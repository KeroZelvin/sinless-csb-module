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

