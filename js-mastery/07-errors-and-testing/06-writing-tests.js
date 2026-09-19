'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 06 — WRITING TESTS (build the tool you have been using)
 *
 * Every test framework — Jest, Vitest, Mocha, node:test — is the same
 * three ideas:
 *
 *   1. An ASSERTION that throws when something is not as expected.
 *   2. A RUNNER that catches those throws and reports pass/fail.
 *   3. GROUPING (describe/it) so failures have readable names.
 *
 * That is genuinely it. You are about to write all three.
 *
 * THE SHAPE OF A GOOD TEST — arrange, act, assert:
 *   const cart = new Cart();          // arrange
 *   cart.add({ price: 10, qty: 2 });  // act
 *   expect(cart.total).toBe(20);      // assert
 *
 * A test should fail for exactly ONE reason. If you assert five unrelated
 * things, the name cannot describe the failure.
 *
 * You have been running `_helpers/check.js` this whole time. After this
 * file, open it — you will recognise every line.
 * ==========================================================================*/

section('Exercise 1 — the assertion');
/* assertEqual(actual, expected, label) throws an Error with the message
 *   `${label}: expected ${expected}, got ${actual}`
 * when they differ with ===, and returns nothing when they match.  */
function assertEqual(actual, expected, label) {
  // your code here
}
check('passes silently', () => String(assertEqual(1, 1, 'nums')), 'undefined', assertEqual);
check('throws with detail', () => {
  try { assertEqual(2, 1, 'nums'); return 'no throw'; } catch (e) { return e.message; }
}, 'nums: expected 1, got 2', assertEqual);

section('Exercise 2 — deep equality');
/* === is useless for objects. deepEquals(a, b) compares by CONTENT:
 * primitives, arrays and plain objects, recursively.             */
