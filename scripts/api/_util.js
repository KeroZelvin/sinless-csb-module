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
  // You have a setting, but default is system.props
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
  // e.g. propPath("Resolve_Cur") => "system.props.Resolve_Cur"
  const root = propsRoot(); // "system.props"
  return `${root}.${key}`;
}

export function poolCurKey(poolKey) {
  // Item.poolKey: "Resolve" => "Resolve_Cur"
  const k = String(poolKey ?? "").trim();
  if (!k) return null;
  return k.endsWith("_Cur") ? k : `${k}_Cur`;
}

/* -------------------------------------------- */
/* Foundry document resolution helpers          */
/* -------------------------------------------- */

/**
 * Resolve canonical Actor if ActorUuid is stored on system.props.ActorUuid.
 * Also handles token-synthetic actor fallback.
 */
export async function resolveCanonicalActor(actor) {
  if (!actor) return null;

  // Prefer sheet-injected canonical ActorUuid (your best practice)
  const u = normalizeUuid(actor?.system?.props?.ActorUuid);
  if (u) {
    try {
      const doc = await fromUuid(u);
      if (doc?.documentName === "Actor") return doc;
    } catch (e) {
      console.warn("SinlessCSB | resolveCanonicalActor fromUuid failed", { ActorUuid: u, e });
    }
  }

  // Token synthetic actor -> base actor
  if (actor.isToken && actor.parent?.baseActor) return actor.parent.baseActor;

  return actor;
}

/**
 * Resolve an Actor to update, with the priority learned in debugging:
 *  1) scope.actorUuid (explicit, GM/sheet-safe)
 *  2) item.parent (embedded owner)
 *  3) controlled token actor
 *  4) user character
 */
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

/**
 * Resolve an Item document from:
 *  - itemUuid (supports "Item.<id>" or "Actor.<id>.Item.<id>")
 *  - OR { actorUuid, itemId } fallback (build embedded uuid)
 */
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
/* DialogV2 helpers (robust across runtimes)    */
/* -------------------------------------------- */

/**
 * Get the DialogV2 class in a v13-safe way.
 */
export function getDialogV2Class() {
  return foundry?.applications?.api?.DialogV2 ?? null;
}

/**
 * Get the root HTMLElement for a DialogV2 instance.
 * (Foundry sometimes exposes dialog.element as an HTMLElement or a jQuery-like wrapper.)
 */
export function getDialogRoot(dialog) {
  const el = dialog?.element ?? null;
  if (!el) return null;
  // HTMLElement
  if (el instanceof HTMLElement) return el;
  // jQuery-ish array-like
  if (Array.isArray(el) && el[0] instanceof HTMLElement) return el[0];
  // Foundry wrapper objects may expose [0]
  if (el?.[0] instanceof HTMLElement) return el[0];
  return null;
}

/**
 * Read FormData from a DialogV2 callback (v13 signature),
 * without relying on button.form or global document selectors.
 *
 * Accepts (event, buttonEl, dialog) or (button) variants safely.
 */
export function getDialogFormFromCallbackArgs(...args) {
  // v13 DialogV2 commonly: (event, buttonEl, dialog)
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
 * Minimal, reusable DialogV2 opener that works even when instance .wait() is missing.
 *
 * Signature is intentionally small and supports both:
 * - Item Roll: simple form submit result
 * - Pools: complex click handlers, live refresh, multi-action buttons via onRender()
 *
 * @param {object} cfg
 * @param {string} cfg.title                 Window title
 * @param {string} cfg.content               HTML content (usually includes a <form>)
 * @param {Array}  cfg.buttons               DialogV2 button specs (action/label/default/callback)
 * @param {Function} [cfg.transform]         Optional transform for the submit result
 * @param {Function} [cfg.onRender]          Called each render: (dialog, rootHTMLElement) => void
 * @param {Function} [cfg.onClose]           Called on close after resolution: (dialog, resolvedValue) => void
 * @param {boolean} [cfg.rejectClose=false]  If true, prevent closing via X without a button
 * @param {object}  [cfg.renderOptions]      Passed to render(), default { force: true }
 *
 * @returns {Promise<any>} resolved submit value (or null if closed/cancel)
 */
export async function openDialogV2(cfg = {}) {
  const DialogV2 = getDialogV2Class();
  if (!DialogV2) {
    ui.notifications?.error?.("DialogV2 not available in this Foundry runtime.");
    return null;
  }

  const title = String(cfg.title ?? "Dialog");
  const content = String(cfg.content ?? "");
  const buttons = Array.isArray(cfg.buttons) ? cfg.buttons : [];
  const rejectClose = Boolean(cfg.rejectClose);
  const renderOptions = cfg.renderOptions && typeof cfg.renderOptions === "object"
    ? cfg.renderOptions
    : { force: true };

  const transform = (typeof cfg.transform === "function") ? cfg.transform : (x) => x;
  const onRender = (typeof cfg.onRender === "function") ? cfg.onRender : null;
  const onClose = (typeof cfg.onClose === "function") ? cfg.onClose : null;

  const baseConfig = {
    window: { title },
    content,
    buttons,
    rejectClose,
    // DialogV2 calls submit(...) with the button callback return value.
    submit: (result) => transform(result)
  };

  // Prefer static DialogV2.wait if present (some v13 builds)
  if (typeof DialogV2.wait === "function") {
    const out = await DialogV2.wait(baseConfig);
    const resolved = transform(out);
    // Ensure onClose runs consistently even in wait mode
    try {
      onClose?.(null, resolved);
    } catch (e) {
      console.warn("SinlessCSB | openDialogV2 onClose (wait) failed", e);
    }
    return resolved;
  }

  // Fallback: Promise-wrapper around render + submit + close
  return await new Promise((resolve) => {
    class SinlessDialogV2 extends DialogV2 {
      constructor(...args) {
        super(...args);
        this._sinlessResolved = false;
      }

      _onRender(context, options) {
        super._onRender(context, options);
        const root = getDialogRoot(this);
        if (!root) return;
        try {
          onRender?.(this, root);
        } catch (e) {
          console.warn("SinlessCSB | openDialogV2 onRender failed", e);
        }
      }

      async close(options) {
        // If user closes via X / ESC and we have not resolved, resolve null.
        if (!this._sinlessResolved) {
          this._sinlessResolved = true;
          try { onClose?.(this, null); } catch (_e) {}
          resolve(null);
        }
        return super.close(options);
      }
    }

    // Wrap submit so we resolve exactly once (submit often triggers close internally).
    const dialog = new SinlessDialogV2({
      ...baseConfig,
      submit: (result) => {
        const resolved = transform(result);
        if (!dialog._sinlessResolved) {
          dialog._sinlessResolved = true;
          try { onClose?.(dialog, resolved); } catch (_e) {}
          resolve(resolved);
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
  await roll.evaluate(); // v13 safe

  const results = roll.dice?.[0]?.results ?? [];
  const successes = results.reduce((acc, r) => acc + (num(r.result, 0) >= tn ? 1 : 0), 0);

  return { roll, dice: d, tn, results, successes };
}
