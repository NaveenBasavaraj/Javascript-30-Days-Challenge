'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 06 — CLOSURES IN LOOPS (the most famous bug in JavaScript)
 *
 * NOTES:
 *   for (var i = 0; i < 3; i++) { ... }
 *     ONE variable `i`, shared by the whole loop and by every function
 *     created inside it. After the loop, i is 3. Every closure sees 3.
 *
 *   for (let i = 0; i < 3; i++) { ... }
 *     A NEW binding of `i` per iteration, and each closure captures its own.
 *     This is a special rule the language added exactly for this problem.
 *
 *   Before `let` existed, the fix was to make a new scope by hand with an
 *   IIFE, passing the current value in as an argument:
 *     for (var i = 0; i < 3; i++) {
 *       (function (j) { ... })(i);
 *     }
 *
 *   Everything here applies equally to setTimeout, event handlers and any
 *   callback that runs LATER — by the time it runs, the loop has finished.
 *
 * Some checks in this file are asynchronous (they wait for timers).
 * Their results print after the synchronous ones — that is normal.
 * ==========================================================================*/

section('Exercise 1 — see the bug');
/* Write it the BROKEN way on purpose, with `var`. Return the array of
 * results after calling every stored function.
 * buggyFunctions() -> [3, 3, 3]                                  */
function buggyFunctions() {
  const fns = [];
  // your code here: a `var` loop from 0 to 2 pushing () => i
  return fns.map((fn) => fn());
}
check('all three see the same i', buggyFunctions(), [3, 3, 3]);

section('Exercise 2 — fix it with let');
/* Same code, one keyword different.
 * fixedWithLet() -> [0, 1, 2]                                    */
function fixedWithLet() {
  const fns = [];
  // your code here
  return fns.map((fn) => fn());
}
check('each keeps its own i', fixedWithLet(), [0, 1, 2]);

section('Exercise 3 — fix it with an IIFE');
/* Keep `var`, but wrap the body in an immediately invoked function that
 * takes the current value as a parameter.
 * fixedWithIife() -> [0, 1, 2]                                   */
function fixedWithIife() {
  const fns = [];
  // your code here: var loop + (function (j) { fns.push(() => j); })(i);
  return fns.map((fn) => fn());
}
check('the IIFE makes a new scope', fixedWithIife(), [0, 1, 2]);

section('Exercise 4 — fix it with a helper function');
/* A named factory is the same trick, more readable.
 * makeReturner(value) returns a function returning that value.
 * fixedWithFactory() -> [0, 1, 2]                                */
function makeReturner(value) {
  // your code here
}
function fixedWithFactory() {
  const fns = [];
  // your code here: var loop calling makeReturner(i)
  return fns.map((fn) => fn());
}
check('factory version', fixedWithFactory(), [0, 1, 2]);

section('Exercise 5 — the same bug with array methods');
/* forEach gives each iteration its own parameter, so there is no bug here
 * at all. Build the same array of functions with forEach.
 * withForEach(['a','b']) -> ['a', 'b']                           */
function withForEach(items) {
  // your code here: return an array of functions, then call them all
}
check('forEach has no bug', withForEach(['a', 'b']), ['a', 'b']);

section('Exercise 6 — a closure per handler');
/* Simulate three buttons. Each handler must report its OWN index.
 * makeHandlers(['save','cancel','help'])
 *   -> ['clicked save (0)', 'clicked cancel (1)', 'clicked help (2)']
 * Return the array of RESULTS of calling each handler.           */
function makeHandlers(labels) {
  // your code here
}
check('handlers', makeHandlers(['save', 'cancel', 'help']),
  ['clicked save (0)', 'clicked cancel (1)', 'clicked help (2)']);

section('Exercise 7 — counters in a loop');
/* Build n independent counters. Each starts at 0 and counts on its own.
 * const [a, b] = makeCounters(2);  a(); a(); b();  ->  a is 2, b is 1  */
function makeCounters(n) {
  // your code here
}
check('independent counters', () => {
  const [a, b] = makeCounters(2);
  a(); a(); b();
  return [a(), b()];
}, [3, 2]);

