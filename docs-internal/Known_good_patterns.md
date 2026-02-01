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
- **Template JSON imports in Foundry**  
  Prefer manual edits inside Foundry for templates; JSON imports have repeatedly caused template loss/corruption. Only import JSONs when absolutely necessary and verify the templates still exist afterward.

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

---

Pilot routing for Drone Actors (contextActor vs rollingActor)
Use case

Drones are separate Actor copies (modded loadouts, armor, weapons, damage state), but pool spend and skill ranks must come from the owning PC (pilot/rigger) rather than the Drone actor.

Pattern

Split “who owns the item/state” from “who pays pools”:

contextActor: the actor whose inventory/item button was clicked (Drone in drone workflows).
Holds drone state and drone-only stats like rigHandling.

rollingActor: the actor whose pools/skills are used and depleted (Pilot/PC).

Data model

On the Drone actor, add a hidden text field:

Key: pilotActorUuid

Type: Text

Value: pilot PC Actor UUID (e.g., Actor.<id>)

Rule

When running an item roll from a Drone actor:

Read pools/skills from rollingActor

Write pool depletion to rollingActor

Read handling / vehicle bonus (e.g., rigHandling) from contextActor when needed

Hardened implementation (inside rollItem())
// Drone pilot routing: contextActor is the actor whose item you clicked (e.g., Drone).
const contextActor = actor;
const pilotActor = await resolvePilotActorFromContext(contextActor);

// Guard: pilotActorUuid is set but did not resolve
const pilotUuidRaw = String(contextActor?.system?.props?.pilotActorUuid ?? "").trim();
if (pilotUuidRaw && !pilotActor) {
  ui.notifications?.warn?.(
    `Drone "${contextActor.name}" has pilotActorUuid set but it could not be resolved. Falling back to ${game.user?.character?.name ?? contextActor.name}.`
  );
}

// rollingActor is where pools/skills come from and where pool spend is written.
const rollingActor = pilotActor || game.user?.character || contextActor;

// Props split: drone state vs pilot pools/skills
const contextProps = readProps(contextActor);
const aprops = readProps(rollingActor);

Chat card best practice

Show both roles when they differ:

Actor: should display contextActor.name (Drone)

Pilot: should display rollingActor.name (PC)

Avoid nested template literals if you are inside a backtick-based content string. Prefer concatenation:

const pilotLine =
  (rollingActor && contextActor && rollingActor.uuid && contextActor.uuid && rollingActor.uuid !== contextActor.uuid)
    ? '<p style="margin:0 0 6px 0;"><strong>Pilot:</strong> ' + escapeHTML(rollingActor.name) + '</p>'
    : '';

Error messaging

When validating pool keys, mention both actors to reduce confusion:

if (poolCurRaw === undefined) {
  ui.notifications?.error?.(
    `Pool "${poolCurK}" not found on rolling actor "${rollingActor?.name ?? "?"}" (context actor "${contextActor?.name ?? "?"}").`
  );
  return null;
}

Common pitfall

Do not place contextActor / rollingActor declarations at module top-level. They must be inside rollItem() after actor is resolved. Top-level actor is undefined and will crash module load.

Chat speaker choice for pilot-routed actions (Drone vs Pilot)

When using contextActor (Drone) + rollingActor (Pilot) routing, you must decide who the chat message “speaks as.” Best practice:

Recommended default

Use the Drone as the chat speaker so the chat log reads like “the drone acted,” while still showing the Pilot line in the card.

const pilotLine =
  (rollingActor && contextActor && rollingActor.uuid && contextActor.uuid && rollingActor.uuid !== contextActor.uuid)
    ? '<p style="margin:0 0 6px 0;"><strong>Pilot:</strong> ' + escapeHTML(rollingActor.name) + '</p>'
    : '';

const content = `
  <div class="sinlesscsb item-roll-card">
    <h3 style="margin:0 0 6px 0;">${escapeHTML(item.name)}</h3>
    <p style="margin:0 0 6px 0;"><strong>Actor:</strong> ${escapeHTML(contextActor.name)}</p>
    ${pilotLine}
    ...
  </div>
`;

await ChatMessage.create({
  speaker: ChatMessage.getSpeaker({ actor: contextActor }),
  content
});

When to use the Pilot as the chat speaker instead

Use rollingActor as the speaker when:

the action is framed as a PC action (e.g., casting, personal skill checks), or

you want all pool spends to appear under the PC’s chat identity consistently.

await ChatMessage.create({
  speaker: ChatMessage.getSpeaker({ actor: rollingActor }),
  content
});

