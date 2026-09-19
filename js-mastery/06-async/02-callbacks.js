'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ASYNC 02 — CALLBACKS
 *
 * The original way to say "run this when you are done". A callback is just
 * a function you hand to another function — you already wrote dozens in
 * topic 03. What makes one ASYNCHRONOUS is that it runs later.
 *
 * THE NODE CONVENTION — "error-first callbacks":
 *   fn(input, (error, result) => { ... })
 *   • error is null when everything worked
 *   • ALWAYS check the error first, and return after handling it
 *
 * WHY WE MOVED ON — three real problems:
 *   1. NESTING. Each step indents further. Five steps and the code
 *      marches off the right edge of the screen ("callback hell").
 *   2. ERROR HANDLING. try/catch cannot catch an error thrown inside a
 *      LATER callback — the try block has already finished.
 *   3. INVERSION OF CONTROL. You hand your callback to someone else's
 *      code and trust it to call you once, with the right arguments, and
 *      not to swallow your errors.
 *
 * Promises fix all three. But callbacks are still everywhere — event
 * listeners, array methods, setTimeout — so you must be fluent in them.
 * ==========================================================================*/

section('Exercise 1 — a callback that runs later');
/* delayedGreet(name, ms, callback) calls callback(`hi ${name}`) after ms.
 * It returns undefined immediately.                              */
function delayedGreet(name, ms, callback) {
  // your code here
}
check('returns nothing straight away', () => String(delayedGreet('a', 5, () => {})), 'undefined', delayedGreet);
checkAsync('calls back later', async () => {
  let got = null;
  delayedGreet('Asha', 10, (msg) => { got = msg; });
  await sleep(30);
  return got;
}, 'hi Asha', delayedGreet);

section('Exercise 2 — the error-first convention');
/* divide(a, b, callback):
 *   b === 0 -> callback(new Error('cannot divide by zero'))
 *   otherwise -> callback(null, a / b)
 * Always call back asynchronously, via setTimeout(..., 0), so the
 * behaviour is consistent. (A function that is sometimes sync and
 * sometimes async is a notorious source of bugs.)                */
function divide(a, b, callback) {
  // your code here
}
checkAsync('success', async () => {
  let result;
  divide(10, 2, (err, value) => { result = [err, value]; });
  await sleep(20);
  return result;
}, [null, 5], divide);
checkAsync('failure', async () => {
  let result;
  divide(1, 0, (err, value) => { result = [err.message, value]; });
  await sleep(20);
  return result;
}, ['cannot divide by zero', undefined], divide);
checkAsync('always asynchronous', async () => {
  const out = [];
  divide(4, 2, () => out.push('callback'));
  out.push('after the call');
  await sleep(20);
  return out;
}, ['after the call', 'callback'], divide);

section('Exercise 3 — a fake data layer');
/* These are provided. Use them in the exercises below.           */
const DB = {
  users: { u1: { id: 'u1', name: 'Asha', teamId: 't1' } },
  teams: { t1: { id: 't1', name: 'Engineering', leadId: 'u1' } },
};
function getUser(id, callback) {
  setTimeout(() => {
    const user = DB.users[id];
    if (!user) callback(new Error(`no user ${id}`));
    else callback(null, user);
  }, 5);
}
function getTeam(id, callback) {
  setTimeout(() => {
    const team = DB.teams[id];
    if (!team) callback(new Error(`no team ${id}`));
    else callback(null, team);
  }, 5);
}

/* getTeamNameForUser(userId, callback) fetches the user, then their team,
 * and calls back with the team NAME. Any error is passed straight to the
 * callback.                                                      */
function getTeamNameForUser(userId, callback) {
  // your code here
}
checkAsync('nested lookups', async () => {
  let result;
  getTeamNameForUser('u1', (err, name) => { result = [err, name]; });
  await sleep(40);
  return result;
}, [null, 'Engineering'], getTeamNameForUser);
checkAsync('an error from the first step', async () => {
  let result;
  getTeamNameForUser('nope', (err, name) => { result = [err.message, name]; });
  await sleep(40);
  return result;
}, ['no user nope', undefined], getTeamNameForUser);

section('Exercise 4 — see the pyramid');
/* Three sequential steps, each depending on the last, all with callbacks.
 * step(n, cb) is provided and calls back with n + 1 after 5ms.
 * Chain three of them and call back with the final number.
 * Notice the indentation as you write it — that is the whole point.  */
