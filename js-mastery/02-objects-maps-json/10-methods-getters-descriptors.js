'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 10 — METHODS, GETTERS & PROPERTY CONTROL
 *
 * NOTES:
 *   METHOD SHORTHAND
 *     { greet() { return 'hi'; } }        same as greet: function () {...}
 *
 *   GETTERS / SETTERS — look like a property, run like a function:
 *     { get area() { return this.w * this.h; },
 *       set area(v) { ... } }
 *     obj.area          no parentheses — the getter runs
 *
 *   `this` inside a method means "the object the method was called ON".
 *     obj.greet()       this === obj
 *   An ARROW function has no `this` of its own, so it does NOT work as a
 *   method here. (Topic 05 covers `this` properly — this file only needs
 *   the method-call case.)
 *
 *   PROPERTY CONTROL
 *     Object.freeze(obj)   no add, no change, no delete       (shallow)
 *     Object.seal(obj)     no add, no delete; changes allowed (shallow)
 *     Object.defineProperty(obj, key, { value, writable, enumerable, ... })
 *       enumerable: false hides a key from Object.keys and for...in
 * ==========================================================================*/

section('Exercise 1 — method shorthand');
/* Build { width, height, area() } where area() returns width * height.
 * Use the shorthand form and `this`.
 * makeRect(3, 4).area() -> 12                                    */
function makeRect(width, height) {
  // your code here
}
check('area', () => makeRect(3, 4).area(), 12);
check('fields kept', () => makeRect(3, 4).width, 3);

section('Exercise 2 — a getter');
/* Same rectangle, but `area` is a GETTER — called without parentheses.
 * makeRect2(3, 4).area -> 12
 * It must stay correct after the width changes.                  */
function makeRect2(width, height) {
  // your code here
}
check('getter', () => makeRect2(3, 4).area, 12);
check('stays live', () => {
  const r = makeRect2(3, 4);
  r.width = 10;
  return r.area;
}, 40);

section('Exercise 3 — a setter');
/* makeTemp() returns an object with a `celsius` property and a
 * `fahrenheit` getter AND setter.
 *   t.celsius = 100  ->  t.fahrenheit === 212
 *   t.fahrenheit = 32 ->  t.celsius === 0                        */
function makeTemp() {
  // your code here
}
check('getter side', () => { const t = makeTemp(); t.celsius = 100; return t.fahrenheit; }, 212);
check('setter side', () => { const t = makeTemp(); t.fahrenheit = 32; return t.celsius; }, 0);

section('Exercise 4 — a counter with private state');
/* makeCounter() returns { increment(), get value }.
 * The count must NOT be reachable as a normal property:
 *   Object.keys(counter) must not contain 'count'.
 * Hint: keep the number in a local variable that the methods close over. */
function makeCounter() {
  // your code here
}
check('starts at 0', () => makeCounter().value, 0);
check('increments', () => { const c = makeCounter(); c.increment(); c.increment(); return c.value; }, 2);
check('counters are independent', () => {
  const a = makeCounter(); const b = makeCounter();
  a.increment();
  return [a.value, b.value];
}, [1, 0]);
check('no count key', () => Object.keys(makeCounter()).includes('count'), false, makeCounter);

section('Exercise 5 — chainable methods');
/* Each method returns `this`, so calls can chain.
 * makeBuilder().add('a').add('b').result() -> 'a b'              */
function makeBuilder() {
  // your code here
}
check('chained', () => makeBuilder().add('a').add('b').result(), 'a b');
check('empty', () => makeBuilder().result(), '');

section('Exercise 6 — freeze vs seal');
/* frozen(obj): return obj frozen.  sealed(obj): return obj sealed.
 * Then read the checks to see exactly what each one blocks.      */
function frozen(obj) {
  // your code here
}
function sealed(obj) {
  // your code here
}
check('frozen blocks a change', () => {
  const o = frozen({ a: 1 });
  try { o.a = 2; } catch { /* strict mode throws */ }
  return o.a;
}, 1);
check('sealed ALLOWS a change', () => {
  const o = sealed({ a: 1 });
  o.a = 2;
  return o.a;
}, 2);
check('sealed blocks a new key', () => {
  const o = sealed({ a: 1 });
  try { o.b = 9; } catch { /* strict mode throws */ }
  return Object.keys(o);
}, ['a']);

section('Exercise 7 — deepFreeze');
/* Freeze an object AND every nested plain object inside it.
 * deepFreeze({ a: { b: 1 } }) then a mutation of .a.b does nothing. */
function deepFreeze(obj) {
  // your code here
}
check('nested is frozen', () => {
  const o = deepFreeze({ a: { b: 1 } });
  try { o.a.b = 99; } catch { /* strict mode throws */ }
  return o.a.b;
}, 1);
check('returns the object', () => Object.isFrozen(deepFreeze({ a: 1 })), true, deepFreeze);

section('Exercise 8 — a hidden property');
/* Add `secret` to the object so that:
 *   obj.secret works,
 *   but Object.keys(obj) does NOT list it.
 * Use Object.defineProperty with enumerable: false.              */
function addSecret(obj, value) {
  // your code here
}
check('readable', () => addSecret({ a: 1 }, 'shh').secret, 'shh');
check('hidden from keys', () => Object.keys(addSecret({ a: 1 }, 'shh')), ['a']);
check('hidden from JSON', () => JSON.stringify(addSecret({ a: 1 }, 'shh')), '{"a":1}');

section('Exercise 9 — a read-only property');
/* Add `id` that cannot be overwritten (writable: false).
 * Writing to it in strict mode throws — the check catches that.  */
function addReadOnlyId(obj, id) {
  // your code here
}
check('reads', () => addReadOnlyId({}, 'x1').id, 'x1');
check('cannot be changed', () => {
  const o = addReadOnlyId({}, 'x1');
  try { o.id = 'x2'; } catch { /* expected in strict mode */ }
  return o.id;
}, 'x1');

section('PREDICTIONS');

// P1: an arrow method cannot see the object it sits on — it has no `this`
//     of its own, so it uses the `this` of the surrounding file.
const o1 = { n: 5, arrowN: () => this?.n, methodN() { return this.n; } };
let p1 = null;
check('P1  String(o1.arrowN())', p1, String(o1.arrowN()));
log('contrast', `the shorthand method works: o1.methodN() === ${o1.methodN()}`);

// P2: a getter has no parentheses
const o2 = { get double() { return 21 * 2; } };
let p2 = null;
check('P2  typeof o2.double', p2, typeof o2.double);

// P3: does a getter show up in Object.keys?
let p3 = null;
check('P3  Object.keys({ get a() { return 1; } })', p3, Object.keys({ get a() { return 1; } }));

// P4: how does JSON.stringify treat a getter?
let p4 = null;
check('P4  JSON.stringify({ get a() { return 1; } })', p4, JSON.stringify({ get a() { return 1; } }));

// P5: a method detached from its object
const o5 = { n: 7, getN() { return this?.n; } };
const loose = o5.getN;
let p5 = null;
check('P5  String(loose())  — called with no object', p5, String(loose()));

log('coming later', 'topic 05 (this, classes & prototypes) picks P5 apart properly');

report();
