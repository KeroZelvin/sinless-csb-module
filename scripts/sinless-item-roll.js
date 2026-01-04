/**
 * Sinless Item Roll
 *
 * Foundry Macro Name (DO NOT CHANGE YET):
 *   sinless item roll   
 *
 * Canonical source:
 *   scripts/sinless-item-roll.js
 */
/**
 * Sinless Item Roll (Foundry v13) — CSB-compatible (v5.4.8)
 *
 * Adds:
 * - Skill groups defaulting: if target skill is untrained (0) but in a group, auto-pick highest trained group skill and apply -2 dice (affects spend limit)
 * - Untrained fallback (non-asterisk skills only): if no ranks in the skill or any group skill, roll ALL dice in linked pool; every 4 successes = 1 success
 * - SkillMeta_JSON support: reads JSON from "Session Settings" actor text field SkillMeta_JSON (optional but recommended)
 *
 * Still supports:
 * - Manual run (no args): requires selected token or user character, and requires itemUuid or itemId+actorUuid (no item picker; provide via buttons)
 * - Macro.execute({ itemUuid }) or Macro.execute({ actorUuid, itemId })
 */

function findKeyPath(obj, targetKey, basePath = "system") {
  const stack = [{ value: obj, path: basePath }];
  const seen = new Set();
  while (stack.length) {
    const { value, path } = stack.pop();
    if (!value || typeof value !== "object") continue;
    if (seen.has(value)) continue;
    seen.add(value);

    if (Object.prototype.hasOwnProperty.call(value, targetKey)) return `${path}.${targetKey}`;
    for (const [k, v] of Object.entries(value)) {
      if (v && typeof v === "object") stack.push({ value: v, path: `${path}.${k}` });
    }
  }
  return null;
}

function getByPath(root, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), root);
}

function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function clampTN(tn, fallback = 4) {
  return [4, 5, 6].includes(tn) ? tn : fallback;
}

function getSessionSettingsActor() {
  const exact = game.actors?.getName?.("Session Settings");
  if (exact) return exact;
  const lower = "session settings";
  return (game.actors?.contents ?? []).find(a => (a.name ?? "").trim().toLowerCase() === lower) ?? null;
}

function normalizePoolKey(poolKeyRaw) {
  if (!poolKeyRaw) return null;
  const s = String(poolKeyRaw).trim();
  if (!s) return null;

  // Map logical pool names to your actor current keys
  const map = {
    Brawn: "Brawn_Cur",
    Finesse: "Finesse_Cur",
    Resolve: "Resolve_Cur",
    Focus: "Focus_Cur"
  };
  return map[s] ?? s;
}

function readItemField(item, fieldName) {
  const path = findKeyPath(item.system, fieldName, "system");
  return path ? getByPath(item, path) : undefined;


}

function readActorProp(actor, key) {
  // In CSB, actual values live under system.props. Avoid scanning actor.system broadly,
  // because template metadata may also contain keys with default values.
  const props = actor?.system?.props;
  if (props && Object.prototype.hasOwnProperty.call(props, key)) return props[key];
  // Fallback: search within props in case of nesting (rare), but never outside props.
  if (props && typeof props === "object") {
    const p = findKeyPath(props, key, "system.props");
    return p ? getByPath(actor, p) : undefined;
  }
  return undefined;
}

function safeParseJSON(maybeJSON, fallback) {
  if (maybeJSON == null) return fallback;
  if (typeof maybeJSON === "object") return maybeJSON; // already parsed
  if (typeof maybeJSON !== "string") return fallback;
  const s = maybeJSON.trim();
  if (!s) return fallback;
  try { return JSON.parse(s); } catch (_e) { return fallback; }
}

async function getSkillMeta(sessionActor) {
  // CSB stores most user-entered field values under system.props.
  // Using findKeyPath can accidentally pick up template/metadata copies first,
  // so prefer the live value in system.props when present.
  // Preferred: store large JSON blobs in actor flags (always persisted regardless of CSB schema).
  // To set: Session Settings actor -> setFlag("world","SkillMeta_JSON", "<json>")
  let rawFlag = null;
  try {
    rawFlag = await sessionActor?.getFlag?.("world", "SkillMeta_JSON");
  } catch (_e) {
    rawFlag = null;
  }
  const rawDirect = sessionActor?.system?.props?.SkillMeta_JSON;
  const raw = (rawFlag !== undefined && rawFlag !== null && String(rawFlag).trim() !== "")
    ? rawFlag
    : (rawDirect !== undefined && rawDirect !== null && String(rawDirect).trim() !== "")
      ? rawDirect
      : (() => {
          const path = findKeyPath(sessionActor.system, "SkillMeta_JSON", "system");
          return path ? getByPath(sessionActor, path) : null;
        })();

  const meta = safeParseJSON(raw, null);
  return (meta && typeof meta === "object") ? meta : null;
}