function step(n, cb) {
  setTimeout(() => cb(null, n + 1), 5);
}
function threeSteps(start, callback) {
  // your code here
}
checkAsync('three deep', async () => {
  let result;
  threeSteps(0, (err, value) => { result = value; });
  await sleep(50);
  return result;
}, 3, threeSteps);

section('Exercise 5 — try/catch cannot reach a callback');
/* An error thrown inside an async callback escapes the try block that
 * scheduled it. Prove it:
 *   catchAttempt() runs setTimeout(() => { throw ... }) inside a
 *   try/catch and returns 'not caught' because the catch never fires.
 * To keep the process alive, the throwing callback is provided; you just
 * write the try/catch around the scheduling.                     */
function throwLater() {
  // provided shape: a callback that would throw
  return () => { throw new Error('too late'); };
}
function catchAttempt() {
  // your code here: try { setTimeout(throwLater(), 5); } catch { return 'caught'; }
  // then return 'not caught'
}
check('the catch never runs', catchAttempt(), 'not caught', catchAttempt);
// The scheduled throw would crash the process, so we intercept it here.
process.once('uncaughtException', () => { /* expected from the exercise above */ });

section('Exercise 6 — callbacks in series');
/* series([fn1, fn2], startValue, done) runs each function in order,
 * feeding the previous result into the next. Each fn has the shape
 * (value, cb) => cb(null, newValue). Errors short-circuit to done.  */
function series(fns, startValue, done) {
  // your code here
}
const addOne = (n, cb) => setTimeout(() => cb(null, n + 1), 3);
const double = (n, cb) => setTimeout(() => cb(null, n * 2), 3);
const boom = (n, cb) => setTimeout(() => cb(new Error('boom')), 3);
checkAsync('runs in order', async () => {
  let result;
  series([addOne, double], 3, (err, value) => { result = value; });
  await sleep(40);
  return result;
}, 8, series);
checkAsync('empty list returns the start value', async () => {
  let result;
  series([], 7, (err, value) => { result = value; });
  await sleep(20);
  return result;
}, 7, series);
checkAsync('an error stops the chain', async () => {
  let result;
  let reached = false;
  series([boom, (n, cb) => { reached = true; cb(null, n); }], 1, (err) => { result = [err.message, reached]; });
  await sleep(40);
  return result;
}, ['boom', false], series);

section('Exercise 7 — callbacks in parallel');
/* parallel([fn1, fn2], done) starts them all at once and calls done with
 * the results IN THE ORIGINAL ORDER once every one has finished.
 * Each fn has the shape (cb) => cb(null, value).                  */
function parallel(fns, done) {
  // your code here
}
const slow = (cb) => setTimeout(() => cb(null, 'slow'), 30);
const fast = (cb) => setTimeout(() => cb(null, 'fast'), 5);
checkAsync('results keep their order', async () => {
  let result;
  parallel([slow, fast], (err, values) => { result = values; });
  await sleep(60);
  return result;
}, ['slow', 'fast'], parallel);
checkAsync('really parallel, not sequential', async () => {
  const started = Date.now();
  let elapsed;
  parallel([slow, slow], () => { elapsed = Date.now() - started; });
  await sleep(80);
  return elapsed < 55;
}, true, parallel);
checkAsync('empty list', async () => {
  let result;
  parallel([], (err, values) => { result = values; });
  await sleep(20);
  return result;
}, [], parallel);

section('Exercise 8 — guarding against a double call');
/* Someone else's code might call your callback twice. once(cb) returns a
 * wrapper that ignores every call after the first.               */
function onceOnly(cb) {
  // your code here
}
check('only the first call gets through', () => {
  const seen = [];
  const safe = onceOnly((v) => seen.push(v));
  safe(1); safe(2); safe(3);
  return seen;
}, [1], onceOnly);

section('PREDICTIONS');

// P1: is a forEach callback asynchronous?
const order1 = [];
[1, 2].forEach((n) => order1.push(n));
order1.push('after');
let p1 = null;
check('P1  [1,2].forEach(push) then push("after")', p1, order1);

// P2: what does a function return when its work is in a callback?
function later(cb) { setTimeout(() => cb(42), 5); return 'immediate'; }
let p2 = null;
check('P2  later(() => {})', p2, later(() => {}));

// P3: can you return a value OUT of a callback?
function broken() {
  let result;
  setTimeout(() => { result = 42; }, 5);
  return result;
}
let p3 = null;
check('P3  String(broken())', p3, String(broken()));
log('why P3 matters', 'this is THE beginner async bug — the value is not there yet');

// P4: how many arguments does an error-first callback take?
let p4 = null;
check('P4  the error-first signature is (?, ?)', p4, 'error, result');

report();
