// scripts/rules/alert-formula.js
// SinlessCSB — Alert Formula evaluator
//
// Supported alert text patterns:
// - "3" (flat)
// - "N/A"
// - "1 per target" (or "1 per target per round")
// - "Hardening of target"
// - "file security rating"
// - "2x number of successes"
// - "3 + 1 per success"
// - "1 per success"
//
// Also supports explicit alertMode overrides for deck actions:
// - "brute-force" => 2 × successes
// - "stealth"     => flat 1

import { num } from "../api/_util.js";

function normalizeText(text) {
  return String(text ?? "").trim();
}

function lower(text) {
  return normalizeText(text).toLowerCase();
}

function intOrNaN(value) {
  const s = String(value ?? "").trim();
  if (!s) return NaN;
  if (!/^-?\d+$/.test(s)) return NaN;
  return Number(s);
}

export function evaluateAlertFormula(alertText, ctx = {}) {
  const raw = normalizeText(alertText);
  const lc = lower(alertText);

  const successes = Math.max(0, Math.floor(num(ctx.successes, 0)));
  const targetCount = Math.max(0, Math.floor(num(ctx.targetCount, 0)));
  const targetHardeningTotal = Number.isFinite(num(ctx.targetHardeningTotal, NaN))
    ? Math.max(0, Math.floor(num(ctx.targetHardeningTotal, 0)))
    : NaN;
  const targetHardeningMax = Number.isFinite(num(ctx.targetHardeningMax, NaN))
    ? Math.max(0, Math.floor(num(ctx.targetHardeningMax, 0)))
    : NaN;
  const fileSecurity = Number.isFinite(num(ctx.fileSecurity, NaN))
    ? Math.max(0, Math.floor(num(ctx.fileSecurity, 0)))
    : NaN;

  const notes = [];
  const mode = String(ctx.alertMode ?? "").trim().toLowerCase();

  if (mode === "brute-force") {
    return {
      raw,
      kind: "brute-force",
      formula: "2 × successes",
      delta: Math.max(0, successes * 2),
      notes
    };
  }

  if (mode === "stealth") {
    return {
      raw,
      kind: "stealth",
      formula: "Stealth Infiltration (flat 1)",
      delta: 1,
      notes
    };
  }

  if (!raw) return { raw, kind: "none", formula: "", delta: null, notes };
  if (lc === "n/a" || lc === "na") return { raw, kind: "na", formula: raw, delta: null, notes };

  const flat = intOrNaN(raw);
  if (Number.isFinite(flat)) {
    return { raw, kind: "flat", formula: raw, delta: flat, notes };
  }

  let m = raw.match(/(-?\d+)\s*(?:x|×|\*)?\s*per\s*target/i);
  if (m) {
    const per = Number(m[1]);
    if (targetCount <= 0) notes.push("No targets selected");
    return {
      raw,
      kind: "per-target",
      formula: `${per} per target`,
      delta: Math.max(0, Math.floor(per * targetCount)),
      notes
    };
  }

  if (lc.includes("hardening of target")) {
    const use = Number.isFinite(targetHardeningTotal) ? targetHardeningTotal : targetHardeningMax;
    if (!Number.isFinite(use)) notes.push("No target hardening found");
    return {
      raw,
      kind: "hardening",
      formula: "Hardening of target",
      delta: Number.isFinite(use) ? use : null,
      notes
    };
  }

  if (lc.includes("file security")) {
    if (!Number.isFinite(fileSecurity)) notes.push("No file security rating provided");
    return {
      raw,
      kind: "file-security",
      formula: "File security rating",
      delta: Number.isFinite(fileSecurity) ? fileSecurity : null,
      notes
    };
  }

  m = raw.match(/(-?\d+)\s*\+\s*(-?\d+)\s*per\s*success/i);
  if (m) {
    const base = Number(m[1]);
    const per = Number(m[2]);
    const delta = Math.max(0, Math.floor(base + per * successes));
    return {
      raw,
      kind: "base-plus-success",
      formula: `${base} + ${per} per success`,
      delta,
      notes
    };
  }

  m = raw.match(/(-?\d+)\s*per\s*success/i);
  if (m) {
    const per = Number(m[1]);
    const delta = Math.max(0, Math.floor(per * successes));
    return {
      raw,
      kind: "per-success",
      formula: `${per} per success`,
      delta,
      notes
    };
  }

  m = raw.match(/(-?\d+)\s*(?:x|×|\*)\s*number\s*of\s*successes/i);
  if (!m) m = raw.match(/(-?\d+)\s*(?:x|×|\*)\s*successes/i);
  if (m) {
    const per = Number(m[1]);
    const delta = Math.max(0, Math.floor(per * successes));
    return {
      raw,
      kind: "mult-success",
      formula: `${per} × successes`,
      delta,
      notes
    };
  }

  return {
    raw,
    kind: "unparsed",
    formula: raw,
    delta: null,
    notes: notes.length ? notes : ["Unparsed alert text"]
  };
}
