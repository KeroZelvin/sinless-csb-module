// scripts/api/initiative-roll.js
// SinlessCSB Initiative API (Foundry v13 + CSB v5)
// - PC initiative: (successes from Focus_Max d6 vs TN_Global) + REA
// - NPC initiative: fixed value from system.props.NPCinit
//
// Design goals:
// - Actor resolution priority: actorUuid -> controlled token -> user.character
// - Canonical actor via system.props.ActorUuid / actorUuid to avoid token-synthetic drift
// - Actor-only combatants (tokenId omitted) + de-dupe
// - v13-safe rolling: await roll.evaluate()
// - Correct chat speaker cosmetics without breaking actor binding

import {
  num,
  normalizeUuid,
  resolveCanonicalActor,
  rollXd6Successes
} from "./_util.js";

/* =========================
 * Session Settings helpers
 * ========================= */

function clampTN(tn, fallback = 4) {
  return [4, 5, 6].includes(tn) ? tn : fallback;
}

function getSessionSettingsActor() {
  const exact = game.actors?.getName?.("Session Settings");
  if (exact) return exact;
  const lower = "session settings";
  return (game.actors?.contents ?? []).find(a => (a.name ?? "").trim().toLowerCase() === lower) ?? null;
}

function readTN(sessionActor) {
  const raw = num(sessionActor?.system?.props?.TN_Global, NaN);
  return clampTN(Number.isFinite(raw) ? raw : 4, 4);
}

/* =========================
 * Actor + token helpers
 * ========================= */

async function resolveActorForInitiative({ actorUuid } = {}) {
  // 1) Explicit actorUuid
  const u = normalizeUuid(actorUuid);
  if (u) {
    try {
      const doc = await fromUuid(u);
      if (doc?.documentName === "Actor") return doc;
    } catch (e) {
      console.warn("SinlessCSB | rollInitiative: fromUuid(actorUuid) failed", { actorUuid: u, e });
    }
  }

  // 2) Controlled token actor
  let candidate = canvas?.tokens?.controlled?.[0]?.actor ?? null;

  // 3) User character fallback
  candidate ??= game.user?.character ?? null;

  return candidate;
}

function findAnyTokenForActorOnScene(actor) {
  const tokens = canvas?.tokens?.placeables ?? [];
  return tokens.find(t => t?.actor?.uuid === actor.uuid) ?? null;
}

/* =========================
 * Combat helpers (Encounter 1)
 * ========================= */

async function getTargetCombat(scene) {
  const combats = game.combats?.contents ?? [];

  // Prefer Encounter 1 if it exists in this scene
  const preferred = combats.find(c => c?.scene?.id === scene.id && (c?.name ?? "").trim() === "Encounter 1");
  if (preferred) return preferred;

  // Otherwise, use active combat in this scene
  const active = combats.find(c => c?.scene?.id === scene.id && c?.active);
  if (active) return active;

  // Otherwise, create a new combat (name it Encounter 1 to keep your convention)
  try {
    const created = await Combat.create({ scene: scene.id, active: true, name: "Encounter 1" });
    return created ?? null;
  } catch (e) {
    console.error("SinlessCSB | getTargetCombat: Combat.create failed", e);
    return null;
  }
}

function getCombatantsByActorId(combat, actorId) {
  const all = combat?.combatants?.contents ?? [];
  return all.filter(c => c?.actorId === actorId);
}

async function ensureSingleRepresentativeCombatant(combat, actor) {
  const matches = getCombatantsByActorId(combat, actor.id);

  // If multiple, delete extras (keep the first)
  if (matches.length > 1) {
    const keep = matches[0];
    const extras = matches.slice(1).map(c => c.id);
    try {
      await combat.deleteEmbeddedDocuments("Combatant", extras);
    } catch (e) {
      console.warn("SinlessCSB | ensureSingleRepresentativeCombatant: failed to delete extras", { extras, e });
    }
    return keep;
  }

  // If none, create actor-only combatant
  if (matches.length === 0) {
    const created = await combat.createEmbeddedDocuments("Combatant", [{
      actorId: actor.id,
      // tokenId intentionally omitted => actor-only combatant
      hidden: false
    }]);
    return created?.[0] ?? (getCombatantsByActorId(combat, actor.id)[0] ?? null);
  }

  return matches[0];
}

/* =========================
 * Public API
 * ========================= */

/**
 * PC initiative roll.
 * @param {object} opts
 * @param {string} [opts.actorUuid] - explicit Actor UUID (GM-safe, sheet-safe)
 * @returns {Promise<object|null>}
 */
