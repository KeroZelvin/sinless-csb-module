// scripts/hooks/hacking-inline-actions.js
// Inject inline hacking buttons under the Cyberdeck item displayer rows.

const MOD_ID = "sinlesscsb";
const CONTAINER_CLASS = "hacking-box";
const CYBERDECK_TEMPLATE = "b2F3cWZSzUeZvam8";

function getRootElement(app, element) {
  if (app?.element instanceof HTMLElement) return app.element;
  if (Array.isArray(app?.element) && app.element[0] instanceof HTMLElement) return app.element[0];
  if (element instanceof HTMLElement) return element;
  if (element?.[0] instanceof HTMLElement) return element[0];
  return null;
}

function extractItemIdFromElement(el) {
  if (!el) return { itemId: null, itemUuid: null };

  const data = el.dataset ?? {};
  const itemUuid =
    data.itemUuid ||
    data.uuid ||
    data.documentUuid ||
    null;

  const itemId =
    data.itemId ||
    data.documentId ||
    null;

  if (itemUuid && String(itemUuid).includes("Item.")) {
    const parts = String(itemUuid).split(".");
    const id = parts[parts.length - 1];
    return { itemId: id, itemUuid };
  }

  return { itemId, itemUuid };
}

function collectRowElements(container) {
  const nodes = [
    ...container.querySelectorAll("[data-item-id]"),
    ...container.querySelectorAll("[data-item-uuid]"),
    ...container.querySelectorAll("[data-uuid]"),
    ...container.querySelectorAll("[data-document-id]"),
    ...container.querySelectorAll("[data-document-uuid]")
  ];

  const out = new Map();
  for (const n of nodes) {
    const rowEl =
      n.closest("[data-item-id], [data-item-uuid], [data-uuid], [data-document-id], [data-document-uuid]") ||
      n;

    const { itemId, itemUuid } = extractItemIdFromElement(rowEl);
    const key = itemId || itemUuid;
    if (!key || out.has(key)) continue;
    out.set(key, rowEl);
  }

  return [...out.values()];
}

function findItemByName(actor, name) {
  const want = String(name ?? "").trim().toLowerCase();
  return (actor?.items ?? []).find(i => String(i.name ?? "").trim().toLowerCase() === want) || null;
}

function findAnyByNames(actor, names) {
  const want = new Set((names ?? []).map(n => String(n ?? "").trim().toLowerCase()));
  return (actor?.items ?? []).find(i => want.has(String(i.name ?? "").trim().toLowerCase())) || null;
}

function getItemRating(item) {
  const p = item?.system?.props ?? {};
  return Number(p.hackingRating ?? p.gearFeature ?? p.gearFeature_copy1 ?? 0) || 0;
}

function getHackingRating(hackingItem, deckItem) {
  const fromHack = getItemRating(hackingItem);
  if (fromHack > 0) return fromHack;
  return getItemRating(deckItem);
}

function rollItemByUuid(itemUuid, actorUuid, scope = {}) {
  const api = game.modules.get(MOD_ID)?.api;
  if (typeof api?.rollItem !== "function") {
    ui.notifications?.error?.("SinlessCSB: rollItem API not available.");
    return;
  }

  api.rollItem({ itemUuid, actorUuid, ...scope });
}

function rollHackingGeneral({ actor, actorUuid, deckItem, alertMode = "" }) {
  const hacking = findItemByName(actor, "Hacking");
  const source = deckItem || hacking;
  if (!source) {
    ui.notifications?.warn?.(`Missing cyberdeck or "Hacking" software on ${actor?.name ?? "Actor"}.`);
    return;
  }
  rollItemByUuid(source.uuid, actorUuid, {
    skillKeyOverride: "Skill_Hacking",
    alertMode
  });
}

function isInActiveThreads(actor, item, name) {
  const activeMap = actor?.system?.props?.activeThreads ?? null;
  if (!activeMap || typeof activeMap !== "object") return false;

  if (item?.id && Object.prototype.hasOwnProperty.call(activeMap, item.id)) return true;

  const want = String(name ?? "").trim().toLowerCase();
  for (const v of Object.values(activeMap)) {
    const n = String(v?.name ?? "").trim().toLowerCase();
    if (n && n === want) return true;
  }
  return false;
}

