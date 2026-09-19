'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 03 — PROMISES
 *
 * A promise is an OBJECT representing a value that is not ready yet.
 * It has three states and moves between them exactly once:
 *
 *   pending  ->  fulfilled (with a value)
 *            ->  rejected  (with a reason, normally an Error)
 *
 * "Settled" means fulfilled or rejected. A settled promise never changes
 * again, and its value is delivered to every handler attached, whenever
 * they were attached.
 *
 * CREATING ONE
 *   new Promise((resolve, reject) => { ...; resolve(value); })
 *     The function runs IMMEDIATELY and synchronously. Only the handlers
 *     are deferred.
 *   Promise.resolve(v)   an already-fulfilled promise
 *   Promise.reject(e)    an already-rejected one
 *
 * READING ONE
 *   p.then(onFulfilled)
 *   p.catch(onRejected)              same as .then(undefined, onRejected)
 *   p.finally(fn)                    runs either way, passes the result on
 *
 * Handlers ALWAYS run asynchronously, as microtasks — even on a promise
 * that is already resolved.
 *
 * Wrap a callback API in a promise ONCE, at the boundary, and use promises
 * everywhere inside. That is the real job of `new Promise`.
 * ==========================================================================*/

section('Exercise 1 — make a resolved promise');
/* resolved(value) returns a promise that fulfils with that value.
 * Use Promise.resolve.                                           */
function resolved(value) {
  // your code here
}
check('it is a promise', () => resolved(1) instanceof Promise, true, resolved);
checkAsync('it fulfils', async () => await resolved(42), 42, resolved);

section('Exercise 2 — make a rejected promise');
/* rejected(message) returns a promise rejecting with new Error(message).  */
function rejected(message) {
  // your code here
}
checkAsync('it rejects', async () => {
  try { await rejected('nope'); return 'no error'; } catch (e) { return e.message; }
}, 'nope', rejected);

section('Exercise 3 — new Promise');
/* wait(ms, value) resolves with `value` after ms milliseconds.   */
function wait(ms, value) {
  // your code here
}
checkAsync('resolves with the value', async () => await wait(10, 'done'), 'done', wait);
checkAsync('really waits', async () => {
  const start = Date.now();
  await wait(30, null);
  return Date.now() - start >= 25;
}, true, wait);

section('Exercise 4 — the executor runs immediately');
/* eagerExecutor(out) creates a promise whose executor pushes 'executor'
 * into out, attaches a .then pushing 'then', and pushes 'after' before
 * returning out.
 * The executor has ALREADY run; the then has not.
 * -> ['executor', 'after']                                       */
function eagerExecutor(out) {
  // your code here
}
check('executor is synchronous', () => { const out = []; eagerExecutor(out); return out; },
  ['executor', 'after'], eagerExecutor);
checkAsync('the handler runs later', async () => {
  const out = [];
  eagerExecutor(out);
  await sleep(20);
  return out;
}, ['executor', 'after', 'then'], eagerExecutor);

section('Exercise 5 — promisify a callback function');
/* Turn the error-first `readValue` below into a promise-returning
 * function. This is the boundary-wrapping job.                   */
function readValue(key, callback) {
  setTimeout(() => {
    if (key === 'missing') callback(new Error('not found'));
    else callback(null, `value of ${key}`);
  }, 5);
}
function readValueAsync(key) {
  // your code here
}
checkAsync('resolves', async () => await readValueAsync('a'), 'value of a', readValueAsync);
checkAsync('rejects', async () => {
  try { await readValueAsync('missing'); return 'no error'; } catch (e) { return e.message; }
}, 'not found', readValueAsync);

section('Exercise 6 — a generic promisify');
/* promisify(fn) works for ANY error-first function of one argument.  */
function promisify(fn) {
  // your code here
}
checkAsync('generic success', async () => await promisify(readValue)('b'), 'value of b', promisify);
checkAsync('generic failure', async () => {
  try { await promisify(readValue)('missing'); return 'no error'; } catch (e) { return e.message; }
}, 'not found', promisify);

section('Exercise 7 — then, catch, finally');
/* Run a promise and record which handlers fired.
 * trace(promise) returns a promise for an array of strings:
 *   a fulfilled promise -> ['then', 'finally']
 *   a rejected promise  -> ['catch', 'finally']                  */
function trace(promise) {
  // your code here
}
checkAsync('fulfilled path', async () => await trace(Promise.resolve(1)), ['then', 'finally'], trace);
checkAsync('rejected path', async () => await trace(Promise.reject(new Error('x'))), ['catch', 'finally'], trace);

section('Exercise 8 — a promise settles only once');
/* onlyOnce() creates a promise whose executor calls resolve('first'),
 * then resolve('second'), then reject(new Error('third')).
 * Everything after the first call is ignored.                    */
function onlyOnce() {
  // your code here
}
checkAsync('the first call wins', async () => await onlyOnce(), 'first', onlyOnce);
checkAsync('and it does not reject', async () => {
  try { await onlyOnce(); return 'fulfilled'; } catch { return 'rejected'; }
}, 'fulfilled', onlyOnce);

section('Exercise 9 — attaching handlers late');
/* A settled promise still delivers to handlers attached afterwards.
 * lateHandler() resolves a promise, waits 20ms, THEN attaches .then, and
 * resolves with that value.                                      */
function lateHandler() {
  // your code here
}
checkAsync('still delivered', async () => await lateHandler(), 'value', lateHandler);

section('Exercise 10 — a timeout wrapper');
/* withTimeout(promise, ms) resolves with the promise's value, or rejects
 * with new Error('timeout') if ms passes first.
 * Hint: Promise.race against a promise that rejects on a timer.  */
function withTimeout(promise, ms) {
  // your code here
}
checkAsync('fast enough', async () => await withTimeout(wait(5, 'ok'), 50), 'ok', withTimeout);
checkAsync('too slow', async () => {
  try { await withTimeout(wait(60, 'ok'), 20); return 'no error'; } catch (e) { return e.message; }
}, 'timeout', withTimeout);

section('PREDICTIONS');

// P1: what does a .then handler return?
let p1 = null;
check('P1  typeof Promise.resolve(1).then(v => v)', p1, typeof Promise.resolve(1).then((v) => v));

// P2: is a promise handler ever synchronous?
const order2 = [];
Promise.resolve().then(() => order2.push('then'));
order2.push('sync');
let p2 = null;
checkAsync('P2  order for an ALREADY resolved promise',
  async () => { await sleep(20); return p2; }, order2);

// P3: what does awaiting a plain, non-promise value do?
let p3 = null;
checkAsync('P3  the result of `await 42`', async () => p3, 42);

// P4: a promise that never settles
let p4 = null;      // guess: 'hangs forever' or 'resolves to undefined'
check('P4  new Promise(() => {}) awaited', p4, 'hangs forever');

// P5: does `new Promise` need an explicit return?
function p5f() { return new Promise((resolve) => { resolve(1); return 'ignored'; }); }
let p5 = null;
checkAsync('P5  the value p5f() resolves to', async () => p5, await_p5f_value());
async function await_p5f_value() { return p5f(); }
log('note P5', 'the executor return value is discarded — only resolve/reject matter');

report();
