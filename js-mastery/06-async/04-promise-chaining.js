'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 04 — CHAINING
 *
 * The rule that makes promises worth it:
 *
 *   .then() ALWAYS returns a new promise.
 *     • return a plain value  -> the next .then gets that value
 *     • return a PROMISE      -> the chain WAITS for it and unwraps it
 *     • throw                 -> the chain skips to the next .catch
 *
 * That unwrapping is what kills the pyramid. Three nested callbacks
 * become three flat .then calls.
 *
 * ERRORS travel DOWN the chain until something catches them. One .catch at
 * the end covers every step above it.
 *
 * AFTER a .catch, the chain is healthy again — the value it returns flows
 * on to the next .then. That is how you recover with a default.
 *
 * THE CLASSIC MISTAKE: forgetting to RETURN inside a .then. Without the
 * return, the next step receives undefined and does not wait.
 * ==========================================================================*/

const DB = {
  u1: { id: 'u1', name: 'Asha', teamId: 't1' },
  t1: { id: 't1', name: 'Engineering' },
};
function fetchRecord(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (DB[id]) resolve(DB[id]);
      else reject(new Error(`no record ${id}`));
    }, 5);
  });
}

section('Exercise 1 — a value flows to the next then');
/* addTen(promise) chains a .then adding 10 and returns the new promise.  */
function addTen(promise) {
  // your code here
}
checkAsync('adds', async () => await addTen(Promise.resolve(5)), 15, addTen);

section('Exercise 2 — chaining several steps');
/* pipeline(n) takes a number and, through THREE separate .then calls,
 * adds 1, doubles it, then turns it into a string.
 * pipeline(4) -> '10'                                            */
function pipeline(n) {
  // your code here
}
checkAsync('three steps', async () => await pipeline(4), '10', pipeline);
checkAsync('another value', async () => await pipeline(0), '2', pipeline);

section('Exercise 3 — returning a promise unwraps it');
/* userTeamName(userId) fetches the user, THEN fetches their team, and
 * resolves with the team name. Use .then twice — no nesting.
 * The second .then must RETURN the fetchRecord promise.          */
function userTeamName(userId) {
  // your code here
}
checkAsync('flattened', async () => await userTeamName('u1'), 'Engineering', userTeamName);

section('Exercise 4 — forgetting the return');
/* brokenChain(userId) is the same, but the inner fetch is NOT returned.
 * Write it that way on purpose and see what the chain resolves to.  */
function brokenChain(userId) {
  // your code here: call fetchRecord inside the then WITHOUT returning it
}
checkAsync('no return means no value', async () => String(await brokenChain('u1')), 'undefined', brokenChain);
log('the lesson', 'every .then that starts async work must RETURN that promise');

section('Exercise 5 — errors skip to catch');
/* safeName(id) resolves with the record name, or the string
 * 'unknown' if the fetch rejects. One .catch at the end.         */
function safeName(id) {
  // your code here
}
checkAsync('happy path', async () => await safeName('u1'), 'Asha', safeName);
checkAsync('recovers', async () => await safeName('nope'), 'unknown', safeName);

section('Exercise 6 — a catch in the middle heals the chain');
/* healed() starts from a rejected promise, catches it and returns 10,
 * then adds 5 in a following .then.
 * -> 15                                                          */
function healed() {
  // your code here
}
checkAsync('recovered and continued', async () => await healed(), 15, healed);

section('Exercise 7 — throwing inside a then');
/* validateThenUse(id) fetches the record, then THROWS
 * new Error('team has no members') when the record has no `name`,
 * and otherwise returns the name. The caller catches it.         */
function validateThenUse(id) {
  // your code here
}
checkAsync('valid record', async () => await validateThenUse('t1'), 'Engineering', validateThenUse);
checkAsync('a throw becomes a rejection', async () => {
  try { await validateThenUse('nope'); return 'no error'; } catch (e) { return e.message; }
}, 'no record nope', validateThenUse);

section('Exercise 8 — which steps ran?');
/* Record the path through a chain. traceChain(shouldFail) returns a
 * promise for an array:
 *   false -> ['step1', 'step2', 'finally']
 *   true  -> ['step1', 'caught', 'finally']
 * step2 must be SKIPPED when step1 throws.                       */
function traceChain(shouldFail) {
  // your code here
}
checkAsync('happy path', async () => await traceChain(false), ['step1', 'step2', 'finally'], traceChain);
checkAsync('failure skips step2', async () => await traceChain(true), ['step1', 'caught', 'finally'], traceChain);

section('Exercise 9 — finally passes the value through');
/* finallyKeepsValue() resolves 'kept', runs a .finally that returns
 * 'ignored', and still resolves with 'kept'.                     */
function finallyKeepsValue() {
  // your code here
}
checkAsync('finally does not change the value', async () => await finallyKeepsValue(), 'kept', finallyKeepsValue);

section('Exercise 10 — sequential with reduce');
/* runSequentially([fn1, fn2], start) runs each async function in turn,
 * feeding the result forward. Each fn is (value) => Promise.
 * Build it with reduce over a starting promise.                  */
function runSequentially(fns, start) {
  // your code here
}
const plusOne = (n) => wait5(n + 1);
const timesTwo = (n) => wait5(n * 2);
function wait5(v) { return new Promise((r) => setTimeout(() => r(v), 5)); }
checkAsync('in order', async () => await runSequentially([plusOne, timesTwo], 3), 8, runSequentially);
checkAsync('empty list', async () => await runSequentially([], 7), 7, runSequentially);
checkAsync('truly sequential', async () => {
  const order = [];
  const step = (tag, ms) => (v) => new Promise((r) => setTimeout(() => { order.push(tag); r(v); }, ms));
  await runSequentially([step('slow', 30), step('fast', 5)], null);
  return order;
}, ['slow', 'fast'], runSequentially);

section('Exercise 11 — rewriting the callback pyramid');
/* Three dependent steps, flat. step(n) is provided and resolves n + 1.
 * threeSteps(0) -> 3, written as a flat chain.                   */
function step(n) {
  return new Promise((r) => setTimeout(() => r(n + 1), 3));
}
function threeSteps(start) {
  // your code here
}
checkAsync('flat chain', async () => await threeSteps(0), 3, threeSteps);

section('PREDICTIONS');

// P1: what does then return?
let p1 = null;
check('P1  Promise.resolve(1).then(v => v) instanceof Promise', p1,
  Promise.resolve(1).then((v) => v) instanceof Promise);

// P2: a then handler returning a promise
let p2 = null;
checkAsync('P2  the value after .then(() => Promise.resolve(5))',
  async () => p2, await_chain());
async function await_chain() { return Promise.resolve(1).then(() => Promise.resolve(5)); }

// P3: a then handler returning nothing
let p3 = null;
checkAsync('P3  the value after .then(v => { v + 1; })',
  async () => p3, await_nothing());
async function await_nothing() { return Promise.resolve(1).then((v) => { v + 1; }); }

// P4: does catch run for a fulfilled promise?
const ran4 = [];
let p4 = null;
checkAsync('P4  which handlers ran for a fulfilled promise', async () => p4, await_handlers());
async function await_handlers() {
  await Promise.resolve(1).then(() => ran4.push('then')).catch(() => ran4.push('catch'));
  return ran4;
}

// P5: an error thrown AFTER the catch
let p5 = null;
checkAsync('P5  is a throw after .catch still caught by it?', async () => p5, 'no');

report();
