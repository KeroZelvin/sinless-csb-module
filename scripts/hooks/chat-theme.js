// scripts/hooks/chat-theme.js
// Theme SinlessCSB chat content in BOTH:
// 1) Chat message popouts (ChatPopout / sidebar chat log)
// 2) Token chat bubbles
//
// Core hooks used:
// - renderChatMessageHTML(message, html, context)
// - chatBubbleHTML(token, html, message, options)

const MOD_ID = "sinlesscsb";
const THEME_CLASS = "sinlesscsb";

// Marker(s) that appear inside your custom chat content.
// Your initiative cards already use `.sinlesscsb ...`.
const CARD_MARKER_SELECTOR = ".sinlesscsb, .sinlesscsb-marker";

function tagIfContainsMarker(rootEl) {
  if (!(rootEl instanceof HTMLElement)) return;
  if (!rootEl.querySelector?.(CARD_MARKER_SELECTOR)) return;

  // Tag the chat message wrapper itself (usually <li class="chat-message">)
  rootEl.classList.add(THEME_CLASS);

  // Also tag nearest wrapper defensively
  rootEl.closest?.("li.chat-message, .chat-message")?.classList?.add(THEME_CLASS);
}

export function registerChatThemeHooks() {
  // 1) All rendered chat messages (sidebar and any place that uses ChatMessage HTML rendering)
  Hooks.on("renderChatMessageHTML", (message, html /* HTMLElement */, context) => {
    try {
      tagIfContainsMarker(html);
    } catch (e) {
      console.warn("SinlessCSB | renderChatMessageHTML tagging failed", e);
    }
  });

  // 2) Token chat bubbles
  Hooks.on("chatBubbleHTML", (token, html /* HTMLElement */, messageText, options) => {
    try {
      // You can also add an additional class specific to bubbles
      html.classList.add(THEME_CLASS, "sinlesscsb-chat-bubble");
    } catch (e) {
      console.warn("SinlessCSB | chatBubbleHTML tagging failed", e);
    }
  });

  // 3) Optional: tag ChatPopout app root (helps if your CSS keys off the window root)
  Hooks.on("renderApplicationV2", (app, element) => {
    try {
      // Avoid tight coupling: detect by class name.
      if (app?.constructor?.name !== "ChatPopout") return;

      const root =
        (app.element instanceof HTMLElement ? app.element :
        (Array.isArray(app.element) && app.element[0] instanceof HTMLElement ? app.element[0] :
        (element instanceof HTMLElement ? element :
        (element?.[0] instanceof HTMLElement ? element[0] : null))));

      if (!root) return;

      root.classList.add(THEME_CLASS, "sinlesscsb-chat-popout");
    } catch (e) {
      console.warn("SinlessCSB | ChatPopout root tagging failed", e);
    }
  });
}
