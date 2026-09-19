'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 05 — ASYNC / AWAIT
 *
 * Syntax over promises. Nothing new underneath — but it reads like normal
 * code, and try/catch works again.
 *
 *   async function f() { ... }
 *     • ALWAYS returns a promise, whatever you return inside.
 *     • `return 5` fulfils with 5. `throw e` rejects with e.
 *
 *   await promise
 *     • Pauses THIS function until the promise settles, then hands you the
 *       value. It does NOT block the thread — everything else keeps
 *       running.
 *     • On rejection it THROWS, so try/catch catches it.
 *     • Awaiting a non-promise just wraps it: `await 5` is 5.
 *
 *   await is only allowed inside an async function (or at the top level of
 *   an ES module — not in these CommonJS files).
 *
 * THE BIG PERFORMANCE TRAP: awaiting inside a loop makes everything
 * sequential. If the calls do not depend on each other, start them all
 * first and await the array. Files 06 covers that properly.
 * ==========================================================================*/

function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
function failAfter(ms, message) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

section('Exercise 1 — an async function returns a promise');
/* five() is async and returns the number 5. The CALLER gets a promise.  */
async function five() {
  // your code here
}
check('returns a promise', () => five() instanceof Promise, true, five);
checkAsync('resolving to 5', async () => await five(), 5, five);

section('Exercise 2 — await a promise');
/* getValue() awaits wait(10, 'ready') and returns it.            */
async function getValue() {
  // your code here
}
checkAsync('awaited', async () => await getValue(), 'ready', getValue);

section('Exercise 3 — throw becomes reject');
/* boom() is async and throws new Error('boom').                  */
async function boom() {
  // your code here
}
checkAsync('rejects', async () => {
  try { await boom(); return 'no error'; } catch (e) { return e.message; }
}, 'boom', boom);

section('Exercise 4 — try/catch works again');
/* safeGet(shouldFail) awaits failAfter(5,'nope') when shouldFail, else
 * wait(5,'ok'), and returns either the value or the string
 * `failed: ${message}`.                                          */
async function safeGet(shouldFail) {
  // your code here
}
checkAsync('success', async () => await safeGet(false), 'ok', safeGet);
checkAsync('handled failure', async () => await safeGet(true), 'failed: nope', safeGet);

section('Exercise 5 — try/catch/finally');
/* traced(shouldFail) returns an array of the blocks that ran:
 *   false -> ['try', 'finally']
 *   true  -> ['catch', 'finally']                                */
async function traced(shouldFail) {
  // your code here
}
checkAsync('success path', async () => await traced(false), ['try', 'finally'], traced);
checkAsync('failure path', async () => await traced(true), ['catch', 'finally'], traced);

section('Exercise 6 — sequential awaits');
/* threeSteps() awaits wait(5, ...) three times, building the string
 * 'a-b-c'. Simple and sequential.                                */
async function threeSteps() {
  // your code here
}
checkAsync('builds the string', async () => await threeSteps(), 'a-b-c', threeSteps);

section('Exercise 7 — the sequential trap');
/* slowTotal(nums) awaits inside a for loop — each call waits for the last.
 * Each wait is 20ms, so three items take about 60ms.
 * Write it the SLOW way here on purpose; file 06 fixes it.       */
async function slowTotal(nums) {
  // your code here: for...of, awaiting wait(20, n) each time, summing
}
checkAsync('correct total', async () => await slowTotal([1, 2, 3]), 6, slowTotal);
checkAsync('and it really is slow', async () => {
  const start = Date.now();
  await slowTotal([1, 2, 3]);
  return Date.now() - start >= 55;
}, true, slowTotal);

section('Exercise 8 — await does not block other work');
/* While one async function is awaiting, a timer can still fire.
 * interleave(out) starts an async function that pushes 'start', awaits
 * 30ms, then pushes 'end'; and schedules a 10ms timer pushing 'timer'.
 * Order: ['start', 'timer', 'end']                               */
function interleave(out) {
  // your code here
}
checkAsync('other work continues', async () => {
  const out = [];
  interleave(out);
  await sleep(60);
  return out;
}, ['start', 'timer', 'end'], interleave);

section('Exercise 9 — awaiting a non-promise');
/* plainAwait() awaits the number 7 and returns it.               */
async function plainAwait() {
  // your code here
}
checkAsync('wraps plain values', async () => await plainAwait(), 7, plainAwait);

section('Exercise 10 — async in array callbacks');
/* map does NOT await for you — an async callback gives you an array of
 * PROMISES.
 * brokenMap([1,2]) returns what .map(async ...) produces.
 * fixedMap([1,2]) awaits them all and returns the values.        */
function brokenMap(nums) {
  // your code here: nums.map(async (n) => { await wait(5); return n * 2; })
}
async function fixedMap(nums) {
  // your code here
}
check('map gives promises', () => brokenMap([1, 2])[0] instanceof Promise, true, brokenMap);
checkAsync('awaiting them gives values', async () => await fixedMap([1, 2]), [2, 4], fixedMap);

section('Exercise 11 — an async method');
/* A class with an async method. Loader.load(key) awaits 5ms and returns
 * `loaded ${key}`, and tracks how many loads happened in a public
 * `count` field.                                                 */
class Loader {
  // your code here
}
checkAsync('loads', async () => await new Loader().load('a'), 'loaded a', Loader);
checkAsync('counts', async () => {
  const l = new Loader();
  await l.load('a');
  await l.load('b');
  return l.count;
}, 2, Loader);

section('Exercise 12 — an async IIFE');
/* runNow(out) starts an async arrow immediately that awaits 5ms then
 * pushes 'done'. It returns out straight away (still empty).     */
function runNow(out) {
  // your code here
}
check('returns immediately', () => { const out = []; runNow(out); return out; }, [], runNow);
checkAsync('finishes later', async () => {
  const out = [];
  runNow(out);
  await sleep(30);
  return out;
}, ['done'], runNow);

section('PREDICTIONS');

// P1: what does an async function return?
async function p1f() { return 1; }
let p1 = null;
check('P1  p1f() instanceof Promise', p1, p1f() instanceof Promise);

// P2: does `return await x` differ from `return x`?
let p2 = null;
check('P2  do `return x` and `return await x` resolve to the same value?', p2, true);

// P3: where does execution pause?
const order3 = [];
async function p3f() { order3.push('before await'); await null; order3.push('after await'); }
p3f();
order3.push('after call');
let p3 = null;
checkAsync('P3  the order', async () => { await sleep(20); return p3; }, order3);

// P4: an unawaited async call
let ran4 = false;
async function p4f() { ran4 = true; }
p4f();
let p4 = null;
check('P4  did p4f() run even though nobody awaited it?', p4, ran4);

// P5: awaiting a rejected promise without try/catch
async function p5f() { await Promise.reject(new Error('x')); return 'reached'; }
let p5 = null;
checkAsync('P5  does p5f() reach its return?', async () => p5, 'no');

// P6: top-level await in a CommonJS file
let p6 = null;
check('P6  is top-level await allowed in these .js files?', p6, false);

log('the habit', 'async/await for reading, Promise.all for speed — file 06 next');

report();
