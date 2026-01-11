// scripts/api/_util.js
// Shared utilities for SinlessCSB API functions (Foundry v13 + CSB v5)

export const MOD_ID = "sinlesscsb";

/* -------------------------------------------- */
/* Basic numeric + string utilities             */
/* -------------------------------------------- */

export function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

export function clamp(n, lo, hi) {
  const v = num(n, lo);
  return Math.max(lo, Math.min(hi, v));
}

export function clampInt(n, lo, hi) {
  return Math.floor(clamp(Math.floor(num(n, lo)), lo, hi));
}

export function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

export function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* -------------------------------------------- */
/* CSB props helpers                            */
/* -------------------------------------------- */

export function propsRoot() {
  try {
    return game.settings?.get?.(MOD_ID, "csbPropsRoot") || "system.props";
  } catch (_e) {
    return "system.props";
  }
}

export function readProps(doc) {
  return doc?.system?.props ?? {};
}

export function propPath(key) {
  const root = propsRoot();
  return `${root}.${key}`;
}

export function poolCurKey(poolKey) {
  const k = String(poolKey ?? "").trim();
  if (!k) return null;
  return k.endsWith("_Cur") ? k : `${k}_Cur`;
}

/* -------------------------------------------- */
/* Foundry document resolution helpers          */
/* -------------------------------------------- */

export async function resolveCanonicalActor(actor) {
  if (!actor) return null;

  const u = normalizeUuid(actor?.system?.props?.ActorUuid);
  if (u) {
    try {
      const doc = await fromUuid(u);
      if (doc?.documentName === "Actor") return doc;
    } catch (e) {
      console.warn("SinlessCSB | resolveCanonicalActor fromUuid failed", { ActorUuid: u, e });
    }
  }

  if (actor.isToken && actor.parent?.baseActor) return actor.parent.baseActor;

  return actor;
}

export async function resolveActorForContext({ scope = {}, item = null } = {}) {
  const actorUuid = normalizeUuid(scope?.actorUuid);
  if (actorUuid) {
    const a = await fromUuid(actorUuid);
    if (a?.documentName === "Actor") return a;
    console.warn("SinlessCSB | resolveActorForContext: actorUuid did not resolve to Actor", { actorUuid, resolved: a });
  }

  if (item?.parent?.documentName === "Actor") return item.parent;

  const tokA = canvas?.tokens?.controlled?.[0]?.actor ?? null;
  if (tokA?.documentName === "Actor") return tokA;

  const charA = game.user.character ?? null;
  if (charA?.documentName === "Actor") return charA;

  return null;
}

export async function resolveItemDoc({ itemUuid = null, actorUuid = null, itemId = null } = {}) {
  const u = normalizeUuid(itemUuid);
  if (u) {
    const doc = await fromUuid(u);
    if (doc?.documentName === "Item") return doc;
  }

  const aUuid = normalizeUuid(actorUuid);
  const iId = normalizeUuid(itemId);
  if (aUuid && iId) {
    const actorDoc = await fromUuid(aUuid);
    if (actorDoc?.documentName === "Actor") {
      const embeddedUuid = `Actor.${actorDoc.id}.Item.${iId}`;
      const doc2 = await fromUuid(embeddedUuid);
      if (doc2?.documentName === "Item") return doc2;
    }
  }

  return null;
}

/* -------------------------------------------- */
/* Dialog helpers                               */
/* -------------------------------------------- */

export function getDialogV2Class() {
  return foundry?.applications?.api?.DialogV2 ?? null;
}

export function getDialogRoot(dialog) {
  const el = dialog?.element ?? null;
  if (!el) return null;
  if (el instanceof HTMLElement) return el;
  if (Array.isArray(el) && el[0] instanceof HTMLElement) return el[0];
  if (el?.[0] instanceof HTMLElement) return el[0];
  return null;
}

/**
 * Read the <form> for DialogV2 callbacks without relying on button.form.
 * Typical v13 callback signature: (event, buttonEl, dialog)
 */
export function getDialogFormFromCallbackArgs(...args) {
  const dialog = args?.[2] ?? args?.[0]?.dialog ?? null;
  const root = getDialogRoot(dialog);
  if (!root?.querySelector) return null;
  return root.querySelector("form") ?? null;
}