Rule of thumb

Drone weapons / drone maneuvers: speaker = contextActor (Drone)

PC abilities / personal actions: speaker = rollingActor (PC)

Always include the Pilot line (conditionally) when contextActor.uuid !== rollingActor.uuid to prevent confusion about where pools were spent.

## Item Roll chat card damage rules

Core display rules

- Only render the `Damage:` line when `itemDamage` or `weaponDamage` is > 0.
- `Special Damage:` is plain escaped text and only renders when non-empty.
- Keep the existing “Weapon Damage” explanatory text for non-melee skills (successes + weapon damage flow).

Damage value priority

- If a legacy formula string exists and the skill is melee/throwing/cyber/unarmed, show the **computed total**.
- Otherwise, use flat numeric `itemDamage` when present.
- Fallback to flat `weaponDamage` if no `itemDamage` is present.

## CSB sheet not picking up SinlessCSB module CSS (Foundry v13 + CSB v5)

### Symptom
Some actor sheets look “unstyled” (missing SinlessCSB theme), while others are correct.

### Root cause
SinlessCSB sheet theming is **scoped** and depends on the presence of a DOM marker:
- If a rendered sheet contains an element with CSS class: `sinlesscsb-marker`
- Then the module hook promotes `.sinlesscsb` onto the nearest `.custom-system` root.
- If the marker is missing, `.sinlesscsb` is never applied and theme-scoped selectors won’t match.