function requireActiveSoftware(actor, name) {
  const item = findItemByName(actor, name);
  const activeFlag = Number(item?.system?.props?.softwareSlot ?? 0) === 1;
  const activeList = isInActiveThreads(actor, item, name);
  if (!item || (!activeFlag && !activeList)) {
    ui.notifications?.warn?.(`Missing "${name}" loaded in Active Threads on ${actor?.name ?? "Actor"}.`);
    return null;
  }
  return item;
}

function rollCameraOffFromDeck({ actor, actorUuid, deckItem }) {
  if (!deckItem) {
    ui.notifications?.warn?.("Missing cyberdeck context for Camera Off.");
    return;
  }

  const hackRatingRaw = getItemRating(deckItem);
  const hackRating = Number.isFinite(Number(hackRatingRaw)) ? Number(hackRatingRaw) : 0;

  rollItemByUuid(deckItem.uuid, actorUuid, {
    skillKeyOverride: "Skill_EWarfare",
    gearFeatureOverride: hackRating,
    limitBonusSourceOverride: "Hacking rating"
  });
}

function rollLoop1FromDeck({ actor, actorUuid, deckItem }) {
  if (!deckItem) {
    ui.notifications?.warn?.("Missing cyberdeck context for Loop 1.");
    return;
  }

  const hackRatingRaw = getItemRating(deckItem);
  const hackRating = Number.isFinite(Number(hackRatingRaw)) ? Number(hackRatingRaw) : 0;

  rollItemByUuid(deckItem.uuid, actorUuid, {
    skillKeyOverride: "Skill_EWarfare",
    gearFeatureOverride: hackRating,
    limitBonusSourceOverride: "Hacking rating"
  });
}

function rollLoop2FromSoftware({ actor, actorUuid }) {
  const crack = requireActiveSoftware(actor, "Crack Encryption");
  if (!crack) return;
  rollItemByUuid(crack.uuid, actorUuid, {});
}

function rollLoop3FromSoftware({ actor, actorUuid }) {
  const device = requireActiveSoftware(actor, "Device Control");
  if (!device) return;
  rollItemByUuid(device.uuid, actorUuid, {});
}

function rollByName({ actor, actorUuid, name }) {
  const item = findItemByName(actor, name);
  if (!item) {
    ui.notifications?.warn?.(`Missing software "${name}" on ${actor?.name ?? "Actor"}.`);
    return;
  }
  rollItemByUuid(item.uuid, actorUuid, {});
}

function makeBtn(labelHtml, action) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "wep-action-btn";
  btn.innerHTML = labelHtml;
  btn.dataset.action = action;
  return btn;
}

function buildInlineBlock(deckUuid) {
  const wrap = document.createElement("div");
  wrap.className = "sinless-hacking-inline";
  if (deckUuid) wrap.dataset.deckUuid = String(deckUuid);

  const details = document.createElement("details");
  details.className = "sinless-hacking-inline-details";
  details.open = false;

  const summary = document.createElement("summary");
  summary.textContent = "Hacking Skills";
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "sinless-hacking-inline-body";

  const row1 = document.createElement("div");
  row1.className = "sinless-hacking-skill-row";
  row1.innerHTML = `<span class="sinless-hacking-skill-name">Hacking<br />(general)</span>`;
  row1.appendChild(makeBtn("Hack<br />Device", "hack-device"));
  row1.appendChild(makeBtn("Brute<br />Force", "brute-force"));
  row1.appendChild(makeBtn("Stealth<br />Infiltration", "stealth"));
  body.appendChild(row1);

  const row2 = document.createElement("div");
  row2.className = "sinless-hacking-skill-row";
  row2.innerHTML = `<span class="sinless-hacking-skill-name">Camera<br />Hacking</span>`;
  row2.appendChild(makeBtn("Camera<br />OFF", "camera-off"));
  row2.appendChild(makeBtn("Loop 1<br />(ACCESS)", "loop-1"));
  row2.appendChild(makeBtn("Loop 2<br />(DECRYPT)", "loop-2"));
  row2.appendChild(makeBtn("Loop 3<br />(EDIT)", "loop-3"));
  body.appendChild(row2);

  details.appendChild(body);
  wrap.appendChild(details);
  return wrap;
}

