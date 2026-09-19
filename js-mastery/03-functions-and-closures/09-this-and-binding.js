'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 09 — `this` AND BINDING
 *
 * `this` is not decided by where a function is WRITTEN. It is decided by how
 * the function is CALLED. Four rules, checked in this order:
 *
 *   1. new Foo()          this = the brand new object          (topic 05)
 *   2. fn.call(obj) / fn.apply(obj) / fn.bind(obj)   this = obj  (explicit)
 *   3. obj.method()       this = obj                           (the dot rule)
 *   4. plain fn()         this = undefined in strict mode, globalThis otherwise
 *
 *   ARROW FUNCTIONS ignore all four. They have no `this` of their own and
 *   permanently use the `this` of the scope they were WRITTEN in. That makes
 *   them perfect for callbacks inside a method, and wrong as a method itself.
 *
 *   THE DETACHMENT BUG — the single most common `this` failure:
 *     const fn = obj.method;   fn();      // the dot is gone, so is `this`
 *     setTimeout(obj.method, 0);          // same problem
 *   Fix with .bind(obj) or by wrapping in an arrow: () => obj.method()
 *
 *   call(obj, a, b)   arguments listed
 *   apply(obj, [a, b])  arguments in an array
 *   bind(obj, a)      returns a NEW function, permanently bound
 * ==========================================================================*/

section('Exercise 1 — the dot rule');
/* Write `fullName()` as a shorthand method returning `${first} ${last}`
 * using `this`.                                                  */
const person = {
  first: 'Asha',
  last: 'Rao',
  // your code here: add a fullName() method
};
check('method call', () => person.fullName(), 'Asha Rao');

section('Exercise 2 — the detachment bug');
/* Pull the method off the object and call it bare. Return the error name
 * ('TypeError') if it throws, or whatever it produces.
 * In strict mode `this` is undefined, so reading this.first throws.  */
function detached() {
  const fn = person.fullName;
  // your code here: call fn() in a try/catch, return e.constructor.name on error
}
check('detached loses this', detached(), 'TypeError');

section('Exercise 3 — fix it with bind');
/* Return a function permanently bound to `person`.               */
function boundName() {
  // your code here
}
check('bound works detached', () => boundName()(), 'Asha Rao');
check('still bound when passed around', () => {
  const fn = boundName();
  const runIt = (f) => f();
  return runIt(fn);
}, 'Asha Rao');

section('Exercise 4 — call and apply');
/* greet is written to use `this.name`. Borrow it for other objects.
 * withCall(greet, { name: 'Ben' }, 'Hi') -> 'Hi, Ben'
 * withApply(greet, { name: 'Cara' }, ['Yo']) -> 'Yo, Cara'       */
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
function withCall(fn, thisArg, arg) {
  // your code here
}
function withApply(fn, thisArg, argsArray) {
  // your code here
}
check('call', withCall(greet, { name: 'Ben' }, 'Hi'), 'Hi, Ben');
check('apply', withApply(greet, { name: 'Cara' }, ['Yo']), 'Yo, Cara');

section('Exercise 5 — method borrowing');
/* `counterObj` has a method. Borrow it for a totally different object
 * using call, without copying the method.
 * borrowTick({ count: 10 }) -> 11                                */
const counterObj = { count: 0, tick() { this.count += 1; return this.count; } };
function borrowTick(target) {
  // your code here
}
check('borrowed', borrowTick({ count: 10 }), 11);
check('the original is untouched', counterObj.count, 0);

section('Exercise 6 — arrow inside a method');
/* The callback inside the method must still see the object.
 * Write `namesUpper()` on `team` so it returns ['ASHA (eng)', 'BEN (eng)'],
 * using this.dept inside a .map callback.
 * Use an ARROW for the callback so `this` carries through.       */
