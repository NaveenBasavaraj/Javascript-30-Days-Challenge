'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 07 — ERRORS IN ASYNC CODE
 *
 * Every async error is a rejected promise. Everything here follows from
 * that one fact.
 *
 * THE RULES
 *   • `throw` inside an async function -> that function's promise rejects.
 *   • `await` on a rejected promise -> throws, so try/catch works.
 *   • A rejection nobody handles becomes an UNHANDLED REJECTION. In modern
 *     Node that CRASHES the process.
 *   • try/catch around a call you did NOT await catches nothing — the
 *     function returns a promise immediately and the try block ends.
 *   • .catch() and try/catch are the same tool in different clothes.
 *
 * THE SUBTLE ONE — "fire and forget" is a landmine:
 *     doWork();            // no await, no .catch  ->  crash on failure
 *     void doWork().catch(log);   // deliberate, and safe
 *
 * FINALLY always runs — use it for cleanup you cannot skip.
 *
 * WRAPPING: catch a low-level error and rethrow a meaningful one, keeping
 * the original in `cause` (topic 05, file 11).
 * ==========================================================================*/

function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
function failAfter(ms, message) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

section('Exercise 1 — catching an awaited rejection');
/* attempt() awaits failAfter(5,'nope') inside try/catch and returns the
 * message.                                                       */
async function attempt() {
  // your code here
}
checkAsync('caught', async () => await attempt(), 'nope', attempt);

section('Exercise 2 — try without await catches nothing');
/* missedCatch() calls failAfter WITHOUT awaiting it, inside a try/catch,
 * and returns 'nothing caught'. Attach a .catch to the stray promise so
 * the process does not crash.                                    */
async function missedCatch() {
  // your code here
}
checkAsync('the catch never fires', async () => await missedCatch(), 'nothing caught', missedCatch);
log('the rule', 'no await means no catch — the try block is already over');

section('Exercise 3 — finally always runs');
/* cleanup(shouldFail) returns an array of what happened:
 *   false -> ['work', 'cleanup']
 *   true  -> ['error', 'cleanup']                                */
async function cleanup(shouldFail) {
  // your code here
}
checkAsync('success', async () => await cleanup(false), ['work', 'cleanup'], cleanup);
checkAsync('failure', async () => await cleanup(true), ['error', 'cleanup'], cleanup);

section('Exercise 4 — rethrowing');
/* loadUser(id) awaits failAfter(5, 'connection lost') and rethrows
 * new Error('could not load user', { cause: original }).         */
async function loadUser(id) {
  // your code here
}
checkAsync('the new message', async () => {
  try { await loadUser('u1'); return 'no error'; } catch (e) { return e.message; }
}, 'could not load user', loadUser);
checkAsync('the cause survives', async () => {
  try { await loadUser('u1'); return 'no error'; } catch (e) { return e.cause.message; }
}, 'connection lost', loadUser);

section('Exercise 5 — a safe wrapper');
/* safe(promise) never rejects. It resolves to
 *   { ok: true, value } or { ok: false, error: message }         */
async function safe(promise) {
  // your code here
}
checkAsync('success', async () => await safe(wait(5, 'v')), { ok: true, value: 'v' }, safe);
checkAsync('failure', async () => await safe(failAfter(5, 'bad')), { ok: false, error: 'bad' }, safe);

section('Exercise 6 — a default on failure');
/* withDefault(promise, fallback) resolves with the value, or the fallback
 * if it rejects. One line with .catch.                           */
function withDefault(promise, fallback) {
  // your code here
}
checkAsync('value', async () => await withDefault(wait(5, 'v'), 'x'), 'v', withDefault);
checkAsync('fallback', async () => await withDefault(failAfter(5, 'bad'), 'x'), 'x', withDefault);

section('Exercise 7 — errors inside Promise.all');
/* collectErrors(promises) uses allSettled and returns an array of the
 * rejection MESSAGES only, in order.                             */
async function collectErrors(promises) {
  // your code here
}
checkAsync('messages', async () => await collectErrors([
  wait(5, 'ok'), failAfter(5, 'first'), failAfter(5, 'second'),
]), ['first', 'second'], collectErrors);
checkAsync('none', async () => await collectErrors([wait(1, 'a')]), [], collectErrors);

