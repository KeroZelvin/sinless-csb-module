# SinlessCSB – Known Good Patterns (API-first)

This file is an “operational playbook” for future edits. Prefer copying these patterns verbatim.

---

## 1) Actor resolution: the canonical pattern

### Resolve the actor to update
```js
// 1) Explicit actorUuid wins (GM/sheet-safe)
const sheetActor = await resolveActorForContext({ scope, item });
if (!sheetActor || sheetActor.documentName !== "Actor") return null;
```

### Resolve canonical actor (prevents token-synthetic drift)
```js
const canonActor = await resolveCanonicalActor(sheetActor);
```

### Mirror updates (required for correct live sheet + token behavior)
```js
await sheetActor.update(updateData);

if (canonActor && canonActor.uuid !== sheetActor.uuid) {
  try { await canonActor.update(updateData); } catch (_e) {}
}

for (const t of canvas?.tokens?.controlled ?? []) {
  const ta = t?.actor;
  if (!ta || ta.documentName !== "Actor") continue;

  const taCanon = await resolveCanonicalActor(ta);
  const matches =
    taCanon?.uuid &&
    (taCanon.uuid === sheetActor.uuid || (canonActor?.uuid && taCanon.uuid === canonActor.uuid));

  if (matches && ta.uuid !== sheetActor.uuid && (!canonActor || ta.uuid !== canonActor.uuid)) {
    try { await ta.update(updateData); } catch (_e) {}
  }
}
```

---

## 2) CSB rollMessage caller pattern (linkedEntity/entity safe)

```js
%{
  const itemUuid = String(linkedEntity?.uuid ?? entity?.uuid ?? "");
  const actorUuid = String(
    linkedEntity?.parent?.uuid ??
    rollActor?.uuid ??
    actor?.uuid ??
    ""
  );

  game.modules.get("sinlesscsb")?.api?.rollItem?.({ itemUuid, actorUuid });
  return "";
}%
```

Use the same pattern for `castSpell` and future `rollInitiative`, swapping the API method name.

---

## 3) DialogV2: robust open + value capture

### Never call `DialogV2.wait()` directly
Some v13 runtimes have DialogV2 but no `.wait()`. Use `_util.openDialogV2`.

### Minimal reusable signature
```js
const result = await openDialogV2({
  title: "My Dialog",
  content: "<form>...</form>",
  rejectClose: false,
  onRender: (_dialog, root) => {
    // bind delegated click handlers, live refresh hooks, etc.
    if (root.dataset.bound === "1") return;
    root.dataset.bound = "1";
  },
  buttons: [
    {
      action: "ok",
      label: "OK",
      default: true,
      callback: (event, button, dialog) => {
        const formEl = getDialogFormFromCallbackArgs(event, button, dialog);
        const fd = formEl ? new FormData(formEl) : null;
        return { value: readDialogNumber(fd, "value", 0) };
      }
    },
    { action: "cancel", label: "Cancel", callback: () => null }
  ]
});
if (!result) return null;
```

### Event binding rules
- Bind once: `root.dataset.<flag> = "1"`.
- Prefer **delegated** handlers on `root` for dynamic content.
- If you must avoid leaks, either:
  - remove listeners inside `dialog.close` wrapper, or
  - rely on dataset guard + short-lived dialog DOM (usually sufficient).

---

## 4) Dice rolling (v13-safe)
```js
const roll = new Roll(`${dice}d6`);
await roll.evaluate();                 // NOT evaluate({ async: true })
const diceHTML = await roll.render();  // for chat cards
```

---

## 5) Avoid these pitfalls
- **Import declarations inside functions**  
  If you see “An import declaration can only be used at the top level of a module”, move `import ...` to the top of the file or use `await import(...)`.
- **Duplicate exports** in `_util.js`  
  Ensure `openDialogV2` is defined/exported exactly once.
- **Relying on `this.form` in DialogV2**  
  Use `getDialogFormFromCallbackArgs(...)` and query the dialog root.

---

## 6) Initiative refactor guidance (pending, but pattern-ready)

When initiative moves to API:
- The caller should pass `actorUuid` whenever possible (sheet button, token button).
- The API should:
  1. resolve sheetActor,
  2. resolve canonActor,
  3. compute initiative,
  4. update combatant / combat tracker,
  5. mirror changes if needed,
  6. post chat card with correct speaker.

