// scripts/api/item-roll.js
// SinlessCSB API — Item/Skill Roll (Foundry v13 + CSB v5)
//
// Entry point: rollItem({ itemUuid }) OR rollItem({ actorUuid, itemId })
//
// Requires:
// - Session Settings actor with system.props.TN_Global (optional, defaults 4)
// - Optional Session Settings system.props.SkillMeta_JSON (JSON string with { skills: { Skill_X: { pool, groupId, isAsterisked }}})

import {
  num,
  normalizeUuid,
  escapeHTML,
  readProps,
  propPath,
  poolCurKey,
  resolveActorForContext,
  resolveCanonicalActor,
  resolveItemDoc,
  rollXd6Successes,
  getDialogFormFromCallbackArgs,
  readDialogNumber,
  openDialogV2
} from "./_util.js";

import { evaluateDamageFormula } from "../rules/damage-formula.js";

/* ----------------------------- */
/* Session Settings helpers      */
/* ----------------------------- */

function clampTN(tn, fallback = 4) {
  return [4, 5, 6].includes(tn) ? tn : fallback;
}

function getSessionSettingsActor() {
  const exact = game.actors?.getName?.("Session Settings");
  if (exact) return exact;
  const lower = "session settings";
  return (game.actors?.contents ?? []).find(a => (a.name ?? "").trim().toLowerCase() === lower) ?? null;
}

function readTN(sessionActor) {
  const raw = num(sessionActor?.system?.props?.TN_Global, NaN);
  return clampTN(Number.isFinite(raw) ? raw : 4, 4);
}

function safeParseJSON(maybeJSON, fallback = null) {
  if (maybeJSON == null) return fallback;
  if (typeof maybeJSON === "object") return maybeJSON;
  if (typeof maybeJSON !== "string") return fallback;
  const s = maybeJSON.trim();
  if (!s) return fallback;
  try { return JSON.parse(s); } catch (_e) { return fallback; }
}

function getSkillMeta(sessionActor) {
  // Per your updated direction: do NOT use flags; read live CSB prop
  const raw = sessionActor?.system?.props?.SkillMeta_JSON;
  const meta = safeParseJSON(raw, null);
  return (meta && typeof meta === "object") ? meta : null;
}

function resolveSkillInfo(skillMeta, skillKey) {
  if (!skillMeta || typeof skillMeta !== "object") return null;
  const skills = skillMeta.skills;
  if (!skills || typeof skills !== "object") return null;
  return skills[String(skillKey)] ?? null;
}

function getGroupSkillKeys(skillMeta, groupId) {
  if (!skillMeta?.skills || typeof skillMeta.skills !== "object") return [];
  const out = [];
  for (const [k, v] of Object.entries(skillMeta.skills)) {
    if (v && typeof v === "object" && v.groupId === groupId) out.push(k);
  }
  return out;
}

function normalizePoolKey(k) {
  const s = String(k ?? "").trim();
  if (!s) return null;
  // Accept "Resolve" or "Resolve_Cur" or "resolve"
  const base = s.replace(/_Cur$/i, "");
  // Title-case first letter for consistency with your actor props keys
  return base.charAt(0).toUpperCase() + base.slice(1);
}

async function resolvePilotActorFromContext(contextActor) {
  const pilotUuid = String(contextActor?.system?.props?.pilotActorUuid ?? "").trim();
  if (!pilotUuid) return null;

  try {
    const doc = await fromUuid(pilotUuid);
    return (doc?.documentName === "Actor") ? doc : null;
  } catch (_e) {
    return null;
  }
}

/* ----------------------------- */
/* Item prop reads (CSB-first)   */
/* ----------------------------- */

function readItemProp(item, key) {
  // CSB typical: item.system.props.<key>
  const p = item?.system?.props ?? {};
  if (Object.prototype.hasOwnProperty.call(p, key)) return p[key];

  // fallback: some templates may nest differently; keep it shallow
  // (avoid full scans across doc to prevent grabbing metadata)
  return undefined;
}