### Fast diagnosis (console)
```js
[...document.querySelectorAll("form.custom-system.actor")].map(f => ({
  marker: !!f.querySelector(".sinlesscsb-marker"),
  hasSinless: f.classList.contains("sinlesscsb"),
  className: f.className
}));
Fix
In CSB template/layout, add sinlesscsb-marker to an always-rendered element (panel/div/etc.).
No content is required; it is a theming trigger.

pgsql
Copy code

If you want, share which template(s) were missing it (PC/NPC/other), and I can propose a quick audit checklist so you can ensure every relevant CSB actor/item template includes the marker in a consistent place.
::contentReference[oaicite:0]{index=0}

---

### Quick Pool Check
a rollMessage macro that:

resolves an Actor safely (sheet actor → controlled token → targeted token → user character)

reads TN_Global from Session Settings (default 4)

reads the requested prop key (e.g., physicalCur, stunCur, Brawn_Cur) from actor.system.props

rolls Xd6, counts successes (>= TN), and posts a chat card with a large success line.

Below is a hardened, copy/paste CSB button rollMessage. Customize only the PROP_KEY and TITLE.


CSB rollMessage: “Quick Pool Check” (no pool spending)
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

How you’ll use it

Create a CSB button (label “Physical Check”, “Stun Check”, “Brawn Check”, etc.)

Paste that block into the button’s rollMessage

Change only:

PROP_KEY = "stunCur" (or whatever)

TITLE = "Stun Check"

Notes

This does not spend or update pools at all.

GM-safe: if you control or target a token, it will roll for that token’s actor.

Scope-safe: avoids ReferenceError by guarding linkedEntity/entity/actor access (same pattern you added to known_good_patterns.md).

// GM backup for Actor sheet buttons:
Module Button Best Practice: Sheet-first actor resolution with GM-friendly fallbacks
Use case

Some CSB/Foundry sheet buttons should always affect the actor whose sheet you clicked, even if you (as GM) have another token selected. However, during testing or certain GM workflows, it is useful to optionally allow the button to act on a controlled/targeted token when there is no reliable sheet actor context.

Problem

In Foundry/CSB, relying on selected tokens can cause misfires:

GM clicks a button on an NPC sheet, but a PC token is selected → the action may apply to the selected PC instead of the sheet actor.

In some CSB contexts, the injected actor identifier may not be present or may not be the expected actor (scope variance).

Pattern (recommended)

Resolve the actor in a strict order:

Injected sheet actor (if present and an Actor document)

Stored actorUuid field on the sheet (e.g., Actor.<id>) resolved via fromUuid()

Fallbacks for GM/testing only:

controlled token actor

targeted token actor

game.user.character

This ensures:

Normal usage: sheet button affects the correct actor even if other tokens are selected.

GM/testing: you can heal/trigger actions by targeting or controlling a token when the sheet context isn’t available.

CSB-safe rule

In CSB %{ ... }% formulas, never reference identifiers that might not exist without guarding:

✅ typeof actor !== "undefined" && actor?.documentName === "Actor"

❌ actor?.uuid (throws if actor identifier is not injected)

Canonical snippet (actor resolution helper)

Use this snippet in sheet button macros where you want “sheet first” behavior, with GM-friendly fallbacks:

// 1) Prefer injected sheet actor
let scopeActor =
  (typeof actor !== "undefined" && actor?.documentName === "Actor") ? actor : null;

// 2) If not present, resolve from a CSB field like "Actor.eMbezua6UThIStwT"
if (!scopeActor) {
  const au =
    (typeof actorUuid !== "undefined" && actorUuid) ? String(actorUuid).trim() : "";

  if (au) {
    try {
      const doc = await fromUuid(au);
      if (doc?.documentName === "Actor") scopeActor = doc;
    } catch (_e) {}
  }
}

// 3) GM/testing fallbacks (only if still no sheet context)
if (!scopeActor) {
  const controlledActor = canvas?.tokens?.controlled?.[0]?.actor ?? null;
  const targetedActor = (() => {
    const t = game.user?.targets ? Array.from(game.user.targets)[0] : null;
    return t?.actor ?? null;
  })();

  scopeActor = controlledActor || targetedActor || game.user?.character || null;
}

if (!scopeActor) {
  ui.notifications?.warn?.("No actor context. Open a sheet or control/target a token.");
  return;
}

Notes

Storing actorUuid on actors/items as a CSB field (e.g., Actor.<id>) is a robust way to bypass CSB scope limitations and reliably recover the correct actor document.

Keep fallbacks after the sheet actor steps to prevent “selected token overrides sheet actor” errors.

If a button should never act on controlled/targeted tokens, delete step (3) and enforce sheet-only behavior.

###  CSB Multi-Action Item Buttons that Work on Both Item Sheets and Actor Item Displayers
Goal

Define action mode fields on the Item (e.g., SS/DT/B/FA or drone actions) and have them:

Render as buttons on the Item sheet, and

Render as buttons inside an Actor Item Displayer row, and

Call the same module API via a hardened rollMessage macro.

This avoids duplicating action logic on the Actor and keeps “what the item can do” stored on the item itself (important for drone weapons and reusable equipment).

Data model (recommended)

Store per-action fields on the Item:

wepAction1Enabled (checkbox / boolean)

wepAction1BonusDice (number; can be negative)

wepAction1Label (text, e.g., "SS")

Repeat for 2–4:

wepAction2Enabled, wepAction2BonusDice, wepAction2Label

wepAction3Enabled, wepAction3BonusDice, wepAction3Label

wepAction4Enabled, wepAction4BonusDice, wepAction4Label

Notes:

Keep these keys in a hidden GM-only panel if you want a clean sheet UI.

Use Item Displayer “Hide Empty” + your Enabled flags to keep rows tidy.

Best practice: CSB formula scope is context-dependent

CSB “Label (Style: Button)” Text fields are CSB formula/interpolation, not full JS. The available variables differ:

On the Item sheet: use the bare keys
✅ wepAction2Enabled, wepAction2Label
❌ system.props.wepAction2Enabled (often blocked: “No access to property props”)
❌ item.wepAction2Enabled (usually undefined on item sheet)

In an Actor Item Displayer row: use item.<key>
✅ item.wepAction2Enabled, item.wepAction2Label
❌ bare wepAction2Enabled (often undefined in displayer row formulas)

This is the main reason “it works on one sheet but not the other” when you reuse formulas.

Item sheet button: Label component configuration

Use a Label component styled as Button, with no Key (button shouldn’t write data).

Text (item sheet context):

${wepAction2Enabled ? wepAction2Label : ""}$


Optional “Visible if” (keeps it from rendering at all when disabled):

${wepAction2Enabled ? true : false}$


Repeat for each action N.

Single-action item templates (Action 1 only)

If the item has only one action (archery/energy/melee/thrown), you still must define the wepAction1 fields. The Actor Item Displayer only looks at wepAction1Enabled + wepAction1Label, and our CSS hides empty/disabled buttons.

Required item-template fields:

wepAction1Label (text field) — replaces old actionLabel.

wepAction1Enabled (checkbox in the Hidden panel) — set defaultChecked: true.

Header button value:

${wepAction1Enabled ? wepAction1Label : ""}$

Migration note: if you’re converting an existing template that used actionLabel, add a template modifier/mapping to copy actionLabel -> wepAction1Label so existing items keep their labels.

Important:

If the button shows the label but also prints "ERROR", the failing formula is usually in Visible if / Tooltip / CSS class / Icon / Disabled if fields on that same component. Make sure those also use bare keys (and avoid system.props.*).

Actor sheet Item Displayer button: Label component configuration

In the Item Displayer row, use Label (Style: Button) and reference the row item as item.

Text (item displayer context):

${item.wepAction2Enabled ? item.wepAction2Label : ""}$


Optional “Visible if”:

${item.wepAction2Enabled ? true : false}$


Repeat for each action N.

RollMessage macros: keep them JS-only and API-only

For actions, use %{ ... }% JavaScript rollMessage blocks to call the module API. This is more robust than CSB formula parsing and avoids “Value expected” parser errors.

Core rule:

Resolve doc with linkedEntity (inventory/displayer row) first, then entity (item sheet).

Resolve actorUuid safely (embedded parent → scope actor → controlled token → targeted token → user character).

Call the API; do not embed roll logic into the macro.

Example skeleton (per action):

bonusDiceDelta can come from doc.system.props.wepActionNBonusDice (preferred), or be hardcoded.

Key reliability point:

The “ReferenceError in ComputablePhrase” class of problems happens when you reference identifiers that don’t exist in scope. In %{ ... }% JS blocks you control your identifiers, so you avoid that entire failure mode as long as you guard linkedEntity/entity/actor with typeof.

Why this works well for drones

Drones often reuse the same item across multiple drone actors. Storing action configuration on the item means:

You can drag-copy the drone gun item into many drones.

Each drone can still differ via actor-side stats (e.g., rigHandling via limitBonusActorKey), while the weapon keeps its own action modes and bonus dice fields.

This cleanly separates:

Item defines available actions and their bonuses (action mode configuration)

Actor defines who rolls / which pools / handling modifiers (pilot routing + limit source)

Common failure modes (and fixes)

Using system.props.* in Label Text
Fix: use bare keys (item sheet) or item.<key> (item displayer). Avoid system.props.

CSB parser errors like “Value expected”
Fix: CSB formula fields are not full JS. Use simple ternaries or move logic into %{ ... }% rollMessage.

Button label shows plus “ERROR” underneath
Fix: another field in the same component (Visible/Tooltip/Icon/etc.) is failing. Audit all formula-capable fields.

Keys not unique / duplicated
Fix: ensure only one instance of each wepActionN* key exists on the template; store duplicates in hidden panels only if they are not keyed.

---

## CSB rich-text image panels (Weapon Card / TarotLand)

Symptom
- Rich-text image in a collapsible panel shows only a cropped portion, or overlaps the next panel.

Root cause
- CSB/Foundry rich-text editors (`prose-mirror`, `.editor-content`) enforce fixed heights and overflow.
- The card container sometimes isn’t actually tagged with the expected CSS class (e.g., `weapon-card-panel`), so overrides don’t apply.

Known-good fix (SinlessCSB)
- Target the actual rich-text component class: `custom-system-component-contents.weaponCard`
- Force the rich-text editor and its wrappers to use normal flow and auto height.
- For Thrown Range Finder, target `custom-system-component-contents.thrownRange` with the same rules.

Canonical CSS (in `styles/sinlesscsb-ui-global.css`)
```css
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .custom-system-rich-editor,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .custom-system-rich-content,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .custom-system-text-area,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .editor,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .editor-content,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .prosemirror,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard prose-mirror.editor,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard prose-mirror.prosemirror {
  height: auto !important;
  max-height: none !important;
  min-height: 0 !important;
  overflow: visible !important;
  display: block;
}

