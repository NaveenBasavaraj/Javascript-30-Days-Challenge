'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 03 — DEFENSIVE CODE & FAILING WELL
 *
 * Most bugs are not exotic. They are a value that was undefined when you
 * assumed it was there. This file is about the habits that stop that.
 *
 * FAIL FAST, AT THE EDGE
 *   Validate input where it ENTERS your system, then trust it inside.
 *   Scattering `if (!x) return` through every function hides the real
 *   problem and doubles the code.
 *
 * FAIL LOUD, NOT SILENT
 *   An empty catch block is how a bug survives for six months.
 *   `catch (e) {}` is almost always wrong.
 *
 * NARROW WHAT YOU CATCH
 *   A try block around ten lines catches errors from all ten. Wrap the
 *   ONE call that can fail, so a typo in the other nine still crashes.
 *
 * DEFAULTS WITHOUT LYING
 *   `?? 0` is right when zero is a real answer. It is wrong when the
 *   value is missing and the caller needs to know.
 * ==========================================================================*/

section('Exercise 1 — validate at the edge');
/* createUser(input) validates ONCE and throws a TypeError with a precise
 * message. Rules, checked in this order:
 *   not an object          -> 'input must be an object'
 *   name not a string      -> 'name must be a string'
 *   age present but not a number -> 'age must be a number'
 * Otherwise return { name, age } with age defaulting to null.    */
function createUser(input) {
  // your code here
}
check('valid', createUser({ name: 'Asha', age: 30 }), { name: 'Asha', age: 30 });
check('age defaults to null', createUser({ name: 'Asha' }), { name: 'Asha', age: null });
check('not an object', () => {
  try { createUser('x'); return 'no throw'; } catch (e) { return e.message; }
}, 'input must be an object', createUser);
check('bad name', () => {
  try { createUser({ name: 5 }); return 'no throw'; } catch (e) { return e.message; }
}, 'name must be a string', createUser);
check('bad age', () => {
  try { createUser({ name: 'a', age: 'x' }); return 'no throw'; } catch (e) { return e.message; }
}, 'age must be a number', createUser);
check('null is not an object here', () => {
  try { createUser(null); return 'no throw'; } catch (e) { return e.message; }
}, 'input must be an object', createUser);

section('Exercise 2 — narrow the try block');
/* Only ONE line can throw. Wrap just that line, so a mistake in the
 * others is not silently swallowed.
 * parseAndDouble(text) parses JSON (may throw), then doubles .n.
 * Return null when the PARSE fails, but let any other error escape.  */
function parseAndDouble(text) {
  // your code here
}
check('valid', parseAndDouble('{"n":4}'), 8);
check('bad json', parseAndDouble('{oops'), null);
check('a real bug still escapes', () => {
  try { parseAndDouble('null'); return 'swallowed'; } catch (e) { return e.constructor.name; }
}, 'TypeError', parseAndDouble);

section('Exercise 3 — never swallow silently');
/* Two versions of the same thing.
 * silent(fn) catches and returns null, losing the error.
 * loud(fn, log) catches, pushes `error: ${message}` into log, and
 * returns null — so the failure is visible.                      */
function silent(fn) {
  // your code here
}
function loud(fn, log) {
  // your code here
}
check('silent hides it', silent(() => { throw new Error('gone'); }), null);
check('loud records it', () => {
  const log = [];
  const value = loud(() => { throw new Error('seen'); }, log);
  return [value, log];
}, [null, ['error: seen']], loud);

section('Exercise 4 — optional chaining is not a fix');
/* Two readers of the same nested data.
 * quiet(data) uses ?. and returns undefined when the shape is wrong.
 * strict(data) throws new Error('missing city') instead.
 * Both are valid — the point is CHOOSING.                        */
function quiet(data) {
  // your code here: return data?.address?.city
}
function strict(data) {
  // your code here
}
check('quiet finds it', quiet({ address: { city: 'Pune' } }), 'Pune');
check('quiet returns undefined', () => String(quiet({})), 'undefined', quiet);
check('strict finds it', strict({ address: { city: 'Pune' } }), 'Pune');
check('strict complains', () => {
  try { strict({}); return 'no throw'; } catch (e) { return e.message; }
}, 'missing city', strict);

section('Exercise 5 — defaults that do not lie');
/* settings(input) fills in missing values but keeps real ones, including
 * 0 and false and ''.
 * Defaults: retries 3, verbose false, prefix ''.                 */