/* ----------------------------- */
/* DialogV2 (preferred)          */
/* ----------------------------- */

async function promptRuntimeInputs({
  title,
  TN,
  displayLines,
  spendCap,
  defaultSpend,
  spendHelp,
  allowSpend
}) {
  const linesHTML = (displayLines ?? []).map(l => `<div>${l}</div>`).join("");

  const spendRow = allowSpend ? `
    <tr>
      <td style="padding:6px 8px; opacity:0.85;">Spend from Pool</td>
      <td style="padding:6px 8px; text-align:right;">
        <div style="display:flex; justify-content:flex-end; gap:6px; align-items:center;">
          <button type="button" data-action="step" data-field="spend" data-step="-1" style="width:32px;">-</button>
          <input type="number" name="spend" value="${defaultSpend}" min="0" max="${spendCap}" step="1" style="width:7em; text-align:right;" />
          <button type="button" data-action="step" data-field="spend" data-step="1" style="width:32px;">+</button>
        </div>
      </td>
    </tr>
  ` : `
    <tr>
      <td style="padding:6px 8px; opacity:0.85;">Spend from Pool</td>
      <td style="padding:6px 8px; text-align:right; opacity:0.85;">(Full pool)</td>
    </tr>
  `;

  // NOTE: Spend row first, then Sit row (per your request)
  const sitRow = `
    <tr>
      <td style="padding:6px 8px; opacity:0.85;">Situational Mod (± dice)</td>
      <td style="padding:6px 8px; text-align:right;">
        <div style="display:flex; justify-content:flex-end; gap:6px; align-items:center;">
          <button type="button" data-action="step" data-field="sit" data-step="-1" style="width:32px;">-</button>
          <input type="number" name="sit" value="0" step="1" style="width:7em; text-align:right;" />
          <button type="button" data-action="step" data-field="sit" data-step="1" style="width:32px;">+</button>
        </div>
      </td>
    </tr>
  `;

  const content = `
    <form class="sinlesscsb item-roll-dialog" autocomplete="off">
      <div style="margin:0 0 8px 0;">
        <em>${linesHTML}</em>
      </div>

      <table style="width:100%; border-collapse:collapse;">
        <tbody>
          ${spendRow}
          ${sitRow}
        </tbody>
      </table>

      <p class="notes" style="margin:8px 0 0 0; opacity:0.85;">${spendHelp}</p>
    </form>
  `;

  const result = await openDialogV2({
    title: title ?? "Sinless Roll",
    content,
    rejectClose: false,
    buttons: [
      {
        action: "roll",
        label: "Roll",
        default: true,
        callback: (...cbArgs) => {
          const form = getDialogFormFromCallbackArgs(...cbArgs);
          const fd = form ? new FormData(form) : null;

          const sit = readDialogNumber(fd, "sit", 0);
          const spend = allowSpend ? readDialogNumber(fd, "spend", 0) : null;

          return { sit, spend };
        }
      },
      { action: "cancel", label: "Cancel", callback: () => null }
    ],

    // Bind the stepper clicks after render (once per root)
    onRender: (dialog, root) => {
      if (!(root instanceof HTMLElement)) return;

      const bindRoot = root.querySelector("form") || root;

      if (bindRoot.dataset.sinlessItemRollBound === "1") return;
      bindRoot.dataset.sinlessItemRollBound = "1";

      const clampToInput = (input, v) => {
        if (!(input instanceof HTMLInputElement)) return 0;

        const minAttr = input.getAttribute("min");
        const maxAttr = input.getAttribute("max");

        const minRaw = (minAttr == null || minAttr === "") ? NaN : Number(minAttr);
        const maxRaw = (maxAttr == null || maxAttr === "") ? NaN : Number(maxAttr);

        const min = Number.isFinite(minRaw) ? minRaw : -Infinity;
        const max = Number.isFinite(maxRaw) ? maxRaw : Infinity;

        let vv = Number(v);
        if (!Number.isFinite(vv)) vv = 0;

        vv = Math.max(min, Math.min(max, vv));
        vv = Math.floor(vv);

        input.value = String(vv);
        return vv;
      };

      const findInputForField = (btn, field) => {
        const localContainer =
          btn.closest("tr") ||
          btn.closest("td") ||
          btn.closest("div") ||
          null;

        if (localContainer) {
          const local = localContainer.querySelector(`input[name="${CSS.escape(field)}"]`);
          if (local instanceof HTMLInputElement) return local;
        }

        const global = bindRoot.querySelector(`input[name="${CSS.escape(field)}"]`);
        if (global instanceof HTMLInputElement) return global;

        return null;
      };

      const handler = (ev) => {
        const btn = ev.target?.closest?.('button[data-action="step"]');
        if (!(btn instanceof HTMLElement)) return;

        ev.preventDefault();

        const field = btn.dataset.field;
        const delta = Number(btn.dataset.step ?? "0");
        if (!field || !Number.isFinite(delta)) return;

        const input = findInputForField(btn, field);
        if (!input || input.disabled || input.readOnly) return;

        const cur = Number(input.value);
        const next = (Number.isFinite(cur) ? cur : 0) + delta;

        clampToInput(input, next);

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };

      bindRoot.addEventListener("click", handler, true);

      if (!dialog._sinlessItemRollCloseWrapped && typeof dialog.close === "function") {
        dialog._sinlessItemRollCloseWrapped = true;
        const origClose = dialog.close.bind(dialog);
        dialog.close = async (...args) => {
          try { bindRoot.removeEventListener("click", handler, true); } catch (_e) {}
          return await origClose(...args);
        };
      }
    }
  });

  if (!result) return null;
  return result;
}

