'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 12 — CHALLENGES, LEVEL 2 (final boss)
 *
 * Rebuild the promise machinery, then build the infrastructure that sits
 * on top of it.
 * ==========================================================================*/

function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
function failAfter(ms, message) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

section('1 — implement Promise.all yourself');
/* myAll(promises) resolves with the values IN ORDER, or rejects with the
 * first rejection. Do not call Promise.all.
 * Count settled promises yourself — do not rely on array length.  */
function myAll(promises) {
  // your code here
}
checkAsync('in order despite timing', async () => await myAll([wait(30, 'a'), wait(5, 'b')]), ['a', 'b'], myAll);
checkAsync('empty resolves immediately', async () => await myAll([]), [], myAll);
checkAsync('non-promises are allowed', async () => await myAll([1, Promise.resolve(2)]), [1, 2], myAll);
checkAsync('first rejection wins', async () => {
  try { await myAll([wait(30, 'a'), failAfter(5, 'bad')]); return 'no error'; } catch (e) { return e.message; }
}, 'bad', myAll);
checkAsync('parallel, not sequential', async () => {
  const start = Date.now();
  await myAll([wait(30, 1), wait(30, 2), wait(30, 3)]);
  return Date.now() - start < 60;
}, true, myAll);

section('2 — implement Promise.allSettled yourself');
function myAllSettled(promises) {
  // your code here
}
checkAsync('both shapes', async () => await myAllSettled([wait(5, 'v'), failAfter(5, 'bad')]), [
  { status: 'fulfilled', value: 'v' },
  { status: 'rejected', reason: 'bad' },   // store the MESSAGE, not the Error
], myAllSettled);
checkAsync('never rejects', async () => {
  const r = await myAllSettled([failAfter(1, 'x')]);
  return r[0].status;
}, 'rejected', myAllSettled);

section('3 — implement Promise.race yourself');
function myRace(promises) {
  // your code here
}
checkAsync('fastest wins', async () => await myRace([wait(40, 'slow'), wait(5, 'fast')]), 'fast', myRace);
checkAsync('a rejection can win', async () => {
  try { await myRace([wait(40, 'slow'), failAfter(5, 'early')]); return 'no error'; } catch (e) { return e.message; }
}, 'early', myRace);

section('4 — a tiny promise from scratch');
/* Thenable(executor) is a minimal promise: state, value, and a then()
 * that works whether the handler is attached before OR after it settles.
 * Only the fulfilled path is required, and then() need not return a new
 * Thenable — just call the handler.                              */
class Thenable {
  // your code here
}
checkAsync('handler attached before settling', async () => new Promise((resolve) => {
  const t = new Thenable((res) => setTimeout(() => res('value'), 10));
  t.then(resolve);
}), 'value', Thenable);
checkAsync('handler attached after settling', async () => new Promise((resolve) => {
  const t = new Thenable((res) => res('immediate'));
  setTimeout(() => t.then(resolve), 10);
}), 'immediate', Thenable);
checkAsync('several handlers all fire', async () => {
  const seen = [];
  const t = new Thenable((res) => setTimeout(() => res('v'), 5));
  t.then((v) => seen.push(`a:${v}`));
  t.then((v) => seen.push(`b:${v}`));
  await sleep(30);
  return seen;
}, ['a:v', 'b:v'], Thenable);

section('5 — an async pipeline with middleware');
/* Each middleware is async (context, next) => { ... }.
 * runPipeline(middlewares, context) awaits them in order; code after
 * `await next()` runs on the way back out.                       */
async function runPipeline(middlewares, context) {
  // your code here
}
checkAsync('onion order', async () => {
  const ctx = { log: [] };
  await runPipeline([
    async (c, next) => { c.log.push('a in'); await next(); c.log.push('a out'); },
    async (c, next) => { c.log.push('b in'); await sleep(5); await next(); c.log.push('b out'); },
  ], ctx);
  return ctx.log;
}, ['a in', 'b in', 'b out', 'a out'], runPipeline);
checkAsync('a middleware can stop the chain', async () => {
  const ctx = { log: [] };
  await runPipeline([
    async (c) => { c.log.push('stop'); },
    async (c) => { c.log.push('never'); },
  ], ctx);
  return ctx.log;
}, ['stop'], runPipeline);
checkAsync('errors propagate out', async () => {
  try {
    await runPipeline([async () => { throw new Error('inner'); }], {});
    return 'no error';
  } catch (e) { return e.message; }
}, 'inner', runPipeline);

section('6 — a rate limiter');
/* makeRateLimiter(max, windowMs) returns { run } allowing at most `max`
 * calls to START inside any window. Calls beyond that WAIT.
 * Keep it simple: a fixed window that resets windowMs after the first
 * call in it.                                                    */
