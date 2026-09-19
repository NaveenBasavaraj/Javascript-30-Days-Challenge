'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 11 — BUILD THE UTILITIES YOU ACTUALLY USE
 *
 * Everything here is a real function from lodash / your future codebase,
 * and every one of them is just a closure. Writing them yourself is the
 * fastest way to stop finding closures mysterious.
 *
 * NOTES on the timing pair, because people mix them up forever:
 *
 *   DEBOUNCE — "wait until things go quiet, then act ONCE".
 *     Each new call CANCELS the pending timer and starts a new one.
 *     Search-as-you-type, resize handlers, autosave.
 *
 *   THROTTLE — "act at most once every N milliseconds".
 *     The first call runs immediately; further calls inside the window
 *     are ignored.
 *     Scroll handlers, rate-limited buttons, analytics pings.
 *
 *   Debounce a 5-keystroke burst -> 1 call, at the end.
 *   Throttle the same burst      -> 1 call, at the start.
 *
 * The async checks below wait on real timers, so this file takes about a
 * second to run and its async results print after the sync ones.
 * ==========================================================================*/

section('Exercise 1 — once');
/* Run the wrapped function at most one time; later calls return the first
 * result without re-running it.                                  */
function once(fn) {
  // your code here
}
check('runs once', () => {
  let calls = 0;
  const init = once(() => { calls++; return 'ready'; });
  return [init(), init(), calls];
}, ['ready', 'ready', 1]);

section('Exercise 2 — after');
/* after(3, fn) returns a function that does nothing for the first two
 * calls and runs fn from the THIRD call onward, returning its result.
 * Before that it returns undefined.                              */
function after(times, fn) {
  // your code here
}
check('waits', () => {
  const f = after(3, () => 'go');
  return [String(f()), String(f()), f(), f()];
}, ['undefined', 'undefined', 'go', 'go']);

section('Exercise 3 — memoize with any number of arguments');
/* Key the cache on JSON.stringify of the argument list.
 * Prove it caches by counting calls.                             */
function memoize(fn) {
  // your code here
}
check('caches multi-arg', () => {
  let calls = 0;
  const add = memoize((a, b) => { calls++; return a + b; });
  return [add(1, 2), add(1, 2), add(2, 1), calls];
}, [3, 3, 3, 2]);

section('Exercise 4 — counter with reset');
/* makeTally() -> { add, get, reset }
 *   add(n)  adds n and returns the running total
 *   get()   the total
 *   reset() sets it to 0 and returns 0                           */
function makeTally() {
  // your code here
}
check('tally', () => { const t = makeTally(); t.add(2); t.add(3); return t.get(); }, 5);
check('reset', () => { const t = makeTally(); t.add(5); t.reset(); return t.get(); }, 0);
check('add returns the total', () => { const t = makeTally(); t.add(2); return t.add(3); }, 5);

section('Exercise 5 — limit');
/* limit(fn, max) allows fn to run `max` times; after that every call
 * returns the string 'limit reached' without running fn.         */
function limit(fn, max) {
  // your code here
}
check('limited', () => {
  let calls = 0;
  const f = limit(() => { calls++; return 'ok'; }, 2);
  return [f(), f(), f(), calls];
}, ['ok', 'ok', 'limit reached', 2]);

section('Exercise 6 — a rotating value');
/* cycle(['a','b','c']) returns a function giving the next item each call,
 * wrapping around forever.                                       */
function cycle(items) {
  // your code here
}
check('cycles', () => {
  const next = cycle(['a', 'b', 'c']);
  return [next(), next(), next(), next()];
}, ['a', 'b', 'c', 'a']);

section('Exercise 7 — defaults via closure');
/* configure({ host: 'db' }) returns a function that merges its argument
 * over the stored defaults.
 * const build = configure({ host: 'localhost', port: 80 });
 * build({ port: 443 }) -> { host: 'localhost', port: 443 }
 * The stored defaults must never be mutated.                     */
function configure(defaults) {
  // your code here
}
check('merges', () => configure({ host: 'localhost', port: 80 })({ port: 443 }),
  { host: 'localhost', port: 443 });