function deepEquals(a, b) {
  // your code here
}
check('primitives', deepEquals(1, 1), true);
check('arrays', deepEquals([1, [2]], [1, [2]]), true);
check('objects ignore key order', deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
check('different values', deepEquals({ a: 1 }, { a: 2 }), false);
check('different key counts', deepEquals({ a: 1 }, { a: 1, b: 2 }), false);
check('array vs object', deepEquals([1], { 0: 1 }), false);
check('null handling', deepEquals(null, null), true);
check('null vs object', deepEquals(null, {}), false);

section('Exercise 3 — an expect API');
/* expect(value) returns an object of matchers:
 *   .toBe(expected)          strict ===
 *   .toEqual(expected)       deep equality
 *   .toThrow(message)        the value must be a FUNCTION that throws
 *                            with that exact message
 * Each throws a descriptive Error on failure and returns nothing on
 * success.                                                       */
function expect(value) {
  // your code here
}
check('toBe passes', () => String(expect(1).toBe(1)), 'undefined', expect);
check('toBe fails', () => {
  try { expect(1).toBe(2); return 'no throw'; } catch (e) { return e instanceof Error; }
}, true, expect);
check('toEqual passes for equal contents', () => String(expect({ a: [1] }).toEqual({ a: [1] })), 'undefined', expect);
check('toEqual fails for different contents', () => {
  try { expect({ a: 1 }).toEqual({ a: 2 }); return 'no throw'; } catch { return 'threw'; }
}, 'threw', expect);
check('toBe fails where toEqual passes', () => {
  try { expect({ a: 1 }).toBe({ a: 1 }); return 'no throw'; } catch { return 'threw'; }
}, 'threw', expect);
check('toThrow passes', () => String(expect(() => { throw new Error('boom'); }).toThrow('boom')), 'undefined', expect);
check('toThrow fails when nothing throws', () => {
  try { expect(() => 1).toThrow('boom'); return 'no throw'; } catch { return 'threw'; }
}, 'threw', expect);
check('toThrow fails on the wrong message', () => {
  try { expect(() => { throw new Error('other'); }).toThrow('boom'); return 'no throw'; } catch { return 'threw'; }
}, 'threw', expect);

section('Exercise 4 — the runner');
/* runTests(tests) takes { name: fn } and returns
 *   { passed, failed, failures: [{ name, message }] }
 * A test PASSES when it does not throw.                          */
function runTests(tests) {
  // your code here
}
check('all pass', runTests({
  'adds': () => { if (1 + 1 !== 2) throw new Error('maths is broken'); },
  'concatenates': () => { if ('a' + 'b' !== 'ab') throw new Error('nope'); },
}), { passed: 2, failed: 0, failures: [] });
check('one fails', runTests({
  'works': () => {},
  'breaks': () => { throw new Error('expected 1, got 2'); },
}), { passed: 1, failed: 1, failures: [{ name: 'breaks', message: 'expected 1, got 2' }] });
check('no tests', runTests({}), { passed: 0, failed: 0, failures: [] });

section('Exercise 5 — describe and it');
/* Grouping, with the names joined by ' > '.
 * makeSuite() returns { describe, it, run } where run() gives the same
 * shape as runTests, with full names like 'Cart > starts empty'.  */
function makeSuite() {
  // your code here
}
check('grouped names', () => {
  const s = makeSuite();
  s.describe('Cart', () => {
    s.it('starts empty', () => {});
    s.it('rejects bad input', () => { throw new Error('nope'); });
  });
  return s.run();
}, {
  passed: 1,
  failed: 1,
  failures: [{ name: 'Cart > rejects bad input', message: 'nope' }],
}, makeSuite);
check('tests outside a describe', () => {
  const s = makeSuite();
  s.it('standalone', () => {});
  return s.run().passed;
}, 1, makeSuite);
check('two groups', () => {
  const s = makeSuite();
  s.describe('A', () => s.it('one', () => {}));
  s.describe('B', () => s.it('two', () => { throw new Error('x'); }));
  return s.run().failures[0].name;
}, 'B > two', makeSuite);

section('Exercise 6 — setup and teardown');
/* beforeEach(fn) runs before every test in the group; afterEach(fn) after.
 * withHooks() returns { beforeEach, afterEach, it, run } and run()
 * returns the shared log so the ORDER is visible.
 * Two tests should produce:
 *   ['before', 'test 1', 'after', 'before', 'test 2', 'after']    */
function withHooks() {
  // your code here
}
check('hook order', () => {
  const s = withHooks();
  const log = [];
  s.beforeEach(() => log.push('before'));
  s.afterEach(() => log.push('after'));
  s.it('one', () => log.push('test 1'));
  s.it('two', () => log.push('test 2'));
  s.run();
  return log;
}, ['before', 'test 1', 'after', 'before', 'test 2', 'after'], withHooks);
check('afterEach runs even when a test fails', () => {
  const s = withHooks();
  const log = [];
  s.afterEach(() => log.push('cleanup'));
  s.it('fails', () => { throw new Error('x'); });
  s.run();
  return log;
}, ['cleanup'], withHooks);

section('Exercise 7 — testing something real');
/* Here is the code under test, provided and correct.
 * Write THREE tests for it in `tests`, covering the happy path, an empty
 * cart, and the error case. Each must throw on failure.          */
function cartTotal(items) {
  if (!Array.isArray(items)) throw new Error('items must be an array');
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
const tests = {
  // your code here: three named functions using assertEqual / expect
};
check('you wrote three tests', () => Object.keys(tests).length, 3);
check('and they all pass', () => runTests(tests).failed, 0);
check('they really exercise the code', () => {
  // a deliberately broken version must make at least one of your tests fail
  const broken = (items) => items.reduce((sum, i) => sum + i.price, 0);
  const original = cartTotal;
  // eslint-disable-next-line no-func-assign
  cartTotal = broken;
  const result = runTests(tests).failed > 0;
  // eslint-disable-next-line no-func-assign
  cartTotal = original;
  return result;
}, true);

section('PREDICTIONS');

// P1: what makes a test "pass" in this design?
let p1 = null;
check('P1  a test passes when it', p1, 'does not throw');

// P2: does assert with === work for objects?
let p2 = null;
check('P2  ({a:1}) === ({a:1})', p2, ({ a: 1 }) === ({ a: 1 }));

// P3: how many reasons should one test have to fail?
let p3 = null;
check('P3  ideal number of reasons a single test can fail', p3, 1);

// P4: if a test never runs its assertion, does it pass?
function p4f() { if (false) { throw new Error('never'); } }
let p4 = null;
check('P4  does a test with an unreachable assertion pass?', p4, true);
log('why P4 matters', 'a test that cannot fail is worse than no test — always see it fail once');

report();
