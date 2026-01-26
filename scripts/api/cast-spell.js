// scripts/api/cast-spell.js
import { evaluateDrainFormula } from "../rules/drain-formula.js";

import {
  num, clamp, clampInt,
  poolCurKey,
  resolveActorForContext,
  resolveCanonicalActor,
  resolveItemDoc,
  rollXd6Successes,
  getDialogFormFromCallbackArgs,
  readDialogNumber,
  openDialogV2,
  propPath
} from "./_util.js";

/**
 * SinlessCSB Cast Spell (Foundry v13 + CSB)
 * - Supports castSpell({ itemUuid, actorUuid?, itemId? })
 * - GM-safe actor resolution (actorUuid preferred; falls back to item.parent)
 * - Canonical actor mirroring via system.props.ActorUuid (prevents token-synthetic drift)
 * - DialogV2-safe form value capture (reads from dialog instance DOM)
 * - Robust dialog open (works even when DialogV2.wait is missing)
 */

/* =========================
 * Session Settings helpers
 * ========================= */

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

/* =========================
 * Track max helpers
 * ========================= */

function computeStunMax(actor) {
  const WIL = num(actor?.system?.props?.WIL, 0);
  return 6 + Math.floor(WIL / 2);
}
function computePhysicalMax(actor) {
  const BOD = num(actor?.system?.props?.BOD, 0);
  return 6 + Math.floor(BOD / 2);
}

/* =========================
 * Chat output
 * ========================= */

async function postSpellChat({ actor, item, forceChosen, cast, drain } = {}) {
  const title = `${item.name} — Cast`;

  const rollInfoRows = [];
  const addRow = (k, v) => rollInfoRows.push(`
    <div class="sl-row">
      <div class="sl-key">${k}</div>
      <div class="sl-val">${v}</div>
    </div>
  `);

  addRow("Force", `<span class="sl-strong">${forceChosen}</span>`);
  addRow(
    "Casting",
    `${cast.dice}d6 vs TN ${cast.tn}`
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
    addRow("Drain applied to Physical", `<span class="sl-strong">${drain.applied}</span> <span class="sl-strong">[LETHAL]</span>`);
  }

  const drainFormulaHTML = `
    <div class="sl-row">
      <div class="sl-key">Drain formula</div>
      <div class="sl-val">
        <div><strong>Text:</strong> ${drain.formulaText}</div>
        <div style="margin-top:4px;"><strong>Normalized:</strong> <code>${drain.normalized}</code></div>
      </div>
    </div>
  `;

  const details = `
    <details>
      <summary>roll info</summary>
      ${rollInfoRows.join("")}
      ${drainFormulaHTML}
    </details>
  `;

  const successLabel = `${cast.successes} SUCCESS${cast.successes === 1 ? "" : "ES"}`;
  const drainAppliedLabel = drain.isLethal ? "Drain applied to Physical [LETHAL]" : "Drain applied";
  const drainAppliedLine = `
    <p style="margin:0 0 6px 0;">${drainAppliedLabel}: <strong>${drain.applied}</strong></p>
  `;

  const content = `
    <div class="sinlesscsb spell-card">
      <div class="sl-card-title">
        <h3>${title}</h3>
        <div class="sl-badge">${actor?.name ?? "—"}</div>
      </div>
      <hr class="sl-card-rule"/>

      <div style="text-align:center; margin:10px 0 12px 0;">
        <div style="font-size:28px; font-weight:bold;">${successLabel}</div>
      </div>

      ${drainAppliedLine}

      <hr class="sl-card-rule"/>

      ${details}
    </div>
  `;

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content
  });
}

/* =========================
 * Dialog (via openDialogV2)
 * ========================= */