check('defaults survive', () => {
  const build = configure({ host: 'localhost', port: 80 });
  build({ port: 443 });
  return build({});
}, { host: 'localhost', port: 80 });

section('Exercise 8 — retryable');
/* retryable(fn, maxAttempts) returns a function that calls fn and, if it
 * THROWS, tries again up to maxAttempts times. It returns the first
 * success, or the last error's message if every attempt fails.
 * (Synchronous only — the async version belongs in topic 06.)    */
function retryable(fn, maxAttempts) {
  // your code here
}
check('succeeds on the third try', () => {
  let attempts = 0;
  const flaky = retryable(() => {
    attempts++;
    if (attempts < 3) throw new Error('nope');
    return 'worked';
  }, 5);
  return [flaky(), attempts];
}, ['worked', 3]);
check('gives up', () => {
  const always = retryable(() => { throw new Error('always fails'); }, 2);
  return always();
}, 'always fails');

section('Exercise 9 — DEBOUNCE (async)');
/* debounce(fn, wait) — each call restarts the timer; fn runs once, `wait`
 * ms after the LAST call. Pass the latest arguments through.     */
function debounce(fn, wait) {
  // your code here
}
checkAsync('a burst of 4 calls fires once', async () => {
  const seen = [];
  const save = debounce((v) => seen.push(v), 30);
  save(1); save(2); save(3); save(4);
  await sleep(80);
  return seen;
}, [4], debounce);
checkAsync('nothing has fired before the wait is up', async () => {
  const seen = [];
  const save = debounce((v) => seen.push(v), 50);
  save('x');
  await sleep(20);
  return seen;
}, [], debounce);
checkAsync('separate bursts each fire', async () => {
  const seen = [];
  const save = debounce((v) => seen.push(v), 20);
  save('a');
  await sleep(60);
  save('b');
  await sleep(60);
  return seen;
}, ['a', 'b'], debounce);

section('Exercise 10 — THROTTLE (async)');
/* throttle(fn, wait) — run immediately, then ignore every call for the
 * next `wait` ms, then allow one again.                          */
function throttle(fn, wait) {
  // your code here
}
checkAsync('a burst fires once, immediately', async () => {
  const seen = [];
  const ping = throttle((v) => seen.push(v), 50);
  ping(1); ping(2); ping(3);
  await sleep(10);
  return seen;
}, [1], throttle);
checkAsync('allowed again after the window', async () => {
  const seen = [];
  const ping = throttle((v) => seen.push(v), 30);
  ping('first');
  await sleep(60);
  ping('second');
  await sleep(10);
  return seen;
}, ['first', 'second'], throttle);

section('Exercise 11 — the difference, side by side');
/* Same burst into both. Debounce keeps the LAST value and fires late;
 * throttle keeps the FIRST and fires immediately.                */
checkAsync('debounce vs throttle', async () => {
  const d = [];
  const t = [];
  const debounced = debounce((v) => d.push(v), 30);
  const throttled = throttle((v) => t.push(v), 30);
  for (const n of [1, 2, 3]) { debounced(n); throttled(n); }
  await sleep(80);
  return { debounced: d, throttled: t };
}, { debounced: [3], throttled: [1] }, debounce);

section('PREDICTIONS');

// P1: does a closure variable survive between calls?
function make() { let n = 0; return () => ++n; }
const m1 = make();
m1(); m1(); m1();
let p1 = null;
check('P1  m1()', p1, m1());

// P2: how many timers does a 5-call debounce burst leave running?
let p2 = null;      // guess 0, 1 or 5 — how many FIRE
check('P2  how many times a debounced fn fires for 5 rapid calls', p2, 1);

// P3: and a throttled one, in the same burst
let p3 = null;
check('P3  how many times a throttled fn fires for 5 rapid calls', p3, 1);

// P4: what does setTimeout return?
const handle = setTimeout(() => {}, 0);
clearTimeout(handle);
let p4 = null;      // guess: 'number' or 'object' — in Node it is one of them
check('P4  typeof setTimeout(...) in Node', p4, typeof handle);

log('the rule', 'debounce = wait for quiet; throttle = at most once per window');

report();