const team = {
  dept: 'eng',
  members: ['Asha', 'Ben'],
  // your code here: add namesUpper()
};
check('arrow keeps this', () => team.namesUpper(), ['ASHA (eng)', 'BEN (eng)']);

section('Exercise 7 — the same thing gone wrong');
/* Now do it with a regular `function` callback and NO fix, and report what
 * happens. Return 'TypeError' if reading this.dept throws.       */
const brokenTeam = {
  dept: 'eng',
  members: ['Asha'],
  namesUpper() {
    try {
      // your code here: use this.members.map(function (m) { ... this.dept ... })
      return 'no error';
    } catch (e) {
      return e.constructor.name;
    }
  },
};
check('regular callback loses this', () => brokenTeam.namesUpper(), 'TypeError');

section('Exercise 8 — an arrow as a method is the wrong tool');
/* Give `badObj` an arrow method `getValue` that tries to read this.value.
 * At the top level of a CommonJS module `this` is module.exports, an empty
 * object, so this.value is undefined — the arrow never sees badObj.  */
const badObj = {
  value: 42,
  // your code here: add getValue as an ARROW property
};
check('arrow method cannot see its object', () => String(badObj.getValue()), 'undefined');

section('Exercise 9 — bind with preset arguments');
/* bind can lock arguments as well as `this`.
 * makeAdder5() returns add.bind(null, 5) so the result adds 5.    */
function add(a, b) {
  return a + b;
}
function makeAdder5() {
  // your code here
}
check('bound argument', () => makeAdder5()(3), 8);
check('reusable', () => [makeAdder5()(1), makeAdder5()(10)], [6, 15]);

section('Exercise 10 — a self-bound method');
/* Return an object whose `tick` works even when detached, by binding it
 * in the factory. makeSafeCounter().tick pulled out and called must work. */
function makeSafeCounter() {
  // your code here
}
check('works normally', () => { const c = makeSafeCounter(); return [c.tick(), c.tick()]; }, [1, 2]);
check('works detached', () => {
  const c = makeSafeCounter();
  const loose = c.tick;
  return [loose(), loose()];
}, [1, 2]);

section('Exercise 11 — fixing a callback');
/* `logger.collect` is passed to a function that calls it bare. Make it work
 * WITHOUT changing `logger`, by passing something that keeps `this`.
 * Return the collected array.                                     */
const logger = {
  lines: [],
  collect(line) { this.lines.push(line); return this.lines.length; },
};
function runWithLogger(runner) {
  // your code here: call runner(<something safe to call bare>)
}
check('callback keeps this', () => {
  logger.lines = [];
  runWithLogger((fn) => { fn('a'); fn('b'); });
  return logger.lines;
}, ['a', 'b'], runWithLogger);

section('PREDICTIONS');

// P1: a plain call in strict mode
function plain() { return this; }
let p1 = null;
check('P1  String(plain())', p1, String(plain()));

// P2: the dot rule
const o2 = { n: 1, get() { return this.n; } };
let p2 = null;
check('P2  o2.get()', p2, o2.get());

// P3: the same function, called without the dot
const pulled3 = o2.get;
let outcome3;
try { outcome3 = pulled3(); } catch (e) { outcome3 = e.constructor.name; }
let p3 = null;
check('P3  pulled3()', p3, outcome3);

// P4: nested object — which object does `this` mean?
const o4 = { n: 'outer', inner: { n: 'inner', get() { return this.n; } } };
let p4 = null;
check('P4  o4.inner.get()', p4, o4.inner.get());

// P5: can you rebind a bound function?
function id5() { return this.tag; }
const bound5 = id5.bind({ tag: 'first' });
let p5 = null;
check('P5  bound5.call({ tag: "second" })', p5, bound5.call({ tag: 'second' }));

// P6: does bind return the same function?
let p6 = null;
check('P6  id5.bind({}) === id5', p6, id5.bind({}) === id5);

log('the question to ask', 'what is immediately to the left of the dot at CALL time?');

report();
