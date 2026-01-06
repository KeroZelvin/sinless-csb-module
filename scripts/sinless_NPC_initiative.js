/**
 * Sinless_NPC_initiative — Encounter 1 + NPCinit-based NPC detection + rep reassignment
 *
 * Output:
 *  - GM-only whisper
 *  - Small message: "NPCs added to combat"
 *  - Full details in a collapsed <details> expander
 *
 * Behavior:
 *  - Targets combat named "Encounter 1" first, then falls back to current combat.
 *  - NPC detection: actor.system.props.NPCinit must be a finite number.
 *  - Groups by Actor type (actor.id) and keeps ONE combatant per type.
 *  - If representative token is gone/defeated/hidden, reassigns to another surviving token.
 */

const COMBAT_NAME = "Encounter 1";

function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readNPCinit(actor) {
  const v = actor?.system?.props?.NPCinit;
  if (v === "" || v === null || v === undefined) return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function isSurvivingToken(token) {
  if (!token) return false;
  if (token.document?.hidden) return false;
  if (token.combatant?.defeated) return false;
  return true;
}

function getNpcTokensOnScene() {
  const tokens = canvas?.tokens?.placeables ?? [];
  // NPC = has a valid NPCinit number on the actor
  return tokens.filter(t => {
    const a = t?.actor;
    if (!a) return false;
    return Number.isFinite(readNPCinit(a));
  });
}

function groupTokensByActorId(tokens) {
  const groups = new Map(); // actorId -> { actor, tokens: [] }
  for (const t of tokens) {
    const actor = t.actor;
    if (!actor?.id) continue;
    if (!groups.has(actor.id)) groups.set(actor.id, { actor, tokens: [] });
    groups.get(actor.id).tokens.push(t);
  }
  return groups;
}

function getCombatantsForActor(combat, actorId) {
  return (combat?.combatants ?? []).filter(c => c?.actor?.id === actorId);
}

function combatantTokenIsValidRepresentative(combatant) {
  if (!combatant) return false;
  if (combatant.defeated) return false;
  const t = canvas?.tokens?.get?.(combatant.tokenId) ?? null;
  if (!t) return false;
  if (!isSurvivingToken(t)) return false;
  return true;
}

function pickNewRepresentativeToken(tokens) {
  const surviving = tokens.filter(isSurvivingToken);
  if (surviving.length) return surviving[0];
  return tokens[0] ?? null;
}

async function deleteCombatants(combat, combatants) {
  const ids = (combatants ?? []).map(c => c?.id).filter(Boolean);
  if (!ids.length) return;
  await combat.deleteEmbeddedDocuments("Combatant", ids);
}

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

  // 2) Else any Encounter 1 (in case you reuse a single combat across scenes)
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

async function ensureSingleRepresentativeCombatant({ combat, actor, tokens, npcInit }) {
  const actorId = actor.id;

  const combatants = getCombatantsForActor(combat, actorId);
  let valid = combatants.find(combatantTokenIsValidRepresentative) ?? null;

  // Delete extras (keep one valid if present)
  if (combatants.length > 1) {
    const extras = valid ? combatants.filter(c => c.id !== valid.id) : combatants.slice(1);
    if (extras.length) await deleteCombatants(combat, extras);
  }

  // Refresh after deletion
  const after = getCombatantsForActor(combat, actorId);
  valid = after.find(combatantTokenIsValidRepresentative) ?? null;

  // If none valid, delete stale and create a new representative
  if (!valid) {
    if (after.length) await deleteCombatants(combat, after);

    const repToken = pickNewRepresentativeToken(tokens);
    if (!repToken) return { combatant: null, repToken: null, action: "no-token" };

    const created = await combat.createEmbeddedDocuments("Combatant", [{
      tokenId: repToken.id,
      sceneId: combat.scene?.id,
      actorId: actor.id,
      hidden: false
    }]);

    const combatant = created?.[0] ?? getCombatantsForActor(combat, actorId)[0] ?? null;
    if (!combatant) return { combatant: null, repToken, action: "create-failed" };

    await combatant.update({ initiative: npcInit });
    return { combatant, repToken, action: "created-new-rep" };
  }

  await valid.update({ initiative: npcInit });
  const repToken = canvas?.tokens?.get?.(valid.tokenId) ?? null;
  return { combatant: valid, repToken, action: "updated-existing-rep" };
}

(async () => {
  const scene = canvas?.scene ?? null;
  if (!scene) {
    ui.notifications.error("No active scene found.");
    return;
  }

  const npcTokens = getNpcTokensOnScene();
  if (!npcTokens.length) {
    ui.notifications.warn("No NPC tokens found on the current scene (NPC = has NPCinit).");
    return;
  }

  const groups = groupTokensByActorId(npcTokens);
  const combat = await getTargetCombat(scene);
  if (!combat) {
    ui.notifications.error("Could not locate or create a Combat to update.");
    return;
  }

  const results = [];

  for (const { actor, tokens } of groups.values()) {
    const npcInit = readNPCinit(actor);
    if (!Number.isFinite(npcInit)) continue; // filtered out already

    try {
      const { combatant, repToken, action } = await ensureSingleRepresentativeCombatant({
        combat, actor, tokens, npcInit
      });

      if (!combatant || !repToken) {
        results.push({ actor, count: tokens.length, error: "No valid representative token available." });
        continue;
      }

      results.push({ actor, repToken, count: tokens.length, npcInit, action });
    } catch (e) {
      console.error(e);
      results.push({ actor, count: tokens.length, error: String(e?.message ?? e) });
    }
  }

  const ok = results.filter(r => !r.error).sort((a, b) => (b.npcInit ?? 0) - (a.npcInit ?? 0));
  const bad = results.filter(r => r.error);

  // Compact top-line + expander details
  const rows = ok.map(r => `
    <tr>
      <td style="padding:4px 6px;"><strong>${escapeHTML(r.actor.name)}</strong></td>
      <td style="padding:4px 6px; text-align:right;">${escapeHTML(r.count)}</td>
      <td style="padding:4px 6px; text-align:right;"><strong>${escapeHTML(r.npcInit)}</strong></td>
      <td style="padding:4px 6px; opacity:0.85;">
        Rep: ${escapeHTML(r.repToken?.name ?? "—")}
        <span style="opacity:0.75;">(${escapeHTML(r.action)})</span>
      </td>
    </tr>
  `).join("");

  const errorBlock = bad.length ? `
    <hr/>
    <h4 style="margin:8px 0 6px 0;">Errors</h4>
    <ul style="margin:0; padding-left:18px;">
      ${bad.map(r => `<li><strong>${escapeHTML(r.actor?.name ?? "Unknown")}</strong>: ${escapeHTML(r.error)}</li>`).join("")}
    </ul>
  ` : "";

  const detailsHtml = `
    <div style="margin-top:6px;">
      <div style="opacity:0.85; margin-bottom:8px;">
        <strong>Combat:</strong> ${escapeHTML(combat.name ?? "(unnamed combat)")}<br/>
        <strong>Scene:</strong> ${escapeHTML(scene.name)}<br/>
        <strong>NPC Types Found:</strong> ${escapeHTML(groups.size)}<br/>
        <strong>Combat Entries Created/Updated:</strong> ${escapeHTML(ok.length)}${bad.length ? ` (plus ${escapeHTML(bad.length)} error${bad.length === 1 ? "" : "s"})` : ""}
      </div>

      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left; padding:4px 6px;">NPC Type (Actor)</th>
            <th style="text-align:right; padding:4px 6px;">Tokens</th>
            <th style="text-align:right; padding:4px 6px;">NPCinit</th>
            <th style="text-align:left; padding:4px 6px;">Representative</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="4" style="padding:6px;">No NPC initiatives applied.</td></tr>`}
        </tbody>
      </table>

      ${errorBlock}
    </div>
  `;

  const content = `
    <div class="sinless-npc-initiative">
      <div style="font-weight:700;">NPCs added to combat</div>
      <details style="margin-top:6px;">
        <summary style="cursor:pointer;">Details</summary>
        ${detailsHtml}
      </details>
    </div>
  `;

  // GM-only whisper
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({}),
    content,
    whisper: ChatMessage.getWhisperRecipients("GM")
  });

  ui.notifications.info(`NPC initiative applied for ${ok.length} NPC type(s).`);
})();