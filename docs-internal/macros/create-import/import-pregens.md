(async () => {
  const baseDir = "modules/sinlesscsb/docs-internal/templateJSONS/PreGens";
  const itemPackId = "sinlesscsb.sinlesscsb-item-templates";

  const num = (v, fallback = 0) => {
    if (typeof v === "string") v = v.trim();
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const computeItemMax = (actor, key) => {
    let max = 0;
    for (const it of actor?.items ?? []) {
      const p = it?.system?.props ?? {};
      if (!Object.prototype.hasOwnProperty.call(p, key)) continue;
      const v = Math.max(0, Math.floor(num(p[key], 0)));
      if (v > max) max = v;
    }
    return max;
  };

  const computeSoulBonuses = (actor) => {
    const out = { brawn: 0, finesse: 0, resolve: 0, focus: 0 };
    for (const it of actor?.items ?? []) {
      const p = it?.system?.props ?? {};
      if (Object.prototype.hasOwnProperty.call(p, "soulBrawn")) out.brawn += Math.floor(num(p.soulBrawn, 0));
      if (Object.prototype.hasOwnProperty.call(p, "soulFinesse")) out.finesse += Math.floor(num(p.soulFinesse, 0));
      if (Object.prototype.hasOwnProperty.call(p, "soulResolve")) out.resolve += Math.floor(num(p.soulResolve, 0));
      if (Object.prototype.hasOwnProperty.call(p, "soulFocus")) out.focus += Math.floor(num(p.soulFocus, 0));
    }
    return out;
  };

  const buildPoolsUpdate = (actor) => {
    const p = actor?.system?.props ?? {};

    const STR = Math.floor(num(p.STR, 0));
    const BOD = Math.floor(num(p.BOD, 0));
    const WIL = Math.floor(num(p.WIL, 0));
    const REA = Math.floor(num(p.REA, 0));
    const INT = Math.floor(num(p.INT, 0));
    const CHA = Math.floor(num(p.CHA, 0));
    const qN = Math.floor(num(p.chaQuarterPoolN, 0));
    const chaQ = Math.floor(CHA / 4);
    const soul = computeSoulBonuses(actor);

    const brawn = Math.max(0, Math.floor(STR + Math.floor(BOD / 2) + Math.floor(WIL / 4) + (qN === 1 ? chaQ : 0) + soul.brawn));
    const finesse = Math.max(0, Math.floor(REA + Math.floor(BOD / 2) + Math.floor(INT / 4) + (qN === 2 ? chaQ : 0) + soul.finesse));
    const resolve = Math.max(0, Math.floor(WIL + Math.floor(INT / 2) + Math.floor(CHA / 2) + (qN === 3 ? chaQ : 0) + soul.resolve));
    const focus = Math.max(0, Math.floor(INT + Math.floor(REA / 2) + Math.floor(WIL / 4) + (qN === 4 ? chaQ : 0) + soul.focus));

    const mcpFromItems = computeItemMax(actor, "mcpDeck");
    const mcpProp = Math.floor(num(p.mcpDeck, 0));
    const mcpMax = Math.max(0, Math.max(mcpProp, mcpFromItems));

    const vcrFromItems = computeItemMax(actor, "vcrBonusDice");
    const vcrProp = Math.floor(num(p.vcrBonusDice, 0));
    const vcrMax = Math.max(0, Math.max(vcrProp, vcrFromItems));

    return {
      "system.props.Brawn_Max": brawn,
      "system.props.Brawn_Cur": brawn,
      "system.props.brawnComputed": brawn,
      "system.props.Finesse_Max": finesse,
      "system.props.Finesse_Cur": finesse,
      "system.props.finesseComputed": finesse,
      "system.props.Resolve_Max": resolve,
      "system.props.Resolve_Cur": resolve,
      "system.props.resolveComputed": resolve,
      "system.props.Focus_Max": focus,
      "system.props.Focus_Cur": focus,
      "system.props.focusComputed": focus,
      "system.props.mcpDeck": mcpMax,
      "system.props.mcpCur": mcpMax,
      "system.props.vcrBonusDice": vcrMax,
      "system.props.vcrbonusCur": vcrMax
    };
  };

  const pcsFolder = game.folders?.find?.(f => f.type === "Actor" && f.name === "PCs" && !f.folder) || null;
  const pregensFolder = game.folders?.find?.(
    f => f.type === "Actor" && f.name === "PreGens" && f.folder?.id === pcsFolder?.id
  ) || null;

  if (!pcsFolder || !pregensFolder) {
    ui.notifications?.error?.("Import PreGens JSONs: PCs/PreGens folder not found. Run create-pregens first.");
    return;
  }

  const actorsByName = new Map(
    (game.actors?.filter?.(a => a.folder?.id === pregensFolder.id) ?? []).map(a => [a.name, a])
  );

  const FP = foundry?.applications?.apps?.FilePicker?.implementation || FilePicker;
  let files = [];
  try {
    const browse = await FP.browse("data", baseDir);
    files = (browse?.files ?? []).filter(f => f.toLowerCase().endsWith(".json"));
  } catch (e) {
    console.error(e);
    ui.notifications?.error?.(`Import PreGens JSONs: could not browse ${baseDir}.`);
    return;
  }

  if (!files.length) {
    ui.notifications?.warn?.(`Import PreGens JSONs: no JSON files found in ${baseDir}.`);
    return;
  }

  const itemPack = game.packs?.get?.(itemPackId) || null;
  let itemIndexByName = new Map();
  if (itemPack) {
    const idx = await itemPack.getIndex({ fields: ["name"] });
    for (const e of idx) {
      const key = String(e.name ?? "").trim().toLowerCase();
      if (!key) continue;
      if (!itemIndexByName.has(key)) itemIndexByName.set(key, e);
    }
  } else {
    ui.notifications?.warn?.(`Import PreGens JSONs: item pack ${itemPackId} not found. Actor props will still import.`);
  }

  const parseItemSpecs = (raw) => {
    const out = [];
    if (!Array.isArray(raw)) return out;
    for (const entry of raw) {
      if (typeof entry === "string") {
        const name = entry.trim();
        if (name) out.push({ name, qty: 1 });
        continue;
      }
      if (!entry || typeof entry !== "object") continue;
      const name = String(entry.name ?? "").trim();
      if (!name) continue;
      const qtyNum = Number(entry.qty);
      const qty = Number.isFinite(qtyNum) && qtyNum > 0 ? Math.floor(qtyNum) : 1;
      out.push({ name, qty });
    }
    return out;
  };

  let updated = 0;
  let refreshed = 0;
  let itemsAdded = 0;
  let poolsSynced = 0;
  const missingActors = [];
  const missingItems = [];

  for (const file of files) {
    let data;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.warn(`Import PreGens JSONs: failed to read ${file}`, e);
      continue;
    }

    const name = String(data?.name ?? "").trim();
    if (!name) continue;

    const actor = actorsByName.get(name);
    if (!actor) {
      missingActors.push(name);
      continue;
    }

    const p = data?.system?.props ?? {};
    const update = {};

    for (const [k, v] of Object.entries(p)) {
      if (k === "ActorUuid" || k === "actorUuid") continue;
      update[`system.props.${k}`] = v;
    }

    if (data?.img) {
      update.img = data.img;
      update["prototypeToken.texture.src"] = data.img;
    }
    update["prototypeToken.name"] = actor.name;

    await actor.update(update);
    updated += 1;

    if (itemPack) {
      const rawSpecs = data?.flags?.sinlesscsb?.pregenCompendiumItems;
      const specs = parseItemSpecs(rawSpecs);

      const desired = new Map();
      for (const s of specs) {
        const key = s.name.toLowerCase();
        const cur = desired.get(key) || { name: s.name, qty: 0 };
        cur.qty += s.qty;
        desired.set(key, cur);
      }

      const docsToCreate = [];
      for (const [key, spec] of desired) {
        const hit = itemIndexByName.get(key);
        if (!hit) {
          missingItems.push(`${actor.name}: ${spec.name}`);
          continue;
        }

        const existingCount = actor.items?.filter?.(i => i.name?.toLowerCase?.() === key)?.length ?? 0;
        const needed = Math.max(0, spec.qty - existingCount);
        if (needed <= 0) continue;

        const doc = await itemPack.getDocument(hit._id);
        if (!doc) {
          missingItems.push(`${actor.name}: ${spec.name}`);
          continue;
        }

        for (let i = 0; i < needed; i += 1) {
          docsToCreate.push(doc.toObject());
        }
      }

      if (docsToCreate.length) {
        await actor.createEmbeddedDocuments("Item", docsToCreate);
        itemsAdded += docsToCreate.length;
      }
    }

    // Force pool Cur/Max sync for pregens so rolls work immediately even
    // when actors do not yet have a player owner.
    const poolsUpdate = buildPoolsUpdate(actor);
    await actor.update(poolsUpdate);
    poolsSynced += 1;

    if (actor.sheet?.rendered) {
      actor.sheet.render(true);
      refreshed += 1;
    }
  }

  if (missingActors.length) {
    ui.notifications?.warn?.(
      `Import PreGens JSONs: ${missingActors.length} actor(s) not found in PCs/PreGens (see console).`
    );
    console.warn("Import PreGens JSONs missing actors:", missingActors);
  }

  if (missingItems.length) {
    ui.notifications?.warn?.(
      `Import PreGens JSONs: ${missingItems.length} compendium item mapping(s) not found (see console).`
    );
    console.warn("Import PreGens JSONs missing compendium items:", missingItems);
  }

  ui.notifications?.info?.(
    `Import PreGens JSONs: updated ${updated} actor(s), synced pools ${poolsSynced}, added ${itemsAdded} item(s), refreshed ${refreshed} open sheet(s).`
  );
})();