function resolveSkillInfo(skillMeta, skillKey) {
  // skillMeta is expected to have a "skills" object keyed by Skill_*
  if (!skillMeta || !skillMeta.skills || typeof skillMeta.skills !== "object") return null;
  return skillMeta.skills[String(skillKey)] ?? null;
}

function getGroupSkillKeys(skillMeta, groupId) {
  if (!skillMeta || !skillMeta.skills || typeof skillMeta.skills !== "object") return [];
  const out = [];
  for (const [k, v] of Object.entries(skillMeta.skills)) {
    if (v && typeof v === "object" && v.groupId === groupId) out.push(k);
  }
  return out;
}

async function promptRuntimeInputs({
  title,
  TN,
  mode,
  displayLines,
  spendCap,
  defaultSpend,
  spendHelp,
  allowSpend
}) {
  const header = (displayLines ?? []).map(l => `<div>${l}</div>`).join("");

  const spendBlock = allowSpend ? `
    <div class="form-group">
      <label>Spend from Pool</label>
      <div class="form-fields" style="display:flex; gap:6px; align-items:center;">
        <button type="button" class="sinless-step" data-step="-1" style="width:32px;">-</button>
        <input type="number" name="spend" value="${defaultSpend}" min="0" max="${spendCap}" step="1" style="flex:1;"/>
        <button type="button" class="sinless-step" data-step="1" style="width:32px;">+</button>
      </div>
      <p class="notes" style="margin:6px 0 0 0;">${spendHelp}</p>
    </div>
  ` : `
    <div class="form-group">
      <label>Spend from Pool</label>
      <p class="notes" style="margin:6px 0 0 0;">${spendHelp}</p>
    </div>
  `;

  const content = `
    <form>
      <p style="margin:0 0 8px 0;"><em>${header}</em></p>

      <div class="form-group">
        <label>Situational Mod (± dice; non-pool)</label>
        <input type="number" name="sit" value="0" step="1"/>
      </div>

      ${spendBlock}
    </form>
  `;

  return await new Promise((resolve) => {
    new Dialog({
      title: title ?? "Sinless Roll",
      content,
      render: (html) => {
        const input = html.find('input[name="spend"]')[0];
        html.find('button.sinless-step').on('click', (ev) => {
          ev.preventDefault();
          if (!input) return;
          const step = Number(ev.currentTarget?.dataset?.step ?? 0);
          const min = Number(input.min ?? 0);
          const max = input.max !== "" ? Number(input.max) : Number.POSITIVE_INFINITY;
          const cur = Number(input.value ?? 0);
          let next = cur + step;
          if (!Number.isFinite(next)) next = 0;
          next = Math.max(min, Math.min(max, next));
          input.value = String(next);
          input.dispatchEvent(new Event('change'));
        });
      },
      buttons: {
        roll: {
          label: "Roll",
          callback: (html) => resolve({
            sit: Number(html.find('[name="sit"]').val()),
            spend: allowSpend ? Number(html.find('[name="spend"]').val()) : null
          })
        },
        cancel: { label: "Cancel", callback: () => resolve(null) }
      },
      default: "roll"
    }).render(true);
  });
}

