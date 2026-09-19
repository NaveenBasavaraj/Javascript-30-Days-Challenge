'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 09 — CANCELLATION & REAL-WORLD PATTERNS
 *
 * A promise CANNOT be cancelled. Once started, the work runs to
 * completion — you can only stop CARING about the result, or ask the
 * underlying operation to stop.
 *
 * ABORTCONTROLLER is the standard way to ask:
 *   const controller = new AbortController();
 *   doWork({ signal: controller.signal });
 *   controller.abort();
 *
 *   signal.aborted            true once aborted
 *   signal.addEventListener('abort', fn)
 *   signal.throwIfAborted()   throws an AbortError
 * fetch, and most modern APIs, accept a signal.
 *
 * THE PATTERNS IN THIS FILE are the ones you will actually reach for:
 * debouncing an async call, polling until a condition, a work queue, a
 * semaphore, deduplicating in-flight requests, and caching a promise.
 * ==========================================================================*/

function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

section('Exercise 1 — an abortable wait');
/* abortableWait(ms, signal) resolves 'done' after ms, but rejects
 * immediately with new Error('aborted') if the signal fires first.
 * Clean up the timer and the listener either way.                */
function abortableWait(ms, signal) {
  // your code here
}
checkAsync('completes normally', async () => {
  const c = new AbortController();
  return await abortableWait(10, c.signal);
}, 'done', abortableWait);
checkAsync('aborts early', async () => {
  const c = new AbortController();
  setTimeout(() => c.abort(), 5);
  try { await abortableWait(60, c.signal); return 'no error'; } catch (e) { return e.message; }
}, 'aborted', abortableWait);
checkAsync('already aborted', async () => {
  const c = new AbortController();
  c.abort();
  try { await abortableWait(10, c.signal); return 'no error'; } catch (e) { return e.message; }
}, 'aborted', abortableWait);

section('Exercise 2 — ignoring a stale result');
/* When a newer request starts, the older one must not overwrite the
 * result. latestOnly() returns a function; each call cancels the previous.
 *   const search = latestOnly();
 *   search(slowPromise); search(fastPromise);
 * Only the LAST call resolves; earlier ones reject with 'superseded'.  */
function latestOnly() {
  // your code here
}
checkAsync('the last call wins', async () => {
  const run = latestOnly();
  const out = [];
  const first = run(wait(40, 'slow')).catch((e) => out.push(e.message));
  const second = run(wait(5, 'fast')).then((v) => out.push(v));
  await Promise.all([first, second]);
  await sleep(60);
  return out;
}, ['fast', 'superseded'], latestOnly);

section('Exercise 3 — polling');
/* pollUntil(check, intervalMs, maxAttempts) calls check() repeatedly
 * until it returns a truthy value, waiting intervalMs between tries.
 * Resolves with the value, or rejects with new Error('gave up').  */
async function pollUntil(checkFn, intervalMs, maxAttempts) {
  // your code here
}
checkAsync('succeeds on the third poll', async () => {
  let n = 0;
  const value = await pollUntil(() => { n++; return n === 3 ? 'ready' : null; }, 5, 10);
  return [value, n];
}, ['ready', 3], pollUntil);
checkAsync('gives up', async () => {
  try { await pollUntil(() => null, 2, 3); return 'no error'; } catch (e) { return e.message; }
}, 'gave up', pollUntil);
checkAsync('succeeds immediately', async () => {
  let n = 0;
  await pollUntil(() => { n++; return 'now'; }, 5, 3);
  return n;
}, 1, pollUntil);

section('Exercise 4 — deduplicating in-flight calls');
/* Ten components ask for the same user at once — make ONE request.
 * dedupe(fn) returns a wrapper: while a call for a given key is still
 * pending, every caller gets the SAME promise. Once it settles, the
 * entry is cleared so a later call starts fresh.                 */
function dedupe(fn) {
  // your code here
}
checkAsync('one call for three requests', async () => {
  let calls = 0;
  const load = dedupe(async (key) => { calls++; await sleep(20); return `data ${key}`; });
  const [a, b, c] = await Promise.all([load('u1'), load('u1'), load('u1')]);
  return [a, b, c, calls];
}, ['data u1', 'data u1', 'data u1', 1], dedupe);
checkAsync('different keys are separate', async () => {
  let calls = 0;
  const load = dedupe(async (key) => { calls++; await sleep(10); return key; });
  await Promise.all([load('a'), load('b')]);
  return calls;
}, 2, dedupe);
checkAsync('a later call runs again', async () => {
  let calls = 0;
  const load = dedupe(async (key) => { calls++; await sleep(5); return key; });
  await load('a');
  await load('a');
  return calls;
}, 2, dedupe);

section('Exercise 5 — a serial queue');
/* Some work must never overlap — writing a file, a payment.
 * makeQueue() returns { add } where add(fn) queues an async function and
 * resolves with its result. Tasks run STRICTLY one at a time, in order. */
