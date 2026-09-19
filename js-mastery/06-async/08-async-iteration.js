'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 08 — ASYNC ITERATION & GENERATORS
 *
 * Sometimes the values arrive one at a time over a period: rows from a
 * database, lines from a file, pages from an API, messages from a socket.
 * Promise.all cannot help — you do not have them all yet.
 *
 *   for await (const item of source) { ... }
 *     Awaits each value in turn. Works on an async iterable, and also on
 *     a plain array of promises.
 *
 *   async function* gen() { yield await something(); }
 *     An ASYNC GENERATOR. Each `yield` hands out one value; the consumer
 *     pauses the generator until it asks for the next.
 *
 *   The protocol: [Symbol.asyncIterator]() returns an object with a
 *   next() returning a PROMISE of { value, done }.
 *
 * WHY IT MATTERS: memory. Loading a million rows with Promise.all holds a
 * million objects at once. Streaming them handles one at a time.
 *
 * `break` out of a for await loop and the generator's finally block runs,
 * so cleanup still happens.
 * ==========================================================================*/

function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

section('Exercise 1 — for await over an array of promises');
/* collect(promises) awaits each in turn and returns the values.  */
async function collect(promises) {
  // your code here
}
checkAsync('values', async () => await collect([wait(5, 'a'), wait(5, 'b')]), ['a', 'b'], collect);
checkAsync('empty', async () => await collect([]), [], collect);

section('Exercise 2 — your first async generator');
/* countTo(n) yields 1..n, waiting 5ms before each.               */
async function* countTo(n) {
  // your code here
}
checkAsync('yields in order', async () => {
  const out = [];
  for await (const v of countTo(3)) out.push(v);
  return out;
}, [1, 2, 3], countTo);
checkAsync('zero yields nothing', async () => {
  const out = [];
  for await (const v of countTo(0)) out.push(v);
  return out;
}, [], countTo);

section('Exercise 3 — values arrive over time');
/* Prove it streams rather than batching: record the gap between the
 * first and last value of countTo(3). Each step waits 5ms, so the whole
 * loop takes at least 15ms.                                      */
checkAsync('really streams', async () => {
  const start = Date.now();
  const out = [];
  for await (const v of countTo(3)) out.push(v);
  return [out.length, Date.now() - start >= 12];
}, [3, true], countTo);

section('Exercise 4 — a paged API');
/* fetchPage(n) is provided: pages 1 and 2 have items, page 3 is empty.
 * allItems() keeps fetching pages until an empty one and returns every
 * item in one flat array.                                        */
function fetchPage(n) {
  const pages = { 1: ['a', 'b'], 2: ['c'], 3: [] };
  return wait(5, pages[n] ?? []);
}
async function allItems() {
  // your code here
}
checkAsync('all pages', async () => await allItems(), ['a', 'b', 'c'], allItems);

section('Exercise 5 — the same thing as a generator');
/* streamItems() is an async generator yielding each ITEM one at a time,
 * fetching pages as needed. The consumer never sees pages at all.  */
async function* streamItems() {
  // your code here
}
checkAsync('streamed', async () => {
  const out = [];
  for await (const item of streamItems()) out.push(item);
  return out;
}, ['a', 'b', 'c'], streamItems);

section('Exercise 6 — stopping early');
/* takeAsync(source, n) returns the first n values from an async iterable
 * and stops asking for more.                                     */
async function takeAsync(source, n) {
  // your code here
}
checkAsync('takes two', async () => await takeAsync(countTo(10), 2), [1, 2], takeAsync);
checkAsync('take zero', async () => await takeAsync(countTo(10), 0), [], takeAsync);
checkAsync('and it really stops early', async () => {
  const start = Date.now();
  await takeAsync(countTo(100), 2);
  return Date.now() - start < 100;
}, true, takeAsync);

section('Exercise 7 — cleanup on break');
/* withCleanup(log) is an async generator yielding 1, 2, 3 with a
 * try/finally that pushes 'cleaned' into log.
 * Breaking out of the loop early must still run the finally.     */
async function* withCleanup(log) {
  // your code here
}
checkAsync('cleanup runs on break', async () => {
  const log = [];
  for await (const v of withCleanup(log)) {
    if (v === 2) break;
  }
  return log;
}, ['cleaned'], withCleanup);

section('Exercise 8 — mapping an async stream');
/* mapAsync(source, fn) is an async generator yielding fn(value) for each
 * value of the source. fn may itself be async.                   */
async function* mapAsync(source, fn) {
  // your code here
}
checkAsync('maps', async () => {
  const out = [];
  for await (const v of mapAsync(countTo(3), (n) => n * 10)) out.push(v);
  return out;
}, [10, 20, 30], mapAsync);
checkAsync('async mapper', async () => {
  const out = [];
  for await (const v of mapAsync(countTo(2), async (n) => { await sleep(2); return `#${n}`; })) out.push(v);
  return out;
}, ['#1', '#2'], mapAsync);

section('Exercise 9 — filtering an async stream');
async function* filterAsync(source, predicate) {
  // your code here
}
checkAsync('filters', async () => {
  const out = [];
  for await (const v of filterAsync(countTo(5), (n) => n % 2 === 1)) out.push(v);
  return out;
}, [1, 3, 5], filterAsync);

section('Exercise 10 — the raw protocol');
/* Build an async iterable BY HAND — no generator syntax.
 * ticker(n) returns an object with [Symbol.asyncIterator]() whose next()
 * resolves { value, done } counting 1..n.                        */
function ticker(n) {
  // your code here
}
checkAsync('hand-written iterable', async () => {
  const out = [];
  for await (const v of ticker(3)) out.push(v);
  return out;
}, [1, 2, 3], ticker);
checkAsync('empty', async () => {
  const out = [];
  for await (const v of ticker(0)) out.push(v);
  return out;
}, [], ticker);

section('Exercise 11 — batching a stream');
/* batch(source, size) yields ARRAYS of up to `size` values.
 * The final batch may be shorter.                                */
async function* batch(source, size) {
  // your code here
}
checkAsync('batches', async () => {
  const out = [];
  for await (const b of batch(countTo(5), 2)) out.push(b);
  return out;
}, [[1, 2], [3, 4], [5]], batch);

section('PREDICTIONS');

// P1: can for await handle a plain array of promises?
let p1 = null;
checkAsync('P1  does `for await` work on [Promise, Promise]?', async () => p1, true);

// P2: what does an async generator function return when called?
async function* p2g() { yield 1; }
let p2 = null;
check('P2  typeof p2g()', p2, typeof p2g());

// P3: is a normal for...of allowed on an async generator?
let outcome3;
try { for (const v of p2g()) { /* unreachable */ } outcome3 = 'allowed'; } catch (e) { outcome3 = e.constructor.name; }
let p3 = null;
check('P3  a plain for...of over an async generator', p3, outcome3);

// P4: what does next() give you on an async generator?
let p4 = null;
checkAsync('P4  await p2g().next()', async () => p4, await_next());
async function await_next() { return p2g().next(); }

// P5: sequential or parallel?
let p5 = null;
check('P5  `for await` over ten 10ms promises takes about', p5, '10ms');
log('note P5', 'the promises were ALL started when the array was built — awaiting them in turn is cheap');

report();
