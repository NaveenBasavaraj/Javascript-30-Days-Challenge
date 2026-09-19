'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 08 — CHALLENGES, LEVEL 1
 * ==========================================================================*/

section('1 — tryCatch as a value');
/* attempt(fn) returns [value, null] or [null, errorMessage].     */
function attempt(fn) {
  // your code here
}
check('success', attempt(() => 5), [5, null]);
check('failure', attempt(() => { throw new Error('bad'); }), [null, 'bad']);

section('2 — a validated parser');
/* parsePositiveInt(text) returns the number, or throws a TypeError with
 * one of: 'not a number', 'not an integer', 'not positive'.      */
function parsePositiveInt(text) {
  // your code here
}
check('valid', parsePositiveInt('42'), 42);
check('not a number', () => {
  try { parsePositiveInt('abc'); return 'no throw'; } catch (e) { return e.message; }
}, 'not a number', parsePositiveInt);
check('not an integer', () => {
  try { parsePositiveInt('4.5'); return 'no throw'; } catch (e) { return e.message; }
}, 'not an integer', parsePositiveInt);
check('not positive', () => {
  try { parsePositiveInt('-3'); return 'no throw'; } catch (e) { return e.message; }
}, 'not positive', parsePositiveInt);
check('zero is not positive', () => {
  try { parsePositiveInt('0'); return 'no throw'; } catch (e) { return e.message; }
}, 'not positive', parsePositiveInt);

section('3 — retry a synchronous function');
/* retrySync(fn, times) returns the first success or rethrows the last
 * error.                                                         */
function retrySync(fn, times) {
  // your code here
}
check('third time lucky', () => {
  let n = 0;
  return [retrySync(() => { n++; if (n < 3) throw new Error('x'); return 'ok'; }, 5), n];
}, ['ok', 3], retrySync);
check('gives up', () => {
  try { retrySync(() => { throw new Error('always'); }, 2); return 'no throw'; } catch (e) { return e.message; }
}, 'always', retrySync);

section('4 — an error boundary');
/* guard(fn, fallback) returns a wrapped function that never throws:
 * on error it returns the fallback VALUE (or calls it if it is a
 * function, passing the error).                                  */
function guard(fn, fallback) {
  // your code here
}
check('passes through', () => guard((n) => n * 2, 0)(5), 10, guard);
check('value fallback', () => guard(() => { throw new Error('x'); }, 'safe')(), 'safe', guard);
check('function fallback gets the error', () => guard(() => { throw new Error('boom'); }, (e) => `caught ${e.message}`)(),
  'caught boom', guard);

section('5 — validate a shape');
/* checkShape(value, shape) returns a list of problems.
 * shape maps keys to expected typeof strings.
 * Missing key      -> `${key} is missing`
 * Wrong type       -> `${key} should be ${type}`
 * Sorted by key.                                                 */
function checkShape(value, shape) {
  // your code here
}
check('valid', checkShape({ a: 1, b: 'x' }, { a: 'number', b: 'string' }), []);
check('missing', checkShape({ b: 'x' }, { a: 'number', b: 'string' }), ['a is missing']);
check('wrong type', checkShape({ a: 'no', b: 'x' }, { a: 'number', b: 'string' }), ['a should be number']);
check('several, sorted', checkShape({}, { b: 'string', a: 'number' }), ['a is missing', 'b is missing']);

section('6 — a result type');
/* ok(value) and err(message) build tagged results.
 * mapResult(result, fn) applies fn only to an ok, passing errors through. */
function ok(value) {
  // your code here
}
function err(message) {
  // your code here
}
function mapResult(result, fn) {
  // your code here
}
check('ok shape', ok(1), { ok: true, value: 1 });
check('err shape', err('bad'), { ok: false, error: 'bad' });
check('maps an ok', mapResult(ok(2), (n) => n * 5), { ok: true, value: 10 });
check('passes an error through', mapResult(err('bad'), (n) => n * 5), { ok: false, error: 'bad' });

section('7 — chaining results');
/* chainResults(value, fns) runs each fn, which returns an ok or err.
 * It stops at the first err.                                     */
function chainResults(value, fns) {
  // your code here
}
const notEmpty = (s) => (s.length ? ok(s) : err('empty'));
const noSpaces = (s) => (s.includes(' ') ? err('has spaces') : ok(s));
check('all pass', chainResults('abc', [notEmpty, noSpaces]), { ok: true, value: 'abc' });
check('stops at the first failure', chainResults('', [notEmpty, noSpaces]), { ok: false, error: 'empty' });
check('second fails', chainResults('a b', [notEmpty, noSpaces]), { ok: false, error: 'has spaces' });
check('no functions', chainResults('x', []), { ok: true, value: 'x' });

section('8 — a circuit breaker');
/* After `threshold` consecutive failures the breaker OPENS and refuses to
 * call the function at all, throwing 'circuit open'.
 * A success resets the count.                                    */
function makeBreaker(fn, threshold) {
  // your code here
}
check('opens after failures', () => {
  let calls = 0;
  const call = makeBreaker(() => { calls++; throw new Error('x'); }, 2);
  const results = [];
  for (let i = 0; i < 4; i++) {
    try { call(); results.push('called'); } catch (e) { results.push(e.message); }
  }
  return [results, calls];
}, [['x', 'x', 'circuit open', 'circuit open'], 2], makeBreaker);
check('a success resets it', () => {
  let shouldFail = true;
  const call = makeBreaker(() => { if (shouldFail) throw new Error('x'); return 'ok'; }, 2);
  try { call(); } catch { /* 1 */ }
  shouldFail = false;
  const good = call();
  shouldFail = true;
  try { call(); } catch { /* 1 again, not 2 */ }
  let third;
  try { call(); third = 'called'; } catch (e) { third = e.message; }
  return [good, third];
}, ['ok', 'circuit open'], makeBreaker);

section('9 — collecting errors from a batch');
/* processAll(items, fn) returns { results, errors } where errors is
 * [{ index, message }] and results holds only the successes.     */
function processAll(items, fn) {
  // your code here
}
check('mixed', processAll([1, 0, 2], (n) => {
  if (n === 0) throw new Error('zero');
  return 10 / n;
}), { results: [10, 5], errors: [{ index: 1, message: 'zero' }] });
check('all good', processAll([1], (n) => n), { results: [1], errors: [] });

section('10 — an async error boundary');
/* guardAsync(fn, fallback) — the async twin of exercise 4.       */
function guardAsync(fn, fallback) {
  // your code here
}
checkAsync('passes through', async () => await guardAsync(async (n) => n + 1, 0)(1), 2, guardAsync);
checkAsync('catches a rejection', async () => await guardAsync(async () => { throw new Error('x'); }, 'safe')(),
  'safe', guardAsync);
checkAsync('never rejects', async () => {
  const wrapped = guardAsync(async () => { throw new Error('x'); }, 'safe');
  return await wrapped().then(() => 'resolved', () => 'rejected');
}, 'resolved', guardAsync);

report();
