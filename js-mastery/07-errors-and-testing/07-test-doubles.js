'use strict';
const { check, checkAsync, sleep, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 07 — TEST DOUBLES & TESTING THE AWKWARD BITS
 *
 * Real code talks to databases, clocks, random numbers and the network.
 * Tests must not. A TEST DOUBLE stands in for the real thing.
 *
 * THE VOCABULARY — people muddle these, so learn them properly:
 *   DUMMY   a value passed just to fill an argument; never used.
 *   STUB    returns canned answers. "getUser always returns Asha."
 *   SPY     records how it was called, and usually calls through.
 *   MOCK    a spy with expectations built in — it fails the test itself.
 *   FAKE    a real, working, simplified implementation — an in-memory
 *           database instead of Postgres.
 *
 * THE RULE THAT MAKES CODE TESTABLE: inject your dependencies. A function
 * that calls `Date.now()` directly can only be tested at the current time.
 * A function that takes `now` as an argument can be tested at any time.
 *
 *   BAD   function isExpired(token) { return token.exp < Date.now(); }
 *   GOOD  function isExpired(token, now = Date.now()) { return token.exp < now; }
 * ==========================================================================*/

section('Exercise 1 — a spy');
/* spy(fn) returns a wrapper that records every call and still returns the
 * original result. The wrapper has:
 *   .calls   an array of argument arrays
 *   .count   how many times it ran
 *   .lastArgs the most recent argument array, or null               */
function spy(fn) {
  // your code here
}
check('records arguments', () => {
  const s = spy((a, b) => a + b);
  s(1, 2); s(3, 4);
  return [s.calls, s.count, s.lastArgs];
}, [[[1, 2], [3, 4]], 2, [3, 4]], spy);
check('still returns the result', () => spy((a) => a * 2)(5), 10, spy);
check('never called', () => {
  const s = spy(() => {});
  return [s.count, s.lastArgs];
}, [0, null], spy);

section('Exercise 2 — a stub');
/* stub(returnValue) returns a function that ignores its arguments and
 * always gives back that value, while recording the call count.  */
function stub(returnValue) {
  // your code here
}
check('canned answer', () => {
  const getUser = stub({ id: 'u1' });
  return [getUser('anything'), getUser(), getUser.count];
}, [{ id: 'u1' }, { id: 'u1' }, 2], stub);

section('Exercise 3 — a stub that can throw');
/* stubThrows(message) returns a function that always throws.
 * Use it to test your error handling.                            */
function stubThrows(message) {
  // your code here
}
check('throws every time', () => {
  const broken = stubThrows('db is down');
  try { broken(); return 'no throw'; } catch (e) { return e.message; }
}, 'db is down', stubThrows);

section('Exercise 4 — injecting the clock');
/* isExpired(token, now) compares token.exp with now.
 * Because `now` is a parameter, you can test any moment you like.  */
function isExpired(token, now) {
  // your code here
}
check('expired', isExpired({ exp: 100 }, 200), true);
check('still valid', isExpired({ exp: 300 }, 200), false);
check('exactly now is not expired', isExpired({ exp: 200 }, 200), false);

section('Exercise 5 — injecting randomness');
/* pickOne(items, random) uses the injected random function (which returns
 * 0 to 1) instead of Math.random, so the test is deterministic.  */
function pickOne(items, random) {
  // your code here
}
check('first', pickOne(['a', 'b', 'c'], () => 0), 'a');
check('last', pickOne(['a', 'b', 'c'], () => 0.99), 'c');
check('middle', pickOne(['a', 'b', 'c'], () => 0.5), 'b');
check('empty', pickOne([], () => 0.5), null);

section('Exercise 6 — a fake repository');
/* makeFakeUserRepo(seed) returns a working in-memory store with the same
 * shape as the real one:
 *   findById(id)    the user or null
 *   save(user)      stores by id, returns the user
 *   count()                                                       */
function makeFakeUserRepo(seed = []) {
  // your code here
}
check('seeded', () => makeFakeUserRepo([{ id: 'u1', name: 'Asha' }]).findById('u1').name, 'Asha', makeFakeUserRepo);
check('missing', () => makeFakeUserRepo().findById('nope'), null, makeFakeUserRepo);
check('save then find', () => {
  const repo = makeFakeUserRepo();
  repo.save({ id: 'u2', name: 'Ben' });
  return [repo.findById('u2').name, repo.count()];
}, ['Ben', 1], makeFakeUserRepo);
check('save overwrites', () => {
  const repo = makeFakeUserRepo([{ id: 'u1', name: 'Old' }]);
  repo.save({ id: 'u1', name: 'New' });
  return [repo.findById('u1').name, repo.count()];
}, ['New', 1], makeFakeUserRepo);

section('Exercise 7 — testing code that uses a dependency');
/* greetUser(id, repo) returns `Hello, ${name}` or 'Unknown user'.
 * It takes the repo as an argument — that is what makes it testable.  */
function greetUser(id, repo) {
  // your code here
}
check('found', greetUser('u1', makeFakeUserRepo([{ id: 'u1', name: 'Asha' }])), 'Hello, Asha', greetUser);
check('missing', greetUser('zz', makeFakeUserRepo()), 'Unknown user', greetUser);

section('Exercise 8 — asserting on the spy, not the result');
/* Sometimes the point IS the side effect.
 * notifyAll(users, send) calls send(email) once per user with an email
 * address, and returns how many it sent. Users without an email are
 * skipped.                                                       */
function notifyAll(users, send) {
  // your code here
}
check('calls send per user', () => {
  const sent = spy(() => {});
  const count = notifyAll([{ email: 'a@x.com' }, { email: null }, { email: 'b@x.com' }], sent);
  return [count, sent.calls];
}, [2, [['a@x.com'], ['b@x.com']]], notifyAll);

section('Exercise 9 — a fake timer');
/* Waiting 5 real seconds in a test is unacceptable. A fake clock lets you
 * jump forward.
 * makeClock() returns { now(), advance(ms), setTimeout(fn, ms) } where
 * advance runs every callback whose time has come, in time order.  */
function makeClock() {
  // your code here
}
check('nothing runs until you advance', () => {
  const clock = makeClock();
  const log = [];
  clock.setTimeout(() => log.push('a'), 10);
  return log;
}, [], makeClock);
check('advance triggers it', () => {
  const clock = makeClock();
  const log = [];
  clock.setTimeout(() => log.push('a'), 10);
  clock.advance(10);
  return log;
}, ['a'], makeClock);
check('only what is due', () => {
  const clock = makeClock();
  const log = [];
  clock.setTimeout(() => log.push('early'), 5);
  clock.setTimeout(() => log.push('late'), 50);
  clock.advance(10);
  return log;
}, ['early'], makeClock);
check('time order, not insertion order', () => {
  const clock = makeClock();
  const log = [];
  clock.setTimeout(() => log.push('second'), 20);
  clock.setTimeout(() => log.push('first'), 10);
  clock.advance(100);
  return log;
}, ['first', 'second'], makeClock);
check('now advances', () => {
  const clock = makeClock();
  clock.advance(30);
  return clock.now();
}, 30, makeClock);

section('Exercise 10 — testing an async function');
/* loadProfile(id, fetchUser) awaits the injected fetcher and returns
 * { name } — or throws new Error('could not load') when it rejects.  */
async function loadProfile(id, fetchUser) {
  // your code here
}
checkAsync('success', async () => await loadProfile('u1', async () => ({ name: 'Asha' })),
  { name: 'Asha' }, loadProfile);
checkAsync('failure', async () => {
  try { await loadProfile('u1', async () => { throw new Error('network'); }); return 'no error'; } catch (e) { return e.message; }
}, 'could not load', loadProfile);
checkAsync('the fetcher gets the id', async () => {
  const fetcher = spy(async () => ({ name: 'x' }));
  await loadProfile('u9', fetcher);
  return fetcher.lastArgs;
}, ['u9'], loadProfile);

section('Exercise 11 — testing that something throws');
/* expectThrows(fn, message) returns true when fn throws with EXACTLY
 * that message, and false otherwise (including when it does not throw). */
function expectThrows(fn, message) {
  // your code here
}
check('right message', expectThrows(() => { throw new Error('boom'); }, 'boom'), true);
check('wrong message', expectThrows(() => { throw new Error('other'); }, 'boom'), false);
check('no throw at all', expectThrows(() => 1, 'boom'), false);

section('PREDICTIONS');

// P1: which double records calls without changing behaviour?
let p1 = null;
check('P1  the double that records and calls through is a', p1, 'spy');

// P2: which one is a working simplified implementation?
let p2 = null;
check('P2  an in-memory database in a test is a', p2, 'fake');

// P3: can you test a function that calls Date.now() internally at a chosen time?
let p3 = null;
check('P3  without injection, can you control the clock?', p3, false);

// P4: does a spy change what the wrapped function returns?
let p4 = null;
check('P4  a spy should change the return value', p4, false);

log('the design lesson', 'hard to test almost always means too many hidden dependencies');

report();