function bindInlineHandler(root, actor) {
  if (!root || root.dataset.sinlessHackingInlineBound === "1") return;
  root.dataset.sinlessHackingInlineBound = "1";

  const handler = (ev) => {
    const btn = ev.target?.closest?.("button[data-action]");
    if (!(btn instanceof HTMLElement)) return;

    const row = btn.closest(".sinless-hacking-inline");
    if (!row) return;

    ev.preventDefault();

    const actorUuid = actor?.uuid;
    if (!actorUuid) {
      ui.notifications?.warn?.("SinlessCSB: missing actor context.");
      return;
    }

    const action = btn.dataset.action;
    const deckUuid = String(btn.closest(".sinless-hacking-inline")?.dataset?.deckUuid ?? "").trim();
    const deckId = deckUuid.split(".").pop();
    const deckItem = deckId ? actor.items.get(deckId) : null;
    switch (action) {
      case "hack-device":
        return rollHackingGeneral({ actor, actorUuid, deckItem });
      case "brute-force":
        return rollHackingGeneral({ actor, actorUuid, deckItem, alertMode: "brute-force" });
      case "stealth":
        return rollHackingGeneral({ actor, actorUuid, deckItem, alertMode: "stealth" });
      case "camera-off":
        return rollCameraOffFromDeck({ actor, actorUuid, deckItem });
      case "loop-1":
        return rollLoop1FromDeck({ actor, actorUuid, deckItem });
      case "loop-2":
        return rollLoop2FromSoftware({ actor, actorUuid });
      case "loop-3":
        return rollLoop3FromSoftware({ actor, actorUuid });
      default:
        return;
    }
  };

  root.addEventListener("click", handler, true);
}

async function injectHackingInlineActions(app, element) {
  const root = getRootElement(app, element);
  if (!root) return;

  const actor = app?.actor ?? app?.document ?? null;
  if (!actor || actor.documentName !== "Actor") return;

  const container = root.querySelector(`.${CONTAINER_CLASS}`);
  if (!container) return;

  for (const el of container.querySelectorAll(".sinless-hacking-inline, .sinless-hacking-inline-row")) el.remove();

  const rows = collectRowElements(container);
  if (!rows.length) return;

  for (const row of rows) {
    const { itemId, itemUuid } = extractItemIdFromElement(row);
    const ownedItem =
      (itemId ? actor.items.get(itemId) : null) ||
      (itemUuid ? actor.items.get(itemUuid.split(".").pop()) : null) ||
      null;

    if (!ownedItem) continue;
    const tpl = String(ownedItem?.system?.template ?? "").trim();
    if (tpl !== CYBERDECK_TEMPLATE) continue;

    const rowAnchor = row.closest("tr") || row;
    if (!rowAnchor?.insertAdjacentElement) continue;

    const inline = buildInlineBlock(ownedItem.uuid);
    if (rowAnchor.tagName === "TR") {
      const tr = document.createElement("tr");
      tr.className = "sinless-hacking-inline-row";
      const td = document.createElement("td");
      td.colSpan = 99;
      td.appendChild(inline);
      tr.appendChild(td);
      rowAnchor.insertAdjacentElement("afterend", tr);
    } else {
      rowAnchor.insertAdjacentElement("afterend", inline);
    }
  }

  bindInlineHandler(root, actor);
}

export function registerHackingInlineActions() {
  const handler = (app, element) => {
    if (!game.settings?.get?.(MOD_ID, "enableAutomation")) return;
    queueMicrotask(() => {
      injectHackingInlineActions(app, element).catch((e) =>
        console.warn("SinlessCSB | hacking inline inject failed", e)
      );
    });
  };

  Hooks.on("renderActorSheetV2", handler);
}
