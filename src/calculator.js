function sanitizeExpression(expression) {
  return expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
}

function validateExpression(expression) {
  if (!expression || !expression.trim()) return false;
  const trimmed = expression.trim();
  if (/[^0-9+\-*/.%\s()]/.test(trimmed)) return false;
  if (/^[+\-*/]/.test(trimmed)) return false;
  if (/[+\-*/]{2,}/.test(trimmed.replace(/%/g, ''))) return false;
  if (/\.\d*\./.test(trimmed)) return false;
  if (/[+\-*/]$/.test(trimmed)) return false;

  const balance = [...trimmed].reduce((count, ch) => {
    if (ch === '(') return count + 1;
    if (ch === ')') return count - 1;
    return count;
  }, 0);
  if (balance !== 0) return false;

  try {
    evaluateExpression(trimmed);
    return true;
  } catch {
    return false;
  }
}

function evaluateExpression(expression) {
  const trimmed = expression.trim();
  if (!trimmed) return '0';

  const sanitized = sanitizeExpression(trimmed);
  const result = Function('"use strict"; return (' + sanitized + ')')();

  if (!Number.isFinite(result) || Number.isNaN(result)) {
    throw new Error('Invalid.. calculation');
  }

  return String(result);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateExpression, evaluateExpression };
}