This prevents the “wrong actor name / wrong actor doc updated” issues seen previously.

## Pattern: Debugging “nothing happens” / UI not updating (module + API)

### 0) First principle: confirm the module actually loaded
If the module fails to load, then:
- `game.modules.get("sinlesscsb")?.api` will be empty
- CSS may appear “broken” (styles never injected)
- sheet buttons/macros that call the API will appear dead

**Fast check**
- Look for boot errors like: `Uncaught SyntaxError: Identifier 'X' has already been declared`
- Confirm: `console.log(Object.keys(game.modules.get("sinlesscsb")?.api ?? {}))` has expected keys

**Common root cause**
- Duplicate declarations inside an ES module (e.g., defining `poolDefs()` twice in `pools-roll.js`).
This is fatal at parse time; nothing after it runs.

---

### 1) “API not available” is a boot/exposure problem until proven otherwise
**Symptom**
- Button roll message logs: `API not available` and `apiKeys: []`

**Causes**
- Module crashed during load (parse/runtime error)
- `main.js` did not expose the function on `mod.api`
- Exposure ran too early/late in a way that never executed (usually because module failed earlier)

**Resolution**
- Fix the boot error first
- Ensure `exposeModuleAPI()` merges in the new function
- Verify API keys again at `ready`

---

### 2) Always verify writes on the correct document before blaming the UI
When a sheet value “didn’t change,” confirm whether the underlying Actor document changed.

