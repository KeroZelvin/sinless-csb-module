// scripts/api/invoke-spirit.js
// SinlessCSB API — Invoke Spirit (Foundry v13 + CSB v5)
//
// Entry point:
//   invokeSpirit({ itemUuid }) OR invokeSpirit({ actorUuid, itemId })
//
// Behavior:
// - Roll uses Skill_Channeling with Resolve pool spend semantics.
// - Limit = Skill_Channeling + item.fetishRank.
// - Drain = max(1, spiritForce - successes).
// - If spiritForce > zoeticPotential: drain is lethal (physical).
// - Else drain applies to stun with overflow to physical.

import { applyDeathSpiralPenalty, computeDeathSpiral, computeDeathSpiralFromProps } from "../rules/death-spiral.js";
import {
  num,
  clamp,
  clampInt,
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

function computeStunMax(actor) {
  const WIL = num(actor?.system?.props?.WIL, 0);
  return 6 + Math.floor(WIL / 2);
}

function computePhysicalMax(actor) {
  const BOD = num(actor?.system?.props?.BOD, 0);
  return 6 + Math.floor(BOD / 2);
}

function computeDeathSpiralForProps(actor, props) {
  const stunMax = Math.max(0, Math.floor(num(props?.stunMax, computeStunMax(actor))));
  const physicalMax = Math.max(0, Math.floor(num(props?.physicalMax, computePhysicalMax(actor))));
  return computeDeathSpiralFromProps(props, { stunMax, physicalMax });
}

async function updateActorWithMirrors(sheetActor, updateData) {
  await sheetActor.update(updateData);

  const canon = await resolveCanonicalActor(sheetActor);
  if (canon && canon.uuid !== sheetActor.uuid) {
    try { await canon.update(updateData); } catch (_e) {}
  }

  for (const t of (canvas?.tokens?.controlled ?? [])) {
    const ta = t?.actor;
    if (!ta || ta.documentName !== "Actor") continue;

    const taCanon = await resolveCanonicalActor(ta);
    const matches = taCanon?.uuid && canon?.uuid && (taCanon.uuid === canon.uuid);
    if (!matches) continue;

    if (ta.uuid === sheetActor.uuid || ta.uuid === canon.uuid) continue;
    try { await ta.update(updateData); } catch (_e) {}
  }

  const rerender = (a) => {
    for (const app of Object.values(a?.apps ?? {})) {
      try { app.render(false); } catch (_e) {}
    }
  };
  rerender(sheetActor);
  if (canon && canon.uuid !== sheetActor.uuid) rerender(canon);
  for (const t of (canvas?.tokens?.controlled ?? [])) rerender(t?.actor);
}

async function promptInvokeSpiritDialog({
  itemName,
  TN,
  poolKey,
  poolCur,
  skillKey,
  skillRank,
  fetishRank,
  spiritForce,
  spendCap,
  bonusDice,
  diceMod
}) {
  const content = `
    <form class="sinlesscsb invoke-spirit-dialog" autocomplete="off">
      <div style="margin:0 0 8px 0;">
        <em>
          <div><strong>TN</strong> ${escapeHTML(TN)}+</div>
          <div><strong>Pool</strong> ${escapeHTML(poolKey)}: ${escapeHTML(poolCur)}</div>
          <div><strong>Skill</strong> ${escapeHTML(skillKey)}: ${escapeHTML(skillRank)}</div>
          <div><strong>Fetish Rank</strong>: ${escapeHTML(fetishRank)}</div>
          <div><strong>Limit</strong>: ${escapeHTML(skillRank)} + ${escapeHTML(fetishRank)} = ${escapeHTML(skillRank + fetishRank)}</div>
          <div><strong>Spirit Force (drain base)</strong>: ${escapeHTML(spiritForce)}</div>
          <div><strong>Spend cap</strong>: ${escapeHTML(spendCap)}</div>
        </em>
      </div>

      <table style="width:100%; border-collapse:collapse;">
        <tbody>
          <tr>
            <td style="padding:6px 8px; opacity:0.85;">Spend from Pool</td>
            <td style="padding:6px 8px; text-align:right;">
              <div style="display:flex; justify-content:flex-end; gap:6px; align-items:center;">
                <button type="button" data-action="step" data-field="spend" data-step="-1" style="width:32px;">-</button>
                <input type="number" name="spend" value="${spendCap}" min="0" max="${spendCap}" step="1" style="width:7em; text-align:right;" />
                <button type="button" data-action="step" data-field="spend" data-step="1" style="width:32px;">+</button>
              </div>
            </td>
          </tr>
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
        </tbody>
      </table>

      <p class="notes" style="margin:8px 0 0 0; opacity:0.85;">
        Invoke uses standard spend semantics. Non-pool dice are added after spend and do not deplete Resolve.
        Static item dice: bonusDice ${escapeHTML(bonusDice)} | diceMod ${escapeHTML(diceMod)}.
      </p>
    </form>
  `;

  const result = await openDialogV2({
    title: `Invoke Spirit: ${itemName}`,
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
          const spend = readDialogNumber(fd, "spend", 0);
          const sit = readDialogNumber(fd, "sit", 0);
          return { spend, sit };
        }
      },
      { action: "cancel", label: "Cancel", callback: () => null }
    ],

    onRender: (dialog, root) => {
      if (!(root instanceof HTMLElement)) return;
      const bindRoot = root.querySelector("form") || root;

      if (bindRoot.dataset.sinlessInvokeSpiritBound === "1") return;
      bindRoot.dataset.sinlessInvokeSpiritBound = "1";

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
        const localContainer = btn.closest("tr") || btn.closest("td") || btn.closest("div") || null;
        if (localContainer) {
          const local = localContainer.querySelector(`input[name="${CSS.escape(field)}"]`);
          if (local instanceof HTMLInputElement) return local;
        }
        const global = bindRoot.querySelector(`input[name="${CSS.escape(field)}"]`);
        return (global instanceof HTMLInputElement) ? global : null;
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

      if (!dialog._sinlessInvokeSpiritCloseWrapped && typeof dialog.close === "function") {
        dialog._sinlessInvokeSpiritCloseWrapped = true;
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

export async function invokeSpirit(scope = {}) {
  try {
    const item = await resolveItemDoc({ itemUuid: scope?.itemUuid, actorUuid: scope?.actorUuid, itemId: scope?.itemId });
    if (!item) {
      ui.notifications?.warn?.("Invoke Spirit: could not resolve Item.");
      return null;
    }

    const sheetActor = await resolveActorForContext({ scope, item });
    if (!sheetActor || sheetActor.documentName !== "Actor") {
      ui.notifications?.warn?.("Invoke Spirit: could not resolve Actor context.");
      return null;
    }

    const props = item.system?.props ?? {};
    const actorProps = readProps(sheetActor);

    const spiritForce = Math.max(0, Math.floor(num(props.spiritForce, 0)));
    if (spiritForce <= 0) {
      ui.notifications?.warn?.(`"${item.name}" is missing spiritForce (must be at least 1).`);
      return null;
    }

    const skillKey = "Skill_Channeling";
    const skillRank = Math.max(0, Math.floor(num(actorProps?.[skillKey], 0)));
    const fetishRank = Math.max(0, Math.floor(num(props.fetishRank, 0)));

    const poolKeyRaw = String(props.poolKey ?? "Resolve").trim() || "Resolve";
    const poolCurK = poolCurKey(poolKeyRaw);
    if (!poolCurK) {
      ui.notifications?.warn?.(`Invoke Spirit: invalid poolKey "${poolKeyRaw}" on "${item.name}".`);
      return null;
    }

    const poolCur = Math.max(0, Math.floor(num(actorProps?.[poolCurK], 0)));
    const limit = Math.max(0, skillRank + fetishRank);
    const spendCap = Math.max(0, Math.min(poolCur, limit));

    const bonusDice = Math.floor(num(props.bonusDice, 0));
    const diceMod = Math.floor(num(props.diceMod, 0));

    const sessionActor = getSessionSettingsActor();
    const TN = readTN(sessionActor);

    const runtime = await promptInvokeSpiritDialog({
      itemName: item.name,
      TN,
      poolKey: poolCurK,
      poolCur,
      skillKey,
      skillRank,
      fetishRank,
      spiritForce,
      spendCap,
      bonusDice,
      diceMod
    });
    if (!runtime) return null;

    const spend = clampInt(num(runtime.spend, 0), 0, spendCap);
    const sitMod = Math.floor(num(runtime.sit, 0));

    const totalDice = Math.max(0, spend + bonusDice + diceMod + sitMod);
    if (totalDice <= 0) {
      ui.notifications?.warn?.("Invoke Spirit: no dice to roll.");
      return null;
    }

    const deathSpiral = Math.max(0, computeDeathSpiralForProps(sheetActor, actorProps));
    const { roll, results, successes: rawSuccesses } = await rollXd6Successes({ dice: totalDice, tn: TN });
    const successes = applyDeathSpiralPenalty(rawSuccesses, deathSpiral);

    const poolAfter = Math.max(0, poolCur - spend);

    const zoeticPotential = num(actorProps?.zoeticPotential, 0);
    const isLethal = spiritForce > zoeticPotential;
    const drainApplied = Math.max(1, spiritForce - successes);

    const stunCur0 = Math.max(0, Math.floor(num(actorProps?.stunCur, 0)));
    const physicalCur0 = Math.max(0, Math.floor(num(actorProps?.physicalCur, 0)));
    const stunMax = Math.max(0, Math.floor(num(actorProps?.stunMax, computeStunMax(sheetActor))));
    const physicalMax = Math.max(0, Math.floor(num(actorProps?.physicalMax, computePhysicalMax(sheetActor))));

    let stunCur = stunCur0;
    let physicalCur = physicalCur0;

    if (isLethal) {
      physicalCur = clamp(physicalCur - drainApplied, 0, physicalMax);
    } else {
      const stunAfter = stunCur - drainApplied;
      if (stunAfter >= 0) {
        stunCur = stunAfter;
      } else {
        stunCur = 0;
        const overflow = Math.abs(stunAfter);
        physicalCur = clamp(physicalCur - overflow, 0, physicalMax);
      }
    }

    const deathSpiralAfter = computeDeathSpiral({
      physicalCur,
      physicalMax,
      stunCur,
      stunMax
    });

    const updateData = {
      [propPath(poolCurK)]: poolAfter,
      [propPath("stunCur")]: stunCur,
      [propPath("physicalCur")]: physicalCur,
      [propPath("deathSpiral")]: deathSpiralAfter
    };
    await updateActorWithMirrors(sheetActor, updateData);

    const diceHTML = await roll.render();
    const diceList = results.map(r => r.result).join(", ") || "—";
    const successLine = `${successes} SUCCESS${successes === 1 ? "" : "ES"}`;
    const drainLine = isLethal
      ? `Drain applied to Physical [LETHAL]: <strong>${escapeHTML(drainApplied)}</strong>`
      : `Drain applied: <strong>${escapeHTML(drainApplied)}</strong>`;

    const itemImgHTML = item?.img
      ? `<div class="sl-card-item-img" style="text-align:center; margin:6px 0 8px 0;">
          <img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.name)}"
               style="width:120px; height:120px; object-fit:contain; display:block; margin:0 auto;">
         </div>`
      : "";

    const content = `
      <div class="sinlesscsb spell-card">
        <h3 style="margin:0 0 6px 0;">${escapeHTML(item.name)} — Invoke</h3>
        <hr class="sl-card-rule"/>

        ${itemImgHTML}

        <div style="text-align:center; margin:10px 0 12px 0;">
          <div style="font-size:28px; font-weight:bold;">${escapeHTML(successLine)}</div>
        </div>

        <p style="margin:0 0 6px 0;">${drainLine}</p>

        <hr class="sl-card-rule"/>

        <details>
          <summary>roll info</summary>
          <p style="margin:6px 0 6px 0;"><strong>Actor:</strong> ${escapeHTML(sheetActor.name)}</p>
          <p style="margin:0 0 6px 0;"><strong>TN (Session Settings):</strong> ${escapeHTML(TN)}+</p>
          <p style="margin:0 0 6px 0;"><strong>Skill:</strong> ${escapeHTML(skillKey)} (${escapeHTML(skillRank)})</p>
          <p style="margin:0 0 6px 0;"><strong>Fetish Rank:</strong> ${escapeHTML(fetishRank)}</p>
          <p style="margin:0 0 6px 0;"><strong>Limit:</strong> ${escapeHTML(limit)}</p>
          <p style="margin:0 0 6px 0;"><strong>Spirit Force:</strong> ${escapeHTML(spiritForce)}</p>
          <p style="margin:0 0 6px 0;"><strong>Zoetic Potential:</strong> ${escapeHTML(zoeticPotential)}</p>
          <p style="margin:0 0 6px 0;"><strong>Pool Spend:</strong> ${escapeHTML(spend)} (cap ${escapeHTML(spendCap)})</p>
          <p style="margin:0 0 6px 0;"><strong>Non-pool dice:</strong> Bonus ${escapeHTML(bonusDice)} | ItemMod ${escapeHTML(diceMod)} | Situational ${escapeHTML(sitMod)}</p>
          <p style="margin:0 0 6px 0;"><strong>Total Rolled:</strong> <strong>${escapeHTML(totalDice)}d6</strong></p>
          <p style="margin:0 0 6px 0;"><strong>DeathSpiral:</strong> ${escapeHTML(deathSpiral)}${deathSpiral > 0 ? ` (successes ${escapeHTML(rawSuccesses)} → ${escapeHTML(successes)})` : ""}</p>
          <p style="margin:0 0 6px 0;"><strong>${escapeHTML(poolCurK)} Pool:</strong> ${escapeHTML(poolCur)} → ${escapeHTML(poolAfter)}</p>
          <p style="margin:0 0 6px 0;"><strong>Stun:</strong> ${escapeHTML(stunCur0)} → ${escapeHTML(stunCur)}</p>
          <p style="margin:0 0 6px 0;"><strong>Physical:</strong> ${escapeHTML(physicalCur0)} → ${escapeHTML(physicalCur)}</p>
          <p style="margin:0 0 6px 0;"><strong>Dice Results:</strong> ${escapeHTML(diceList)}</p>
          ${diceHTML}
        </details>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: sheetActor }),
      content,
      rolls: [roll]
    });

    return {
      actorUuid: sheetActor.uuid,
      itemUuid: item.uuid,
      TN,
      skillKey,
      skillRank,
      fetishRank,
      spiritForce,
      spend,
      spendCap,
      totalDice,
      rawSuccesses,
      successes,
      deathSpiral,
      drainApplied,
      isLethal,
      poolCurK,
      poolCur,
      poolAfter,
      stunCur0,
      stunCur,
      physicalCur0,
      physicalCur
    };
  } catch (e) {
    console.error("SinlessCSB | invokeSpirit failed", e);
    ui.notifications?.error?.("Invoke Spirit failed. See console (F12).");
    return null;
  }
}