export async function rollInitiative({ actorUuid } = {}) {
  try {
    // Resolve actor (priority order), then canonicalize
    const candidate = await resolveActorForInitiative({ actorUuid });
    const actor = await resolveCanonicalActor(candidate);

    if (!actor) {
      ui.notifications?.warn?.("Roll Initiative: no actor found (pass { actorUuid }, select a token, or set a User Character).");
      return null;
    }

    const scene = canvas?.scene ?? null;
    if (!scene) {
      ui.notifications?.error?.("Roll Initiative: no active scene found.");
      return null;
    }

    const combat = await getTargetCombat(scene);
    if (!combat) {
      ui.notifications?.error?.("Roll Initiative: could not locate or create Combat (Encounter 1).");
      return null;
    }

    // Ensure actor-only combatant and de-dupe
    const combatant = await ensureSingleRepresentativeCombatant(combat, actor);
    if (!combatant) {
      ui.notifications?.error?.("Roll Initiative: could not create or locate a Combatant for this actor.");
      return null;
    }

    // Session TN
    const sessionActor = getSessionSettingsActor();
    if (!sessionActor) {
      ui.notifications?.error?.('Roll Initiative: Actor "Session Settings" not found (needed for TN_Global).');
      return null;
    }
    const TN = readTN(sessionActor);

    // Dice pool from actor props
    const focusMax = Math.floor(num(actor?.system?.props?.Focus_Max, 0));
    const rea = Math.floor(num(actor?.system?.props?.REA, 0));

    if (focusMax <= 0) {
      ui.notifications?.warn?.(`Roll Initiative: ${actor.name} has Focus_Max <= 0; initiative will be REA only.`);
    }

    // Roll Focus_Max d6 vs TN, count successes
    const rolled = await rollXd6Successes({ dice: Math.max(0, focusMax), tn: TN });
    const successes = rolled.successes;

    const initiative = Math.floor(successes + rea);

    // Update combatant initiative
    await combatant.update({ initiative });

    // Chat output
    const diceList = (rolled.results ?? []).map(r => r.result).join(", ") || "—";
    const token = findAnyTokenForActorOnScene(actor);
    const speaker = ChatMessage.getSpeaker({ actor, token: token?.document });

    const content = `
      <div class="sinlesscsb initiative-roll-card">
        <h2 style="margin:0 0 6px 0;">Initiative</h2>
        <p style="margin:0 0 6px 0;"><strong>Actor:</strong> ${actor.name}</p>
        <p style="margin:0 0 6px 0;"><strong>TN (Session Settings):</strong> ${TN}+</p>
        <p style="margin:0 0 6px 0;"><strong>Focus:</strong> ${focusMax}d6 → <strong>${successes}</strong> successes</p>
        <p style="margin:0 0 6px 0;"><strong>REA:</strong> ${rea}</p>
        <hr/>
        <p style="margin:0 0 6px 0;"><strong>Initiative:</strong> <span style="font-size:20px; font-weight:bold;">${initiative}</span></p>
        <details>
          <summary>Dice Results</summary>
          <div style="margin-top:6px;">${diceList}</div>
        </details>
      </div>
    `;

    await ChatMessage.create({ speaker, content });

    return {
      actorUuid: actor.uuid,
      TN,
      focusMax,
      rea,
      successes,
      initiative
    };
  } catch (e) {
    console.error("SinlessCSB | rollInitiative failed", e);
    ui.notifications?.error?.("Roll Initiative failed. See console (F12).");
    return null;
  }
}

/**
 * NPC “fixed” initiative for all NPC tokens on the active scene.
 * Uses actor.system.props.NPCinit as the initiative value.
 *
 * @param {object} opts
 * @param {string} [opts.sceneId] - optional override; defaults canvas.scene.id
 * @returns {Promise<object|null>}
 */
export async function rollNpcInitiative({ sceneId } = {}) {
  try {
    const scene = (sceneId && game.scenes?.get(sceneId)) ? game.scenes.get(sceneId) : (canvas?.scene ?? null);
    if (!scene) {
      ui.notifications?.error?.("NPC Initiative: no active scene found.");
      return null;
    }

    const combat = await getTargetCombat(scene);
    if (!combat) {
      ui.notifications?.error?.("NPC Initiative: could not locate or create Combat (Encounter 1).");
      return null;
    }

    // Find all tokens in scene with NPCinit defined
    const tokens = scene.tokens?.contents ?? [];
    const npcTokens = tokens.filter(td => {
      const a = td?.actor;
      const v = a?.system?.props?.NPCinit;
      return Number.isFinite(Number(v));
    });

    if (npcTokens.length === 0) {
      ui.notifications?.warn?.("NPC Initiative: no NPC tokens found with system.props.NPCinit on this scene.");
      return null;
    }

    const updates = [];
    const summary = [];

    for (const td of npcTokens) {
      const tokenDoc = td;
      const tokenActor = tokenDoc?.actor;
      if (!tokenActor) continue;

      const actor = await resolveCanonicalActor(tokenActor);
      if (!actor) continue;

      const initVal = Math.floor(num(actor?.system?.props?.NPCinit, NaN));
      if (!Number.isFinite(initVal)) continue;

      const combatant = await ensureSingleRepresentativeCombatant(combat, actor);
      if (!combatant) continue;

      await combatant.update({ initiative: initVal });

      updates.push({ actorName: actor.name, initiative: initVal });
      summary.push(`<li>${actor.name}: <strong>${initVal}</strong></li>`);
    }

    const content = `
      <div class="sinlesscsb npc-initiative-roll-card">
        <h2 style="margin:0 0 6px 0;">NPC Initiative</h2>
        <p style="margin:0 0 8px 0;">Set from <code>system.props.NPCinit</code> (fixed).</p>
        <ul style="margin:0; padding-left:18px;">
          ${summary.join("")}
        </ul>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({}),
      content
    });

    return { sceneId: scene.id, count: updates.length, updates };
  } catch (e) {
    console.error("SinlessCSB | rollNpcInitiative failed", e);
    ui.notifications?.error?.("NPC Initiative failed. See console (F12).");
    return null;
  }
}
