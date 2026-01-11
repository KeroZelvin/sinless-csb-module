// scripts/api/cast-spell.js
import { evaluateDrainFormula } from "../rules/drain-formula.js";

/**
 * SinlessCSB Cast Spell (Foundry v13 + CSB)
 * - Supports castSpell({ itemUuid, actorUuid? })
 * - GM-safe actor resolution (actorUuid preferred; falls back to item.parent)
 * - Canonical actor mirroring via system.props.ActorUuid (prevents token-synthetic drift)
 * - DialogV2-safe form value capture (reads from dialog instance DOM)
 */

/* =========================
 * Utilities
 * ========================= */
function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}
function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
function int(x, fallback = 0) {
  return Math.floor(num(x, fallback));
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
 * Try to resolve the "best" actor to UPDATE based on scope + item ownership.
 * Priority:
 *  1) scope.actorUuid (explicit, best for GM / sheet context)
 *  2) item.parent (embedded item owner)
 *  3) controlled token actor
 *  4) user character
 */
async function resolveActorForCast({ scope, item }) {
  const actorUuid = String(scope?.actorUuid ?? "").trim();
  if (actorUuid) {
    const a = await fromUuid(actorUuid);
    if (a?.documentName === "Actor") return a;
    console.warn("SinlessCSB | castSpell: actorUuid did not resolve to Actor", { actorUuid, resolved: a });
  }

  if (item?.parent?.documentName === "Actor") return item.parent;

  const tokA = canvas?.tokens?.controlled?.[0]?.actor ?? null;
  if (tokA?.documentName === "Actor") return tokA;

  const charA = game.user.character ?? null;
  if (charA?.documentName === "Actor") return charA;

  return null;
}

/**
 * Get pool current key from item.poolKey ("Resolve" -> "Resolve_Cur", etc.)
 * Hardened: accepts "resolve", "RESOLVE", "Resolve_Cur", etc.
 */
function poolCurKey(poolKey) {
  const raw = String(poolKey ?? "").trim();
  if (!raw) return null;

  // Strip any existing suffix (case-insensitive)
  const base = raw.replace(/_Cur$/i, "");

  // Normalize casing to match your actor keys (Resolve, Focus, etc.)
  const norm = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();

  return `${norm}_Cur`;
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
  const d = Math.max(0, int(dice, 0));

  // Foundry v13+: Roll#evaluate is async by default; DO NOT pass {async:true}
  const roll = new Roll(`${d}d6`);
  await roll.evaluate();

  const results = roll.dice?.[0]?.results ?? [];
  const successes = results.reduce((acc, r) => acc + (num(r.result, 0) >= tn ? 1 : 0), 0);

  return { roll, successes, dice: d, tn, flavor };
}

/** Render chat output */
async function postSpellChat({ actor, item, forceChosen, cast, drain } = {}) {
  const title = `${item.name} — Cast`;

  const rows = [];
  const addRow = (k, v) => rows.push(`
    <div class="sl-row">
      <div class="sl-key">${k}</div>
      <div class="sl-val">${v}</div>
    </div>
  `);

  addRow("Force", `<span class="sl-strong">${forceChosen}</span>`);
  addRow(
    "Casting",
    `${cast.dice}d6 vs TN ${cast.tn} → <span class="sl-strong">${cast.successes}</span> successes`
  );

  addRow(
    "Drain (raw)",
    `${drain.drain} ${drain.isLethal ? `<span class="sl-strong">(LETHAL)</span>` : ""}`
  );

  if (!drain.isLethal) {
    addRow(
      "Drain resist",
      `${drain.resistDice}d6 vs TN ${drain.tn} → <span class="sl-strong">${drain.resistSuccesses}</span> successes`
    );
    addRow(
      "Drain applied",
      `<span class="sl-strong">${drain.applied}</span> (stun overflow → physical)`
    );
  } else {
    addRow("Drain applied to Physical", `<span class="sl-strong">${drain.applied}</span>`);
  }

  const details = `
    <details>
      <summary>Drain formula</summary>
      <div style="margin-top:6px;">
        <div><strong>Text:</strong> ${drain.formulaText}</div>
        <div style="margin-top:4px;"><strong>Normalized:</strong> <code>${drain.normalized}</code></div>
      </div>
    </details>
  `;

  const content = `
    <div class="sinlesscsb spell-card">
      <div class="sl-card-title">
        <h3>${title}</h3>
        <div class="sl-badge">${actor?.name ?? "—"}</div>
      </div>
      ${rows.join("")}
      ${details}
    </div>
  `;

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content
  });
}


