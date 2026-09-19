'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 01 — THE EVENT LOOP
 * Run with:  node 06-async/01-the-event-loop.js
 *
 * JavaScript runs ONE piece of code at a time, on one thread. It never
 * pauses mid-function to run something else. So how is it "asynchronous"?
 *
 * THE MODEL, in four parts:
 *   CALL STACK      the function calls currently running
 *   WEB/NODE APIs   timers, file reads, network — handled OUTSIDE your thread
 *   TASK QUEUE      callbacks ready to run (setTimeout, I/O)   "macrotasks"
 *   MICROTASK QUEUE promise callbacks, queueMicrotask           "microtasks"
 *
 * THE LOOP: when the call stack is empty, drain EVERY microtask, then take
 * ONE macrotask, then drain every microtask again, and so on.
 *
 * Two consequences you must know cold:
 *   1. setTimeout(fn, 0) does NOT run immediately. It runs after the
 *      current code finishes AND after every pending microtask.
 *   2. Promise callbacks jump the queue ahead of timers, always.
 *
 * BLOCKING: a long synchronous loop freezes everything — timers, promises,
 * rendering. Asynchronous does not mean parallel; it means "get out of the
 * way and come back later".
 * ==========================================================================*/

section('Exercise 1 — synchronous order');
/* Push 'a', 'b', 'c' into `out` in order, with plain synchronous calls.  */
function syncOrder(out) {
  // your code here
}
check('straight through', () => { const out = []; syncOrder(out); return out; }, ['a', 'b', 'c'], syncOrder);

section('Exercise 2 — a timer runs later');
/* Push 'start', schedule a setTimeout(..., 0) that pushes 'timer', then
 * push 'end'. Return `out` IMMEDIATELY — the timer has not run yet.  */
function timerOrder(out) {
  // your code here
}
check('the timer has not fired yet', () => { const out = []; timerOrder(out); return out; },
  ['start', 'end'], timerOrder);
checkAsync('and it fires after the current code', async () => {
  const out = [];
  timerOrder(out);
  await sleep(20);
  return out;
}, ['start', 'end', 'timer'], timerOrder);

section('Exercise 3 — microtasks beat macrotasks');
/* Push 'sync' now, schedule a setTimeout pushing 'timer', schedule a
 * Promise.resolve().then pushing 'micro', then push 'end'.
 * After everything settles the order must be:
 *   ['sync', 'end', 'micro', 'timer']                            */
function queueOrder(out) {
  // your code here
}
checkAsync('microtask first', async () => {
  const out = [];
  queueOrder(out);
  await sleep(20);
  return out;
}, ['sync', 'end', 'micro', 'timer'], queueOrder);

section('Exercise 4 — every microtask drains before the next macrotask');
/* Schedule THREE promise callbacks pushing 'm1','m2','m3' and ONE
 * setTimeout pushing 't'. The timer comes last no matter what order you
 * schedule them in. Schedule the timer FIRST to prove it.        */
function drainOrder(out) {
  // your code here
}
checkAsync('all microtasks first', async () => {
  const out = [];
  drainOrder(out);
  await sleep(20);
  return out;
}, ['m1', 'm2', 'm3', 't'], drainOrder);

section('Exercise 5 — a microtask can queue another microtask');
/* Inside a promise callback, queue ANOTHER promise callback. Both still
 * run before any timer.
 * Order: ['outer', 'inner', 'timer']                             */
function nestedMicro(out) {
  // your code here
}
checkAsync('nested microtasks still win', async () => {
  const out = [];
  nestedMicro(out);
  await sleep(20);
  return out;
}, ['outer', 'inner', 'timer'], nestedMicro);

section('Exercise 6 — blocking the loop');
/* busyWait(ms) spins in a while loop until that many milliseconds have
 * passed, using Date.now(). Nothing else can run while it does.
 * Prove it: schedule a 0ms timer, then block for 30ms, and show the timer
 * could not fire early.                                          */
function busyWait(ms) {
  // your code here
}
check('it really waits', () => {
  const start = Date.now();
  busyWait(25);
  return Date.now() - start >= 25;
}, true, busyWait);
checkAsync('a 0ms timer cannot interrupt it', async () => {
  const out = [];
  setTimeout(() => out.push('timer'), 0);
  busyWait(30);
  out.push('after blocking');
  await sleep(20);
  return out;
}, ['after blocking', 'timer'], busyWait);

section('Exercise 7 — breaking work into chunks');
/* Instead of one long loop, process items one macrotask at a time so the
 * loop can breathe. chunked([1,2,3], out) pushes each doubled value via a
 * separate setTimeout, and returns immediately.                  */
function chunked(items, out) {
  // your code here
}
check('returns before doing the work', () => { const out = []; chunked([1, 2], out); return out; }, [], chunked);
checkAsync('all of it eventually runs, in order', async () => {
  const out = [];
  chunked([1, 2, 3], out);
  await sleep(40);
  return out;
}, [2, 4, 6], chunked);

section('Exercise 8 — queueMicrotask');
/* Same idea as Promise.resolve().then, but explicit.
 * Order: ['now', 'micro', 'timer']                               */
function withQueueMicrotask(out) {
  // your code here
}
checkAsync('explicit microtask', async () => {
  const out = [];
  withQueueMicrotask(out);
  await sleep(20);
  return out;
}, ['now', 'micro', 'timer'], withQueueMicrotask);

section('Exercise 9 — timer order among themselves');
/* Schedule three timers with delays 20, 0 and 10, pushing their delay.
 * They fire in delay order, not in the order you wrote them.
 * -> [0, 10, 20]                                                 */
function timerRace(out) {
  // your code here
}
checkAsync('shortest delay first', async () => {
  const out = [];
  timerRace(out);
  await sleep(60);
  return out;
}, [0, 10, 20], timerRace);

section('PREDICTIONS — guess before you run');

// P1: the classic interview question
const order1 = [];
order1.push('1');
setTimeout(() => order1.push('2'), 0);
Promise.resolve().then(() => order1.push('3'));
order1.push('4');
let p1 = null;
checkAsync('P1  the four pushes above, once everything settles',
  async () => { await sleep(20); return p1; }, order1);

// P2: does an async function start running immediately?
const order2 = [];
async function go2() { order2.push('inside'); await null; order2.push('after await'); }
order2.push('before');
go2();
order2.push('after call');
let p2 = null;
checkAsync('P2  the order for an async function call',
  async () => { await sleep(20); return p2; }, order2);

// P3: setTimeout with 0 vs 1 millisecond
let p3 = null;
check('P3  is setTimeout(fn, 0) the same as calling fn() now?', p3, false);

// P4: how many milliseconds does a 0ms timer actually wait?
let p4 = null;      // guess: 'exactly 0' or 'at least 0, usually more'
check('P4  a 0ms timer waits', p4, 'at least 0, usually more');

log('the one rule', 'stack empties -> ALL microtasks -> ONE macrotask -> repeat');

report();
