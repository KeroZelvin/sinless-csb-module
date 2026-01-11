// scripts/api/item-roll.js
// SinlessCSB API — Item/Skill Roll (Foundry v13 + CSB v5)
//
// Entry point: rollItem({ itemUuid }) OR rollItem({ actorUuid, itemId })
//
// Requires:
// - Session Settings actor with system.props.TN_Global (optional, defaults 4)
// - Optional Session Settings system.props.SkillMeta_JSON (JSON string with { skills: { Skill_X: { pool, groupId, isAsterisked }}})

import {
  MOD_ID,
  num,
  clamp,
  normalizeUuid,
  escapeHTML,
  propsRoot,
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

  const content = `
    <form class="sinlesscsb item-roll-dialog" autocomplete="off">
      <div style="margin:0 0 8px 0;">
        <em>${linesHTML}</em>
      </div>

      <table style="width:100%; border-collapse:collapse;">
        <tbody>
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

          ${spendRow}
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
    onRender: (_dialog, root) => {
      // Prevent double-binding on rerender
      if (root?.dataset?.sinlessItemRollBound === "1") return;
      root.dataset.sinlessItemRollBound = "1";

      const form = root.querySelector("form.sinlesscsb.item-roll-dialog");
      if (!form) return;

      const q = (name) => form.querySelector(`input[name="${CSS.escape(name)}"]`);

      const step = (field, delta) => {
        const el = q(field);
        if (!el) return;

        const min = el.min !== "" ? Number(el.min) : -Infinity;
        const max = el.max !== "" ? Number(el.max) : Infinity;
        const cur = Number(el.value ?? 0);

        let next = cur + delta;
        if (!Number.isFinite(next)) next = 0;
        next = Math.max(min, Math.min(max, next));

        el.value = String(next);
        // "input" tends to produce more consistent live updates than "change"
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      };

      root.addEventListener("click", (ev) => {
        const t = ev.target;
        if (!(t instanceof HTMLElement)) return;
        if (t.dataset.action !== "step") return;

        ev.preventDefault();

        const field = t.dataset.field;
        const delta = Number(t.dataset.step ?? 0);
        if (!field || !Number.isFinite(delta)) return;

        step(field, delta);
      });
    }
  });

  // With openDialogV2: cancel/close returns null
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

  // If the user is looking at a token-synthetic actor, mirror there too
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

    // Resolve item
    const item = await resolveItemDoc({ itemUuid, actorUuid, itemId });
    if (!item) {
      ui.notifications?.error?.("Sinless Item Roll: could not resolve item. Pass { itemUuid } or { actorUuid, itemId }.");
      return null;
    }

    // Resolve actor to update (explicit actorUuid wins; else item.parent; else token/character)
    const actor = await resolveActorForContext({ scope: { actorUuid }, item });
    if (!actor || actor.documentName !== "Actor") {
      ui.notifications?.error?.("Sinless Item Roll: could not resolve an Actor to update (pass actorUuid or use an owned item).");
      return null;
    }

    // Session Settings
    const sessionActor = getSessionSettingsActor();
    if (!sessionActor) {
      ui.notifications?.error?.('Actor "Session Settings" not found (needed for TN_Global / SkillMeta_JSON).');
      return null;
    }

    const TN = readTN(sessionActor);
    const skillMeta = getSkillMeta(sessionActor);

    // Item-defined roll config
    const skillKeyRaw = readItemProp(item, "skillKey");
    const skillKey = String(skillKeyRaw ?? "").trim();
    if (!skillKey) {
      ui.notifications?.error?.(`Item "${item.name}" missing skillKey (e.g., "Skill_Firearms").`);
      return null;
    }

    const gearFeature = num(readItemProp(item, "gearFeature"), 0);
    const bonusDice = num(readItemProp(item, "bonusDice"), 0);
    const diceMod = num(readItemProp(item, "diceMod"), 0);

    // Pool from item or from SkillMeta_JSON mapping
    const poolFromItem = readItemProp(item, "poolKey");
    const skillInfo = resolveSkillInfo(skillMeta, skillKey);
    const poolFromMeta = skillInfo?.pool ?? null;

    const poolKeyLogical = String(poolFromItem ?? poolFromMeta ?? "").trim();
    const poolCurK = poolCurKey(poolKeyLogical); // "Resolve" => "Resolve_Cur"
    if (!poolCurK) {
      ui.notifications?.error?.(`Item "${item.name}" missing poolKey and no pool mapping found in SkillMeta_JSON for ${skillKey}.`);
      return null;
    }

    const aprops = readProps(actor);
    const poolCurRaw = aprops?.[poolCurK];
    if (poolCurRaw === undefined) {
      ui.notifications?.error?.(`Pool "${poolCurK}" not found on actor "${actor.name}" (expected under system.props).`);
      return null;
    }
    const poolCur = Math.max(0, Math.floor(num(poolCurRaw, 0)));

    // Skill value
    const baseSkillVal = Math.max(0, Math.floor(num(aprops?.[skillKey], 0)));

    // Group-defaulting / untrained fallback
    const groupId = skillInfo?.groupId ?? null;
    const isAsterisked = Boolean(skillInfo?.isAsterisked);

    let mode = "trained"; // trained | group | untrainedPool
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

    // Limit and spend cap
    const limit = Math.max(0, effectiveSkillVal + gearFeature);
    const spendCap = (mode === "untrainedPool")
      ? poolCur
      : Math.max(0, Math.min(poolCur, limit));

    // Dialog header lines
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
      displayLines.push(`<strong>Untrained fallback</strong>: roll full pool; every 4 successes = 1 success`);
    }

    displayLines.push(`<strong>GearFeature</strong>: ${escapeHTML(gearFeature)}`);
    displayLines.push(`<strong>Limit</strong>: ${escapeHTML(limit)}`);
    displayLines.push(`<strong>Spend cap</strong>: ${escapeHTML(spendCap)}`);

    const allowSpend = (mode !== "untrainedPool");
    const defaultSpend = allowSpend ? spendCap : poolCur;

    const spendHelp = (mode === "untrainedPool")
      ? `Rolling <strong>ALL ${escapeHTML(poolCur)}</strong> dice from ${escapeHTML(poolCurK)}. Every <strong>4</strong> successes count as <strong>1</strong> success.`
      : `Max spend = <strong>${escapeHTML(spendCap)}</strong> (Limit <strong>${escapeHTML(limit)}</strong> = EffectiveSkill ${escapeHTML(effectiveSkillVal)} + Gear ${escapeHTML(gearFeature)}; Pool ${escapeHTML(poolCur)})`;

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

    // Optional guard: if they somehow get 0d6, warn and exit cleanly
    if (totalDice <= 0) {
      ui.notifications?.warn?.("No dice to roll.");
      return null;
    }

    // Roll + compute successes
    const { roll, results, successes: rawSuccesses } = await rollXd6Successes({ dice: totalDice, tn: TN });
    const finalSuccesses = (mode === "untrainedPool") ? Math.floor(rawSuccesses / 4) : rawSuccesses;

    // Pool depletion
    const newPool = Math.max(0, poolCur - spend);
    const update = { [propPath(poolCurK)]: newPool };
    await updateActorWithMirrors(actor, update);

    const diceHTML = await roll.render();

    const modeLine =
      (mode === "trained") ? "Trained skill" :
      (mode === "group") ? `Group defaulting: used ${chosenGroupSkillKey} ${chosenGroupSkillVal} at −2 (effective ${effectiveSkillVal})` :
      "Untrained fallback: every 4 successes = 1";

    const successLine = (mode === "untrainedPool")
      ? `${finalSuccesses} SUCCESS${finalSuccesses === 1 ? "" : "ES"} <span style="font-size:12px; opacity:0.85;">(raw ${rawSuccesses} ÷ 4)</span>`
      : `${finalSuccesses} SUCCESS${finalSuccesses === 1 ? "" : "ES"}`;

    const content = `
      <div class="sinlesscsb item-roll-card">
        <h3 style="margin:0 0 6px 0;">${escapeHTML(item.name)}</h3>
        <p style="margin:0 0 6px 0;"><strong>Actor:</strong> ${escapeHTML(actor.name)}</p>
        <p style="margin:0 0 6px 0;"><strong>TN (Session Settings):</strong> ${escapeHTML(TN)}+</p>
        <p style="margin:0 0 6px 0;"><strong>Mode:</strong> ${escapeHTML(modeLine)}</p>
        <hr/>

        <p style="margin:0 0 6px 0;"><strong>Target Skill:</strong> ${escapeHTML(skillKey)} (base ${escapeHTML(baseSkillVal)})</p>
        ${mode === "group"
          ? `<p style="margin:0 0 6px 0;"><strong>Defaulted From:</strong> ${escapeHTML(chosenGroupSkillKey)} ${escapeHTML(chosenGroupSkillVal)} → effective ${escapeHTML(effectiveSkillVal)}</p>`
          : ""
        }

        <p style="margin:0 0 6px 0;"><strong>Limit (pool cap):</strong> EffectiveSkill (${escapeHTML(effectiveSkillVal)}) + GearFeature (${escapeHTML(gearFeature)}) = <strong>${escapeHTML(limit)}</strong></p>
        <p style="margin:0 0 6px 0;"><strong>Pool Spend:</strong> ${escapeHTML(spend)} (cap ${escapeHTML(spendCap)})</p>
        <p style="margin:0 0 6px 0;"><strong>Non-pool dice:</strong> Bonus ${escapeHTML(bonusDice)} | ItemMod ${escapeHTML(diceMod)} | Situational ${escapeHTML(sitMod)}</p>
        <p style="margin:0 0 10px 0;"><strong>Total Rolled:</strong> <strong>${escapeHTML(totalDice)}d6</strong></p>

        <div style="text-align:center; margin:10px 0 12px 0;">
          <div style="font-size:28px; font-weight:bold;">${successLine}</div>
        </div>

        <p style="margin:0 0 10px 0;"><strong>${escapeHTML(poolCurK)}:</strong> ${escapeHTML(poolCur)} → ${escapeHTML(newPool)}</p>

        <details>
          <summary>Dice Results</summary>
          ${diceHTML}
        </details>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content
    });

    return {
      actorUuid: actor.uuid,
      itemUuid: item.uuid,
      TN,
      mode,
      poolCurK,
      poolCur,
      spend,
      newPool,
      totalDice,
      rawSuccesses,
      finalSuccesses
    };
  } catch (e) {
    console.error("SinlessCSB | rollItem failed", e);
    ui.notifications?.error?.("Sinless Item Roll failed. See console (F12).");
    return null;
  }
}