function settings(input = {}) {
  // your code here
}
check('empty', settings(), { retries: 3, verbose: false, prefix: '' });
check('zero is kept', settings({ retries: 0 }), { retries: 0, verbose: false, prefix: '' });
check('false is kept', settings({ verbose: false }), { retries: 3, verbose: false, prefix: '' });
check('empty string is kept', settings({ prefix: '' }), { retries: 3, verbose: false, prefix: '' });
check('null falls back', settings({ retries: null }), { retries: 3, verbose: false, prefix: '' });

section('Exercise 6 — total functions');
/* A function that cannot fail for any input of the right type is easier
 * to trust than one that throws.
 * average(nums) returns 0 for an empty array, ignores non-numbers, and
 * never throws — even for a non-array.                           */
function average(nums) {
  // your code here
}
check('normal', average([2, 4, 6]), 4);
check('empty', average([]), 0);
check('ignores rubbish', average([2, 'x', 4, null]), 3);
check('not an array', average('nope'), 0);
check('undefined', average(undefined), 0);

section('Exercise 7 — exhaustive switch');
/* An unhandled case should be loud, not silent.
 * area(shape) handles { kind: 'square', side } and
 * { kind: 'circle', r } (rounded to 2 decimals), and throws
 * `unknown shape: ${kind}` for anything else.                    */
function area(shape) {
  // your code here
}
check('square', area({ kind: 'square', side: 3 }), 9);
check('circle', area({ kind: 'circle', r: 1 }), 3.14);
check('unknown', () => {
  try { area({ kind: 'blob' }); return 'no throw'; } catch (e) { return e.message; }
}, 'unknown shape: blob', area);

section('Exercise 8 — freeze what must not change');
/* CONFIG is shared. Return a deeply frozen copy so a caller cannot
 * corrupt it for everyone else.
 * protect(obj) freezes every level and returns it.               */
function protect(obj) {
  // your code here
}
check('top level frozen', () => Object.isFrozen(protect({ a: 1 })), true, protect);
check('nested frozen', () => Object.isFrozen(protect({ a: { b: 1 } }).a), true, protect);
check('mutation does nothing', () => {
  const c = protect({ a: { b: 1 } });
  try { c.a.b = 99; } catch { /* strict mode throws */ }
  return c.a.b;
}, 1, protect);

section('Exercise 9 — a safe JSON round trip');
/* safeJson(text, fallback) parses, and returns the fallback on ANY
 * failure — including a valid-but-wrong-shape result.
 * It must return the fallback unless the result is a plain object.  */
function safeJson(text, fallback) {
  // your code here
}
check('object', safeJson('{"a":1}', {}), { a: 1 });
check('broken', safeJson('{oops', { d: true }), { d: true });
check('an array is not an object here', safeJson('[1,2]', { d: true }), { d: true });
check('null is not an object here', safeJson('null', { d: true }), { d: true });
check('a number is not an object', safeJson('42', { d: true }), { d: true });

section('Exercise 10 — fail fast on a bad invariant');
/* withdraw(account, amount) must never leave a negative balance.
 * Check first, mutate second — and throw before touching anything.
 * Returns the new balance.                                       */
function withdraw(account, amount) {
  // your code here
}
check('normal', () => withdraw({ balance: 100 }, 30), 70);
check('overdraft throws', () => {
  try { withdraw({ balance: 10 }, 50); return 'no throw'; } catch (e) { return e.message; }
}, 'insufficient funds', withdraw);
check('and changes nothing', () => {
  const acc = { balance: 10 };
  try { withdraw(acc, 50); } catch { /* expected */ }
  return acc.balance;
}, 10, withdraw);
check('a negative amount is refused', () => {
  try { withdraw({ balance: 100 }, -5); return 'no throw'; } catch (e) { return e.message; }
}, 'amount must be positive', withdraw);

section('PREDICTIONS');

// P1: does ?. protect against a missing METHOD call?
let p1 = null;
check('P1  String(({}).missing?.())', p1, String(({}).missing?.()));

// P2: and against a misspelled property two levels down?
const data2 = { a: { b: 1 } };
let p2 = null;
check('P2  String(data2.a?.typo?.c)', p2, String(data2.a?.typo?.c));

// P3: what does an empty catch return?
function p3f() { try { throw new Error('x'); } catch (e) { /* nothing */ } }
let p3 = null;
check('P3  String(p3f())', p3, String(p3f()));

// P4: does Object.freeze stop a nested change?
const f4 = Object.freeze({ inner: { n: 1 } });
f4.inner.n = 99;
let p4 = null;
check('P4  f4.inner.n', p4, f4.inner.n);

// P5: is typeof null useful for validation?
let p5 = null;
check('P5  typeof null', p5, typeof null);
log('why P5 matters', 'checking typeof x === "object" lets null through — test for null explicitly');

report();