/* ----------------------------- */
/* Actor update mirroring        */
/* ----------------------------- */

async function updateActorWithMirrors(sheetActor, update) {
  await sheetActor.update(update);

  const canon = await resolveCanonicalActor(sheetActor);
  if (canon && canon.uuid !== sheetActor.uuid) {
    try { await canon.update(update); } catch (_e) {}
  }

  for (const t of canvas?.tokens?.controlled ?? []) {
    const ta = t?.actor;
    if (!ta || ta.documentName !== "Actor") continue;
    const taCanon = await resolveCanonicalActor(ta);
    const matches = (taCanon?.uuid && (taCanon.uuid === sheetActor.uuid || taCanon.uuid === canon?.uuid));
    if (!matches) continue;
    if (ta.uuid === sheetActor.uuid || ta.uuid === canon?.uuid) continue;
    try { await ta.update(update); } catch (_e) {}
  }
}


/* ----------------------------- */
/* Main API function             */
/* ----------------------------- */

export async function rollItem(scope = {}) {
  try {
    const itemUuid = normalizeUuid(scope?.itemUuid);
    const actorUuid = normalizeUuid(scope?.actorUuid);
    const itemId = normalizeUuid(scope?.itemId);

    const item = await resolveItemDoc({ itemUuid, actorUuid, itemId });
    if (!item) {
      ui.notifications?.error?.("Sinless Item Roll: could not resolve item. Pass { itemUuid } or { actorUuid, itemId }.");
      return null;
    }

    const actor = await resolveActorForContext({ scope: { actorUuid }, item });
    if (!actor || actor.documentName !== "Actor") {
      ui.notifications?.error?.("Sinless Item Roll: could not resolve an Actor to update (pass actorUuid or use an owned item).");
      return null;
    }

// Drone pilot routing: contextActor is the actor whose item you clicked (e.g., Drone).
const contextActor = actor;
const pilotActor = await resolvePilotActorFromContext(contextActor);

// Guard: pilotActorUuid is set but did not resolve
const pilotUuidRaw = String(contextActor?.system?.props?.pilotActorUuid ?? "").trim();
if (pilotUuidRaw && !pilotActor) {
  ui.notifications?.warn?.(
    `Drone "${contextActor.name}" has pilotActorUuid set but it could not be resolved. Falling back to ${game.user?.character?.name ?? contextActor.name}.`
  );
}

// Rolling actor: prefer pilot; else fall back to user.character; else contextActor
// rollingActor is where pools/skills come from and where pool spend is written.
const rollingActor = pilotActor || game.user?.character || contextActor;

// Props split: drone state vs pilot pools/skills
const contextProps = readProps(contextActor);
const aprops = readProps(rollingActor);


    const sessionActor = getSessionSettingsActor();
    if (!sessionActor) {
      ui.notifications?.error?.('Actor "Session Settings" not found (needed for TN_Global / SkillMeta_JSON).');
      return null;
    }

    const TN = readTN(sessionActor);
    const skillMeta = getSkillMeta(sessionActor);

    const skillKeyRaw = readItemProp(item, "skillKey");
    const skillKey = String(skillKeyRaw ?? "").trim();
    if (!skillKey) {
      ui.notifications?.error?.(`Item "${item.name}" missing skillKey (e.g., "Skill_Firearms").`);
      return null;
    }

    const gearFeature = num(readItemProp(item, "gearFeature"), 0);
    // Optional: for Drive/Rig actions, pull the limit bonus from actor props (e.g., rigHandling)
    const limitBonusActorKey = String(readItemProp(item, "limitBonusActorKey") ?? "").trim();

// Runtime bonus dice controls (optional): allow firing modes to add/subtract bonus dice
const bonusDiceDelta =
  (scope?.bonusDiceDelta === 0 || scope?.bonusDiceDelta)
    ? Math.floor(num(scope.bonusDiceDelta, 0))
    : 0;

const bonusDiceOverride =
  (scope?.bonusDiceOverride === 0 || scope?.bonusDiceOverride)
    ? Math.floor(num(scope.bonusDiceOverride, 0))
    : null;

// Item base values
const bonusDiceBase = Math.floor(num(readItemProp(item, "bonusDice"), 0));
const bonusDiceCore = (bonusDiceOverride !== null)
  ? bonusDiceOverride
  : (bonusDiceBase + bonusDiceDelta);

// Optional actor-sourced bonus dice (e.g., VCR bonus on the pilot)
const bonusDiceActorKey = String(readItemProp(item, "bonusDiceActorKey") ?? "").trim();
const bonusDiceActor = bonusDiceActorKey
  ? Math.floor(num(aprops?.[bonusDiceActorKey], 0))
  : 0;

const bonusDice = bonusDiceCore + bonusDiceActor;

const diceMod = Math.floor(num(readItemProp(item, "diceMod"), 0));


    // Damage fields (read once; usage depends on skillKey)
    const itemDamageText = String(readItemProp(item, "itemDamage") ?? "").trim();
    const weaponDamageRaw = readItemProp(item, "weaponDamage");
    const weaponDamage = Number.isFinite(Number(weaponDamageRaw))
      ? Math.max(0, Math.floor(num(weaponDamageRaw, 0)))
      : null;

    // Damage formula skills (melee-style). Successes-based damage applies to all other skills (Firearms, Gunnery, etc.).
    const DAMAGE_FORMULA_SKILLS = new Set([
      "Skill_MeleeWeapons",
      "Skill_ThrowingWeapons",
      "Skill_CyberCombat",
      "Skill_UnarmedCombat"
    ]);

    const isDamageSkill = DAMAGE_FORMULA_SKILLS.has(skillKey);

    const damageEligible = isDamageSkill && !!itemDamageText;
    const damageFlatFallback = isDamageSkill && !itemDamageText && (weaponDamage !== null);

    // For non-melee skills: show weaponDamage as reference (successes remaining + weapon damage)
    const showSuccessesDamageHint = (!isDamageSkill) && (weaponDamage !== null);

    const poolFromItemRaw = readItemProp(item, "poolKey");
    const skillInfo = resolveSkillInfo(skillMeta, skillKey);
    const poolFromMetaRaw = skillInfo?.pool ?? null;

    let poolKeyLogical = String(poolFromItemRaw ?? poolFromMetaRaw ?? "").trim();
    poolKeyLogical = poolKeyLogical.replace(/_(Cur|Max)$/i, "").trim();

    if (!poolKeyLogical) {
      poolKeyLogical = "Resolve";
      console.warn("SinlessCSB | rollItem: poolKey missing; defaulting to Resolve", {
        item: { name: item.name, uuid: item.uuid },
        skillKey,
        poolFromItemRaw,
        poolFromMetaRaw
      });
      ui.notifications?.warn?.(`"${item.name}" has no poolKey; defaulting to Resolve.`);
    }

    const poolKeyCanonMap = {
      brawn: "Brawn",
      finesse: "Finesse",
      resolve: "Resolve",
      focus: "Focus"
    };
    const poolKeyCanon = poolKeyCanonMap[poolKeyLogical.toLowerCase()] ?? poolKeyLogical;

    const poolCurK = poolCurKey(poolKeyCanon);
    if (!poolCurK) {
      ui.notifications?.error?.(
        `Item "${item.name}" has invalid poolKey "${poolKeyLogical}". Use one of: Brawn, Finesse, Resolve, Focus.`
      );
      return null;
    }


const poolCurRaw = aprops?.[poolCurK];
if (poolCurRaw === undefined) {
  ui.notifications?.error?.(
    `Pool "${poolCurK}" not found on rolling actor "${rollingActor?.name ?? "?"}" (context actor "${contextActor?.name ?? "?"}").`
  );
  return null;
}

    const poolCur = Math.max(0, Math.floor(num(poolCurRaw, 0)));

    const baseSkillVal = Math.max(0, Math.floor(num(aprops?.[skillKey], 0)));

    const groupId = skillInfo?.groupId ?? null;
    const isAsterisked = Boolean(skillInfo?.isAsterisked);

    let mode = "trained";
    let effectiveSkillVal = baseSkillVal;
    let chosenGroupSkillKey = null;
    let chosenGroupSkillVal = null;

    if (baseSkillVal <= 0 && groupId) {
      const groupSkillKeys = getGroupSkillKeys(skillMeta, groupId);
      let bestKey = null;
      let bestVal = 0;

      for (const k of groupSkillKeys) {
        if (k === skillKey) continue;
        const v = Math.max(0, Math.floor(num(aprops?.[k], 0)));
        if (v > bestVal) { bestVal = v; bestKey = k; }
      }

      if (bestKey && bestVal > 0) {
        mode = "group";
        chosenGroupSkillKey = bestKey;
        chosenGroupSkillVal = bestVal;
        effectiveSkillVal = Math.max(0, bestVal - 2);
      }
    }

    if (baseSkillVal <= 0 && mode !== "group") {
      if (!isAsterisked) {
        mode = "untrainedPool";
        effectiveSkillVal = 0;
      } else {
        ui.notifications?.error?.(`Skill "${skillKey}" is trained-only (asterisked) and you have no ranks in it (or any group skill).`);
        return null;
      }
    }

    // Limit bonus: either item gearFeature OR actor-based handling (never both)
    let limitBonus = Math.floor(num(gearFeature, 0));
    let limitBonusSource = "item.gearFeature";

    if (limitBonusActorKey) {
      limitBonus = Math.floor(num(contextProps?.[limitBonusActorKey], 0));
      limitBonusSource = `contextActor.${limitBonusActorKey}`;
    } else {
      limitBonus = Math.floor(num(gearFeature, 0));
      limitBonusSource = "item.gearFeature";
    }

    const limit = Math.max(0, effectiveSkillVal + limitBonus);

    const spendCap = (mode === "untrainedPool")
      ? poolCur
      : Math.max(0, Math.min(poolCur, limit));

    const displayLines = [];
    displayLines.push(`<strong>TN</strong> ${escapeHTML(TN)}+`);
    displayLines.push(`<strong>Pool</strong> ${escapeHTML(poolCurK)}: ${escapeHTML(poolCur)}`);

    if (mode === "trained") {
      displayLines.push(`<strong>Skill</strong> ${escapeHTML(skillKey)}: ${escapeHTML(baseSkillVal)}`);
    } else if (mode === "group") {
      displayLines.push(`<strong>Skill</strong> ${escapeHTML(skillKey)}: 0 (untrained)`);
      displayLines.push(`<strong>Defaulting</strong> via ${escapeHTML(chosenGroupSkillKey)}: ${escapeHTML(chosenGroupSkillVal)} → ${escapeHTML(effectiveSkillVal)} (−2)`);
    } else {
      displayLines.push(`<strong>Skill</strong> ${escapeHTML(skillKey)}: 0 (untrained)`);
      displayLines.push(`<strong>Untrained fallback</strong>: every 4 successes = 1 success`);
    }

    displayLines.push(`<strong>GearFeature</strong>: ${escapeHTML(gearFeature)}`);
    displayLines.push(`<strong>Limit Bonus</strong>: ${escapeHTML(limitBonus)} <span style="font-size:12px; opacity:0.85;">(${escapeHTML(limitBonusSource)})</span>`);
    displayLines.push(`<strong>Limit</strong>: ${escapeHTML(limit)}`);

    displayLines.push(`<strong>Spend cap</strong>: ${escapeHTML(spendCap)}`);

    const allowSpend = true;
    const defaultSpend = spendCap;

const spendHelp = (mode === "untrainedPool")
  ? `Spend up to <strong>${escapeHTML(poolCur)}</strong> from ${escapeHTML(poolCurK)}. Untrained fallback still applies: every <strong>4</strong> successes = <strong>1</strong> success.`
  : `Max spend = <strong>${escapeHTML(spendCap)}</strong> (Limit <strong>${escapeHTML(limit)}</strong> = EffectiveSkill ${escapeHTML(effectiveSkillVal)} + LimitBonus ${escapeHTML(limitBonus)}; Pool ${escapeHTML(poolCur)}).<br/>
     <span style="font-size:12px; opacity:0.85;">Bonus dice are added after spend and do <strong>not</strong> deplete the pool. Only <strong>Spend from Pool</strong> reduces ${escapeHTML(poolCurK)}.</span>`;


    const runtime = await promptRuntimeInputs({
      title: item.name,
      TN,
      displayLines,
      spendCap,
      defaultSpend,
      spendHelp,
      allowSpend
    });

    if (!runtime) return null;

    const sitMod = Math.floor(num(runtime.sit, 0));

    let spend = allowSpend ? Math.floor(num(runtime.spend, 0)) : poolCur;
    if (mode === "untrainedPool") spend = poolCur;

    spend = Math.max(0, Math.min(spend, spendCap));

    const totalDice = Math.max(0, spend + bonusDice + diceMod + sitMod);

    if (totalDice <= 0) {
      ui.notifications?.warn?.("No dice to roll.");
      return null;
    }

    const { roll, results, successes: rawSuccesses } = await rollXd6Successes({ dice: totalDice, tn: TN });
    const finalSuccesses = (mode === "untrainedPool") ? Math.floor(rawSuccesses / 4) : rawSuccesses;

    let damage = null;

    if (damageEligible) {
      try {
        const strVal = Math.max(0, Math.floor(num(aprops?.STR, 0)));
        const evald = evaluateDamageFormula(itemDamageText, strVal);

        const diceCount = Math.abs(Math.floor(num(evald.dice, 0)));
        let diceTotalSigned = 0;
        let damageDiceHTML = "";

        if (diceCount > 0) {
          const dmgRoll = new Roll(`${diceCount}d6`);
          await dmgRoll.evaluate();
          const dmgTotal = Math.floor(num(dmgRoll.total, 0));

          diceTotalSigned = (evald.dice < 0) ? -dmgTotal : dmgTotal;
          damageDiceHTML = await dmgRoll.render();
        }

        const total = Math.max(0, Math.floor(evald.base + diceTotalSigned));

        damage = {
          kind: "formula",
          formulaText: evald.formulaText,
          normalized: evald.normalized,
          STR: evald.STR,
          base: evald.base,
          dice: evald.dice,
          diceTotal: diceTotalSigned,
          total,
          diceHTML: damageDiceHTML
        };
      } catch (e) {
        console.warn("SinlessCSB | rollItem: itemDamage evaluation failed; continuing without damage", {
          item: { name: item?.name, uuid: item?.uuid },
          skillKey,
          itemDamageText
        }, e);
        damage = null;
      }
    } else if (damageFlatFallback) {
      damage = {
        kind: "flatFallback",
        formulaText: "",
        normalized: "",
        STR: Math.max(0, Math.floor(num(aprops?.STR, 0))),
        base: weaponDamage,
        dice: 0,
        diceTotal: 0,
        total: weaponDamage,
        diceHTML: ""
      };
    }

    const newPool = Math.max(0, poolCur - spend);
    const update = { [propPath(poolCurK)]: newPool };
   await updateActorWithMirrors(rollingActor, update);


    const diceHTML = await roll.render();

    const modeLine =
      (mode === "trained") ? "Trained skill" :
      (mode === "group") ? `Group defaulting: used ${chosenGroupSkillKey} ${chosenGroupSkillVal} at −2 (effective ${effectiveSkillVal})` :
      "Untrained fallback: every 4 successes = 1";

    const successLine = (mode === "untrainedPool")
      ? `${finalSuccesses} SUCCESS${finalSuccesses === 1 ? "" : "ES"} <span style="font-size:12px; opacity:0.85;">(raw ${rawSuccesses} ÷ 4)</span>`
      : `${finalSuccesses} SUCCESS${finalSuccesses === 1 ? "" : "ES"}`;

    const damageSectionHTML = damage ? `
      <hr/>
      <p style="margin:0 0 6px 0;">
        <strong>Damage:</strong> <strong>${escapeHTML(damage.total)}</strong>
        ${damage.kind === "formula" ? `
          <span style="font-size:12px; opacity:0.85;">
            (base ${escapeHTML(damage.base)}${damage.dice ? ` + ${escapeHTML(Math.abs(damage.dice))}d6` : ""})
          </span>
        ` : `
          <span style="font-size:12px; opacity:0.85;">(flat)</span>
        `}
      </p>

      ${damage.kind === "formula" ? `
        <details>
          <summary>Damage Details</summary>
          <p style="margin:6px 0 0 0;"><strong>Formula:</strong> ${escapeHTML(damage.formulaText)}</p>
          <p style="margin:0;"><strong>Normalized:</strong> ${escapeHTML(damage.normalized)}</p>
          <p style="margin:0;"><strong>STR used:</strong> ${escapeHTML(damage.STR)}</p>
          <p style="margin:0;"><strong>Base (floored):</strong> ${escapeHTML(damage.base)}</p>
          ${damage.dice ? `
            <p style="margin:0 0 6px 0;"><strong>Dice:</strong> ${escapeHTML(Math.abs(damage.dice))}d6 → ${escapeHTML(damage.diceTotal)}</p>
            ${damage.diceHTML}
          ` : ""}
        </details>
      ` : `
        <p style="margin:0 0 6px 0; font-size:12px; opacity:0.85;">
          From <code>weaponDamage</code> (fallback because <code>itemDamage</code> is blank).
        </p>
      `}
    ` : "";

    const successesDamageHintHTML = showSuccessesDamageHint ? `
      <hr/>
      <p style="margin:0 0 6px 0;">
        <strong>Weapon Damage:</strong> <strong>${escapeHTML(weaponDamage)}</strong>
        <span style="font-size:12px; opacity:0.85;">
          (after dodge: remaining successes + weapon damage)
        </span>
      </p>
      <p style="margin:0 0 6px 0; font-size:12px; opacity:0.85;">
        Table flow: Target dodges to cancel successes. Base damage = <strong>${escapeHTML(weaponDamage)}</strong> + (successes remaining).
      </p>
    ` : "";

    const pilotLine =
  (rollingActor && contextActor && rollingActor.uuid && contextActor.uuid && rollingActor.uuid !== contextActor.uuid)
    ? '<p style="margin:0 0 6px 0;"><strong>Pilot:</strong> ' + escapeHTML(rollingActor.name) + '</p>'
    : '';

    const bonusActorLabel = bonusDiceActorKey
      ? (bonusDiceActorKey === "vcrBonusDice" ? "VCR" : bonusDiceActorKey)
      : "";

    const bonusBreakdown = bonusDiceActorKey
      ? `Bonus ${escapeHTML(bonusDice)} (Item/Action ${escapeHTML(bonusDiceCore)} + ${escapeHTML(bonusActorLabel)} ${escapeHTML(bonusDiceActor)})`
      : `Bonus ${escapeHTML(bonusDice)} (Item/Action ${escapeHTML(bonusDiceCore)})`;


    const content = `
      <div class="sinlesscsb item-roll-card">
        <h3 style="margin:0 0 6px 0;">${escapeHTML(item.name)}</h3>
        <p style="margin:0 0 6px 0;"><strong>Actor:</strong> ${escapeHTML(contextActor.name)}</p>
        ${pilotLine}

        
        <p style="margin:0 0 6px 0;"><strong>TN (Session Settings):</strong> ${escapeHTML(TN)}+</p>
        <p style="margin:0 0 6px 0;"><strong>Mode:</strong> ${escapeHTML(modeLine)}</p>
        <hr/>

        <p style="margin:0 0 6px 0;"><strong>Target Skill:</strong> ${escapeHTML(skillKey)} (base ${escapeHTML(baseSkillVal)})</p>
        ${mode === "group"
          ? `<p style="margin:0 0 6px 0;"><strong>Defaulted From:</strong> ${escapeHTML(chosenGroupSkillKey)} ${escapeHTML(chosenGroupSkillVal)} → effective ${escapeHTML(effectiveSkillVal)}</p>`
          : ""
        }

        <p style="margin:0 0 6px 0;">
          <strong>Limit (pool cap):</strong>
          EffectiveSkill (${escapeHTML(effectiveSkillVal)}) + LimitBonus (${escapeHTML(limitBonus)})
          = <strong>${escapeHTML(limit)}</strong>
          <span style="font-size:12px; opacity:0.85;">(${escapeHTML(limitBonusSource)})</span>
        </p>

        <p style="margin:0 0 6px 0;"><strong>Pool Spend:</strong> ${escapeHTML(spend)} (cap ${escapeHTML(spendCap)})</p>
        <p style="margin:0 0 6px 0;"><strong>Non-pool dice:</strong> ${bonusBreakdown} | ItemMod ${escapeHTML(diceMod)} | Situational ${escapeHTML(sitMod)}</p>
        <p style="margin:0 0 10px 0;"><strong>Total Rolled:</strong> <strong>${escapeHTML(totalDice)}d6</strong></p>

        <div style="text-align:center; margin:10px 0 12px 0;">
          <div style="font-size:28px; font-weight:bold;">${successLine}</div>
        </div>

        ${damageSectionHTML}
        ${successesDamageHintHTML}

        <p style="margin:0 0 10px 0;"><strong>${escapeHTML(poolCurK)}:</strong> ${escapeHTML(poolCur)} → ${escapeHTML(newPool)}</p>

        <details>
          <summary>Dice Results</summary>
          ${diceHTML}
        </details>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: contextActor }),
      content
    });

    return {
      actorUuid: rollingActor.uuid, // legacy: pools/spend actor
      contextActorUuid: contextActor.uuid,
      rollingActorUuid: rollingActor.uuid,
      itemUuid: item.uuid,
      TN,
      mode,
      skillKey,
      poolCurK,
      poolCur,
      spend,
      newPool,
      totalDice,
      rawSuccesses,
      finalSuccesses,
      itemDamageText,
      weaponDamage,
      damage
    };
  } catch (e) {
    console.error("SinlessCSB | rollItem failed", e);
    ui.notifications?.error?.("Sinless Item Roll failed. See console (F12).");
    return null;
  }
}
