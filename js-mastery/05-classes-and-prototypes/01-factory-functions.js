'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 01 — FACTORY FUNCTIONS (the starting point)
 * Run with:  node 05-classes-and-prototypes/01-factory-functions.js
 *
 * Before `class` and before `new`, there is the simplest way to make many
 * similar objects: a function that returns one.
 *
 *   function makeDog(name) {
 *     return { name, speak: () => `${name} says woof` };
 *   }
 *
 * NOTES:
 *   A factory is just a function. No `new`, no `this` problems, and any
 *   variable it declares is genuinely private (that is your closures from
 *   topic 03 doing the work).
 *
 *   THE TRADE-OFF, and the reason classes exist:
 *   every object a factory returns gets its OWN COPY of every method.
 *   A thousand dogs means a thousand `speak` functions in memory, and
 *   dog1.speak !== dog2.speak. Prototypes (file 03) fix exactly that by
 *   sharing one copy between every instance.
 *
 *   For a handful of objects, a factory is often the better choice. Know
 *   both, and know why you picked one.
 * ==========================================================================*/

section('Exercise 1 — a basic factory');
/* makePoint(1, 2) -> { x: 1, y: 2 }                              */
function makePoint(x, y) {
  // your code here
}
check('shape', makePoint(1, 2), { x: 1, y: 2 });
check('two points are separate objects', () => makePoint(1, 2) !== makePoint(1, 2), true, makePoint);

section('Exercise 2 — a factory with behaviour');
/* makeDog('Rex') -> an object with a name and a speak() method.
 * speak() returns 'Rex says woof'.                               */
function makeDog(name) {
  // your code here
}
check('name', () => makeDog('Rex').name, 'Rex');
check('speak', () => makeDog('Rex').speak(), 'Rex says woof');
check('another dog', () => makeDog('Bo').speak(), 'Bo says woof');

section('Exercise 3 — the duplication cost');
/* Prove that each object gets its own copy of the method.
 * Return true when the two speak functions are DIFFERENT objects.  */
function methodsAreSeparate() {
  // your code here: make two dogs, compare their speak functions with !==
}
check('each instance has its own copy', methodsAreSeparate(), true);

section('Exercise 4 — real privacy');
/* makeCounter() -> { increment, value } with the count unreachable.
 * Object.keys must not contain 'count'.                          */
function makeCounter() {
  // your code here
}
check('starts at 0', () => makeCounter().value(), 0);
check('increments', () => { const c = makeCounter(); c.increment(); c.increment(); return c.value(); }, 2);
check('count is private', () => Object.keys(makeCounter()).sort(), ['increment', 'value']);
check('counters are independent', () => {
  const a = makeCounter(); const b = makeCounter();
  a.increment();
  return b.value();
}, 0);

section('Exercise 5 — a factory with validation');
/* makeUser({ name, age }) returns the user, or throws when name is missing
 * or age is negative.
 * The error messages are exactly 'name is required' and 'age must be positive'. */
function makeUser({ name, age } = {}) {
  // your code here
}
check('valid', makeUser({ name: 'Asha', age: 30 }), { name: 'Asha', age: 30 });
check('missing name', () => {
  try { makeUser({ age: 1 }); return 'no throw'; } catch (e) { return e.message; }
}, 'name is required', makeUser);
check('negative age', () => {
  try { makeUser({ name: 'a', age: -1 }); return 'no throw'; } catch (e) { return e.message; }
}, 'age must be positive', makeUser);

section('Exercise 6 — a factory with defaults');
/* makeConfig() -> { host: 'localhost', port: 80, debug: false }
 * makeConfig({ port: 443 }) overrides just the port.
 * Two calls must not share the same object.                      */
function makeConfig(overrides = {}) {
  // your code here
}
check('defaults', makeConfig(), { host: 'localhost', port: 80, debug: false });
check('override', makeConfig({ port: 443 }), { host: 'localhost', port: 443, debug: false });
check('false is respected', () => makeConfig({ debug: false }).debug, false);
check('calls do not share', () => makeConfig() !== makeConfig(), true, makeConfig);

section('Exercise 7 — sharing methods by hand');
/* Here is the fix for exercise 3, done manually: define the methods ONCE
 * in an object, and give every instance a reference to the same functions.
 * makeSharedDog('Rex').speak() -> 'Rex says woof'
 * and two dogs' speak functions must be the SAME function (===).
 * Hint: the shared method uses `this.name`, so it must be a regular
 * function, not an arrow.                                        */
const dogMethods = {
  // your code here: speak() { ... this.name ... }
};
function makeSharedDog(name) {
  // your code here: return an object with name plus the shared methods
}
check('still works', () => makeSharedDog('Rex').speak(), 'Rex says woof');
check('the method is shared', () => makeSharedDog('a').speak === makeSharedDog('b').speak, true, makeSharedDog);

section('Exercise 8 — a factory returning a factory');
/* makeSpeciesFactory('cat', 'meow') returns a factory.
 * const makeCat = makeSpeciesFactory('cat', 'meow');
 * makeCat('Tom').speak() -> 'Tom the cat says meow'              */
function makeSpeciesFactory(species, sound) {
  // your code here
}
check('cat', () => makeSpeciesFactory('cat', 'meow')('Tom').speak(), 'Tom the cat says meow');
check('cow', () => makeSpeciesFactory('cow', 'moo')('Bess').speak(), 'Bess the cow says moo');

section('Exercise 9 — a stateful factory');
/* makeStack() -> { push, pop, peek, size }
 *   push(x) returns the new size
 *   pop()   removes and returns the top item, or null when empty
 *   peek()  returns the top item without removing it, or null    */
function makeStack() {
  // your code here
}
check('lifo order', () => {
  const s = makeStack();
  s.push('a'); s.push('b');
  return [s.pop(), s.pop(), s.pop()];
}, ['b', 'a', null]);
check('peek does not remove', () => {
  const s = makeStack();
  s.push('a');
  return [s.peek(), s.size()];
}, ['a', 1]);
check('push returns the size', () => { const s = makeStack(); s.push('a'); return s.push('b'); }, 2);

section('PREDICTIONS — guess before you run');

// P1: two objects built by the same factory
function make1() { return { a: 1 }; }
let p1 = null;
check('P1  make1() === make1()', p1, make1() === make1());

// P2: their methods
function make2() { return { go() { return 1; } }; }
let p2 = null;
check('P2  make2().go === make2().go', p2, make2().go === make2().go);

// P3: a shared method referenced from a constant
const shared = { go() { return 1; } };
function make3() { return { go: shared.go }; }
let p3 = null;
check('P3  make3().go === make3().go', p3, make3().go === make3().go);

// P4: what does a factory need `new` for?
function makeThing() { return { ok: true }; }
let p4 = null;
check('P4  new makeThing()', p4, new makeThing());

// P5: an arrow method reading `this`
function makeBad(name) { return { name, get: () => this?.name }; }
let p5 = null;
check('P5  String(makeBad("x").get())', p5, String(makeBad('x').get()));

log('the trade-off', 'factories give privacy and no `this` traps; prototypes give shared methods');

report();