function makeRateLimiter(max, windowMs) {
  // your code here
}
checkAsync('the third call waits for the window', async () => {
  const limiter = makeRateLimiter(2, 40);
  const start = Date.now();
  const times = [];
  await Promise.all([1, 2, 3].map(() => limiter.run(async () => { times.push(Date.now() - start); })));
  return [times.length, times[0] < 20, times[1] < 20, times[2] >= 35];
}, [3, true, true, true], makeRateLimiter);

section('7 — an event stream to async iterable');
/* makeChannel() returns { push, close, stream } where stream is an async
 * iterable yielding everything pushed, in order, and finishing on close.
 * Values pushed BEFORE anyone iterates must not be lost.         */
function makeChannel() {
  // your code here
}
checkAsync('buffers then streams', async () => {
  const ch = makeChannel();
  ch.push('a');
  ch.push('b');
  ch.close();
  const out = [];
  for await (const v of ch.stream) out.push(v);
  return out;
}, ['a', 'b'], makeChannel);
checkAsync('values pushed later still arrive', async () => {
  const ch = makeChannel();
  setTimeout(() => { ch.push('x'); ch.push('y'); ch.close(); }, 10);
  const out = [];
  for await (const v of ch.stream) out.push(v);
  return out;
}, ['x', 'y'], makeChannel);

section('8 — a cache with expiry');
/* makeCache(ttlMs) with an async get(key, loader):
 *   a fresh value is returned without calling loader again
 *   an expired value causes a reload
 *   concurrent misses for the same key share ONE loader call    */
function makeCache(ttlMs) {
  // your code here
}
checkAsync('caches within the ttl', async () => {
  let calls = 0;
  const cache = makeCache(60);
  const load = async () => { calls++; await sleep(5); return 'v'; };
  await cache.get('k', load);
  await cache.get('k', load);
  return calls;
}, 1, makeCache);
checkAsync('reloads after expiry', async () => {
  let calls = 0;
  const cache = makeCache(20);
  const load = async () => { calls++; return 'v'; };
  await cache.get('k', load);
  await sleep(40);
  await cache.get('k', load);
  return calls;
}, 2, makeCache);
checkAsync('concurrent misses share one load', async () => {
  let calls = 0;
  const cache = makeCache(100);
  const load = async () => { calls++; await sleep(20); return 'v'; };
  await Promise.all([cache.get('k', load), cache.get('k', load), cache.get('k', load)]);
  return calls;
}, 1, makeCache);

section('9 — a retrying, timing-out, abortable request');
/* robustCall(fn, { attempts, timeoutMs }) calls fn(signal).
 * Each attempt gets its own timeout and its own AbortController.
 * Resolve on the first success; reject with the last error otherwise.  */
async function robustCall(fn, { attempts = 3, timeoutMs = 50 } = {}) {
  // your code here
}
checkAsync('succeeds after two timeouts', async () => {
  let tries = 0;
  const flaky = (signal) => new Promise((resolve, reject) => {
    tries++;
    const slow = tries < 3;
    const t = setTimeout(() => resolve('ok'), slow ? 200 : 2);
    signal.addEventListener('abort', () => { clearTimeout(t); reject(new Error('timeout')); });
  });
  const value = await robustCall(flaky, { attempts: 3, timeoutMs: 20 });
  return [value, tries];
}, ['ok', 3], robustCall);
checkAsync('gives up', async () => {
  const always = async () => { throw new Error('nope'); };
  try { await robustCall(always, { attempts: 2, timeoutMs: 20 }); return 'no error'; } catch (e) { return e.message; }
}, 'nope', robustCall);

section('10 — a dependency-ordered task runner');
/* Tasks declare which other tasks they need. Run each exactly once, as
 * early as possible, in parallel where dependencies allow.
 * runTasks({ a: { deps: [], run }, b: { deps: ['a'], run } })
 *   resolves to { a: value, b: value }                           */
async function runTasks(tasks) {
  // your code here
}
checkAsync('respects dependencies', async () => {
  const order = [];
  const make = (name, ms) => async () => { await sleep(ms); order.push(name); return name.toUpperCase(); };
  const result = await runTasks({
    a: { deps: [], run: make('a', 20) },
    b: { deps: ['a'], run: make('b', 5) },
    c: { deps: [], run: make('c', 5) },
  });
  return [result, order];
}, [{ a: 'A', b: 'B', c: 'C' }, ['c', 'a', 'b']], runTasks);
checkAsync('a task runs exactly once', async () => {
  let calls = 0;
  await runTasks({
    shared: { deps: [], run: async () => { calls++; return 1; } },
    x: { deps: ['shared'], run: async () => 2 },
    y: { deps: ['shared'], run: async () => 3 },
  });
  return calls;
}, 1, runTasks);

log('finished?', 'that is async — the topic that changes how you write everything else');
report();
