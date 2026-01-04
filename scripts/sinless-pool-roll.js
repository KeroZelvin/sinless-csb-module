/**
 * Sinless Pool Roller (Foundry v13) — TN from "Session Settings" actor
 * - One dialog table for Brawn/Finesse/Resolve/Focus
 * - Enter Spend + Mod for each row
 * - Click Roll to roll Total d6, count successes >= TN_Global from Session Settings
 * - Spend depletes the pool (Mod does not)
 * - Adds "Refresh Pools" button (top-right) that recalculates pools per PDF:
 *   Brawn   = STR + floor(BOD/2) + floor(WIL/4)
 *   Finesse = REA + floor(BOD/2) + floor(INT/4)
 *   Resolve = WIL + floor(INT/2) + floor(CHA/2)
 *   Focus   = INT + floor(REA/2) + floor(WIL/4)
 *   Plus: add floor(CHA/4) to exactly one pool based on chaQuarterPoolN (1..4).
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
  const a = game.actors?.getName?.("Session Settings");
  if (a) return a;
  const lower = "session settings";
  return (game.actors?.contents ?? []).find(x => (x.name ?? "").trim().toLowerCase() === lower) ?? null;
}

async function main() {
  const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;
  if (!actor) {
    ui.notifications.warn("Select a token or set a User Character.");
    return;
  }

  const sessionActor = getSessionSettingsActor();
  if (!sessionActor) {
    ui.notifications.error('Actor "Session Settings" not found. Create an Actor with that exact name.');
    return;
  }

  // TN_Global from Session Settings actor
  const tnPath = findKeyPath(sessionActor.system, "TN_Global", "system");
  let tn = clampTN(tnPath ? num(getByPath(sessionActor, tnPath), 4) : 4, 4);

  const pools = [
    { name: "Brawn",  key: "Brawn_Cur" },
    { name: "Finesse", key: "Finesse_Cur" },
    { name: "Resolve", key: "Resolve_Cur" },
    { name: "Focus",  key: "Focus_Cur" }
  ];

  for (const p of pools) p.path = findKeyPath(actor.system, p.key, "system");

  const missingPools = pools.filter(p => !p.path).map(p => p.key);
  if (missingPools.length) {
    ui.notifications.error(`Missing pool field(s) on actor: ${missingPools.join(", ")}`);
    return;
  }

  // Attribute keys used for refresh (must match your CSB field keys)
  const attrKeys = ["STR", "BOD", "WIL", "REA", "INT", "CHA", "chaQuarterPoolN"];
  const attrPaths = {};
  for (const k of attrKeys) attrPaths[k] = findKeyPath(actor.system, k, "system");

  const missingAttrs = attrKeys.filter(k => !attrPaths[k]);
  const refreshDisabled = missingAttrs.length > 0;

  function readAttr(k) {
    const p = attrPaths[k];
    return p ? num(getByPath(actor, p), 0) : 0;
  }

  function floorDiv(a, d) {
    return Math.floor(num(a, 0) / d);
  }

  async function readTNFromSession($html) {
    const raw = tnPath ? num(getByPath(sessionActor, tnPath), 4) : 4;
    tn = clampTN(raw, 4);
    if ($html) $html.find("span.tn").text(String(tn));
    return tn;
  }

  async function refreshPoolsAndUI($html) {
    if (refreshDisabled) return;

    // Read attributes fresh
    const STR = readAttr("STR");
    const BOD = readAttr("BOD");
    const WIL = readAttr("WIL");
    const REA = readAttr("REA");
    const INT = readAttr("INT");
    const CHA = readAttr("CHA");
    const qN  = readAttr("chaQuarterPoolN");

const chaQ = Math.floor(CHA / 4);  // floor(CHA/4)

// Text-spec formulas, independent floor:
const brawn =
  STR + Math.floor(BOD / 2) + Math.floor(WIL / 4) + (qN === 1 ? chaQ : 0);

const finesse =
  REA + Math.floor(BOD / 2) + Math.floor(INT / 4) + (qN === 2 ? chaQ : 0);

const resolve =
  WIL + Math.floor(INT / 2) + Math.floor(CHA / 2) + (qN === 3 ? chaQ : 0);

const focus =
  INT + Math.floor(REA / 2) + Math.floor(WIL / 4) + (qN === 4 ? chaQ : 0);


    const updates = {
      [pools.find(p => p.key === "Brawn_Cur").path]: brawn,
      [pools.find(p => p.key === "Finesse_Cur").path]: finesse,
      [pools.find(p => p.key === "Resolve_Cur").path]: resolve,
      [pools.find(p => p.key === "Focus_Cur").path]: focus
    };

    await actor.update(updates);

    // Update dialog Current column
    $html.find(`span.cur[data-cur="Brawn_Cur"]`).text(String(brawn));
    $html.find(`span.cur[data-cur="Finesse_Cur"]`).text(String(finesse));
    $html.find(`span.cur[data-cur="Resolve_Cur"]`).text(String(resolve));
    $html.find(`span.cur[data-cur="Focus_Cur"]`).text(String(focus));

    ui.notifications.info("Pools refreshed.");
  }

  // Initial current values
  const cur = {};
  for (const p of pools) cur[p.key] = num(getByPath(actor, p.path), 0);

  const content = `
  <form>
    <div style="display:flex; align-items:center; justify-content:space-between; gap: 12px; margin-bottom: 0.5rem;">
      <div>
        <strong>Target Number (Session Settings):</strong> <span class="tn">${tn}</span>+
      </div>
      <div>
        <button type="button" class="refresh" ${refreshDisabled ? "disabled" : ""}>
          Refresh Pools
        </button>
      </div>
    </div>

    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align:left; padding: 4px 6px;">Pool</th>
          <th style="text-align:right; padding: 4px 6px;">Current</th>
          <th style="text-align:right; padding: 4px 6px;">Spend</th>
          <th style="text-align:right; padding: 4px 6px;">Mod</th>
          <th style="text-align:left; padding: 4px 6px;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${pools.map(p => `
          <tr data-pool="${p.key}">
            <td style="padding: 4px 6px;"><strong>${p.name}</strong></td>
            <td style="padding: 4px 6px; text-align:right;">
              <span class="cur" data-cur="${p.key}">${cur[p.key]}</span>
            </td>
            <td style="padding: 4px 6px; text-align:right;">
              <input type="number" name="${p.key}_spend" value="0" min="0" step="1" style="width: 6em; text-align:right;" />
            </td>
            <td style="padding: 4px 6px; text-align:right;">
              <input type="number" name="${p.key}_mod" value="0" step="1" style="width: 6em; text-align:right;" />
            </td>
            <td style="padding: 4px 6px;">
              <button type="button" class="roll" data-pool="${p.key}">Roll</button>
              <button type="button" class="clear" data-pool="${p.key}" style="margin-left:6px;">Clear</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <p style="margin-top: 0.75rem; opacity: 0.85;">
      Spend depletes the pool; Mod adds/removes dice but does not deplete.
      ${refreshDisabled ? `<br><em>Refresh disabled: missing attribute key(s): ${missingAttrs.join(", ")}</em>` : ""}
    </p>
  </form>
  `;

  const dialog = new Dialog({
    title: `Sinless Pools — ${actor.name}`,
    content,
    buttons: { close: { label: "Close" } },
    default: "close",
    render: (html) => {
      const $html = html;

      function getPoolDef(poolKey) {
        return pools.find(p => p.key === poolKey);
      }

      async function doRoll(poolKey) {
        // refresh TN each roll (GM may change mid-session)
        await readTNFromSession($html);

        const p = getPoolDef(poolKey);
        if (!p) return;

        const curVal = num(getByPath(actor, p.path), 0);
        const spend = num($html.find(`[name="${poolKey}_spend"]`).val(), 0);
        const mod = num($html.find(`[name="${poolKey}_mod"]`).val(), 0);

        const spendClamped = Math.max(0, Math.min(curVal, spend));
        const totalDice = Math.max(0, spendClamped + mod);

        const roll = await (new Roll(`${totalDice}d6`)).evaluate({ async: true });
        const results = roll.dice?.[0]?.results ?? [];
        const successes = results.reduce((acc, r) => acc + (r.result >= tn ? 1 : 0), 0);

        const newCur = Math.max(0, curVal - spendClamped);
        await actor.update({ [p.path]: newCur });

        $html.find(`span.cur[data-cur="${poolKey}"]`).text(String(newCur));
        $html.find(`[name="${poolKey}_spend"]`).val(0);
        $html.find(`[name="${poolKey}_mod"]`).val(0);

        const flavor = `
          <div>
            <h2>${p.name} Test</h2>
            <p><strong>Actor:</strong> ${actor.name}</p>
            <p><strong>TN (Session Settings):</strong> ${tn}+</p>
            <p><strong>Spend:</strong> ${spendClamped} (depletes) &nbsp; | &nbsp;
               <strong>Mod:</strong> ${mod} (free) &nbsp; | &nbsp;
               <strong>Total:</strong> ${totalDice}d6</p>
            <p><strong>Successes:</strong> ${successes}</p>
            <p><strong>${p.name}:</strong> ${curVal} → ${newCur}</p>
          </div>
        `;

        await roll.toMessage(
          { speaker: ChatMessage.getSpeaker({ actor }), flavor },
          { create: true }
        );
      }

      $html.find("button.refresh").on("click", async (ev) => {
        ev.preventDefault();
        try {
          await refreshPoolsAndUI($html);
        } catch (e) {
          console.error(e);
          ui.notifications.error("Refresh Pools failed. See console (F12).");
        }
      });

      $html.find("button.roll").on("click", async (ev) => {
        ev.preventDefault();
        const poolKey = ev.currentTarget.dataset.pool;
        try {
          await doRoll(poolKey);
        } catch (e) {
          console.error(e);
          ui.notifications.error(`Roll failed for ${poolKey}. See console (F12).`);
        }
      });

      $html.find("button.clear").on("click", (ev) => {
        ev.preventDefault();
        const poolKey = ev.currentTarget.dataset.pool;
        $html.find(`[name="${poolKey}_spend"]`).val(0);
        $html.find(`[name="${poolKey}_mod"]`).val(0);
      });
    }
  });

  dialog.render(true);
}

main();