html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard {
  flex: 0 0 auto;
  align-self: stretch;
}

html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .custom-system-rich-content,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .editor,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .editor-content,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard .prosemirror,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard prose-mirror {
  position: static !important;
}

html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.weaponCard img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Thrown Range Finder uses the same rich-text layout fix */
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .custom-system-rich-editor,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .custom-system-rich-content,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .custom-system-text-area,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .editor,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .editor-content,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .prosemirror,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange prose-mirror.editor,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange prose-mirror.prosemirror {
  height: auto !important;
  max-height: none !important;
  min-height: 0 !important;
  overflow: visible !important;
  display: block;
}

html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange {
  flex: 0 0 auto;
  align-self: stretch;
}

html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .custom-system-rich-content,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .editor,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .editor-content,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange .prosemirror,
html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange prose-mirror {
  position: static !important;
}

html[data-sinless-theme] .custom-system.sinlesscsb .custom-system-component-contents.thrownRange img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

Notes
- If you add a custom class like `weapon-card-panel` to the CSB panel, verify it actually appears in the rendered DOM. If not, target `weaponCard` directly.
- The “push panel down” behavior requires `position: static` and normal flow (no absolute positioning) on the editor wrappers.

## VCR / Actor-Sourced Bonus Dice Pattern (Drone + Pilot routing)

