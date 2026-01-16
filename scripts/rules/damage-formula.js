// scripts/rules/damage-formula.js
// SinlessCSB — Item Damage Formula evaluator
//
// Supports arithmetic with STR and optional signed +Nd6 terms.
// Examples:
//   "½ STR + 2"
//   "½ STR + 12 + 2d6"
//   "STR + 6"
//
// Rounding policy (production exact):
// - STR is floored to an integer and min 0
// - Base (non-dice) damage is floored to an integer and min 0
// - Dice are rolled as Xd6 and added to base (signed if user writes -2d6)

export function normalizeDamageFormula(input) {
  let s = String(input ?? "").trim();

  // Replace "½ STR" or "½STR" with "(STR/2)"
  s = s.replace(/½\s*str/gi, "(STR/2)");

  // Replace remaining "½" with 0.5 (rare, but safe)
  s = s.replace(/½/g, "0.5");

  // Normalize STR casing
  s = s.replace(/str/gi, "STR");

  // Remove whitespace
  s = s.replace(/\s+/g, "");

  return s;
}

function extractDiceTerms(normalized) {
  // Find signed dice terms like +2d6, -1d6, or 2d6
  const rx = /([+-]?)(\d+)d6/gi;

  let diceNet = 0;
  let m;
  while ((m = rx.exec(normalized)) !== null) {
    const sign = (m[1] === "-") ? -1 : 1;
    const n = Number(m[2]);
    if (Number.isFinite(n) && n > 0) diceNet += sign * n;
  }

  // Replace all dice terms with 0 so arithmetic parsing ignores them
  const baseExpr = normalized.replace(rx, "0");
  return { baseExpr, diceNet };
}

function tokenize(expr) {
  const tokens = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // Number (supports decimals like 0.5)
    if (/[0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < expr.length && /[0-9.]/.test(expr[j])) j++;
      const raw = expr.slice(i, j);
      if (raw.split(".").length > 2) throw new Error(`Invalid number: ${raw}`);
      tokens.push({ type: "num", value: Number(raw) });
      i = j;
      continue;
    }

    // Variable STR
    if (expr.startsWith("STR", i)) {
      tokens.push({ type: "var", value: "STR" });
      i += 3;
      continue;
    }

    // Operators / parentheses
    if ("+-*/()".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character '${ch}' in formula.`);
  }

  return tokens;
}

function toRPN(tokens) {
  const out = [];
  const ops = [];
  const prec = { "+": 1, "-": 1, "*": 2, "/": 2 };

  for (const t of tokens) {
    if (t.type === "num" || t.type === "var") {
      out.push(t);
      continue;
    }

    const v = t.value;

    if (v === "(") {
      ops.push(t);
      continue;
    }
    if (v === ")") {
      while (ops.length && ops[ops.length - 1].value !== "(") out.push(ops.pop());
      if (!ops.length) throw new Error("Mismatched parentheses.");
      ops.pop(); // remove "("
      continue;
    }

    while (
      ops.length &&
      ops[ops.length - 1].value !== "(" &&
      prec[ops[ops.length - 1].value] >= prec[v]
    ) {
      out.push(ops.pop());
    }
    ops.push(t);
  }

  while (ops.length) {
    const op = ops.pop();
    if (op.value === "(" || op.value === ")") throw new Error("Mismatched parentheses.");
    out.push(op);
  }

  return out;
}

function evalRPN(rpn, vars) {
  const st = [];

  for (const t of rpn) {
    if (t.type === "num") {
      st.push(t.value);
      continue;
    }
    if (t.type === "var") {
      st.push(Number(vars[t.value]));
      continue;
    }

    const b = st.pop();
    const a = st.pop();
    if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error("Bad expression.");

    switch (t.value) {
      case "+": st.push(a + b); break;
      case "-": st.push(a - b); break;
      case "*": st.push(a * b); break;
      case "/":
        if (b === 0) throw new Error("Division by zero.");
        st.push(a / b);
        break;
      default:
        throw new Error(`Unknown operator ${t.value}`);
    }
  }

  if (st.length !== 1 || !Number.isFinite(st[0])) throw new Error("Bad expression.");
  return st[0];
}

/**
 * Evaluate an itemDamage formula.
 * @param {string} formulaText - raw item.system.props.itemDamage
 * @param {number} strValue - actor STR
 */
export function evaluateDamageFormula(formulaText, strValue) {
  const STR = Math.max(0, Math.floor(Number(strValue) || 0));

  const normalized = normalizeDamageFormula(formulaText);
  const { baseExpr, diceNet } = extractDiceTerms(normalized);

  const tokens = tokenize(baseExpr);
  const rpn = toRPN(tokens);
  const raw = evalRPN(rpn, { STR });

  const base = Math.max(0, Math.floor(raw));

  return {
    formulaText: String(formulaText ?? ""),
    normalized,
    baseExpr,
    STR,
    base,
    dice: diceNet
  };
}