**Console probe**
```js
(async () => {
  const a = await fromUuid("Actor.<id>");
  console.log("Actor", a?.name, a?.uuid);
  console.log("Props", a?.system?.props);
})();

DialogV2 CSS Triage Tips (Fast Debug Checklist)

Use this checklist before rewriting CSS or markup. It quickly distinguishes “wrong element,” “CSS not applying,” and “overlay / pointer-events” issues.

1) Confirm you’re inspecting the right element

Many DialogV2 issues are caused by checking a different wrapper than the one actually being laid out.

const el = document.querySelector(".sinlesscsb-stepper, .sinlesscsb-spell-row");
el
el?.outerHTML


If outerHTML is not the wrapper you expect (no - input +), stop and find the correct wrapper first.

2) Determine whether your CSS is being applied

This is the decisive test for “Foundry CSS is winning.”

getComputedStyle(document.querySelector(".sinlesscsb-stepper, .sinlesscsb-spell-row")).display


If it returns "grid" or "flex", your CSS is applying; adjust layout normally.

If it stays "block" despite your CSS, Foundry/the theme is overriding you; escalate to inline hard-stop (style="display:grid !important; …").

3) Check for overlays or swallowed clicks (when controls don’t respond)

Even if UI appears correct, an overlay or disabled state can swallow pointer events.

const btn = document.querySelector('.dialog button[data-action="step"], .dialog button.sinlesscsb-step');
const r = btn.getBoundingClientRect();
document.elementFromPoint(r.left + r.width/2, r.top + r.height/2)


If elementFromPoint returns something else (overlay), investigate pointer-events, z-index, and modal overlays.

4) Quick “is a click reaching anything” probe (temporary)

When clicks do nothing and you suspect propagation/binding:

window.__sinlessClickProbe?.remove?.();
window.__sinlessClickProbe = (() => {
  const handler = (ev) => {
    const t = ev.target;
    const stepBtn =
      t?.closest?.('button[data-action="step"]') ||
      t?.closest?.('button.sinlesscsb-step');
    if (stepBtn) console.log("CAPTURE saw step click", stepBtn);
  };
  document.addEventListener("click", handler, true);
  return { remove: () => document.removeEventListener("click", handler, true) };
})();


If this logs but your handler doesn’t, your binding root is wrong or a dataset guard blocked binding.

DialogV2 CSS: Canonical Stepper Layout + Sizing (Foundry v13)
Symptom

Stepper buttons render correctly in the DOM (- input +) but display vertically (buttons above/below input), or computed style does not reflect your injected CSS:

getComputedStyle(document.querySelector(".sinlesscsb-*-row")).display
// returns "block" even though CSS attempts to set grid/flex

Root cause (typical)

Foundry v13 DialogV2 wraps content in its own dialog form structure and applies high-specificity styling to form elements and buttons. In practice this can:

Force buttons to behave like block/full-width elements

Collapse or override display:flex/grid on your row wrappers

Cause table-based layouts to stretch to full width and create excessive whitespace

Canonical debugging checks

Confirm markup is correct:

document.querySelector(".sinlesscsb-stepper, .sinlesscsb-spell-row")?.outerHTML


Confirm CSS is not applying:

getComputedStyle(document.querySelector(".sinlesscsb-stepper, .sinlesscsb-spell-row")).display


If it stays block, assume Foundry CSS is winning.

Canonical fix hierarchy
Tier 1: Selector-based grid layout (try first)

Use a wrapper class and define a three-column layout:

.sinlesscsb-stepper {
  display: grid;
  grid-template-columns: 1.75rem 5ch 1.75rem;
  gap: 6px;
  align-items: center;
  justify-content: end;
}
.sinlesscsb-stepper input { width: 5ch; min-width: 0; text-align: right; }
.sinlesscsb-stepper button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  margin: 0;
}


Use ch units for numeric fields: 4–6ch is typically ideal.

Tier 2: Inline “hard-stop” layout (canonical when Tier 1 fails)

If computed style remains block, apply inline style on the wrapper (this is the reliable fix in DialogV2):

<div class="sinlesscsb-stepper"
     style="display:grid !important; grid-template-columns:1.75rem 5ch 1.75rem; gap:6px; align-items:center; justify-content:end;">
  <button type="button" data-action="step" data-field="FIELD" data-step="-1"
          style="display:inline-flex !important; align-items:center; justify-content:center;
                 width:1.75rem !important; height:1.75rem !important; padding:0 !important; margin:0 !important;">-</button>

  <input type="number" name="FIELD" value="0" step="1"
         style="width:5ch !important; min-width:0; text-align:right;" />

  <button type="button" data-action="step" data-field="FIELD" data-step="1"
          style="display:inline-flex !important; align-items:center; justify-content:center;
                 width:1.75rem !important; height:1.75rem !important; padding:0 !important; margin:0 !important;">+</button>
</div>


Rule: Inline layout is acceptable for DialogV2 steppers when Foundry theming defeats normal CSS. Prefer Tier 1, but don’t waste time—Tier 2 is deterministic.

Table layout guidance (Pools dialog)

Avoid table-layout: fixed + percentage column widths unless you actually need it; it often causes dialogs to expand and creates excessive whitespace.

Preferred:

Let the table auto-size naturally

Use white-space: nowrap on cells to prevent wrap-based expansion

Constrain overall dialog content width with max-width on your outer container:

<div class="sinlesscsb sinless-pools-dialog" style="max-width: 760px;">

Button sizing guidance

Avoid width:100% on action buttons in dialog tables (it makes them dominate the row). Prefer a modest fixed width/height:

.sinlesscsb-pools-roll-btn { width: 6.5rem; height: 2.25rem; padding: 0 10px; }

“Computed style doesn’t change” is the deciding signal

If getComputedStyle(wrapper).display is still block after you inject CSS, stop iterating on selector specificity and escalate to inline display:grid !important on the wrapper. This is faster and more reliable in Foundry DialogV2.

Below is a copy/paste section you can append to `known_good_patterns.md`. It consolidates what worked (and what broke) during the Friz + Foundry v13 + CSB theming work, with practical diagnostics and hardened patterns.

---

## Foundry v13 + CSS Theming: Fonts, Icons, and “Why Did That Break?”

### Core principle: scope aggressively, override surgically

Foundry’s UI is a large, layered cascade (core + system + modules + your module). You will get unintended side-effects if you apply broad selectors like `*`, `button`, `i`, `[class^="fa-"]`, or global `::before` rules.

Preferred pattern:

* Gate your theme to a single root marker:

  * `html[data-sinless-theme] ...`
  * or `.sinlesscsb ...` (if you can reliably add a root class)
* Apply global typography to `body`, then selectively override headings / labels / chat cards.
* Fix outliers using the smallest selector that matches the problematic element.

---

## 1) Custom fonts (Friz / etc.) in Foundry

### Do

* Define font variables once:

  * `--sinless-font-body`, `--sinless-font-display`, `--sinless-font-mono`
* Apply `--sinless-font-body` at:

  * `html[data-sinless-theme] body { font-family: var(--sinless-font-body); }`
* Keep monospace explicit:

  * `code, pre, textarea { font-family: var(--sinless-font-mono) !important; }`

### Do not

* Apply `font-family` to all descendants via `* { font-family: ... }`
* Apply `font-family` to `button::before`, `*::before`, or `*::after` (this commonly breaks icons)

---

## 2) Font Awesome icons: what broke and what fixed it

### Symptom: icons become “squares” (tofu) everywhere

This is almost always one of:

* An overly broad typography rule overriding icon pseudo-elements (especially `::before`)
* Hard-coding the wrong FA family/weight
* Forcing `content:` for icons (very risky)

### Golden rule

Foundry v13 renders many icons as **pseudo-elements**:

* Sidebar / tool controls: `<button class="ui-control icon fa-solid ...">` with glyph on `::before`
* Other icons may use `<i class="fa-solid ...">`

So the fix must target **`::before`**, not just the element.

### Best practice: use Foundry/FA variables, don’t hardcode “Free”

Foundry (and other modules) may use FA variables for font shorthands, and hardcoding `"Font Awesome 6 Free"` can cause glyph mismatch. The robust approach:

* Never force `content`
* Restore FA fonts using Foundry’s variables when available:

  * `--fa-font-solid`, `--fa-font-regular`, `--fa-font-brands`
  * `--fa-style-family-classic`, `--fa-style-family-brands`

#### Canonical “Font Awesome isolation” block (known-good)

Use one block, at the **end** of your CSS, and avoid multiple competing icon rules:

```css
:root {
  --sinless-fa-classic: var(--fa-style-family-classic, var(--fa-style-family, "Font Awesome 6 Free"));
  --sinless-fa-brands:  var(--fa-style-family-brands, "Font Awesome 6 Brands");
  --sinless-fa-font-solid:   var(--fa-font-solid,   normal 900 1em/1 var(--sinless-fa-classic));
  --sinless-fa-font-regular: var(--fa-font-regular, normal 400 1em/1 var(--sinless-fa-classic));
  --sinless-fa-font-brands:  var(--fa-font-brands,  normal 400 1em/1 var(--sinless-fa-brands));
}

