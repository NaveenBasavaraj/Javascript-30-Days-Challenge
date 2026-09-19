'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 11 — CHALLENGES, LEVEL 1
 *
 * Files 01-10 combined. Nothing new.
 * ==========================================================================*/

function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
function failAfter(ms, message) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

section('1 — delay');
/* delay(ms) resolves after ms with no value.                     */
function delay(ms) {
  // your code here
}
checkAsync('waits', async () => {
  const start = Date.now();
  await delay(30);
  return Date.now() - start >= 25;
}, true, delay);

section('2 — sleepSort');
/* Resolve each number after (n * 5)ms so they arrive in sorted order.
 * sleepSort([3, 1, 2]) -> [1, 2, 3]
 * Silly, but it proves you understand scheduling.                */
async function sleepSort(nums) {
  // your code here
}
checkAsync('sorted by arrival', async () => await sleepSort([3, 1, 2]), [1, 2, 3], sleepSort);
checkAsync('empty', async () => await sleepSort([]), [], sleepSort);

section('3 — asyncMap');
/* Apply an async function to every item, in PARALLEL, keeping order.  */
async function asyncMap(items, fn) {
  // your code here
}
checkAsync('maps', async () => await asyncMap([1, 2, 3], async (n) => { await sleep(5); return n * 2; }),
  [2, 4, 6], asyncMap);
checkAsync('parallel', async () => {
  const start = Date.now();
  await asyncMap([1, 2, 3], async () => sleep(20));
  return Date.now() - start < 50;
}, true, asyncMap);

section('4 — asyncFilter');
/* Keep items whose async predicate resolves truthy, preserving order.  */
async function asyncFilter(items, predicate) {
  // your code here
}
checkAsync('filters', async () => await asyncFilter([1, 2, 3, 4], async (n) => {
  await sleep(2);
  return n % 2 === 0;
}), [2, 4], asyncFilter);

section('5 — asyncFind');
/* Return the first item whose async predicate is truthy, or null.
 * It may check them in parallel, but must return the FIRST match by
 * position, not by speed.                                        */
async function asyncFind(items, predicate) {
  // your code here
}
checkAsync('finds', async () => await asyncFind([1, 2, 3, 4], async (n) => n > 2), 3, asyncFind);
checkAsync('position wins over speed', async () => await asyncFind([1, 2, 3], async (n) => {
  await sleep(n === 3 ? 1 : 20);
  return n >= 2;
}), 2, asyncFind);
checkAsync('none', async () => await asyncFind([1], async () => false), null, asyncFind);

section('6 — asyncReduce');
/* Reduce with an async reducer, strictly in order.               */
async function asyncReduce(items, reducer, start) {
  // your code here
}
checkAsync('sums', async () => await asyncReduce([1, 2, 3], async (acc, n) => {
  await sleep(2);
  return acc + n;
}, 0), 6, asyncReduce);
checkAsync('in order', async () => await asyncReduce(['a', 'b'], async (acc, s) => acc + s, ''), 'ab', asyncReduce);

section('7 — waterfall');
/* Run async functions in sequence, feeding each result to the next.  */
async function waterfall(fns, start) {
  // your code here
}
checkAsync('chains', async () => await waterfall([
  async (n) => n + 1,
  async (n) => n * 2,
  async (n) => `= ${n}`,
], 4), '= 10', waterfall);
checkAsync('empty', async () => await waterfall([], 'x'), 'x', waterfall);

section('8 — timeoutAfter');
/* Reject with 'timeout' if the promise is too slow, otherwise pass the
 * value through.                                                 */
function timeoutAfter(promise, ms) {
  // your code here
}
checkAsync('in time', async () => await timeoutAfter(wait(5, 'v'), 40), 'v', timeoutAfter);
checkAsync('too slow', async () => {
  try { await timeoutAfter(wait(60, 'v'), 20); return 'no error'; } catch (e) { return e.message; }
}, 'timeout', timeoutAfter);

section('9 — allWithProgress');
/* Run promises in parallel and call onProgress(done, total) after each
 * one settles. Resolve with the values in order.                 */
async function allWithProgress(promises, onProgress) {
  // your code here
}
checkAsync('reports progress', async () => {
  const calls = [];
  const values = await allWithProgress(
    [wait(20, 'a'), wait(5, 'b'), wait(10, 'c')],
    (done, total) => calls.push(`${done}/${total}`),
  );
  return [values, calls];
}, [['a', 'b', 'c'], ['1/3', '2/3', '3/3']], allWithProgress);

section('10 — chunkedProcess');
/* Process items in batches of `size`: each batch runs in parallel, but
 * the batches run one after another. Return all results in order.  */
async function chunkedProcess(items, size, fn) {
  // your code here
}
checkAsync('results in order', async () => await chunkedProcess([1, 2, 3, 4, 5], 2, async (n) => {
  await sleep(5);
  return n * 10;
}), [10, 20, 30, 40, 50], chunkedProcess);
checkAsync('batches are sequential', async () => {
  const order = [];
  await chunkedProcess([1, 2, 3, 4], 2, async (n) => {
    order.push(`start ${n}`);
    await sleep(10);
    order.push(`end ${n}`);
  });
  return order;
}, ['start 1', 'start 2', 'end 1', 'end 2', 'start 3', 'start 4', 'end 3', 'end 4'], chunkedProcess);

section('11 — firstSuccessful');
/* Try each async function in TURN until one succeeds. Resolve with its
 * value, or reject with new Error('all failed').                 */
async function firstSuccessful(fns) {
  // your code here
}
checkAsync('second works', async () => await firstSuccessful([
  async () => { throw new Error('a'); },
  async () => 'worked',
  async () => 'never reached',
]), 'worked', firstSuccessful);
checkAsync('all fail', async () => {
  try { await firstSuccessful([async () => { throw new Error('x'); }]); return 'no error'; } catch (e) { return e.message; }
}, 'all failed', firstSuccessful);
checkAsync('stops at the first success', async () => {
  let calls = 0;
  await firstSuccessful([async () => { calls++; return 'ok'; }, async () => { calls++; return 'ok'; }]);
  return calls;
}, 1, firstSuccessful);

section('12 — settleWithTimeout');
/* Wait up to ms for the promise. Resolve { status: 'ok', value },
 * { status: 'error', error: message } or { status: 'timeout' }.
 * It must never reject.                                          */
async function settleWithTimeout(promise, ms) {
  // your code here
}
checkAsync('ok', async () => await settleWithTimeout(wait(5, 'v'), 40), { status: 'ok', value: 'v' }, settleWithTimeout);
checkAsync('error', async () => await settleWithTimeout(failAfter(5, 'bad'), 40),
  { status: 'error', error: 'bad' }, settleWithTimeout);
checkAsync('timeout', async () => await settleWithTimeout(wait(60, 'v'), 20), { status: 'timeout' }, settleWithTimeout);

report();
