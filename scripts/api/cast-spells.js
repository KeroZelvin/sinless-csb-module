// scripts/api/cast-spell.js
import { evaluateDrainFormula } from "../rules/drain-formula.js";

/** Utility: safe number */
function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}
function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Resolve canonical Actor if your sheet stores ActorUuid (prevents token-synthetic drift).
 * Falls back to the provided actor if not available.
 */
async function resolveCanonicalActor(actor) {
  const actorUuid = actor?.system?.props?.ActorUuid;
  if (typeof actorUuid === "string" && actorUuid.length) {
    const doc = await fromUuid(actorUuid);
    if (doc?.documentName === "Actor") return doc;
  }
  return actor;
}

/**
 * Get pool current key from item.poolKey ("Resolve" -> "Resolve_Cur", "Brawn" -> "Brawn_Cur", etc.)
 */
function poolCurKey(poolKey) {
  const k = String(poolKey ?? "").trim();
  if (!k) return null;
  return k.endsWith("_Cur") ? k : `${k}_Cur`;
}

/** Derived track maxes (fallback if the computed keys don't exist yet) */
function computeStunMax(actor) {
  const WIL = num(actor?.system?.props?.WIL, 0);
  return 6 + Math.floor(WIL / 2);
}
function computePhysicalMax(actor) {
  const BOD = num(actor?.system?.props?.BOD, 0);
  return 6 + Math.floor(BOD / 2);
}

/**
 * Simple d6 success roll. TN defaults to 4 unless you later wire a global TN.
 */
async function rollPoolD6({ dice, tn = 4, flavor = "" } = {}) {
  const d = Math.max(0, Math.floor(num(dice, 0)));
  const roll = await (new Roll(`${d}d6`)).evaluate({ async: true });

  const results = roll.dice?.[0]?.results ?? [];
  const successes = results.reduce((acc, r) => acc + (num(r.result, 0) >= tn ? 1 : 0), 0);

  return { roll, successes, dice: d, tn, flavor };
}

/** Render minimal chat output */
async function postSpellChat({ actor, item, forceChosen, cast, drain } = {}) {
  const title = `${item.name} — Cast`;
  const lines = [];

  lines.push(`<p><strong>Force:</strong> ${forceChosen}</p>`);
  lines.push(`<p><strong>Casting:</strong> ${cast.dice}d6 vs TN ${cast.tn} → <strong>${cast.successes}</strong> successes</p>`);
  lines.push(`<p><strong>Drain formula:</strong> ${drain.formulaText} (normalized: <code>${drain.normalized}</code>)</p>`);
  lines.push(`<p><strong>Drain (raw):</strong> ${drain.drain} ${drain.isLethal ? "(LETHAL: no resist)" : ""}</p>`);

  if (!drain.isLethal) {
    lines.push(`<p><strong>Drain resist:</strong> ${drain.resistDice}d6 vs TN ${drain.tn} → <strong>${drain.resistSuccesses}</strong> successes</p>`);
    lines.push(`<p><strong>Drain applied:</strong> ${drain.applied} (stun overflow → physical)</p>`);
  } else {
    lines.push(`<p><strong>Drain applied to Physical:</strong> ${drain.applied}</p>`);
  }

  const content = `<div class="sinlesscsb spell-card"><h3>${title}</h3>${lines.join("\n")}</div>`;

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
  });
}

/**
 * Module API entry: castSpell({ itemUuid })
 */
