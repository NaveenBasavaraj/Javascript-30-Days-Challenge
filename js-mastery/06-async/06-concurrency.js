'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 06 — RUNNING THINGS AT THE SAME TIME
 *
 * The single biggest performance win in async JavaScript: stop awaiting
 * things that do not depend on each other.
 *
 *   SEQUENTIAL (slow)          PARALLEL (fast)
 *   const a = await getA();    const [a, b] = await Promise.all([getA(), getB()]);
 *   const b = await getB();
 *
 * The trick: calling an async function STARTS it. Awaiting only decides
 * when you collect the result. Start everything, then await.
 *
 * THE FOUR COMBINATORS
 *   Promise.all(ps)         all values, in order. Rejects the moment ANY
 *                           one rejects — the rest keep running but their
 *                           results are lost.
 *   Promise.allSettled(ps)  never rejects. Gives
 *                           { status: 'fulfilled', value } or
 *                           { status: 'rejected', reason } for each.
 *   Promise.race(ps)        the first to SETTLE, fulfilled or rejected.
 *   Promise.any(ps)         the first to FULFIL. Rejects with an
 *                           AggregateError only if they all fail.
 *
 * Pick: all = "I need everything"; allSettled = "report on each";
 * race = "whichever is first, including failure"; any = "any success".
 * ==========================================================================*/

function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
function failAfter(ms, message) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

section('Exercise 1 — Promise.all');
/* bothValues() runs wait(30,'a') and wait(30,'b') at the same time and
 * returns ['a','b'] in about 30ms, not 60.                       */
async function bothValues() {
  // your code here
}
checkAsync('values in order', async () => await bothValues(), ['a', 'b'], bothValues);
checkAsync('and it is parallel', async () => {
  const start = Date.now();
  await bothValues();
  return Date.now() - start < 55;
}, true, bothValues);

section('Exercise 2 — fix the sequential loop');
/* fastTotal(nums) waits 20ms per number but runs them all together,
 * returning the sum. Three numbers must take about 20ms, not 60.  */
async function fastTotal(nums) {
  // your code here
}
checkAsync('correct total', async () => await fastTotal([1, 2, 3]), 6, fastTotal);
checkAsync('and fast', async () => {
  const start = Date.now();
  await fastTotal([1, 2, 3]);
  return Date.now() - start < 50;
}, true, fastTotal);
checkAsync('empty', async () => await fastTotal([]), 0, fastTotal);

section('Exercise 3 — all rejects on the first failure');
/* allOrNothing() runs wait(5,'ok') and failAfter(10,'bad') with
 * Promise.all and returns either the values or `failed: ${message}`.  */
async function allOrNothing() {
  // your code here
}
checkAsync('one failure kills it', async () => await allOrNothing(), 'failed: bad', allOrNothing);

section('Exercise 4 — allSettled');
/* report() runs wait(5,'ok') and failAfter(5,'bad') with allSettled and
 * returns an array of simple strings:
 *   ['ok: ok', 'error: bad']                                     */
async function summarise() {
  // your code here
}
checkAsync('both reported', async () => await summarise(), ['ok: ok', 'error: bad'], summarise);

section('Exercise 5 — race');
/* fastest() races wait(50,'slow') and wait(5,'quick') and returns the
 * winner.                                                        */
async function fastest() {
  // your code here
}
checkAsync('first to settle', async () => await fastest(), 'quick', fastest);

section('Exercise 6 — race includes failures');
/* raceWithFailure() races wait(50,'slow') against failAfter(5,'early').
 * The rejection wins, so return `lost: ${message}`.              */
async function raceWithFailure() {
  // your code here
}
checkAsync('a rejection can win a race', async () => await raceWithFailure(), 'lost: early', raceWithFailure);

section('Exercise 7 — any');
/* firstSuccess() uses Promise.any on failAfter(5,'a'), wait(20,'good')
 * and failAfter(10,'b'), and returns the first SUCCESS.          */
