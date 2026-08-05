const assert = require('assert');
const { validateExpression, evaluateExpression } = require('./calculator');

const tests = [
  { expression: '1+1', expected: '2' },
  { expression: '7-2', expected: '5' },
  { expression: '5*6', expected: '30' },
  { expression: '8/4', expected: '2' },
  { expression: '2+3*4', expected: '14' },
  { expression: '10-3/2', expected: '8.5' },
  { expression: '4.5+5.5', expected: '10' },
  { expression: '50%', expected: '0.5' },
  { expression: '25%+1', expected: '1.25' },
  { expression: '+5', invalid: true },
  { expression: '5++3', invalid: true },
  { expression: '2..5+1', invalid: true },
];

let passed = 0;

for (const test of tests) {
  const { expression, expected, invalid } = test;

  if (invalid) {
    if (validateExpression(expression)) {
      throw new Error(`Expected invalid expression to fail validation: ${expression}`);
    }
    console.log(`✅ invalid check passed: ${expression}`);
    passed += 1;
    continue;
  }

  assert.strictEqual(validateExpression(expression), true, `Validation failed for: ${expression}`);
  const actual = evaluateExpression(expression);
  assert.strictEqual(actual, expected, `Expected ${expression} = ${expected}, got ${actual}`);
  console.log(`✅ ${expression} = ${actual}`);
  passed += 1;
}

console.log(`\n${passed}/${tests.length} tests passed.`);