async function promptCastSpellDialog({
  itemName,
  poolCur,
  spellforceMax,
  castLimit,
  resistLimit,
  skillKey,
  skillRank,
  fociRank,
  channelingRank,
  fetishRank,
  bonusDice,
  diceMod
}) {
  const maxCastSpend = Math.min(poolCur, castLimit);

  const defaultForce = clamp(Math.floor(num(spellforceMax, 1)), 1, spellforceMax);
  const initialCast = clamp(Math.floor(num(maxCastSpend, 0)), 0, maxCastSpend);

  const initialRemaining = Math.max(0, poolCur - initialCast);
  const initialDrainMax = Math.min(resistLimit, initialRemaining);
  const initialDrain = clamp(Math.floor(num(initialDrainMax, 0)), 0, initialDrainMax);

const content = `
  <form class="sinlesscsb spell-dialog" autocomplete="off">
    <style>
      .sinlesscsb-spell-table { width: 100%; border-collapse: collapse; }
      .sinlesscsb-spell-table th, .sinlesscsb-spell-table td { padding: 8px 10px; vertical-align: top; }
      .sinlesscsb-spell-table thead th { text-align: left; padding: 0 0 6px 0; }
      .sinlesscsb-spell-table tbody tr:nth-child(even) td { background: rgba(255, 255, 255, 0.04); }
      .sinlesscsb-spell-table tbody tr:nth-child(odd) td { background: rgba(255, 255, 255, 0.00); }
      .sinlesscsb-spell-label { font-weight: 600; margin-bottom: 4px; }
      .sinlesscsb-spell-value { font-size: 1.05rem; }

      /* Keep these, but Foundry may override them; inline styles below are the hard stop. */
      .sinlesscsb-spell-row {
        display: grid !important;
        grid-template-columns: 2rem 1fr 2rem;
        gap: 8px;
        align-items: center;
      }

      button.sinlesscsb-step {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        width: 2rem !important;
        height: 2rem !important;
        line-height: 2rem !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      input.sinlesscsb-spell-input {
        width: 100% !important;
        min-width: 0;
      }

      .sinlesscsb-muted { opacity: 0.85; margin-top: 4px; }
      .sinlesscsb-details { margin-top: 4px; opacity: 0.9; }
      .sinlesscsb-details summary { cursor: pointer; opacity: 0.85; }
    </style>

    <table class="sinlesscsb-spell-table">
      <tbody>
        <tr>
          <td>
            <div class="sinlesscsb-spell-label">Learned Force MAX:</div>
            <div class="sinlesscsb-spell-value">${spellforceMax}</div>
          </td>
          <td>
            <div class="sinlesscsb-spell-label">Cast Force:</div>

            <!-- INLINE GRID: this defeats Foundry's dialog form CSS that forces stacking -->
            <div class="sinlesscsb-spell-row"
                 style="display:grid !important; grid-template-columns:2rem 1fr 2rem; gap:8px; align-items:center;">
              <button type="button" class="sinlesscsb-step" data-target="forceChosen" data-delta="-1">-</button>
              <input class="sinlesscsb-spell-input" type="number" name="forceChosen"
                     min="1" max="${spellforceMax}" value="${defaultForce}" step="1"/>
              <button type="button" class="sinlesscsb-step" data-target="forceChosen" data-delta="1">+</button>
            </div>
          </td>
        </tr>

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

        <tr>
          <td>
            <div class="sinlesscsb-spell-label">Resolve Pool:</div>
            <div class="sinlesscsb-spell-value">
              <span data-sinless="poolCur">${poolCur}</span>
            </div>
          </td>
          <td>
            <div class="sinlesscsb-spell-label">Cast Spend:</div>

            <div class="sinlesscsb-spell-row"
                 style="display:grid !important; grid-template-columns:2rem 1fr 2rem; gap:8px; align-items:center;">
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

        <tr>
          <td>
            <div class="sinlesscsb-spell-label">Post-Cast Resolve Pool:</div>
            <div class="sinlesscsb-spell-value">
              <span data-sinless="remainAfterCast">${initialRemaining}</span>
            </div>
          </td>
          <td>
            <div class="sinlesscsb-spell-label">Drain Resist Spend:</div>

            <div class="sinlesscsb-spell-row"
                 style="display:grid !important; grid-template-columns:2rem 1fr 2rem; gap:8px; align-items:center;">
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
  </form>
`;



  return await openDialogV2({
    title: `Cast Spell: ${itemName}`,
    content,
    rejectClose: false,

    onRender: (dialog, root) => {
      if (!(root instanceof HTMLElement)) return;

      // Deterministic bind root in v13 DialogV2: the outer rendered form is stable.
      const bindRoot = root.querySelector("form") || root;

      // Guard on bindRoot (rerender-safe)
      if (bindRoot.dataset.sinlessCastBound === "1") return;
      bindRoot.dataset.sinlessCastBound = "1";

      // Find the inner form (optional). If missing, we can still operate via bindRoot queries.
      const innerForm = bindRoot.querySelector("form.sinlesscsb.spell-dialog") || bindRoot;

      const elForce = innerForm.querySelector('input[name="forceChosen"]');
      const elCast = innerForm.querySelector('input[name="spendCast"]');
      const elDrain = innerForm.querySelector('input[name="spendDrain"]');

      const elRemain = innerForm.querySelector('[data-sinless="remainAfterCast"]');
      const elDrainMax = innerForm.querySelector('[data-sinless="drainMax"]');

      let drainDirty = false;

      // Correct min/max parsing: missing attributes must NOT clamp to 0.
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

      const updateDerived = () => {
        if (!(elCast instanceof HTMLInputElement) || !(elDrain instanceof HTMLInputElement)) return;

        if (elForce instanceof HTMLInputElement) {
          clampToInput(elForce, Number(elForce.value));
        }

        const castVal = clampToInput(elCast, Number(elCast.value));

        const remaining = Math.max(0, poolCur - castVal);
        if (elRemain) elRemain.textContent = String(remaining);

        const drainMax = Math.min(resistLimit, remaining);
        elDrain.setAttribute("max", String(drainMax));
        if (elDrainMax) elDrainMax.textContent = String(drainMax);

        const currentDrain = Number(elDrain.value);

        if (!drainDirty) {
          // Default to max drain spend (but only until the user edits drain)
          elDrain.value = String(Math.floor(drainMax));
        } else if (Number.isFinite(currentDrain) && currentDrain > drainMax) {
          elDrain.value = String(Math.floor(drainMax));
        }
      };

      // Mark drainDirty when user edits drain directly (including via stepper dispatch)
      elDrain?.addEventListener("input", () => {
        drainDirty = true;
        updateDerived();
      });

      elCast?.addEventListener("input", updateDerived);
      elForce?.addEventListener("input", updateDerived);

      // Delegated stepper clicks (capture phase) — robust against child click targets.
      const clickHandler = (ev) => {
        const btn = ev.target?.closest?.("button.sinlesscsb-step");
        if (!(btn instanceof HTMLElement)) return;

        ev.preventDefault();

        const target = btn.getAttribute("data-target") || "";
        const delta = Number(btn.getAttribute("data-delta") ?? "0");
        if (!target || !Number.isFinite(delta)) return;

        const input = innerForm.querySelector(`input[name="${CSS.escape(target)}"]`);
        if (!(input instanceof HTMLInputElement) || input.disabled || input.readOnly) return;

        const cur = Number(input.value);
        const next = (Number.isFinite(cur) ? cur : 0) + delta;

        clampToInput(input, next);

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };

      bindRoot.addEventListener("click", clickHandler, true);

      // Cleanup on close (wrap once)
      if (!dialog._sinlessCastCloseWrapped && typeof dialog.close === "function") {
        dialog._sinlessCastCloseWrapped = true;
        const origClose = dialog.close.bind(dialog);
        dialog.close = async (...args) => {
          try { bindRoot.removeEventListener("click", clickHandler, true); } catch (_e) {}
          return await origClose(...args);
        };
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
          const formEl = getDialogFormFromCallbackArgs(event, button, dialog);
          if (!formEl) {
            console.warn("SinlessCSB | castSpell Dialog: could not locate dialog form");
            return { forceChosen: 1, spendCast: 0, spendDrain: 0 };
          }

          const fd = new FormData(formEl);

          const forceChosen = clampInt(readDialogNumber(fd, "forceChosen", 1), 1, spellforceMax);
          const spendCast = clampInt(readDialogNumber(fd, "spendCast", 0), 0, maxCastSpend);

          const remainingAfterCast = Math.max(0, poolCur - spendCast);
          const spendDrainMax = Math.min(resistLimit, remainingAfterCast);
          const spendDrain = clampInt(readDialogNumber(fd, "spendDrain", 0), 0, spendDrainMax);

          return { forceChosen, spendCast, spendDrain };
        }
      },
      { action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark", callback: () => null }
    ]
  });
}