async function firstSuccess() {
  // your code here
}
checkAsync('ignores failures', async () => await firstSuccess(), 'good', firstSuccess);

section('Exercise 8 — any when everything fails');
/* allFail() uses Promise.any on two rejecting promises and returns
 * the string 'all failed' when it rejects.                       */
async function allFail() {
  // your code here
}
checkAsync('AggregateError', async () => await allFail(), 'all failed', allFail);

section('Exercise 9 — start then await');
/* startedTogether() calls both async functions FIRST (storing the
 * promises), then awaits them one at a time. Still parallel.
 * Returns ['a','b'] in about 30ms.                               */
async function startedTogether() {
  // your code here
}
checkAsync('values', async () => await startedTogether(), ['a', 'b'], startedTogether);
checkAsync('still parallel', async () => {
  const start = Date.now();
  await startedTogether();
  return Date.now() - start < 55;
}, true, startedTogether);

section('Exercise 10 — a concurrency limit');
/* Running 1000 requests at once is as bad as running them one at a time.
 * mapLimit(items, limit, fn) runs at most `limit` at once and returns the
 * results in the ORIGINAL order.
 * Each call to fn returns a promise.                             */
async function mapLimit(items, limit, fn) {
  // your code here
}
checkAsync('results in order', async () => await mapLimit([1, 2, 3, 4], 2, async (n) => {
  await sleep(10);
  return n * 2;
}), [2, 4, 6, 8], mapLimit);
checkAsync('never exceeds the limit', async () => {
  let running = 0;
  let peak = 0;
  await mapLimit([1, 2, 3, 4, 5, 6], 2, async () => {
    running++;
    peak = Math.max(peak, running);
    await sleep(10);
    running--;
  });
  return peak;
}, 2, mapLimit);
checkAsync('empty input', async () => await mapLimit([], 2, async (n) => n), [], mapLimit);

section('Exercise 11 — settle everything, then split');
/* partitionResults(promises) uses allSettled and returns
 *   { ok: [values], failed: [messages] }                         */
async function partitionResults(promises) {
  // your code here
}
checkAsync('splits', async () => await partitionResults([
  wait(5, 'one'), failAfter(5, 'bad'), wait(5, 'two'),
]), { ok: ['one', 'two'], failed: ['bad'] }, partitionResults);
checkAsync('all good', async () => await partitionResults([wait(1, 'x')]),
  { ok: ['x'], failed: [] }, partitionResults);

section('PREDICTIONS');

// P1: does calling an async function start it, even unawaited?
const order1 = [];
async function p1f() { order1.push('started'); await sleep(5); order1.push('finished'); }
p1f();
order1.push('after the call');
let p1 = null;
checkAsync('P1  the order', async () => { await sleep(30); return p1; }, order1);

// P2: how long do two parallel 30ms waits take?
let p2 = null;      // guess: 'about 30ms' or 'about 60ms'
check('P2  Promise.all of two 30ms waits takes', p2, 'about 30ms');

// P3: when Promise.all rejects, does the OTHER promise get cancelled?
//     (Promises cannot be cancelled — but guess what happens.)
let stillRan3 = false;
let p3 = null;   // guess true or false
checkAsync('P3  did the slower promise still finish?', async () => {
  try {
    await Promise.all([failAfter(5, 'x'), wait(20, 'y').then(() => { stillRan3 = true; })]);
  } catch { /* expected */ }
  await sleep(40);
  return p3;
}, true);
log('note P3', 'Promise.all stops WAITING, it cannot stop the work — see AbortController in file 09');

// P4: Promise.all with no promises
let p4 = null;
checkAsync('P4  await Promise.all([])', async () => p4, []);

// P5: Promise.all with a non-promise in the list
let p5 = null;
checkAsync('P5  await Promise.all([1, Promise.resolve(2)])', async () => p5, [1, 2]);

// P6: which combinator never rejects?
let p6 = null;
check('P6  the one that never rejects is', p6, 'allSettled');

log('the habit to build', 'if two awaits do not depend on each other, they should be one Promise.all');

report();