(async () => {
  // Foundry v11+ passes Macro.execute({ ... }) arguments into a built-in `scope` object.
  // Some modules (or older patterns) may instead provide `args` as an array. Support both.
  const _scope =
    (typeof scope !== "undefined" && scope && typeof scope === "object") ? scope :
    (typeof args  !== "undefined" && Array.isArray(args) && args[0] && typeof args[0] === "object") ? args[0] :
    {};

  const _asCleanString = (v) => {
    if (v === null || v === undefined) return null;
    const s = String(v).trim();
    if (!s || s === "undefined" || s === "null") return null;
    return s;
  };

  const passedItemUuid  = _asCleanString(_scope.itemUuid);
  const passedActorUuid = _asCleanString(_scope.actorUuid);
  const passedItemId    = _asCleanString(_scope.itemId);

  // Resolve actor
  let actor = (passedActorUuid ? await fromUuid(passedActorUuid) : null) ?? canvas?.tokens?.controlled?.[0]?.actor ?? game.user.character ?? null;

  // Resolve item
  let item = null;

  // If called from a CSB row/item-sheet button with actorUuid + itemId, resolve the embedded item directly
  if (passedItemId) {
    if (!actor) {
      ui.notifications.warn("No actor found. Provide actorUuid, select a token, or set a User Character.");
      return;
    }
    item = actor.items?.get(passedItemId) ?? null;
    if (!item) {
      ui.notifications.error("Sinless Item Roll: passed itemId was not found on the resolved actor.");
      return;
    }
  }

  // If called with itemUuid: resolve item by UUID and prefer embedded instance on its parent actor
  if (!item && passedItemUuid) {
    const doc = await fromUuid(passedItemUuid);
    if (!doc || doc.documentName !== "Item") {
      ui.notifications.error("Sinless Item Roll: itemUuid did not resolve to an Item.");
      return;
    }

    // Prefer embedded parent actor if present; otherwise fall back to selected token / user character
    actor = (doc.parent?.documentName === "Actor") ? doc.parent : actor;
    if (!actor) {
      ui.notifications.warn("No actor found. Select a token or set a User Character.");
      return;
    }

    item = actor.items?.get(doc.id) ?? actor.items?.getName(doc.name) ?? doc;
  }

  if (!actor) {
    ui.notifications.warn("No actor found. Select a token or set a User Character.");
    return;
  }
  if (!item) {
    ui.notifications.warn(`No item was provided to Sinless Item Roll. Call with { itemUuid } or { actorUuid, itemId }. Received: ${JSON.stringify(_scope)}`);
    return;
  }

  // Session Settings
  const sessionActor = getSessionSettingsActor();
  if (!sessionActor) {
    ui.notifications.error('Actor "Session Settings" not found (needed for TN_Global / SkillMeta_JSON).');
    return;
  }

  // TN (prefer live value in system.props)
const tnRawDirect = sessionActor?.system?.props?.TN_Global;
const tnRaw = Number.isFinite(Number(tnRawDirect))
  ? Number(tnRawDirect)
  : (() => {
      const tnPath = findKeyPath(sessionActor.system, "TN_Global", "system");
      return tnPath ? num(getByPath(sessionActor, tnPath), 4) : 4;
    })();
const TN = clampTN(tnRaw, 4);


  // SkillMeta (optional)
  const skillMeta = await getSkillMeta(sessionActor);

  // Item-defined roll config
  const skillKeyRaw = readItemField(item, "skillKey");
  if (!skillKeyRaw) {
    ui.notifications.error(`Item "${item.name}" missing skillKey (e.g., "Skill_Firearms").`);
    return;
  }
  const skillKey = String(skillKeyRaw).trim();

  const gearFeature = num(readItemField(item, "gearFeature"), 0);
  const bonusDice = num(readItemField(item, "bonusDice"), 0);
  const diceMod = num(readItemField(item, "diceMod"), 0);

  // Pool from item or from SkillMeta (if present)
  const poolFromItem = readItemField(item, "poolKey");
  const skillInfo = resolveSkillInfo(skillMeta, skillKey);
  const poolFromMeta = skillInfo?.pool ?? null;

  const poolKeyNorm = normalizePoolKey(poolFromItem ?? poolFromMeta);
  if (!poolKeyNorm) {
    ui.notifications.error(`Item "${item.name}" missing poolKey and no pool mapping found in SkillMeta_JSON for ${skillKey}.`);
    return;
  }

  // Resolve pool current
  const poolCur = num(readActorProp(actor, poolKeyNorm), 0);
  // CSB actors store live values under system.props; update path must target that container.
  const poolPath = actor.system?.props
    ? `system.props.${poolKeyNorm}`
    : (findKeyPath(actor.system, poolKeyNorm, "system") ?? `system.${poolKeyNorm}`);

  if (poolCur === 0 && readActorProp(actor, poolKeyNorm) === undefined) {
    ui.notifications.error(`Pool "${poolKeyNorm}" not found on actor "${actor.name}".`);
    return;
  }

  // Resolve skill value from actor (missing keys resolve to 0, but warn)
  const baseSkillVal = num(readActorProp(actor, skillKey), 0);

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
      const v = num(readActorProp(actor, k), 0);
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
    // No skill and no group skill coverage
    if (!isAsterisked) {
      mode = "untrainedPool";
      effectiveSkillVal = 0;
    } else {
      ui.notifications.error(`Skill "${skillKey}" is trained-only (asterisked) and you have no ranks in it (or any group skill).`);
      return;
    }
  }

  // Limit and spend cap
  const limit = effectiveSkillVal + gearFeature;
  const spendCap = (mode === "untrainedPool") ? Math.max(0, poolCur) : Math.max(0, Math.min(poolCur, limit));

  // Build dialog header lines
  const displayLines = [];
  displayLines.push(`TN ${TN}+`);
  displayLines.push(`Pool ${poolKeyNorm}: ${poolCur}`);
  if (mode === "trained") {
    displayLines.push(`Skill ${skillKey}: ${baseSkillVal}`);
  } else if (mode === "group") {
    displayLines.push(`Skill ${skillKey}: 0 (untrained)`);
    displayLines.push(`Defaulting via ${chosenGroupSkillKey}: ${chosenGroupSkillVal} → ${effectiveSkillVal} (−2)`);
  } else {
    displayLines.push(`Skill ${skillKey}: 0 (untrained)`);
    displayLines.push(`Untrained fallback: roll full pool; every 4 successes = 1 success`);
  }
  displayLines.push(`GearFeature: ${gearFeature}`);
  displayLines.push(`Limit: ${limit}`);
  displayLines.push(`Spend cap: ${spendCap}`);

  const allowSpend = (mode !== "untrainedPool");
  const defaultSpend = allowSpend ? spendCap : poolCur;

  const spendHelp = (mode === "untrainedPool")
    ? `Rolling <strong>ALL ${poolCur}</strong> dice from ${poolKeyNorm}. Every <strong>4</strong> successes count as <strong>1</strong> success.`
    : `Max spend = <strong>${spendCap}</strong> (Limit <strong>${limit}</strong> = EffectiveSkill ${effectiveSkillVal} + Gear ${gearFeature}; Pool ${poolCur})`;

  const runtime = await promptRuntimeInputs({
    title: item.name,
    TN,
    mode,
    displayLines,
    spendCap,
    defaultSpend,
    spendHelp,
    allowSpend
  });
  if (!runtime) return;

  const sitMod = num(runtime.sit, 0);

  let spend = allowSpend ? num(runtime.spend, 0) : poolCur;
  if (mode === "untrainedPool") spend = poolCur;
  spend = Math.max(0, Math.min(spend, spendCap));

  const totalDice = Math.max(0, spend + bonusDice + diceMod + sitMod);

  const roll = new Roll(`${totalDice}d6`);
  await roll.evaluate();
  const results = roll.dice?.[0]?.results ?? [];
  const rawSuccesses = results.reduce((acc, r) => acc + (r.result >= TN ? 1 : 0), 0);
  const finalSuccesses = (mode === "untrainedPool") ? Math.floor(rawSuccesses / 4) : rawSuccesses;

  // Pool depletion
  const newPool = Math.max(0, poolCur - spend);
  await actor.update({ [poolPath]: newPool });

  const diceHTML = await roll.render();

  const modeLine =
    (mode === "trained") ? "Trained skill" :
    (mode === "group") ? `Group defaulting: used ${chosenGroupSkillKey} ${chosenGroupSkillVal} at −2 (effective ${effectiveSkillVal})` :
    "Untrained fallback: every 4 successes = 1";

  const successLine = (mode === "untrainedPool")
    ? `${finalSuccesses} SUCCESS${finalSuccesses === 1 ? "" : "ES"} <span style="font-size:12px;">(raw ${rawSuccesses} ÷ 4)</span>`
    : `${finalSuccesses} SUCCESS${finalSuccesses === 1 ? "" : "ES"}`;

  const content = `
    <div class="sinless-roll">
      <h2 style="margin:0 0 6px 0;">${item.name}</h2>
      <p style="margin:0 0 6px 0;"><strong>Actor:</strong> ${actor.name}</p>
      <p style="margin:0 0 6px 0;"><strong>TN (Session Settings):</strong> ${TN}+</p>
      <p style="margin:0 0 6px 0;"><strong>Mode:</strong> ${modeLine}</p>
      <hr/>
      <p style="margin:0 0 6px 0;"><strong>Target Skill:</strong> ${skillKey} (base ${baseSkillVal})</p>
      ${mode === "group" ? `<p style="margin:0 0 6px 0;"><strong>Defaulted From:</strong> ${chosenGroupSkillKey} ${chosenGroupSkillVal} → effective ${effectiveSkillVal}</p>` : ""}
      <p style="margin:0 0 6px 0;"><strong>Limit (pool cap):</strong> EffectiveSkill (${effectiveSkillVal}) + GearFeature (${gearFeature}) = <strong>${limit}</strong></p>
      <p style="margin:0 0 6px 0;"><strong>Pool Spend:</strong> ${spend} (cap ${spendCap})</p>
      <p style="margin:0 0 6px 0;"><strong>Non-pool dice:</strong> Bonus ${bonusDice} | ItemMod ${diceMod} | Situational ${sitMod}</p>
      <p style="margin:0 0 10px 0;"><strong>Total Rolled:</strong> <strong>${totalDice}d6</strong></p>

      <div style="text-align:center; margin:10px 0 12px 0;">
        <div style="font-size:28px; font-weight:bold;">${successLine}</div>
      </div>

      <p style="margin:0 0 10px 0;"><strong>${poolKeyNorm}:</strong> ${poolCur} → ${newPool}</p>

      <details>
        <summary>Dice Results</summary>
        ${diceHTML}
      </details>
    </div>
  `;

  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content
  });
})();