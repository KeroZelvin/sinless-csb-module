/**
 * Sinless Roll Initiative (v13 + CSB) v1.5
 * Initiative = (Successes from Focus_Max d6 vs TN_Global) + REA
 *
 * Enhancements in v1.5:
 * - Canonicalize actor using system.props.ActorUuid first (prevents token-synthetic drift)
 * - Actor-only combatants (no token required on scene)
 * - Keeps strict actorUuid priority and correct fallback order
 *
 * Notes:
 * - TN_Global is read from Actor named "Session Settings"
 * - Success = die result >= TN_Global
 */

const COMBAT_NAME = "Encounter 1";

function num(x, fallback = 0) {
  if (typeof x === "string") x = x.trim();
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

function normalizeUuid(u) {
  const s = String(u ?? "").trim();
  return s.length ? s : null;
}

/* -------------------------------------------- */
/* Canonical Actor Resolution (ActorUuid first) */
/* -------------------------------------------- */

async function resolveCanonicalActor(docOrActor) {
  if (!docOrActor) return null;

  // If a TokenDocument was passed accidentally
  if (docOrActor?.documentName === "Token") docOrActor = docOrActor.actor;

  // If we got an Actor document
  if (docOrActor?.documentName === "Actor") {
    const injected = normalizeUuid(docOrActor?.system?.props?.ActorUuid);
    if (injected) {
      try {
        const a = await fromUuid(injected);
        if (a?.documentName === "Actor") return a;
      } catch (e) {
        console.warn("Sinless Roll Initiative | ActorUuid fromUuid failed", { injected, e });
      }
    }
    return docOrActor;
  }

  // Token synthetic actor case
  if (docOrActor?.isToken) {
    const injected = normalizeUuid(docOrActor?.system?.props?.ActorUuid);
    if (injected) {
      try {
        const a = await fromUuid(injected);
        if (a?.documentName === "Actor") return a;
      } catch (e) {
        console.warn("Sinless Roll Initiative | ActorUuid fromUuid failed", { injected, e });
      }
    }
    if (docOrActor.parent?.baseActor) return docOrActor.parent.baseActor;
    return docOrActor;
  }

  return null;
}

function getSessionSettingsActor() {
  const exact = game.actors?.getName?.("Session Settings");
  if (exact) return exact;
  const lower = "session settings";
  return (game.actors?.contents ?? []).find(a => (a.name ?? "").trim().toLowerCase() === lower) ?? null;
}

/* ------------------------- */
/* Combat targeting utilities */
/* ------------------------- */

function findCombatForSceneByName(sceneId, name) {
  const combats = game.combats?.contents ?? [];
  return combats.find(c => (c?.name ?? "").trim() === name && c?.scene?.id === sceneId) ?? null;
}
function findAnyCombatByName(name) {
  const combats = game.combats?.contents ?? [];
  return combats.find(c => (c?.name ?? "").trim() === name) ?? null;
}
async function getTargetCombat(scene) {
  const sceneId = scene?.id ?? null;
  if (!sceneId) return null;

  // 1) Prefer Encounter 1 on this scene
  let c = findCombatForSceneByName(sceneId, COMBAT_NAME);

  // 2) Else any Encounter 1 (if you reuse one combat across scenes)
  if (!c) c = findAnyCombatByName(COMBAT_NAME);

  // 3) Else current combat
  if (!c) c = game.combat ?? null;

  // 4) Else any combat tied to this scene
  if (!c) c = (game.combats?.contents ?? []).find(x => x?.scene?.id === sceneId) ?? null;

  // 5) Last resort: create
  if (!c) c = await Combat.create({ scene: sceneId, active: true });

  if (c && !c.active) await c.update({ active: true });
  return c;
}

/* --------------------------- */
/* Actor-only combatant helpers */
/* --------------------------- */

function getCombatantByActorId(combat, actorId) {
  return combat?.combatants?.find(c => c?.actorId === actorId) ?? null;
}

async function ensureCombatantForActor(combat, actor) {
  let combatant = getCombatantByActorId(combat, actor.id);
  if (combatant) return combatant;

  const created = await combat.createEmbeddedDocuments("Combatant", [{
    actorId: actor.id,
    // tokenId intentionally omitted => actor-only combatant
    hidden: false
  }]);

  return created?.[0] ?? getCombatantByActorId(combat, actor.id) ?? null;
}

// Optional: pick a token for speaker cosmetics if one exists (no selection required)
function findAnyTokenForActorOnScene(actor) {
  const tokens = canvas?.tokens?.placeables ?? [];
  return tokens.find(t => t?.actor?.uuid === actor.uuid) ?? null;
}

(async () => {
  // Optional scope binding from sheet button
// Robust scope: handle both arguments[0] and the occasional global `scope` var.
const _scope =
  (arguments?.length && arguments[0] && typeof arguments[0] === "object") ? arguments[0] :
  (typeof scope !== "undefined" && scope && typeof scope === "object") ? scope :
  {};

const actorUuidFromArgs = normalizeUuid(_scope.actorUuid);

// Read the handoff FIRST, before anything else can mutate it.
const actorUuidFromHandoff = normalizeUuid(game?.sinlesscsb?._initActorUuid);

// Prefer explicit args, else handoff
const actorUuidParam = actorUuidFromArgs || actorUuidFromHandoff;

console.log("Sinless Roll Initiative | input", {
  actorUuidFromArgs,
  actorUuidFromHandoff,
  actorUuidParam,
  handoffObjectPresent: !!game?.sinlesscsb
});

  // 1) Strict priority: actorUuid (sheet button) -> selected token actor -> user character
  let candidate = null;
  if (actorUuidParam) {
    try {
      candidate = await fromUuid(actorUuidParam);
    } catch (e) {
      console.warn("Sinless Roll Initiative | fromUuid(actorUuidParam) failed", { actorUuidParam, e });
    }
  }
  candidate ??= canvas?.tokens?.controlled?.[0]?.actor ?? null;
  candidate ??= game.user.character ?? null;

  const actor = await resolveCanonicalActor(candidate);

  console.log("Sinless Roll Initiative | resolved actor", {
    name: actor?.name ?? null,
    uuid: actor?.uuid ?? null,
    actorUuidParam
  });

  if (!actor) {
    ui.notifications.warn("No actor found. Select a token, set a User Character, or call with { actorUuid }.");
    return;
  }

  const scene = canvas?.scene ?? null;
  if (!scene) {
    ui.notifications.error("No active scene found.");
    return;
  }

  const combat = await getTargetCombat(scene);
  if (!combat) {
    ui.notifications.error("Could not locate or create a Combat to update.");
    return;
  }

  const combatant = await ensureCombatantForActor(combat, actor);
  if (!combatant) {
    ui.notifications.error("Could not create or locate a Combatant for this actor.");
    return;
  }

  // Read TN_Global from Session Settings
  const sessionActor = getSessionSettingsActor();
  if (!sessionActor) {
    ui.notifications.error('Actor "Session Settings" not found (needed for TN_Global).');
    return;
  }

  const tnRaw = num(sessionActor?.system?.props?.TN_Global, NaN);
  const TN = clampTN(Number.isFinite(tnRaw) ? tnRaw : 4, 4);

  // Read actor stats from CSB props (trim-safe)
  const p = actor.system?.props ?? {};
  const focusMax = Math.max(0, Math.floor(num(p.Focus_Max, 0)));
  const rea = num(p.REA, 0);

  // Roll Focus_Max d6 and count successes >= TN
  const roll = new Roll(`${focusMax}d6`);
  await roll.evaluate();

  const diceResults = roll.dice?.[0]?.results?.map(r => r.result) ?? [];
  const successes = diceResults.reduce((acc, r) => acc + (r >= TN ? 1 : 0), 0);
  const initiative = num(successes + rea, 0);

  // Update combatant initiative
  await combatant.update({ initiative });

  ui?.combat?.render?.(true);

  const diceList = diceResults.length ? diceResults.join(", ") : "—";

  const content = `
    <div class="sinless-initiative">
      <p style="margin:0 0 6px 0;"><strong>Player:</strong> ${escapeHTML(actor.name)}</p>
      <p style="margin:0 0 6px 0;"><strong>Target Number:</strong> ${escapeHTML(TN)}+</p>

      <p style="margin:0 0 10px 0;">
        <strong>Focus Pool Successes</strong> ${escapeHTML(successes)} + <strong>Reaction</strong> ${escapeHTML(rea)} =
      </p>

      <div style="text-align:center; margin:10px 0 8px 0;">
        <div style="font-size:28px; font-weight:bold;">INITIATIVE</div>
        <div style="font-size:44px; font-weight:800; line-height:1.05;">${escapeHTML(initiative)}</div>
      </div>

      <details>
        <summary>Dice Results (Focus Pool ${escapeHTML(focusMax)}d6)</summary>
        <div style="margin-top:6px;">${escapeHTML(diceList)}</div>
      </details>
    </div>
  `;

  // Speaker: include token if present (nice chat header), but not required
  const token = findAnyTokenForActorOnScene(actor);
  const speaker = ChatMessage.getSpeaker({ actor, token });

  await ChatMessage.create({ speaker, content });
})();