%{
  (async () => {
    // ===== CONFIG (edit these two lines per button) =====
    const PROP_KEY = "physicalCur"; // e.g. "stunCur", "Brawn_Cur", "Finesse_Cur", etc.
    const TITLE = "Physical Check"; // label shown on the chat card
    // ====================================================

    // Local helpers (keep inline for CSB safety)
    const num = (x, fallback = 0) => {
      const n = Number(x);
      return Number.isFinite(n) ? n : fallback;
    };
    const escapeHTML = (s) => String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

    // Resolve a usable "doc" without ReferenceError (CSB scope-safe)
    const doc =
      (typeof linkedEntity !== "undefined" && linkedEntity) ? linkedEntity :
      (typeof entity !== "undefined" && entity) ? entity :
      null;

    // Resolve Actor object (prefer sheet context; then controlled/targeted; then user character)
    const controlledActor = canvas?.tokens?.controlled?.[0]?.actor ?? null;
    const targetedActor = (() => {
      const t = game.user?.targets ? Array.from(game.user.targets)[0] : null;
      return t?.actor ?? null;
    })();

    let a =
      (doc?.documentName === "Actor") ? doc :
      (doc?.actor?.documentName === "Actor") ? doc.actor :
      (doc?.parent?.documentName === "Actor") ? doc.parent :
      (typeof actor !== "undefined" && actor?.documentName === "Actor") ? actor :
      controlledActor ||
      targetedActor ||
      game.user?.character ||
      null;

    if (!a || a.documentName !== "Actor") {
      ui.notifications?.warn?.("Quick Check: No actor context. Open a sheet, or control/target a token, then try again.");
      return;
    }

    // TN from Session Settings (fallback 4)
    const sessionActor =
      game.actors?.getName?.("Session Settings") ||
      (game.actors?.contents ?? []).find(x => (x.name ?? "").trim().toLowerCase() === "session settings") ||
      null;

    const tnRaw = num(sessionActor?.system?.props?.TN_Global, 4);
    const TN = [4, 5, 6].includes(tnRaw) ? tnRaw : 4;

    // Pull dice count from actor.system.props[PROP_KEY]
    const props = a.system?.props ?? {};
    const dice = Math.max(0, Math.floor(num(props?.[PROP_KEY], 0)));

    if (!dice) {
      ui.notifications?.warn?.(`Quick Check: "${PROP_KEY}" is 0 or missing on ${a.name}.`);
      return;
    }

    // Roll + count successes
    const roll = new Roll(`${dice}d6`);
    await roll.evaluate();

    const dieResults = (roll.dice?.[0]?.results ?? []).map(r => Number(r.result)).filter(Number.isFinite);
    const successes = dieResults.reduce((acc, v) => acc + (v >= TN ? 1 : 0), 0);

    const diceHTML = await roll.render();

    // Chat card (big successes line, similar structure to your item-roll output)
    const content = `
      <div class="sinlesscsb item-roll-card">
        <h3 style="margin:0 0 6px 0;">${escapeHTML(TITLE)}</h3>
        <p style="margin:0 0 6px 0;"><strong>Actor:</strong> ${escapeHTML(a.name)}</p>
        <p style="margin:0 0 6px 0;"><strong>Key:</strong> <code>${escapeHTML(PROP_KEY)}</code></p>
        <p style="margin:0 0 10px 0;"><strong>Roll:</strong> <strong>${escapeHTML(dice)}d6</strong> vs TN <strong>${escapeHTML(TN)}+</strong></p>

        <div style="text-align:center; margin:10px 0 12px 0;">
          <div style="font-size:28px; font-weight:bold;">
            ${escapeHTML(successes)} SUCCESS${successes === 1 ? "" : "ES"}
          </div>
        </div>

        <details>
          <summary>Dice Results</summary>
          ${diceHTML}
        </details>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: a }),
      content
    });
  })();

  return "";
}%
