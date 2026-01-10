// drain-formula.js
export function normalizeDrainFormula(input) {
  let s = String(input ?? "").trim();

  // Normalize unicode fractions we care about
  // Replace "½ Force" or "½Force" with "(Force/2)"
  s = s.replace(/½\s*force/gi, "(Force/2)");

  // If someone enters just "½" (unlikely), treat it as 0.5
  s = s.replace(/½/g, "0.5");

  // Normalize Force casing
  s = s.replace(/force/gi, "Force");

  // Remove spaces
  s = s.replace(/\s+/g, "");

  return s;
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

    // Variable Force
    if (expr.startsWith("Force", i)) {
      tokens.push({ type: "var", value: "Force" });
      i += 5;
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

    // operator
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

    // operator
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
 * Evaluate drainFormula using chosen Force.
 * Rounding rules:
 * - Force term is floored and min 1.
 * - Final drain is floored to an integer and min 0.
 */
export function evaluateDrainFormula(formulaText, forceChosen) {
  const F = Math.max(1, Math.floor(Number(forceChosen) || 1));

  const normalized = normalizeDrainFormula(formulaText);
  const tokens = tokenize(normalized);
  const rpn = toRPN(tokens);
  const raw = evalRPN(rpn, { Force: F });

  const drain = Math.max(0, Math.floor(raw));
  return { drain, Force: F, normalized };
}
