// scripts/hooks/token-bars-bidirectional.js
// Enables editing of canonical tracks from token bars:
// - User edits system.props.*Bar.value via Token HUD
// - We mirror that back to canonical system.props.*Cur
// Also keeps canonical -> bar mirroring (optional if you already have it elsewhere).

const MOD_ID = "sinlesscsb";

function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function buildBar(cur, max) {
  const c = num(cur, 0);
  const m = Math.max(0, num(max, 0));
  const value = m > 0 ? clamp(c, 0, m) : Math.max(0, c);
  return { value, max: m };
}

function barsMatch(existing, desired) {
  if (!existing || typeof existing !== "object") return false;
  return num(existing.value, NaN) === desired.value && num(existing.max, NaN) === desired.max;
}

async function mirrorCanonicalToBars(actor) {
  if (!actor?.system?.props) return;

  const p = actor.system.props;

  const desiredPhysical = buildBar(p.physicalCur, p.physicalMax);
  const desiredStun = buildBar(p.stunCur, p.stunMax);

  const needsPhysical = !barsMatch(p.physicalBar, desiredPhysical);
  const needsStun = !barsMatch(p.stunBar, desiredStun);

  if (!needsPhysical && !needsStun) return;

  const update = {};
  if (needsPhysical) update["system.props.physicalBar"] = desiredPhysical;
  if (needsStun) update["system.props.stunBar"] = desiredStun;

  await actor.update(update, { render: false });
}

function getChanged(path, changes) {
  const u = foundry?.utils;
  if (!u) return undefined;
  return u.getProperty(changes, path);
}

function hasChanged(path, changes) {
  const u = foundry?.utils;
  if (!u) return false;
  return u.hasProperty(changes, path);
}

/**
 * If token HUD edits bar.value, write it back into canonical Cur keys.
 * This is the critical part that enables "edit from token".
 */
async function mirrorBarsToCanonical(actor, changes) {
  if (!actor?.system?.props) return;

  const p = actor.system.props;

  // Detect whether bar values were updated
  const stunBarVal = getChanged("system.props.stunBar.value", changes);
  const physBarVal = getChanged("system.props.physicalBar.value", changes);

  const updates = {};

  if (stunBarVal !== undefined) {
    const max = num(p.stunMax, 0);
    const v = num(stunBarVal, num(p.stunCur, 0));
    updates["system.props.stunCur"] = max > 0 ? clamp(v, 0, max) : Math.max(0, v);
  }

  if (physBarVal !== undefined) {
    const max = num(p.physicalMax, 0);
    const v = num(physBarVal, num(p.physicalCur, 0));
    updates["system.props.physicalCur"] = max > 0 ? clamp(v, 0, max) : Math.max(0, v);
  }

  if (!Object.keys(updates).length) return;

  // Update canonical keys; avoid rerender storms.
  await actor.update(updates, { render: false });

  if (game.settings?.get?.(MOD_ID, "debugLogs")) {
    console.log("SinlessCSB | token bar edit -> canonical", { actor: actor.name, updates });
  }
}

export function registerTokenBarsBidirectionalHooks() {
  Hooks.on("createActor", (actor) => {
    mirrorCanonicalToBars(actor).catch(err => console.warn("SinlessCSB | createActor mirror failed", err));
  });

  Hooks.on("updateActor", (actor, changes) => {
    // If the bar value was edited (likely via token HUD), copy back to canonical
    const barValueTouched =
      hasChanged("system.props.stunBar.value", changes) ||
      hasChanged("system.props.physicalBar.value", changes);

    if (barValueTouched) {
      mirrorBarsToCanonical(actor, changes)
        .then(() => mirrorCanonicalToBars(actor))
        .catch(err => console.warn("SinlessCSB | bars->canonical failed", err));
      return;
    }

    // Otherwise, if canonical or max changed, mirror canonical -> bars
    const canonicalTouched =
      hasChanged("system.props.stunCur", changes) ||
      hasChanged("system.props.stunMax", changes) ||
      hasChanged("system.props.physicalCur", changes) ||
      hasChanged("system.props.physicalMax", changes);

    if (canonicalTouched) {
      mirrorCanonicalToBars(actor).catch(err => console.warn("SinlessCSB | canonical->bars failed", err));
    }
  });

  Hooks.once("ready", () => {
    for (const actor of game.actors?.contents ?? []) {
      mirrorCanonicalToBars(actor).catch(err => console.warn("SinlessCSB | ready sweep mirror failed", err));
    }
  });
}
