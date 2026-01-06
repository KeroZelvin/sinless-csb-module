/**
 * Sinless Pool Roll (Foundry v13+) — DialogV2 version
 * FIX: Do not rely on this.form (DialogV2 may not provide it).
 * PATCH: Resolve canonical Actor via system.props.ActorUuid first (prevents token-synthetic drift).
 * PATCH: Live-refresh dialog when actor pools are updated (combat round refresh, manual refresh, etc.)
 */

function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}
function clampTN(tn, fallback = 4) {
  return [4, 5, 6].includes(tn) ? tn : fallback;
}
function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSessionSettingsActor() {
  const exact = game.actors?.getName?.("Session Settings");
  if (exact) return exact;
  const lower = "session settings";
  return (game.actors?.contents ?? []).find(a => (a.name ?? "").trim().toLowerCase() === lower) ?? null;
}

function readTN(sessionActor) {
  const tnRaw = num(sessionActor?.system?.props?.TN_Global, NaN);
  return clampTN(Number.isFinite(tnRaw) ? tnRaw : 4, 4);
}

function props(actor) {
  return actor?.system?.props ?? {};
}
function readProp(actor, key, fallback = 0) {
  return num(props(actor)?.[key], fallback);
}
function updateKey(key) {
  return `system.props.${key}`;
}

/* ------------------------------- */
/* Canonical Actor resolution patch */
/* ------------------------------- */

function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

async function resolveCanonicalActor(actor) {
  if (!actor) return null;

  // Prefer sheet-injected canonical ActorUuid
  const u = normalizeUuid(actor?.system?.props?.ActorUuid);
  if (u) {
    try {
      const doc = await fromUuid(u);
      if (doc?.documentName === "Actor") return doc;
    } catch (e) {
      console.warn("Sinless Pool Roll | resolveCanonicalActor fromUuid failed", { ActorUuid: u, e });
    }
  }

  // Token synthetic actor -> base actor
  if (actor.isToken && actor.parent?.baseActor) return actor.parent.baseActor;

  return actor;
}

function computePoolsFromAttrs(actor) {
  const STR = readProp(actor, "STR");
  const BOD = readProp(actor, "BOD");
  const WIL = readProp(actor, "WIL");
  const REA = readProp(actor, "REA");
  const INT = readProp(actor, "INT");
  const CHA = readProp(actor, "CHA");

  const qN = readProp(actor, "chaQuarterPoolN", 0);
  const chaQ = Math.floor(CHA / 4);

  const brawn   = STR + Math.floor(BOD / 2) + Math.floor(WIL / 4) + (qN === 1 ? chaQ : 0);
  const finesse = REA + Math.floor(BOD / 2) + Math.floor(INT / 4) + (qN === 2 ? chaQ : 0);
  const resolve = WIL + Math.floor(INT / 2) + Math.floor(CHA / 2) + (qN === 3 ? chaQ : 0);
  const focus   = INT + Math.floor(REA / 2) + Math.floor(WIL / 4) + (qN === 4 ? chaQ : 0);

  return { brawn, finesse, resolve, focus };
}

async function refreshPools(actor) {
  // Only use module refresh for PC actors (module is PC-only by design)
  if (actor?.hasPlayerOwner) {
    try {
      const mod = game.modules?.get?.("sinlesscsb");
      if (mod?.active) {
        const poolsMod = await import("/modules/sinlesscsb/scripts/rules/pools.js");
        if (typeof poolsMod?.refreshPoolsForActor === "function") {
          await poolsMod.refreshPoolsForActor(actor);
          return;
        }
      }
    } catch (e) {
      console.warn("Sinless Pool Roll | module refresh import failed; using fallback", e);
    }
  }

  // Fallback: always refresh (needed for test actors without player ownership)
  const { brawn, finesse, resolve, focus } = computePoolsFromAttrs(actor);

  const update = {};
  update[updateKey("Brawn_Max")] = brawn;
  update[updateKey("Brawn_Cur")] = brawn;
  update[updateKey("Finesse_Max")] = finesse;
  update[updateKey("Finesse_Cur")] = finesse;
  update[updateKey("Resolve_Max")] = resolve;
  update[updateKey("Resolve_Cur")] = resolve;
  update[updateKey("Focus_Max")] = focus;
  update[updateKey("Focus_Cur")] = focus;

  console.log("Sinless Pool Roll | fallback update", update);
  await actor.update(update);
  console.log("Sinless Pool Roll | after update (props)", foundry.utils.deepClone(actor.system?.props));
}