export async function castSpell(scope = {}) {
  const itemUuid = String(scope?.itemUuid ?? "");
  if (!itemUuid) return ui.notifications?.warn("castSpell: missing itemUuid.");

  const doc = await fromUuid(itemUuid);
  if (!doc) return ui.notifications?.warn(`castSpell: could not resolve uuid ${itemUuid}.`);
  if (doc.documentName !== "Item") return ui.notifications?.warn("castSpell: uuid is not an Item.");

  const item = doc;
  const parentActor = item.parent;
  if (!parentActor || parentActor.documentName !== "Actor") {
    return ui.notifications?.warn("castSpell: spell must be owned by an Actor (in inventory).");
  }

  const actor = await resolveCanonicalActor(parentActor);

  // --- Read item props (your keys) ---
  const props = item.system?.props ?? {};
  const skillKey = String(props.skillKey ?? "").trim();              // "Skill_Sorcery" or "Skill_Conjuring"
  const poolKey = String(props.poolKey ?? "Resolve").trim();         // "Resolve"
  const fociRank = num(props.spellFociRank, 0);                      // numberField
  const bonusDice = num(props.bonusDice, 0);
  const diceMod = num(props.diceMod, 0);

  const spellforceMax = Math.max(1, Math.floor(num(props.spellforceMax, 1)));
  const spellforceDefault = Math.max(1, Math.floor(num(props.spellforceDefault, 1)));

  const fetishRank = Math.max(0, Math.floor(num(props.fetishRank, 0)));
  const drainFormulaText = String(props.drainFormula ?? "").trim();  // label field text

  if (!skillKey) return ui.notifications?.warn("Spell is missing item prop: skillKey (e.g., Skill_Sorcery).");
  if (!drainFormulaText) return ui.notifications?.warn("Spell is missing drainFormula text.");

  // --- Actor values ---
  const aprops = actor.system?.props ?? {};

  const poolCurK = poolCurKey(poolKey);            // e.g. Resolve_Cur
  if (!poolCurK) return ui.notifications?.warn("Spell is missing poolKey (e.g., Resolve).");

  const poolCur = Math.max(0, Math.floor(num(aprops[poolCurK], 0)));
  const skillRank = Math.max(0, Math.floor(num(aprops[skillKey], 0)));

  const channelingRank = Math.max(0, Math.floor(num(aprops["Skill_Channeling"], 0)));
  const zoeticPotential = num(aprops.zoeticPotential, 0);            // decimal allowed

  // Track currents (treat as remaining)
  const stunCur0 = Math.max(0, Math.floor(num(aprops.stunCur, 0)));
  const physicalCur0 = Math.max(0, Math.floor(num(aprops.physicalCur, 0)));

  // Track maxes (use stored if present; otherwise derive from WIL/BOD)
  const stunMax = Math.max(0, Math.floor(num(aprops.stunMax, computeStunMax(actor))));
  const physicalMax = Math.max(0, Math.floor(num(aprops.physicalMax, computePhysicalMax(actor))));

  // --- Limits (your rules) ---
  const castLimit = Math.max(0, skillRank + fociRank);
  const resistLimit = Math.max(0, channelingRank + fetishRank);

  // --- Dialog inputs ---
  const dialogData = await new Promise((resolve) => {
    new Dialog({
      title: `Cast Spell: ${item.name}`,
      content: `
        <form>
          <div class="form-group">
            <label>Force (1–${spellforceMax})</label>
            <input type="number" name="forceChosen" min="1" max="${spellforceMax}" value="${clamp(spellforceDefault, 1, spellforceMax)}" step="1"/>
          </div>

          <hr/>

          <div class="form-group">
            <label>Resolve available now (${poolKey}): ${poolCur}</label>
            <p style="margin: 0.25rem 0 0.5rem 0; opacity: 0.8;">
              Casting limit: ${castLimit} ( ${skillKey} ${skillRank} + Foci ${fociRank} )
            </p>
            <label>Spend on casting roll (0–${Math.min(poolCur, castLimit)})</label>
            <input type="number" name="spendCast" min="0" max="${Math.min(poolCur, castLimit)}" value="${Math.min(poolCur, castLimit)}" step="1"/>
          </div>

          <div class="form-group">
            <p style="margin: 0.25rem 0 0.5rem 0; opacity: 0.8;">
              Drain resist limit (if allowed): ${resistLimit} ( Channeling ${channelingRank} + Fetish ${fetishRank} )
            </p>
            <label>Reserve Resolve for drain resist (0–${Math.min(poolCur, resistLimit)})</label>
            <input type="number" name="spendDrain" min="0" max="${Math.min(poolCur, resistLimit)}" value="0" step="1"/>
          </div>

          <hr/>
          <div class="form-group">
            <label>Static dice modifiers</label>
            <div style="opacity:0.85;">bonusDice: ${bonusDice} | diceMod: ${diceMod}</div>
          </div>
        </form>
      `,
      buttons: {
        cast: {
          icon: '<i class="fas fa-magic"></i>',
          label: "Cast",
          callback: (html) => {
            const forceChosen = num(html.find('[name="forceChosen"]').val(), 1);
            const spendCast = num(html.find('[name="spendCast"]').val(), 0);
            const spendDrain = num(html.find('[name="spendDrain"]').val(), 0);
            resolve({ forceChosen, spendCast, spendDrain });
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => resolve(null)
        }
      },
      default: "cast"
    }).render(true);
  });

  if (!dialogData) return;

  // Enforce force bounds
  const forceChosen = clamp(Math.floor(dialogData.forceChosen), 1, spellforceMax);

  // Enforce spend bounds + limits
  const spendCastMax = Math.min(poolCur, castLimit);
  const spendDrainMax = Math.min(poolCur, resistLimit);

  let spendCast = clamp(Math.floor(dialogData.spendCast), 0, spendCastMax);
  let spendDrain = clamp(Math.floor(dialogData.spendDrain), 0, spendDrainMax);

  // Total spend cannot exceed poolCur
  if (spendCast + spendDrain > poolCur) {
    // reduce drain reserve first
    spendDrain = Math.max(0, poolCur - spendCast);
  }

  // --- Evaluate drain ---
  const { drain, normalized, Force: ForceUsed } = evaluateDrainFormula(drainFormulaText, forceChosen);

  // Lethal bypass rule (your latest):
  // if calculated drain > zoeticPotential: no channeling roll; full drain applies to physicalCur
  const isLethal = drain > zoeticPotential;

  // TN (placeholder; wire to your global TN later if you have one)
  const tn = 4;

  // --- Casting roll (Resolve dice spent on casting + static mods) ---
  const castDice = Math.max(0, spendCast + bonusDice + diceMod);
  const cast = await rollPoolD6({ dice: castDice, tn, flavor: `${item.name} cast` });

  // Spend Resolve immediately for the cast (like weapon macro behavior)
  let poolAfterCast = poolCur - spendCast;

  // --- Drain resolution ---
  let resistDice = 0;
  let resistSuccesses = 0;
  let appliedDrain = 0;

  let stunCur = stunCur0;
  let physicalCur = physicalCur0;

  if (isLethal) {
    // No resist roll. Apply full drain to physicalCur (remaining track model)
    appliedDrain = drain;
    physicalCur = clamp(physicalCur - appliedDrain, 0, physicalMax);
    // spendDrain is irrelevant in lethal case; do NOT subtract it
    spendDrain = 0;
  } else {
    // Allow resist roll. Spend additional resolve from remaining pool.
    const spendDrainAllowed = clamp(spendDrain, 0, Math.min(poolAfterCast, resistLimit));
    poolAfterCast -= spendDrainAllowed;

    resistDice = Math.max(0, spendDrainAllowed); // resolve dice reserved for resist
    const resist = await rollPoolD6({ dice: resistDice, tn, flavor: `${item.name} drain resist` });
    resistSuccesses = resist.successes;

    const remaining = Math.max(0, drain - resistSuccesses);
    appliedDrain = remaining;

    // Apply to stun first; overflow goes to physical (remaining track model)
    const stunAfter = stunCur - remaining;
    if (stunAfter >= 0) {
      stunCur = stunAfter;
    } else {
      stunCur = 0;
      const overflow = Math.abs(stunAfter);
      physicalCur = clamp(physicalCur - overflow, 0, physicalMax);
    }
  }

  // --- Write back actor updates ---
  const updateData = {
    [`system.props.${poolCurK}`]: poolAfterCast,
    "system.props.stunCur": stunCur,
    "system.props.physicalCur": physicalCur,
  };

  await actor.update(updateData);

  // --- Chat output ---
  await postSpellChat({
    actor,
    item,
    forceChosen: ForceUsed,
    cast: { ...cast },
    drain: {
      formulaText: drainFormulaText,
      normalized,
      drain,
      isLethal,
      resistDice,
      resistSuccesses,
      applied: appliedDrain,
      tn,
    }
  });

  return true;
}