section('Exercise 8 — retry');
/* retry(fn, attempts) calls fn() and retries on rejection, up to
 * `attempts` times in total. Resolves with the first success, or rejects
 * with the LAST error.                                           */
async function retry(fn, attempts) {
  // your code here
}
checkAsync('succeeds on the third try', async () => {
  let tries = 0;
  const flaky = async () => {
    tries++;
    if (tries < 3) throw new Error('flaky');
    return 'worked';
  };
  const value = await retry(flaky, 5);
  return [value, tries];
}, ['worked', 3], retry);
checkAsync('gives up with the last error', async () => {
  let tries = 0;
  const always = async () => { tries++; throw new Error(`fail ${tries}`); };
  try { await retry(always, 3); return 'no error'; } catch (e) { return [e.message, tries]; }
}, ['fail 3', 3], retry);
checkAsync('succeeds first time', async () => {
  let tries = 0;
  await retry(async () => { tries++; return 'ok'; }, 3);
  return tries;
}, 1, retry);

section('Exercise 9 — retry with backoff');
/* retryWithBackoff(fn, attempts, baseMs) waits baseMs, then baseMs * 2,
 * then baseMs * 4 between tries. Record the gaps to prove it.    */
async function retryWithBackoff(fn, attempts, baseMs) {
  // your code here
}
checkAsync('waits longer each time', async () => {
  const times = [];
  let last = Date.now();
  const failing = async () => {
    times.push(Date.now() - last);
    last = Date.now();
    throw new Error('x');
  };
  try { await retryWithBackoff(failing, 3, 20); } catch { /* expected */ }
  // first call is immediate, then ~20ms, then ~40ms
  return [times.length, times[1] >= 15, times[2] >= 35];
}, [3, true, true], retryWithBackoff);

section('Exercise 10 — a timeout that rejects');
/* timeout(promise, ms) rejects with new Error('timed out') when the
 * promise is too slow. Clear the timer when it wins, so the process can
 * exit promptly.                                                 */
function timeout(promise, ms) {
  // your code here
}
checkAsync('in time', async () => await timeout(wait(5, 'ok'), 50), 'ok', timeout);
checkAsync('too slow', async () => {
  try { await timeout(wait(60, 'ok'), 20); return 'no error'; } catch (e) { return e.message; }
}, 'timed out', timeout);
checkAsync('the original rejection passes through', async () => {
  try { await timeout(failAfter(5, 'inner'), 50); return 'no error'; } catch (e) { return e.message; }
}, 'inner', timeout);

section('Exercise 11 — fire and forget, safely');
/* fireAndForget(fn, log) calls the async fn without awaiting, but
 * attaches a .catch pushing `caught: ${message}` into log.
 * It returns immediately.                                        */
function fireAndForget(fn, log) {
  // your code here
}
check('returns at once', () => {
  const log = [];
  fireAndForget(async () => { throw new Error('x'); }, log);
  return log;
}, [], fireAndForget);
checkAsync('the rejection is handled', async () => {
  const log = [];
  fireAndForget(async () => { throw new Error('later'); }, log);
  await sleep(20);
  return log;
}, ['caught: later'], fireAndForget);

section('PREDICTIONS');

// P1: does a throw in an async function become a rejection?
async function p1f() { throw new Error('x'); }
let p1 = null;
checkAsync('P1  does p1f() throw synchronously or reject?', async () => p1, 'reject');

// P2: try/catch around an unawaited call
let p2 = null;
checkAsync('P2  does try/catch catch an unawaited rejection?', async () => p2, false);

// P3: what happens to a rejection nobody handles, in modern Node?
let p3 = null;
check('P3  an unhandled rejection in Node 20', p3, 'crashes the process');

// P4: does finally change the resolved value?
let p4 = null;
checkAsync('P4  Promise.resolve(1).finally(() => 99) resolves to',
  async () => p4, finallyValue());
async function finallyValue() { return Promise.resolve(1).finally(() => 99); }

// P5: does a .catch that returns a value heal the chain?
let p5 = null;
checkAsync('P5  Promise.reject(new Error()).catch(() => "fixed") resolves to',
  async () => p5, healed());
async function healed() { return Promise.reject(new Error('x')).catch(() => 'fixed'); }

report();
