%{
  const doc = (typeof linkedEntity !== "undefined" && linkedEntity) ? linkedEntity
            : (typeof entity !== "undefined" && entity) ? entity
            : null;

  const itemUuid = String(doc?.uuid ?? "").trim();

  const embeddedActorUuid =
    (doc?.parent?.documentName === "Actor" && doc?.parent?.uuid) ? String(doc.parent.uuid) : "";

  const scopeActorUuid =
    (typeof actor !== "undefined" && actor?.documentName === "Actor" && actor?.uuid) ? String(actor.uuid) : "";

  const controlledActorUuid = (() => {
    const t = canvas?.tokens?.controlled?.[0];
    return t?.actor?.uuid ? String(t.actor.uuid) : "";
  })();

  const targetedActorUuid = (() => {
    const t = game.user?.targets ? Array.from(game.user.targets)[0] : null;
    return t?.actor?.uuid ? String(t.actor.uuid) : "";
  })();

  const userCharUuid = game.user?.character?.uuid ? String(game.user.character.uuid) : "";

  const actorUuid = String(
    embeddedActorUuid ||
    scopeActorUuid ||
    controlledActorUuid ||
    targetedActorUuid ||
    userCharUuid ||
    ""
  ).trim();

  if (!itemUuid) { ui.notifications?.warn?.("SinlessCSB: missing item context (itemUuid)."); return ""; }
  if (!actorUuid) { ui.notifications?.warn?.("SinlessCSB: No actor context. Control/target a token."); return ""; }

  const api = game.modules.get("sinlesscsb")?.api;
  if (typeof api?.openOwnedDroneSheet !== "function") {
    ui.notifications?.error?.("SinlessCSB: openOwnedDroneSheet API not available.");
    return "";
  }

  api.openOwnedDroneSheet({ itemUuid, actorUuid });
  return "";
}%
