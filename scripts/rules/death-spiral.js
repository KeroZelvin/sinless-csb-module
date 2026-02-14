// scripts/rules/death-spiral.js
// Sinless death spiral:
// For every 3 boxes marked off on either condition track (stun/physical),
// apply -1 success penalty on skill tests.

function num(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function toInt(x, fallback = 0) {
  return Math.floor(num(x, fallback));
}

function clampCur(cur, max) {
  const m = Math.max(0, toInt(max, 0));
  const c = Math.max(0, toInt(cur, 0));
  if (m <= 0) return c;
  return Math.max(0, Math.min(c, m));
}

export function computeDeathSpiral({
  physicalCur = 0,
  physicalMax = 0,
  stunCur = 0,
  stunMax = 0
} = {}) {
  const pMax = Math.max(0, toInt(physicalMax, 0));
  const sMax = Math.max(0, toInt(stunMax, 0));
  const pCur = clampCur(physicalCur, pMax);
  const sCur = clampCur(stunCur, sMax);

  const physicalLost = Math.max(0, pMax - pCur);
  const stunLost = Math.max(0, sMax - sCur);

  const physicalPenalty = Math.floor(physicalLost / 3);
  const stunPenalty = Math.floor(stunLost / 3);

  return Math.max(0, physicalPenalty + stunPenalty);
}

export function computeDeathSpiralFromProps(
  props = {},
  {
    physicalMax = 0,
    stunMax = 0
  } = {}
) {
  const p = props && typeof props === "object" ? props : {};
  return computeDeathSpiral({
    physicalCur: p.physicalCur,
    physicalMax: (p.physicalMax ?? physicalMax),
    stunCur: p.stunCur,
    stunMax: (p.stunMax ?? stunMax)
  });
}

export function applyDeathSpiralPenalty(successes, deathSpiral) {
  const raw = Math.max(0, toInt(successes, 0));
  const ds = Math.max(0, toInt(deathSpiral, 0));
  return Math.max(0, raw - ds);
}
