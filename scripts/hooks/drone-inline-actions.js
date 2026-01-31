// scripts/hooks/drone-inline-actions.js
// Inject inline drone-weapon buttons under the PC "Drones Owned" item displayer rows.

const MOD_ID = "sinlesscsb";

const DRONE_WEAPON_TEMPLATES = new Set([
  "8L2WHN9Spx1TyIys", // Drone Ballistic Template
  "lOAPMavVjtRre3OI", // Drone Energy W Template
  "QtMNKYb9rrdKwv0k", // Rig Drive Skill Template
  "mCc3spF6itnvgfou"  // Rig Fly Skill Template
]);

const VEHICLE_WEAPON_TEMPLATES = new Set([
  "WQoI2Ir3qVKJASl3", // Vehicle Ballistic Template
  "jM4PHhDREfU7OUZ4", // Vehicle Energy W Template
  "QtMNKYb9rrdKwv0k", // Rig Drive Skill Template
  "mCc3spF6itnvgfou"  // Rig Fly Skill Template
]);

const RIG_INLINE_CONFIGS = [
  {
    type: "drone",
    containerClass: "sinless-drones-owned",
    flagKey: "droneActorUuid",
    itemFindKey: "findItemdrone",
    templates: DRONE_WEAPON_TEMPLATES
  },
  {
    type: "vehicle",
    containerClass: "sinless-vehicles-owned",
    flagKey: "vehicleActorUuid",
    itemFindKey: "findItemvehicle",
    templates: VEHICLE_WEAPON_TEMPLATES
  }
];

const DRONE_INLINE_CLASS = "sinless-drone-inline";
const DRONE_INLINE_ROW_CLASS = "sinless-drone-inline-row";

function getRootElement(app, element) {
  if (app?.element instanceof HTMLElement) return app.element;
  if (Array.isArray(app?.element) && app.element[0] instanceof HTMLElement) return app.element[0];
  if (element instanceof HTMLElement) return element;
  if (element?.[0] instanceof HTMLElement) return element[0];
  return null;
}

function findRigOwnedRoot(root, className, titleFallback) {
  if (!root?.querySelector) return null;

  const byClass = className ? root.querySelector(`.${className}`) : null;
  if (byClass) return byClass;

  const headings = [...root.querySelectorAll("h1,h2,h3,h4,header,.custom-system-component-title")];
  const titleEl = titleFallback
    ? headings.find(h => (h?.textContent ?? "").trim() === titleFallback)
    : null;
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

function getRigActionItems(rigActor, templateSet) {
  const items = rigActor?.items?.contents ?? [];
  return items.filter(i => {
    const tpl = String(i?.system?.template ?? "").trim();
    return templateSet?.has?.(tpl);
  });
}

function makeWeaponRow({ weaponItem, rigActor }) {
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
    btn.dataset.actorUuid = rigActor.uuid;
    btn.dataset.bonusDiceDelta = String(bonus);

    row.appendChild(btn);
  }

  return row;
}

function buildInlineBlock({ ownedItem, rigActor, title, templateSet, emptyText }) {
  const wrap = document.createElement("div");
  wrap.className = DRONE_INLINE_CLASS;
  wrap.dataset.ownedItemId = ownedItem.id;

  const details = document.createElement("details");
  details.className = "sinless-drone-inline-details";
  details.open = false;

  const summary = document.createElement("summary");
  summary.textContent = title || "Rig Weapons";
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "sinless-drone-inline-body";

  const weapons = getRigActionItems(rigActor, templateSet);
  if (!weapons.length) {
    const empty = document.createElement("div");
    empty.className = "sinless-drone-weapon-empty";
    empty.textContent = emptyText || "No rig weapons installed.";
    body.appendChild(empty);
  } else {
    for (const w of weapons) body.appendChild(makeWeaponRow({ weaponItem: w, rigActor }));
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

async function injectRigInlineActions(app, element) {
  const root = getRootElement(app, element);
  if (!root) return;

  const actor = app?.actor ?? app?.document ?? null;
  if (!actor || actor.documentName !== "Actor") return;

  for (const cfg of RIG_INLINE_CONFIGS) {
    const container = findRigOwnedRoot(root, cfg.containerClass, cfg.type === "drone" ? "Drones Owned" : "Vehicles Owned");
    if (!container) continue;

    // Clear previous injection
    for (const el of container.querySelectorAll(`.${DRONE_INLINE_CLASS}, .${DRONE_INLINE_ROW_CLASS}`)) el.remove();

    const rows = collectRowElements(container);
    if (!rows.length) continue;

    for (const row of rows) {
      const { itemId, itemUuid } = extractItemIdFromElement(row);
      const ownedItem =
        (itemId ? actor.items.get(itemId) : null) ||
        (itemUuid ? actor.items.get(itemUuid.split(".").pop()) : null) ||
        null;

      if (!ownedItem) continue;

      const findKey = String(ownedItem?.system?.props?.[cfg.itemFindKey] ?? "").trim();
      if (!findKey) continue;

      const rigUuid = String(ownedItem.getFlag?.(MOD_ID, cfg.flagKey) ?? "").trim();
      if (!rigUuid) continue;

      const rowAnchor = row.closest("tr") || row;
      if (!rowAnchor?.insertAdjacentElement) continue;

      let rigActor = null;
      try {
        const doc = await fromUuid(rigUuid);
        if (doc?.documentName === "Actor") rigActor = doc;
      } catch (_e) {}

      if (!rigActor) continue;

      const inline = buildInlineBlock({
        ownedItem,
        rigActor,
        title: cfg.type === "vehicle" ? "Vehicle Weapons" : "Drone Weapons",
        templateSet: cfg.templates,
        emptyText: cfg.type === "vehicle" ? "No vehicle weapons installed." : "No drone weapons installed."
      });

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
  }

  bindInlineHandler(root);
}

export function registerDroneInlineActions() {
  const handler = (app, element) => {
    if (!game.settings?.get?.(MOD_ID, "enableAutomation")) return;
    queueMicrotask(() => {
      injectRigInlineActions(app, element).catch((e) =>
        console.warn("SinlessCSB | drone inline inject failed", e)
      );
    });
  };

  Hooks.on("renderActorSheetV2", handler);
}