function makeQueue() {
  // your code here
}
checkAsync('strictly one at a time', async () => {
  const q = makeQueue();
  const order = [];
  const task = (tag, ms) => async () => {
    order.push(`${tag} start`);
    await sleep(ms);
    order.push(`${tag} end`);
    return tag;
  };
  const results = await Promise.all([q.add(task('a', 20)), q.add(task('b', 5))]);
  return [results, order];
}, [['a', 'b'], ['a start', 'a end', 'b start', 'b end']], makeQueue);
checkAsync('a failing task does not break the queue', async () => {
  const q = makeQueue();
  const failed = await q.add(async () => { throw new Error('x'); }).catch((e) => e.message);
  const after = await q.add(async () => 'still works');
  return [failed, after];
}, ['x', 'still works'], makeQueue);

section('Exercise 6 — a semaphore');
/* Like the queue, but allowing `limit` tasks at once.
 * makeSemaphore(2) returns { run } where run(fn) waits for a free slot. */
function makeSemaphore(limit) {
  // your code here
}
checkAsync('never exceeds the limit', async () => {
  const s = makeSemaphore(2);
  let running = 0;
  let peak = 0;
  const task = async () => {
    running++;
    peak = Math.max(peak, running);
    await sleep(10);
    running--;
    return 'ok';
  };
  const results = await Promise.all([1, 2, 3, 4, 5].map(() => s.run(task)));
  return [peak, results.length];
}, [2, 5], makeSemaphore);

section('Exercise 7 — an async debounce');
/* debounceAsync(fn, ms) delays the call; a new call restarts the timer.
 * Every caller in the burst gets the result of the ONE call that runs.  */
function debounceAsync(fn, ms) {
  // your code here
}
checkAsync('one call, everyone gets the answer', async () => {
  let calls = 0;
  const search = debounceAsync(async (q) => { calls++; return `results for ${q}`; }, 20);
  const promises = [search('a'), search('ab'), search('abc')];
  const values = await Promise.all(promises);
  return [values, calls];
}, [['results for abc', 'results for abc', 'results for abc'], 1], debounceAsync);

section('Exercise 8 — caching a promise, not a value');
/* Cache the PROMISE so concurrent callers share one request, and later
 * callers get the cached value with no await at all.
 * memoizeAsync(fn) keyed by the first argument. A rejection must NOT be
 * cached — the next call should try again.                       */
function memoizeAsync(fn) {
  // your code here
}
checkAsync('caches the value', async () => {
  let calls = 0;
  const load = memoizeAsync(async (k) => { calls++; await sleep(5); return k.toUpperCase(); });
  await load('a');
  const second = await load('a');
  return [second, calls];
}, ['A', 1], memoizeAsync);
checkAsync('failures are not cached', async () => {
  let calls = 0;
  const load = memoizeAsync(async () => {
    calls++;
    if (calls === 1) throw new Error('first fails');
    return 'ok';
  });
  await load('k').catch(() => {});
  const value = await load('k');
  return [value, calls];
}, ['ok', 2], memoizeAsync);

section('Exercise 9 — racing with a signal');
/* runWithTimeout(fn, ms) calls fn(signal) and aborts the signal after ms.
 * fn is expected to honour the signal. Return 'aborted' if it does.  */
async function runWithTimeout(fn, ms) {
  // your code here
}
checkAsync('aborts a slow task', async () => {
  const slow = (signal) => new Promise((resolve, reject) => {
    const t = setTimeout(() => resolve('finished'), 100);
    signal.addEventListener('abort', () => { clearTimeout(t); reject(new Error('aborted')); });
  });
  try { return await runWithTimeout(slow, 20); } catch (e) { return e.message; }
}, 'aborted', runWithTimeout);
checkAsync('a fast task finishes', async () => {
  const fast = () => wait(5, 'finished');
  return await runWithTimeout(fast, 50);
}, 'finished', runWithTimeout);

section('PREDICTIONS');

// P1: can you cancel a promise?
let p1 = null;
check('P1  is there a promise.cancel()?', p1, false);

// P2: does aborting stop work that ignores the signal?
let p2 = null;
check('P2  aborting a promise that ignores the signal', p2, 'the work still finishes');

// P3: what is signal.aborted before any abort?
const c3 = new AbortController();
let p3 = null;
check('P3  new AbortController().signal.aborted', p3, c3.signal.aborted);

// P4: and after?
c3.abort();
let p4 = null;
check('P4  the same signal after abort()', p4, c3.signal.aborted);

// P5: two awaits on the same promise
let calls5 = 0;
const shared = (async () => { calls5++; return 'v'; })();
let p5 = null;
checkAsync('P5  how many times does the body run if you await it twice?', async () => {
  await shared; await shared;
  return p5;
}, 1);
log('note P5', 'a promise runs its work ONCE — awaiting again just reads the settled value');

report();
