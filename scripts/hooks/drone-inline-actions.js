// scripts/hooks/drone-inline-actions.js
// Inject inline drone-weapon buttons under the PC "Drones Owned" item displayer rows.

const MOD_ID = "sinlesscsb";

const DRONE_WEAPON_TEMPLATES = new Set([
  "8L2WHN9Spx1TyIys", // Drone Ballistic Template
  "lOAPMavVjtRre3OI", // Drone Energy W Template
  "QtMNKYb9rrdKwv0k", // Rig Drive Skill Template
  "mCc3spF6itnvgfou"  // Rig Fly Skill Template
]);

const DRONES_OWNED_CLASS = "sinless-drones-owned";
const DRONE_INLINE_CLASS = "sinless-drone-inline";
const DRONE_INLINE_ROW_CLASS = "sinless-drone-inline-row";

function getRootElement(app, element) {
  if (app?.element instanceof HTMLElement) return app.element;
  if (Array.isArray(app?.element) && app.element[0] instanceof HTMLElement) return app.element[0];
  if (element instanceof HTMLElement) return element;
  if (element?.[0] instanceof HTMLElement) return element[0];
  return null;
}

function findDronesOwnedRoot(root) {
  if (!root?.querySelector) return null;

  const byClass = root.querySelector(`.${DRONES_OWNED_CLASS}`);
  if (byClass) return byClass;

  const byKey =
    root.querySelector('[data-key="dronesOwned"]') ||
    root.querySelector('[data-component-key="dronesOwned"]') ||
    root.querySelector('[data-componentid="dronesOwned"]');

  if (byKey) return byKey;

  const headings = [...root.querySelectorAll("h1,h2,h3,h4,header,.custom-system-component-title")];
  const titleEl = headings.find(h => (h?.textContent ?? "").trim() === "Drones Owned");
  if (!titleEl) return null;

  return titleEl.closest(".custom-system-component, .custom-system-item-container, .custom-system-component-contents, form") ?? null;
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

function getDroneWeaponItems(droneActor) {
  const items = droneActor?.items?.contents ?? [];
  return items.filter(i => {
    const tpl = String(i?.system?.template ?? "").trim();
    return DRONE_WEAPON_TEMPLATES.has(tpl);
  });
}

function makeWeaponRow({ weaponItem, droneActor }) {
  const row = document.createElement("div");
  row.className = "sinless-drone-weapon-row";

  const name = document.createElement("span");
  name.className = "sinless-drone-weapon-name";
  name.textContent = weaponItem?.name ?? "Weapon";
  row.appendChild(name);

  for (let slot = 1; slot <= 4; slot += 1) {
    const enabled = !!weaponItem?.system?.props?.[`wepAction${slot}Enabled`];
    if (!enabled) continue;

    const label = String(weaponItem?.system?.props?.[`wepAction${slot}Label`] ?? "").trim();
    if (!label) continue;

    const bonus = Number(weaponItem?.system?.props?.[`wepAction${slot}BonusDice`] ?? 0) || 0;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wep-action-btn";
    btn.textContent = label;
    btn.dataset.action = "drone-roll";
    btn.dataset.itemUuid = weaponItem.uuid;
    btn.dataset.actorUuid = droneActor.uuid;
    btn.dataset.bonusDiceDelta = String(bonus);

    row.appendChild(btn);
  }

  return row;
}

function buildInlineBlock({ ownedItem, droneActor }) {
  const wrap = document.createElement("div");
  wrap.className = DRONE_INLINE_CLASS;
  wrap.dataset.ownedItemId = ownedItem.id;

  const details = document.createElement("details");
  details.className = "sinless-drone-inline-details";
  details.open = false;

  const summary = document.createElement("summary");
  summary.textContent = "Drone Weapons";
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "sinless-drone-inline-body";

  const weapons = getDroneWeaponItems(droneActor);
  if (!weapons.length) {
    const empty = document.createElement("div");
    empty.className = "sinless-drone-weapon-empty";
    empty.textContent = "No drone weapons installed.";
    body.appendChild(empty);
  } else {
    for (const w of weapons) body.appendChild(makeWeaponRow({ weaponItem: w, droneActor }));
  }

  details.appendChild(body);
  wrap.appendChild(details);
  return wrap;
}

function bindInlineHandler(root) {
  if (!root || root.dataset.sinlessDroneInlineBound === "1") return;
  root.dataset.sinlessDroneInlineBound = "1";

  const handler = (ev) => {
    const btn = ev.target?.closest?.('button[data-action="drone-roll"]');
    if (!(btn instanceof HTMLElement)) return;

    ev.preventDefault();

    const itemUuid = String(btn.dataset.itemUuid ?? "").trim();
    const actorUuid = String(btn.dataset.actorUuid ?? "").trim();
    const bonusDiceDelta = Number(btn.dataset.bonusDiceDelta ?? 0) || 0;

    if (!itemUuid || !actorUuid) {
      ui.notifications?.warn?.("SinlessCSB: missing drone weapon context.");
      return;
    }

    const api = game.modules.get(MOD_ID)?.api;
    if (typeof api?.rollItem !== "function") {
      ui.notifications?.error?.("SinlessCSB: rollItem API not available.");
      return;
    }

    api.rollItem({ itemUuid, actorUuid, bonusDiceDelta });
  };

  root.addEventListener("click", handler, true);
}

async function injectDroneInlineActions(app, element) {
  const root = getRootElement(app, element);
  if (!root) return;

  const actor = app?.actor ?? app?.document ?? null;
  if (!actor || actor.documentName !== "Actor") return;

  const container = findDronesOwnedRoot(root);
  if (!container) return;

  // Clear previous injection
  for (const el of container.querySelectorAll(`.${DRONE_INLINE_CLASS}, .${DRONE_INLINE_ROW_CLASS}`)) el.remove();

  const rows = collectRowElements(container);
  if (!rows.length) return;

  for (const row of rows) {
    const { itemId, itemUuid } = extractItemIdFromElement(row);
    const ownedItem =
      (itemId ? actor.items.get(itemId) : null) ||
      (itemUuid ? actor.items.get(itemUuid.split(".").pop()) : null) ||
      null;

    if (!ownedItem) continue;

    const findKey = String(ownedItem?.system?.props?.findItemdrone ?? "").trim();
    if (!findKey) continue;

    const droneUuid = String(ownedItem.getFlag?.(MOD_ID, "droneActorUuid") ?? "").trim();
    if (!droneUuid) continue;

    const rowAnchor = row.closest("tr") || row;
    if (!rowAnchor?.insertAdjacentElement) continue;

    let droneActor = null;
    try {
      const doc = await fromUuid(droneUuid);
      if (doc?.documentName === "Actor") droneActor = doc;
    } catch (_e) {}

    if (!droneActor) continue;

    const inline = buildInlineBlock({ ownedItem, droneActor });

    if (rowAnchor.tagName === "TR") {
      const tr = document.createElement("tr");
      tr.className = DRONE_INLINE_ROW_CLASS;
      const td = document.createElement("td");
      td.colSpan = 99;
      td.appendChild(inline);
      tr.appendChild(td);
      rowAnchor.insertAdjacentElement("afterend", tr);
    } else {
      rowAnchor.insertAdjacentElement("afterend", inline);
    }
  }

  bindInlineHandler(root);
}

export function registerDroneInlineActions() {
  const handler = (app, element) => {
    if (!game.settings?.get?.(MOD_ID, "enableAutomation")) return;
    queueMicrotask(() => {
      injectDroneInlineActions(app, element).catch((e) =>
        console.warn("SinlessCSB | drone inline inject failed", e)
      );
    });
  };

  Hooks.on("renderActorSheetV2", handler);
}