section('Exercise 8 — accumulating into shared state');
/* Every adder adds its own number to ONE shared total.
 * const { adders, total } = makeAdders([1, 2, 3]);
 * adders[0](); adders[2]();  total() -> 4
 * The numbers are per-closure; the total is shared by all of them.  */
function makeAdders(numbers) {
  // your code here
}
check('shared total', () => {
  const { adders, total } = makeAdders([1, 2, 3]);
  adders[0]();
  adders[2]();
  return total();
}, 4);
check('starts at zero', () => makeAdders([5]).total(), 0);
check('each adder knows its own number', () => {
  const { adders, total } = makeAdders([10, 20]);
  adders[1]();
  return total();
}, 20);
check('two sets do not share', () => {
  const a = makeAdders([1]);
  const b = makeAdders([1]);
  a.adders[0]();
  return b.total();
}, 0);

section('Exercise 9 — the timer version of the bug');
/* THE interview classic. Schedule three timers that each report their
 * index, collecting the results into `out`.
 * Write the BROKEN var version: after ~20ms, out is [3, 3, 3].    */
function scheduleBuggy(out) {
  // your code here: var loop, setTimeout(() => out.push(i), 5)
}
checkAsync('var version pushes 3 three times', async () => {
  const out = [];
  scheduleBuggy(out);
  await sleep(30);
  return out;
}, [3, 3, 3], scheduleBuggy);

/* Now the fixed version: [0, 1, 2].                              */
function scheduleFixed(out) {
  // your code here
}
checkAsync('let version pushes 0, 1, 2', async () => {
  const out = [];
  scheduleFixed(out);
  await sleep(30);
  return out;
}, [0, 1, 2], scheduleFixed);

section('Exercise 10 — staggered timers');
/* Schedule each item to be pushed after (index * 10)ms, so they arrive in
 * order even though they were all scheduled at once.
 * Then prove the loop itself finished FIRST: `out` is still empty
 * immediately after calling it.                                  */
function scheduleStaggered(items, out) {
  // your code here
}
check('nothing has run yet', () => {
  const out = [];
  scheduleStaggered(['a', 'b'], out);
  return out;
}, [], scheduleStaggered);
checkAsync('they arrive in order', async () => {
  const out = [];
  scheduleStaggered(['a', 'b', 'c'], out);
  await sleep(60);
  return out;
}, ['a', 'b', 'c'], scheduleStaggered);

section('PREDICTIONS (synchronous)');

// P1: what is `i` after a var loop finishes?
let afterVar;
for (var i = 0; i < 3; i++) { afterVar = i; }   // eslint-disable-line no-var
let p1 = null;
check('P1  i after the loop, reading the var itself', p1, i);

// P2: and is `i` even reachable after a let loop?
let outcome2;
for (let j = 0; j < 3; j++) { /* nothing */ }
try { outcome2 = j; } catch (e) { outcome2 = e.constructor.name; } // eslint-disable-line no-undef
let p2 = null;
check('P2  reading j after a let loop', p2, outcome2);

// P3: does the let rule apply to for...of too?
const fns3 = [];
for (const v of ['a', 'b']) fns3.push(() => v);
let p3 = null;
check('P3  fns3.map(f => f())', p3, fns3.map((f) => f()));

// P4: a while loop with let declared OUTSIDE it
const fns4 = [];
let k = 0;
while (k < 3) { fns4.push(() => k); k++; }
let p4 = null;
check('P4  fns4.map(f => f())', p4, fns4.map((f) => f()));

section('PREDICTIONS (asynchronous)');

// P5: a timer set to 0ms — does it interrupt the lines after it?
const order = [];
order.push('before');
setTimeout(() => order.push('timeout'), 0);
order.push('after');
let p5 = null;          // guess the full array once the timer has run
checkAsync('P5  order after the timer runs', async () => { await sleep(20); return p5; }, order);

// P6: a timer set inside a closure still sees the live variable
let live = 'first';
const seen = [];
setTimeout(() => seen.push(live), 5);
live = 'second';
let p6 = null;          // guess what the timer pushed
checkAsync('P6  what the timer saw', async () => { await sleep(20); return p6; }, seen);

report();