export function readDialogNumber(fd, key, fallback = 0) {
  try {
    return num(fd?.get?.(key), fallback);
  } catch (_e) {
    return fallback;
  }
}

/**
 * Robust DialogV2 opener:
 * - Works whether DialogV2.wait exists or not (some runtimes omit it)
 * - Supports complex dialogs via onRender (Pools) and simple submit (Item/Spell)
 * - Resolves null on X/ESC close (unless rejectClose blocks it in the runtime)
 *
 * @param {object} cfg
 * @param {string} cfg.title
 * @param {string} cfg.content
 * @param {Array<object>} cfg.buttons
 * @param {boolean} [cfg.rejectClose=false]
 * @param {(dialog:any, root:HTMLElement)=>void} [cfg.onRender]
 * @param {(value:any)=>any} [cfg.transform]
 * @param {object} [cfg.renderOptions] defaults {force:true}
 * @returns {Promise<any|null>}
 */
export async function openDialogV2(cfg = {}) {
  const DialogV2 = getDialogV2Class();

  const title = String(cfg.title ?? "Dialog");
  const content = String(cfg.content ?? "");
  const buttons = Array.isArray(cfg.buttons) ? cfg.buttons : [];
  const rejectClose = Boolean(cfg.rejectClose);
  const onRender = (typeof cfg.onRender === "function") ? cfg.onRender : null;
  const transform = (typeof cfg.transform === "function") ? cfg.transform : (x) => x;
  const renderOptions = (cfg.renderOptions && typeof cfg.renderOptions === "object")
    ? cfg.renderOptions
    : { force: true };

  // Best-effort fallback if DialogV2 is missing (unlikely on v13, but safe)
  if (!DialogV2) {
    return await new Promise((resolve) => {
      const legacyButtons = {};
      for (const b of buttons) {
        const key = b.action ?? b.label ?? "ok";
        legacyButtons[key] = {
          label: b.label ?? "OK",
          callback: (html) => resolve(transform(b.callback ? b.callback(html) : true))
        };
      }
      if (!legacyButtons.cancel) {
        legacyButtons.cancel = { label: "Cancel", callback: () => resolve(null) };
      }

      new Dialog({
        title,
        content,
        buttons: legacyButtons,
        default: (buttons.find(x => x.default)?.action) ?? "ok",
        close: () => resolve(null)
      }).render(true);
    });
  }

  // Preferred fast-path: DialogV2.wait exists
  if (typeof DialogV2.wait === "function") {
    const out = await DialogV2.wait({
      window: { title },
      content,
      buttons,
      rejectClose,
      render: (event, dialog) => {
        const root = getDialogRoot(dialog);
        if (root && onRender) onRender(dialog, root);
      }
    });

    // In some runtimes, cancel returns "cancel"; in ours we standardize to null
    if (!out || out === "cancel") return null;
    return transform(out);
  }

  // Fallback: instance render + resolve via submit/close
  return await new Promise((resolve) => {
    class SinlessDialogV2 extends DialogV2 {
      constructor(...args) {
        super(...args);
        this._sinlessResolved = false;
      }

      _onRender(context, options) {
        super._onRender(context, options);
        const root = getDialogRoot(this);
        if (root && onRender) onRender(this, root);
      }

      async close(options) {
        if (!this._sinlessResolved) {
          this._sinlessResolved = true;
          resolve(null);
        }
        return super.close(options);
      }
    }

    const dialog = new SinlessDialogV2({
      window: { title },
      content,
      buttons,
      rejectClose,
      submit: (result) => {
        const resolved = transform(result);
        if (!dialog._sinlessResolved) {
          dialog._sinlessResolved = true;
          // normalize “cancel” to null
          resolve((!resolved || resolved === "cancel") ? null : resolved);
        }
        return resolved;
      }
    });

    dialog.render(renderOptions);
  });
}

/* -------------------------------------------- */
/* Dice rolling helpers (v13-safe)              */
/* -------------------------------------------- */

export async function rollXd6Successes({ dice = 0, tn = 4 } = {}) {
  const d = Math.max(0, Math.floor(num(dice, 0)));
  const roll = new Roll(`${d}d6`);
  await roll.evaluate();

  const results = roll.dice?.[0]?.results ?? [];
  const successes = results.reduce((acc, r) => acc + (num(r.result, 0) >= tn ? 1 : 0), 0);

  return { roll, dice: d, tn, results, successes };
}