/* =========================
 * API: castSpell
 * ========================= */

export async function castSpell(scope = {}) {
  const item = await resolveItemDoc({ itemUuid: scope?.itemUuid, actorUuid: scope?.actorUuid, itemId: scope?.itemId });
  if (!item) return ui.notifications?.warn("castSpell: could not resolve Item (provide itemUuid or {actorUuid, itemId}).");

  const sheetActor = await resolveActorForContext({ scope, item });
  if (!sheetActor || sheetActor.documentName !== "Actor") {
    return ui.notifications?.warn("castSpell: could not resolve an Actor to update (pass actorUuid or use an owned item).");
  }

  const canonActor = await resolveCanonicalActor(sheetActor);

  // Item props
  const props = item.system?.props ?? {};
  const skillKey = String(props.skillKey ?? "").trim();
  const poolKey = String(props.poolKey ?? "Resolve").trim();

  const fociRank = Math.floor(num(props.spellFociRank, 0));
  const bonusDice = Math.floor(num(props.bonusDice, 0));
  const diceMod = Math.floor(num(props.diceMod, 0));

  const spellforceMax = Math.max(1, Math.floor(num(props.spellforceMax, 1)));
  const fetishRank = Math.max(0, Math.floor(num(props.fetishRank, 0)));
  const drainFormulaText = String(props.drainFormula ?? "").trim();

  if (!skillKey) return ui.notifications?.warn("Spell is missing item prop: skillKey (e.g., Skill_Sorcery).");
  if (!drainFormulaText) return ui.notifications?.warn("Spell is missing drainFormula text.");

  // Session TN
  const sessionActor = getSessionSettingsActor();
  const tn = sessionActor ? readTN(sessionActor) : 4;

  // Actor values
  const aprops = sheetActor.system?.props ?? {};

  const poolCurK = poolCurKey(poolKey);
  if (!poolCurK) return ui.notifications?.warn("Spell is missing poolKey (e.g., Resolve).");

  const poolCur = Math.max(0, Math.floor(num(aprops[poolCurK], 0)));
  const skillRank = Math.max(0, Math.floor(num(aprops[skillKey], 0)));

  const channelingRank = Math.max(0, Math.floor(num(aprops["Skill_Channeling"], 0)));
  const zoeticPotential = num(aprops.zoeticPotential, 0);

  // Remaining-track model
  const stunCur0 = Math.max(0, Math.floor(num(aprops.stunCur, 0)));
  const physicalCur0 = Math.max(0, Math.floor(num(aprops.physicalCur, 0)));

  const stunMax = Math.max(0, Math.floor(num(aprops.stunMax, computeStunMax(sheetActor))));
  const physicalMax = Math.max(0, Math.floor(num(aprops.physicalMax, computePhysicalMax(sheetActor))));

  // Limits
  const castLimit = Math.max(0, skillRank + fociRank);
  const resistLimit = Math.max(0, channelingRank + fetishRank);

  const dialogData = await promptCastSpellDialog({
    itemName: item.name,
    poolCur,
    spellforceMax,
    castLimit,
    resistLimit,
    skillKey,
    skillRank,
    fociRank,
    channelingRank,
    fetishRank,
    bonusDice,
    diceMod
  });
  if (!dialogData) return;

  const forceChosen = clampInt(num(dialogData.forceChosen, 1), 1, spellforceMax);

  const spendCastMax = Math.min(poolCur, castLimit);
  let spendCast = clampInt(num(dialogData.spendCast, 0), 0, spendCastMax);

  const remainingAfterCast = Math.max(0, poolCur - spendCast);
  const spendDrainMax = Math.min(resistLimit, remainingAfterCast);
  let spendDrain = clampInt(num(dialogData.spendDrain, 0), 0, spendDrainMax);

  // Drain evaluation
  const { drain, normalized, Force: ForceUsed } = evaluateDrainFormula(drainFormulaText, forceChosen);
  const isLethal = drain > zoeticPotential;

  // Casting roll
  const castDice = Math.max(0, spendCast + bonusDice + diceMod);
  const cast = await rollXd6Successes({ dice: castDice, tn });

  let poolAfterCast = poolCur - spendCast;

  // Drain resolution
  let resistDice = 0;
  let resistSuccesses = 0;
  let appliedDrain = 0;

  let stunCur = stunCur0;
  let physicalCur = physicalCur0;

  if (isLethal) {
    appliedDrain = drain;
    physicalCur = clamp(physicalCur - appliedDrain, 0, physicalMax);
    spendDrain = 0;
  } else {
    // Spend resolve for resist out of remaining pool
    const spendDrainAllowed = clampInt(spendDrain, 0, Math.min(poolAfterCast, resistLimit));
    poolAfterCast -= spendDrainAllowed;

    resistDice = Math.max(0, spendDrainAllowed);
    const resist = await rollXd6Successes({ dice: resistDice, tn });
    resistSuccesses = resist.successes;

    let remaining = Math.max(0, drain - resistSuccesses);
    if (drain > 0) remaining = Math.max(1, remaining); // minimum 1 on non-lethal drain>0
    appliedDrain = remaining;

    const stunAfter = stunCur - remaining;
    if (stunAfter >= 0) {
      stunCur = stunAfter;
    } else {
      stunCur = 0;
      const overflow = Math.abs(stunAfter);
      physicalCur = clamp(physicalCur - overflow, 0, physicalMax);
    }
  }

  // Write back updates
  const updateData = {
    [propPath(poolCurK)]: poolAfterCast,
    [propPath("stunCur")]: stunCur,
    [propPath("physicalCur")]: physicalCur
  };

  await sheetActor.update(updateData);

  if (canonActor && canonActor.uuid !== sheetActor.uuid) {
    try { await canonActor.update(updateData); } catch (e) {
      console.warn("SinlessCSB | castSpell: canonical mirror update failed", e);
    }
  }

  for (const t of canvas?.tokens?.controlled ?? []) {
    const ta = t?.actor;
    if (!ta || ta.documentName !== "Actor") continue;

    const taCanon = await resolveCanonicalActor(ta);
    const matches =
      taCanon?.uuid &&
      (taCanon.uuid === sheetActor.uuid || (canonActor?.uuid && taCanon.uuid === canonActor.uuid));

    if (matches && ta.uuid !== sheetActor.uuid && (!canonActor || ta.uuid !== canonActor.uuid)) {
      try { await ta.update(updateData); } catch (e) {
        console.warn("SinlessCSB | castSpell: token-synth mirror update failed", e);
      }
    }
  }

  // Rerender open sheets
  const rerenderActor = (a) => {
    for (const app of Object.values(a?.apps ?? {})) {
      try { app.render(false); } catch (_e) {}
    }
  };
  rerenderActor(sheetActor);
  if (canonActor && canonActor.uuid !== sheetActor.uuid) rerenderActor(canonActor);
  for (const t of canvas?.tokens?.controlled ?? []) rerenderActor(t?.actor);

  // Chat output
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