/* =========================
 * Dialog
 * ========================= */

/**
 * DialogV2 helper (Foundry v13+).
 * Adds:
 *  A) live "remaining Resolve after cast" + live drain max
 *  B) +/- controls for spend fields
 *  C) drain defaults to max allowed, and refreshes when cast spend changes
 */
async function promptCastSpellDialog({
  itemName,
  poolKey,
  poolCur,
  spellforceMax,
  spellforceDefault, // unused (we default Cast Force to spellforceMax per your request)
  castLimit,
  skillKey,
  skillRank,
  fociRank,
  resistLimit,
  channelingRank,
  fetishRank,
  bonusDice,
  diceMod
}) {
  const DialogV2 = foundry?.applications?.api?.DialogV2;

  const maxCastSpend = Math.min(poolCur, castLimit);

  // Default: Cast Force = spellforceMax
  const defaultForce = clamp(Math.floor(num(spellforceMax, 1)), 1, spellforceMax);

  // Default: Cast spend = maxCastSpend
  const initialCast = clamp(Math.floor(num(maxCastSpend, 0)), 0, maxCastSpend);

  // Default: Drain spend = max allowed AFTER cast (bounded by resistLimit)
  const initialRemaining = Math.max(0, poolCur - initialCast);
  const initialDrainMax = Math.min(resistLimit, initialRemaining);
  const initialDrain = clamp(Math.floor(num(initialDrainMax, 0)), 0, initialDrainMax);

  const content = `
    <div class="sinlesscsb spell-dialog">
      <style>
        .sinlesscsb-spell-table {
          width: 100%;
          border-collapse: collapse;
        }
        .sinlesscsb-spell-table th,
        .sinlesscsb-spell-table td {
          padding: 8px 10px;
          vertical-align: top;
        }
        .sinlesscsb-spell-table thead th {
          text-align: left;
          padding: 0 0 6px 0;
        }

        /* Alternating row color for readability (like pools dialog) */
        .sinlesscsb-spell-table tbody tr:nth-child(even) td {
          background: rgba(255, 255, 255, 0.04);
        }
        .sinlesscsb-spell-table tbody tr:nth-child(odd) td {
          background: rgba(255, 255, 255, 0.00);
        }

        .sinlesscsb-spell-label {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .sinlesscsb-spell-value {
          font-size: 1.05rem;
        }
        .sinlesscsb-spell-row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: nowrap;
        }
        .sinlesscsb-step {
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
        }
        .sinlesscsb-spell-input {
          width: 6rem;
        }
        .sinlesscsb-muted {
          opacity: 0.85;
          margin-top: 4px;
        }
        .sinlesscsb-details {
          margin-top: 4px;
          opacity: 0.9;
        }
        .sinlesscsb-details summary {
          cursor: pointer;
          opacity: 0.85;
        }
      </style>

      <table class="sinlesscsb-spell-table">
        <tbody>

          <!-- Row 1 -->
          <tr>
            <td>
              <div class="sinlesscsb-spell-label">Learned Force MAX:</div>
              <div class="sinlesscsb-spell-value">${spellforceMax}</div>
            </td>
            <td>
              <div class="sinlesscsb-spell-label">Cast Force:</div>
              <div class="sinlesscsb-spell-row">
                <button type="button" class="sinlesscsb-step" data-target="forceChosen" data-delta="-1">-</button>
                <input class="sinlesscsb-spell-input" type="number" name="forceChosen"
                       min="1" max="${spellforceMax}" value="${defaultForce}" step="1"/>
                <button type="button" class="sinlesscsb-step" data-target="forceChosen" data-delta="1">+</button>
              </div>
            </td>
          </tr>

          <!-- Row 2 -->
          <tr>
            <td>
              <div class="sinlesscsb-spell-label">Casting Limit:</div>
              <div class="sinlesscsb-spell-value">${castLimit}</div>
              <details class="sinlesscsb-details">
                <summary>Show formula</summary>
                <div class="sinlesscsb-muted">${skillKey} (${skillRank}) + Spell Foci (${fociRank})</div>
              </details>
            </td>
            <td>
              <div class="sinlesscsb-spell-label">Drain Resist Limit:</div>
              <div class="sinlesscsb-spell-value">${resistLimit}</div>
              <details class="sinlesscsb-details">
                <summary>Show formula</summary>
                <div class="sinlesscsb-muted">Skill_Channeling (${channelingRank}) + Fetish (${fetishRank})</div>
              </details>
            </td>
          </tr>

          <!-- Row 3 -->
          <tr>
            <td>
              <div class="sinlesscsb-spell-label">Resolve Pool:</div>
              <div class="sinlesscsb-spell-value">
                <span data-sinless="poolCur">${poolCur}</span>
              </div>
            </td>
            <td>
              <div class="sinlesscsb-spell-label">Cast Spend:</div>
              <div class="sinlesscsb-spell-row">
                <button type="button" class="sinlesscsb-step" data-target="spendCast" data-delta="-1">-</button>
                <input class="sinlesscsb-spell-input" type="number" name="spendCast"
                       min="0" max="${maxCastSpend}" value="${initialCast}" step="1"/>
                <button type="button" class="sinlesscsb-step" data-target="spendCast" data-delta="1">+</button>
              </div>
              <div class="sinlesscsb-muted">
                Max: <span data-sinless="castMax">${maxCastSpend}</span>
              </div>
            </td>
          </tr>

          <!-- Row 4 -->
          <tr>
            <td>
              <div class="sinlesscsb-spell-label">Post-Cast Resolve Pool:</div>
              <div class="sinlesscsb-spell-value">
                <span data-sinless="remainAfterCast">${initialRemaining}</span>
              </div>
            </td>
            <td>
              <div class="sinlesscsb-spell-label">Drain Resist Spend:</div>
              <div class="sinlesscsb-spell-row">
                <button type="button" class="sinlesscsb-step" data-target="spendDrain" data-delta="-1">-</button>
                <input class="sinlesscsb-spell-input" type="number" name="spendDrain"
                       min="0" max="${initialDrainMax}" value="${initialDrain}" step="1"/>
                <button type="button" class="sinlesscsb-step" data-target="spendDrain" data-delta="1">+</button>
              </div>
              <div class="sinlesscsb-muted">
                Max: <span data-sinless="drainMax">${initialDrainMax}</span>
              </div>
            </td>
          </tr>

        </tbody>
      </table>

      <hr/>

      <div class="form-group">
        <label>Static dice modifiers</label>
        <div class="sinlesscsb-muted">bonusDice: ${bonusDice} | diceMod: ${diceMod}</div>
      </div>
    </div>
  `;

  if (DialogV2?.wait) {
    console.log("SinlessCSB | promptCastSpellDialog opening (DialogV2)");

    const result = await DialogV2.wait({
      window: { title: `Cast Spell: ${itemName}` },
      content,

      render: (event, dialog) => {
        const root =
          (dialog?.element instanceof HTMLElement ? dialog.element : dialog?.element?.[0]) ?? null;
        if (!root) return;

        if (root.dataset?.sinlessBound === "1") return;
        root.dataset.sinlessBound = "1";

        const form = root.querySelector("form") ?? root;

        const elForce = form.querySelector('input[name="forceChosen"]');
        const elCast = form.querySelector('input[name="spendCast"]');
        const elDrain = form.querySelector('input[name="spendDrain"]');

        const elRemain = form.querySelector('[data-sinless="remainAfterCast"]');
        const elDrainMax = form.querySelector('[data-sinless="drainMax"]');

        let drainDirty = false;

        const clampToInput = (input, v) => {
          if (!input) return 0;
          const min = Number(input.min ?? 0);
          const max = Number(input.max ?? 0);
          const vv = Math.max(min, Math.min(max, Number.isFinite(v) ? v : min));
          input.value = String(Math.floor(vv));
          return Math.floor(vv);
        };

        const updateDerived = () => {
          if (!elCast || !elDrain) return;

          // Force clamp (typing can exceed max unless we clamp)
          if (elForce) clampToInput(elForce, Number(elForce.value));

          // Cast spend clamp
          const castVal = clampToInput(elCast, Number(elCast.value));

          // Remaining resolve after cast
          const remaining = Math.max(0, poolCur - castVal);
          if (elRemain) elRemain.textContent = String(remaining);

          // Drain max = min(resistLimit, remaining)
          const drainMax = Math.min(resistLimit, remaining);
          elDrain.max = String(drainMax);
          if (elDrainMax) elDrainMax.textContent = String(drainMax);

          // Default drain to max allowed unless user has edited it
          const currentDrain = Number(elDrain.value);
          if (!drainDirty) {
            elDrain.value = String(Math.floor(drainMax));
          } else if (currentDrain > drainMax) {
            elDrain.value = String(Math.floor(drainMax));
          }
        };

        elDrain?.addEventListener("input", () => {
          drainDirty = true;
          updateDerived();
        });

        elCast?.addEventListener("input", () => updateDerived());
        elForce?.addEventListener("input", () => updateDerived());

        for (const btn of form.querySelectorAll("button.sinlesscsb-step")) {
          btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            const delta = Number(btn.getAttribute("data-delta") ?? "0");
            const input = form.querySelector(`input[name="${target}"]`);
            if (!input) return;

            const cur = Number(input.value);
            const next = (Number.isFinite(cur) ? cur : 0) + delta;

            input.value = String(next);
            input.dispatchEvent(new Event("input", { bubbles: true }));
          });
        }

        updateDerived();
      },

      buttons: [
        {
          action: "cast",
          label: "Cast",
          icon: "fa-solid fa-wand-magic-sparkles",
          default: true,
          callback: (event, button, dialog) => {
            console.log("SinlessCSB | DialogV2 CAST callback fired");

            const form = button?.form ?? null;
            if (!form?.elements) {
              console.warn("SinlessCSB | DialogV2: no form found on button");
              return { forceChosen: 1, spendCast: 0, spendDrain: 0 };
            }

            // Final clamp at submit time (defense-in-depth)
            const forceChosen = clamp(Math.floor(num(form.elements.forceChosen?.value, 1)), 1, spellforceMax);

            const spendCastRaw = Math.floor(num(form.elements.spendCast?.value, 0));
            const spendCast = clamp(spendCastRaw, 0, maxCastSpend);

            const remainingAfterCast = Math.max(0, poolCur - spendCast);
            const spendDrainMax = Math.min(resistLimit, remainingAfterCast);

            const spendDrainRaw = Math.floor(num(form.elements.spendDrain?.value, 0));
            const spendDrain = clamp(spendDrainRaw, 0, spendDrainMax);

            console.log("SinlessCSB | castSpell dialog read", { forceChosen, spendCast, spendDrain });
            return { forceChosen, spendCast, spendDrain };
          }
        },
        {
          action: "cancel",
          label: "Cancel",
          icon: "fa-solid fa-xmark",
          callback: () => null
        }
      ],

      rejectClose: false
    });

    if (!result || result === "cancel") return null;
    return result;
  }

  // Legacy Dialog fallback (no live refresh)
  return await new Promise((resolve) => {
    new Dialog({
      title: `Cast Spell: ${itemName}`,
      content: `<div>${content}</div>`,
      buttons: {
        cast: {
          icon: '<i class="fas fa-magic"></i>',
          label: "Cast",
          callback: (html) => {
            const forceChosen = clamp(Math.floor(num(html.find('[name="forceChosen"]').val(), 1)), 1, spellforceMax);

            const spendCast = clamp(
              Math.floor(num(html.find('[name="spendCast"]').val(), 0)),
              0,
              maxCastSpend
            );

            const remainingAfterCast = Math.max(0, poolCur - spendCast);
            const spendDrainMax = Math.min(resistLimit, remainingAfterCast);

            const spendDrain = clamp(
              Math.floor(num(html.find('[name="spendDrain"]').val(), 0)),
              0,
              spendDrainMax
            );

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
}



/* =========================
 * API: castSpell
 * ========================= */

/**
 * Module API entry: castSpell({ itemUuid, actorUuid? })
 */
export async function castSpell(scope = {}) {
  const itemUuid = String(scope?.itemUuid ?? "");
  if (!itemUuid) return ui.notifications?.warn("castSpell: missing itemUuid.");

  const doc = await fromUuid(itemUuid);
  if (!doc) return ui.notifications?.warn(`castSpell: could not resolve uuid ${itemUuid}.`);
  if (doc.documentName !== "Item") return ui.notifications?.warn("castSpell: uuid is not an Item.");

  const item = doc;

  // Resolve the Actor we will UPDATE (GM-safe if actorUuid passed)
  const sheetActor = await resolveActorForCast({ scope, item });
  if (!sheetActor || sheetActor.documentName !== "Actor") {
    return ui.notifications?.warn("castSpell: could not resolve an Actor to update (pass actorUuid or use an owned item).");
  }

  // Canonical actor is useful, but do NOT only update it.
  const canonActor = await resolveCanonicalActor(sheetActor);

  // --- Read item props (your keys) ---
  const props = item.system?.props ?? {};
  const skillKey = String(props.skillKey ?? "").trim();
  const poolKey = String(props.poolKey ?? "Resolve").trim();

  const fociRank = int(props.spellFociRank, 0);
  const bonusDice = int(props.bonusDice, 0);
  const diceMod = int(props.diceMod, 0);

  const spellforceMax = Math.max(1, int(props.spellforceMax, 1));
  const spellforceDefault = Math.max(1, int(props.spellforceDefault, 1));

  const fetishRank = Math.max(0, int(props.fetishRank, 0));
  const drainFormulaText = String(props.drainFormula ?? "").trim();

  if (!skillKey) return ui.notifications?.warn("Spell is missing item prop: skillKey (e.g., Skill_Sorcery).");
  if (!drainFormulaText) return ui.notifications?.warn("Spell is missing drainFormula text.");

  // --- Actor values ---
  const aprops = sheetActor.system?.props ?? {};

  const poolCurK = poolCurKey(poolKey);
  if (!poolCurK) return ui.notifications?.warn("Spell is missing poolKey (e.g., Resolve).");

  const poolCur = Math.max(0, int(aprops[poolCurK], 0));
  const skillRank = Math.max(0, int(aprops[skillKey], 0));

  const channelingRank = Math.max(0, int(aprops["Skill_Channeling"], 0));
  const zoeticPotential = num(aprops.zoeticPotential, 0);

  // Track currents (treat as remaining)
  const stunCur0 = Math.max(0, int(aprops.stunCur, 0));
  const physicalCur0 = Math.max(0, int(aprops.physicalCur, 0));

  // Track maxes (use stored if present; otherwise derive from WIL/BOD)
  const stunMax = Math.max(0, int(aprops.stunMax, computeStunMax(sheetActor)));
  const physicalMax = Math.max(0, int(aprops.physicalMax, computePhysicalMax(sheetActor)));

  // --- Limits (your rules) ---
  const castLimit = Math.max(0, skillRank + fociRank);
  const resistLimit = Math.max(0, channelingRank + fetishRank);

  // --- Dialog inputs ---
  const dialogData = await promptCastSpellDialog({
    itemName: item.name,
    poolKey,
    poolCur,
    spellforceMax,
    spellforceDefault,
    castLimit,
    skillKey,
    skillRank,
    fociRank,
    resistLimit,
    channelingRank,
    fetishRank,
    bonusDice,
    diceMod
  });
  if (!dialogData) return;

  // Enforce force bounds
  const forceChosen = clamp(int(dialogData.forceChosen, 1), 1, spellforceMax);

  // Enforce spend bounds + limits
  const spendCastMax = Math.min(poolCur, castLimit);
  const spendDrainMax = Math.min(poolCur, resistLimit);

  let spendCast = clamp(int(dialogData.spendCast, 0), 0, spendCastMax);
  let spendDrain = clamp(int(dialogData.spendDrain, 0), 0, spendDrainMax);

  // Total spend cannot exceed poolCur (reduce drain reserve first)
  if (spendCast + spendDrain > poolCur) {
    spendDrain = Math.max(0, poolCur - spendCast);
  }

  // --- Evaluate drain ---
  const { drain, normalized, Force: ForceUsed } = evaluateDrainFormula(drainFormulaText, forceChosen);

  // Lethal bypass rule:
  const isLethal = drain > zoeticPotential;

  // TN (placeholder; wire to your global TN later if you have one)
  const tn = 4;

  console.log("SinlessCSB | castSpell spend/dice", {
    poolCurK,
    poolCur,
    castLimit,
    resistLimit,
    spendCast,
    spendDrain,
    bonusDice,
    diceMod,
    castDice: Math.max(0, spendCast + bonusDice + diceMod)
  });

  // --- Casting roll (Resolve dice spent on casting + static mods) ---
  const castDice = Math.max(0, spendCast + bonusDice + diceMod);
  const cast = await rollPoolD6({ dice: castDice, tn, flavor: `${item.name} cast` });

  // Spend Resolve immediately for the cast
  let poolAfterCast = poolCur - spendCast;

  // --- Drain resolution ---
  let resistDice = 0;
  let resistSuccesses = 0;
  let appliedDrain = 0;

  let stunCur = stunCur0;
  let physicalCur = physicalCur0;

  if (isLethal) {
    // No resist roll. Apply full drain to Physical (remaining track model)
    appliedDrain = drain;
    physicalCur = clamp(physicalCur - appliedDrain, 0, physicalMax);

    // spendDrain irrelevant in lethal case
    spendDrain = 0;
  } else {
    // Spend additional resolve from remaining pool for resist
    const spendDrainAllowed = clamp(spendDrain, 0, Math.min(poolAfterCast, resistLimit));
    poolAfterCast -= spendDrainAllowed;

    resistDice = Math.max(0, spendDrainAllowed);
    const resist = await rollPoolD6({ dice: resistDice, tn, flavor: `${item.name} drain resist` });
    resistSuccesses = resist.successes;

let remaining = Math.max(0, drain - resistSuccesses);

// Rules: minimum 1 drain applied when drain is non-lethal and drain > 0
// (If drain is 0, keep it 0; if lethal, handled in other branch.)
if (drain > 0) remaining = Math.max(1, remaining);

appliedDrain = remaining;


    // Apply to stun first; overflow to physical (remaining track model)
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
    "system.props.physicalCur": physicalCur
  };

  console.log("SinlessCSB | castSpell targets", {
    item: { name: item.name, uuid: item.uuid },
    scope,
    sheetActor: { name: sheetActor.name, uuid: sheetActor.uuid },
    canonActor: canonActor ? { name: canonActor.name, uuid: canonActor.uuid } : null,
    updateData
  });

  // 1) Update the resolved actor (explicit actorUuid or item parent)
  await sheetActor.update(updateData);

  // 2) Mirror to canonical actor if different
  if (canonActor && canonActor.uuid !== sheetActor.uuid) {
    try {
      await canonActor.update(updateData);
    } catch (e) {
      console.warn("SinlessCSB | castSpell: canonical mirror update failed", e);
    }
  }

  // 3) If a controlled token actor is different but represents the same canonical actor, mirror there too.
  const controlled = canvas?.tokens?.controlled ?? [];
  for (const t of controlled) {
    const ta = t?.actor;
    if (!ta || ta.documentName !== "Actor") continue;

    const taCanon = await resolveCanonicalActor(ta);
    const matches =
      taCanon?.uuid &&
      (taCanon.uuid === sheetActor.uuid || (canonActor?.uuid && taCanon.uuid === canonActor.uuid));

    if (matches && ta.uuid !== sheetActor.uuid && (!canonActor || ta.uuid !== canonActor.uuid)) {
      try {
        await ta.update(updateData);
      } catch (e) {
        console.warn("SinlessCSB | castSpell: token-synthetic mirror update failed", e);
      }
    }
  }

  // 4) Re-render open sheets tied to updated actor docs
  const rerenderActor = (a) => {
    for (const app of Object.values(a?.apps ?? {})) {
      try {
        app.render(false);
      } catch (_e) {}
    }
  };
  rerenderActor(sheetActor);
  if (canonActor && canonActor.uuid !== sheetActor.uuid) rerenderActor(canonActor);
  for (const t of canvas?.tokens?.controlled ?? []) rerenderActor(t?.actor);

  // --- Chat output ---
  await postSpellChat({
    actor: sheetActor,
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
      tn
    }
  });

  return true;
}