Goal: Add bonus dice from a separate “support item” (VCR) to multiple skill items (drone skills), while still stacking action bonuses (wepActionNBonusDice).

Core rules

- Keep logic in the API; rollMessage macros stay thin (API-first).
- Read actor-sourced bonuses from the rolling actor (pilot), not the context actor (drone).
- `pilotActorUuid` must be set on drones for GM testing (no reliance on `game.user.character`).

Data model

- Support item (VCR) defines numeric prop: `vcrBonusDice`.
- Drone skill items define hidden text prop: `bonusDiceActorKey = "vcrBonusDice"` (case-sensitive).

Implementation summary

- `scripts/api/item-roll.js`: adds `bonusDiceActorKey` handling and stacks actor bonus with item + action bonuses; chat card shows bonus breakdown.
- `scripts/hooks/vcr-bonus-sync.js`: caches highest `vcrBonusDice` from VCR items to the owning actor (`actor.system.props.vcrBonusDice`).
- `scripts/main.js`: registers VCR bonus hook at init.

Template locations (CSB JSON exports)

- `docs-internal/templateJSONS/` (VCR item template: `vcrBonusDice`; drone skill templates: `bonusDiceActorKey`; drone actor template: `pilotActorUuid`).

Common pitfalls / fixes

- Template edits do not backfill existing items. Old items may not have `bonusDiceActorKey` or `vcrBonusDice` until edited/saved or backfilled.
- Key casing must match exactly: `vcrBonusDice`, `bonusDiceActorKey`, `pilotActorUuid`.
- When a pilot bonus appears “missing,” confirm the item instance actually has `bonusDiceActorKey` in `item.system.props`.

Reusable for Cyberdeck / MCP

- Same pattern: add a support-item prop (e.g., `mcpBonusDice`), cache highest on actor via a hook, and reference via `bonusDiceActorKey` on related skill items.

## Item Data Notes: `specialDamage`

Use `system.props.specialDamage` to store **extra damage or special notes** that appear in tables but don't fit standard numeric fields (e.g., blast radius breakdowns, ground-only restrictions, per-ammo cost addenda).

Rules
- Prefer a short, plain-text note (no quotes).
- Only use `specialDamage` for the **extra** note; keep core numeric stats in their normal fields.

## Table-to-JSON Workflow (Sinless PDFs)

Use this workflow whenever a task involves reading Sinless PDF tables and generating JSONs.

1) Identify the source page
- Confirm the exact page number(s) and table name.
- Extract the page image if needed for visual verification.

2) Pick the correct template + example
- Always use a template JSON for structure and defaults.
- Use an existing item/actor JSON as a mapping example (field ↔ column).
- Do **not** invent keys; verify from the template.

3) Map table columns to keys
- Convert dashes/empty to `0` for numeric fields.
- Keep non-numeric strings in text fields as-is (e.g., Core type).
- Put extra notes (blast radius, restrictions, per‑ammo cost) in `specialDamage`.

4) Generate JSONs
- Use the template’s defaults; override only the mapped keys.
- Keep JSON ASCII-safe.
- Use stable filenames: `fvtt-Item-<category>-<slug>-<id>.json` or similar.

5) Create/import macros
- **Create** macro makes blank items from template (no stats).
- **Import** macro updates `system.props.*` from JSON files.
- Create a dedicated folder (e.g., `Weapons/Drone Weapons`), then import into it.

6) Sanity check
- Spot-check 1–2 items against the table (numeric values, action modes, cost).
- Confirm template id/unique version matches the expected template file.

## Macro Patterns (Create/Import)

Create macros
- Find template by id or name.
- Ensure folder exists (create if missing).
- Create items with the template set (no stats), then rely on import.

Import macros
- Browse JSONs from `modules/sinlesscsb/docs-internal/templateJSONS/...`.
- Match items by name in the target folder.
- Update only `system.props.*` keys.
- Refresh open sheets.

## Repo Hygiene: Compendiums (`packs/`)

`D:\Git\sinlesscsb\packs` contains Foundry compendiums for the module. Treat these as **release artifacts**:
- Do not edit, regenerate, or touch anything under `packs/` during normal work.
- Only update `packs/` when packaging a release.