/* Normalize FA pseudo-elements (do not set content) */
.fa-solid::before, .fas::before,
.fa-regular::before, .far::before,
.fa-brands::before, .fab::before,
button.ui-control.icon::before {
  font-style: normal !important;
  line-height: 1 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Solid / Regular / Brands */
.fa-solid::before, .fas::before,
button.ui-control.icon.fa-solid::before {
  font: var(--sinless-fa-font-solid) !important;
}

.fa-regular::before, .far::before,
button.ui-control.icon.fa-regular::before {
  font: var(--sinless-fa-font-regular) !important;
}

.fa-brands::before, .fab::before,
button.ui-control.icon.fa-brands::before {
  font: var(--sinless-fa-font-brands) !important;
}

/* Element-based icons */
.fa-solid, .fas { font-family: var(--sinless-fa-classic) !important; font-weight: 900 !important; }
.fa-regular, .far { font-family: var(--sinless-fa-classic) !important; font-weight: 400 !important; }
.fa-brands, .fab { font-family: var(--sinless-fa-brands) !important; font-weight: 400 !important; }
```

### Do not

* Do not set `content: var(--fa)` globally (causes “mystery squares” on non-FA elements)
* Do not try to “fix icons” with a broad selector like `i, span { font-family: Font Awesome }`
* Do not apply global `button::before { font-family: ... }`

---

## 3) Debugging workflow (fast, reliable)

### Identify whether you’re in the right document

Foundry uses popouts/iframes. Always check:

```js
const el = $0;
el?.ownerDocument === document
```

If false, you are inspecting a different document. CSS may not apply if your stylesheet isn’t loaded there.

### Inspect computed font for the broken thing

For normal text:

```js
const el = $0;
({
  fontFamily: getComputedStyle(el).fontFamily,
  fontWeight: getComputedStyle(el).fontWeight,
  fontStyle: getComputedStyle(el).fontStyle
})
```

For icons (pseudo-elements):

```js
const el = $0;
({
  beforeContent: getComputedStyle(el, "::before").content,
  beforeFontFamily: getComputedStyle(el, "::before").fontFamily,
  beforeFontWeight: getComputedStyle(el, "::before").fontWeight
})
```

### Confirm fonts are actually loaded

```js
({
  free900: document.fonts.check('900 16px "Font Awesome 6 Free"'),
  free400: document.fonts.check('400 16px "Font Awesome 6 Free"'),
  brands:  document.fonts.check('400 16px "Font Awesome 6 Brands"')
})
```

If these are true but icons are squares, it’s usually a **wrong-family/variable mismatch** or your typography is overriding `::before`.

### Find who is overriding (quickest method)

In DevTools → Elements → Computed:

* Look at the property (font-family / font) and click the arrow to see the winning rule
* Fix by narrowing the override to the precise class, not global elements

---

## 4) When a text element refuses your font (CSB “subtitle” case)

Sometimes CSB applies a different font explicitly (e.g., `"Modesto Condensed"`). You must override that **specific class**, not everything.

Known CSB example:

* `.custom-system-label-root` forced a different font family, preventing inheritance

Targeted fix:

```css
html[data-sinless-theme] .custom-system-label-root,
html[data-sinless-theme] .custom-system-label-root * {
  font-family: var(--sinless-font-body) !important;
}
```

Optional subtitle styling:

```css
html[data-sinless-theme] .custom-system-label-root {
  font-weight: 400 !important;
  font-style: italic;
}
```

---

## 5) Safe ordering (reduces “it worked until later” issues)

In your stylesheet:

1. Variables (`:root`, theme roots)
2. Global typography (`body`, monospace)
3. Headings / titles
4. Component styling (buttons, inputs, chat cards)
5. Hard overrides (minimal)
6. **Font Awesome isolation block last**

If Font Awesome is not last, a later typography rule can silently clobber it.

---

## 6) “Never again” rules (high-signal)

* Never apply global `font-family` to `*`, `button`, or `::before/::after` without scoping.
* Never set `content:` for Font Awesome yourself; let Foundry/FA do it.
* For icons: always debug `::before` computed styles.
* Prefer Foundry’s FA variables over hardcoded family names.
* When something resists inheritance, it’s usually a class-level explicit font-family; override that specific class subtree.

---

CSB ComputablePhrase scope: avoid ReferenceError on undefined identifiers

Symptom
Console error from CSB formula evaluation:

Uncaught (in promise) ReferenceError: rollActor is not defined

Stack mentions ComputablePhrase.js / processFormulas

Root cause
In CSB ComputablePhrase evaluation, referencing an identifier that is not injected into the evaluation scope throws immediately. Optional chaining does not protect you if the identifier itself doesn’t exist (e.g., rollActor?.uuid still throws if rollActor is undefined as a variable).

Rule
In CSB %{ ... }% formulas, only read optional globals behind a typeof <name> !== "undefined" guard.

Hardened rollMessage caller (item sheet + inventory row + GM token-safe)

Use this when you want an Item template button to call the module API reliably from either:

Actor inventory row (linkedEntity exists), or

Item sheet (entity exists), including GM use by controlled / targeted token.

%{
  // Prefer linkedEntity (inventory row) then entity (item sheet)
  const doc = (typeof linkedEntity !== "undefined" && linkedEntity) ? linkedEntity
            : (typeof entity !== "undefined" && entity) ? entity
            : null;

  const itemUuid = String(doc?.uuid ?? "").trim();

  // Actor resolution: embedded parent wins; otherwise token/character fallbacks.
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

  if (!itemUuid) {
    ui.notifications?.warn?.("SinlessCSB: missing item context (itemUuid).");
    return "";
  }

  if (!actorUuid) {
    ui.notifications?.warn?.("SinlessCSB: No actor context. Control or target a token, then try again.");
    return "";
  }

  const api = game.modules.get("sinlesscsb")?.api;
  if (typeof api?.rollItem !== "function") {
    ui.notifications?.error?.("SinlessCSB: rollItem API not available (module not ready / not exposed).");
    return "";
  }

  api.rollItem({ itemUuid, actorUuid });
  return "";
}%


Notes
“This same pattern applies to castSpell: only the final API method name changes (rollItem → castSpell).”

This avoids rollActor entirely (common missing identifier in item-sheet contexts).

For GM usage: it works best when the GM controls a token (click) or targets a token (T).

Safe label formula (item sheet + inventory row)

If you must compute the label via JS formula, do not assume linkedEntity exists:

%{
  const doc = (typeof linkedEntity !== "undefined" && linkedEntity) ? linkedEntity
            : (typeof entity !== "undefined" && entity) ? entity
            : null;
  return String(doc?.system?.props?.actionLabel ?? "Use");
}%