function poolDefs() {
  return [
    { name: "Brawn",   curKey: "Brawn_Cur",   maxKey: "Brawn_Max" },
    { name: "Finesse", curKey: "Finesse_Cur", maxKey: "Finesse_Max" },
    { name: "Resolve", curKey: "Resolve_Cur", maxKey: "Resolve_Max" },
    { name: "Focus",   curKey: "Focus_Cur",   maxKey: "Focus_Max" }
  ];
}

(async () => {
  const scope = (arguments && arguments.length && typeof arguments[0] === "object") ? arguments[0] : {};
  const actorUuid = (typeof scope.actorUuid === "string" && scope.actorUuid.length) ? scope.actorUuid : null;
  const boundActor = actorUuid ? await fromUuid(actorUuid) : null;

  // Resolve initial candidate, then canonicalize via ActorUuid/baseActor.
  const actorCandidate =
    boundActor ??
    canvas?.tokens?.controlled?.[0]?.actor ??
    game.user.character ??
    null;

  const actor = await resolveCanonicalActor(actorCandidate);

  if (!actor) return ui.notifications.warn("Select a token or set a User Character.");

  console.log("Sinless Pool Roll | actor resolved", {
    name: actor.name,
    uuid: actor.uuid,
    ActorUuid: actor.system?.props?.ActorUuid,
    hasPlayerOwner: actor.hasPlayerOwner,
    isOwner: actor.isOwner
  });

  const sessionActor = getSessionSettingsActor();
  if (!sessionActor) return ui.notifications.error('Actor "Session Settings" not found (needed for TN_Global).');

  const pools = poolDefs();
  const getCur = (p) => readProp(actor, p.curKey, 0);
  const getMax = (p) => readProp(actor, p.maxKey, 0);

  const tn = readTN(sessionActor);

  const content = `
    <div class="sinless-pools">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom: 0.5rem;">
        <div><strong>Target Number (Session Settings):</strong> <span data-tn>${escapeHTML(tn)}</span>+</div>
        <div><button type="button" data-action="refresh">Refresh Pools</button></div>
      </div>

      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align:left; padding:4px 6px;">Pool</th>
            <th style="text-align:right; padding:4px 6px;">Cur / Max</th>
            <th style="text-align:right; padding:4px 6px;">Spend</th>
            <th style="text-align:right; padding:4px 6px;">Mod</th>
            <th style="text-align:left; padding:4px 6px;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${pools.map(p => {
            const cur = getCur(p);
            const max = getMax(p);
            return `
              <tr data-pool="${p.curKey}">
                <td style="padding:4px 6px;"><strong>${escapeHTML(p.name)}</strong></td>
                <td style="padding:4px 6px; text-align:right;">
                  <span data-cur="${p.curKey}">${escapeHTML(cur)}</span>
                  /
                  <span data-max="${p.maxKey}">${escapeHTML(max)}</span>
                </td>
                <td style="padding:4px 6px; text-align:right;">
                  <input type="number" name="${p.curKey}_spend" value="0" min="0" step="1" style="width:6em; text-align:right;" />
                </td>
                <td style="padding:4px 6px; text-align:right;">
                  <input type="number" name="${p.curKey}_mod" value="0" step="1" style="width:6em; text-align:right;" />
                </td>
                <td style="padding:4px 6px;">
                  <button type="button" data-action="roll" data-pool="${p.curKey}">Roll</button>
                  <button type="button" data-action="clear" data-pool="${p.curKey}" style="margin-left:6px;">Clear</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>

      <p style="margin-top:0.75rem; opacity:0.85;">
        Spend depletes the pool; Mod adds/removes dice but does not deplete.
      </p>
    </div>
  `;

  class SinlessPoolDialog extends foundry.applications.api.DialogV2 {
    constructor(...args) {
      super(...args);
      this._sinlessActorUpdateHookId = null;
      this._sinlessActorId = actor?.id ?? null;
      this._sinlessClickBound = false;
    }

    async close(options) {
      if (this._sinlessActorUpdateHookId) {
        Hooks.off("updateActor", this._sinlessActorUpdateHookId);
        this._sinlessActorUpdateHookId = null;
      }
      return super.close(options);
    }

    _onRender(context, options) {
      super._onRender(context, options);

      const root = this.element;
      if (!(root instanceof HTMLElement)) return;

      const qInput = (name) => root.querySelector(`input[name="${CSS.escape(name)}"]`);

      const updateTNDisplay = () => {
        const newTN = readTN(sessionActor);
        const tnEl = root.querySelector("[data-tn]");
        if (tnEl) tnEl.textContent = String(newTN);
        return newTN;
      };

      const updateRow = (p) => {
        const curEl = root.querySelector(`[data-cur="${CSS.escape(p.curKey)}"]`);
        const maxEl = root.querySelector(`[data-max="${CSS.escape(p.maxKey)}"]`);
        if (curEl) curEl.textContent = String(getCur(p));
        if (maxEl) maxEl.textContent = String(getMax(p));
      };

      const updateAllRows = () => {
        updateTNDisplay();
        for (const p of pools) updateRow(p);
      };

      const clearInputs = (poolKey) => {
        const spend = qInput(`${poolKey}_spend`);
        const mod = qInput(`${poolKey}_mod`);
        if (spend) spend.value = 0;
        if (mod) mod.value = 0;
      };

      const doRefresh = async () => {
        await refreshPools(actor);
        updateAllRows();
        ui.notifications.info("Pools refreshed.");
      };

      const doRoll = async (poolKey) => {
        const p = pools.find(x => x.curKey === poolKey);
        if (!p) return;

        const TN = updateTNDisplay();
        const curVal = getCur(p);

        const spendEl = qInput(`${poolKey}_spend`);
        const modEl = qInput(`${poolKey}_mod`);

        const spend = num(spendEl?.value, 0);
        const mod = num(modEl?.value, 0);

        const spendClamped = Math.max(0, Math.min(curVal, spend));
        const totalDice = Math.max(0, spendClamped + mod);

        const roll = await (new Roll(`${totalDice}d6`)).evaluate({ async: true });
        const results = roll.dice?.[0]?.results ?? [];
        const successes = results.reduce((acc, r) => acc + (r.result >= TN ? 1 : 0), 0);

        const newCur = Math.max(0, curVal - spendClamped);
        await actor.update({ [updateKey(p.curKey)]: newCur });

        updateRow(p);
        clearInputs(poolKey);

        const diceList = results.map(r => r.result).join(", ") || "—";

        const flavor = `
          <div class="sinless-pool-roll">
            <h2 style="margin:0 0 6px 0;">${escapeHTML(p.name)} Test</h2>
            <p style="margin:0 0 6px 0;"><strong>Actor:</strong> ${escapeHTML(actor.name)}</p>
            <p style="margin:0 0 6px 0;"><strong>TN (Session Settings):</strong> ${escapeHTML(TN)}+</p>
            <p style="margin:0 0 6px 0;">
              <strong>Spend:</strong> ${escapeHTML(spendClamped)} (depletes) &nbsp;|&nbsp;
              <strong>Mod:</strong> ${escapeHTML(mod)} (free) &nbsp;|&nbsp;
              <strong>Total:</strong> ${escapeHTML(totalDice)}d6
            </p>
            <p style="margin:0 0 6px 0;"><strong>Successes:</strong> ${escapeHTML(successes)}</p>
            <p style="margin:0 0 6px 0;"><strong>${escapeHTML(p.name)}:</strong> ${escapeHTML(curVal)} → ${escapeHTML(newCur)}</p>
            <details>
              <summary>Dice Results</summary>
              <div style="margin-top:6px;">${escapeHTML(diceList)}</div>
            </details>
          </div>
        `;

        await roll.toMessage(
          { speaker: ChatMessage.getSpeaker({ actor }), flavor },
          { create: true }
        );
      };

      // Live refresh: update dialog when THIS actor updates its system.props
      if (!this._sinlessActorUpdateHookId && this._sinlessActorId) {
        this._sinlessActorUpdateHookId = Hooks.on("updateActor", (updatedActor, changed) => {
          if (updatedActor?.id !== this._sinlessActorId) return;
          if (!changed?.system?.props) return; // cheap filter
          updateAllRows();
        });
      }

      // Attach click handler once per dialog instance (DialogV2 can re-render)
      if (!this._sinlessClickBound) {
        this._sinlessClickBound = true;

        root.addEventListener("click", async (ev) => {
          const t = ev.target;
          if (!(t instanceof HTMLElement)) return;

          const action = t.dataset.action;
          if (!action) return;

          // Optional: keep your click logging
          console.log("Sinless Pool Roll | click", { action, pool: t.dataset.pool });

          ev.preventDefault();

          try {
            if (action === "refresh") return await doRefresh();
            if (action === "clear") return clearInputs(t.dataset.pool);
            if (action === "roll") return await doRoll(t.dataset.pool);
          } catch (e) {
            console.error(e);
            ui.notifications.error("Sinless Pool Roll failed. See console (F12).");
          }
        });
      }

      // Ensure display is current at render time (including after live updates)
      updateAllRows();
    }
  }

  new SinlessPoolDialog({
    window: { title: `Sinless Pools — ${actor.name}` },
    content,
    buttons: [{ action: "close", label: "Close", default: true }],
    submit: () => "close"
  }).render({ force: true });
})();