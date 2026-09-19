'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 03 — PROTOTYPES (the thing classes are made of)
 *
 * Every object has a hidden link to another object, called its PROTOTYPE.
 * When you read a property that the object does not have, JavaScript
 * follows that link, and keeps following it, until it finds the property
 * or reaches null. That chain is the whole inheritance system.
 *
 * TWO NAMES THAT LOOK ALIKE AND ARE NOT THE SAME THING:
 *   SomeFunction.prototype
 *     A plain object hanging off a FUNCTION. It becomes the prototype of
 *     every object made with `new SomeFunction()`. Only useful on
 *     constructors.
 *   someObject.__proto__     (properly: Object.getPrototypeOf(someObject))
 *     The actual link on an INSTANCE, pointing at the object it inherits
 *     from.
 *   So:  Object.getPrototypeOf(new Dog()) === Dog.prototype
 *
 * READING walks the chain. WRITING never does: assigning to obj.x always
 * creates an OWN property on obj, shadowing whatever the chain had.
 *
 * THE CHAIN ENDS AT null:
 *   new Dog() -> Dog.prototype -> Object.prototype -> null
 *
 * TOOLS
 *   Object.create(proto)           a new object with that prototype
 *   Object.getPrototypeOf(obj)     read the link
 *   Object.setPrototypeOf(o, p)    change it (slow — avoid in hot code)
 *   obj.hasOwnProperty(k)          own property, ignoring the chain
 *   Object.hasOwn(obj, k)          the modern, safer spelling
 *   k in obj                       own OR inherited
 * ==========================================================================*/

section('Exercise 1 — Object.create');
/* Build an object whose prototype is `animal`, and which has its own name.
 * makeFrom(animal, 'Rex').speak() -> 'Rex makes a sound'
 * The speak method must come from the prototype, not be copied.  */
const animal = {
  speak() { return `${this.name} makes a sound`; },
};
function makeFrom(proto, name) {
  // your code here
}
check('inherits speak', () => makeFrom(animal, 'Rex').speak(), 'Rex makes a sound');
check('name is its own', () => Object.keys(makeFrom(animal, 'Rex')), ['name']);
check('speak is inherited, not own', () => Object.hasOwn(makeFrom(animal, 'Rex'), 'speak'), false, makeFrom);
check('the prototype is animal', () => Object.getPrototypeOf(makeFrom(animal, 'Rex')) === animal, true, makeFrom);

section('Exercise 2 — reading the link');
/* protoOf(obj) returns the object's prototype.
 * isPrototypeOfIt(proto, obj) -> true when proto is anywhere in obj's chain. */
function protoOf(obj) {
  // your code here
}
function isPrototypeOfIt(proto, obj) {
  // your code here
}
check('proto of a literal is Object.prototype', () => protoOf({}) === Object.prototype, true, protoOf);
check('direct', () => isPrototypeOfIt(animal, Object.create(animal)), true);
check('further up the chain', () => isPrototypeOfIt(Object.prototype, Object.create(animal)), true);
check('unrelated', () => isPrototypeOfIt(animal, {}), false);

section('Exercise 3 — the two prototypes');
/* Fill in the two answers for a constructor function.
 * For  function Dog() {}  and  const d = new Dog():
 *   linkedTo(Dog, d) -> true when Object.getPrototypeOf(d) === Dog.prototype */
function Dog(name) {
  this.name = name;
}
function linkedTo(Ctor, instance) {
  // your code here
}
check('the link', () => linkedTo(Dog, new Dog('a')), true);
check('not linked to a different constructor', () => linkedTo(Object, new Dog('a')), false);

section('Exercise 4 — own vs inherited');
/* countOwn(obj) -> how many OWN properties
 * countAll(obj) -> how many properties are reachable including inherited
 *                  ENUMERABLE ones (a for...in loop counts those)      */
const base = { shared: 1 };
function countOwn(obj) {
  // your code here
}
function countAll(obj) {
  // your code here
}
const child = Object.create(base);
child.mine = 2;
check('own only', countOwn(child), 1);
check('including inherited', countAll(child), 2);
check('a plain object inherits nothing enumerable', countAll({ a: 1 }), 1);

section('Exercise 5 — shadowing');
/* Writing NEVER walks the chain — it always creates an own property.
 * shadow() creates a child of `base`, assigns child.shared = 99, and
 * returns [child.shared, base.shared, Object.hasOwn(child, 'shared')].
 * The parent must be unaffected.                                 */
function shadow() {
  // your code here
}
check('shadowed', shadow(), [99, 1, true]);

section('Exercise 6 — deleting a shadow');
/* Delete the own property and the inherited one becomes visible again.
 * unshadow() -> [99, 1] : the value before the delete, and after.  */
function unshadow() {
  // your code here
}
check('the parent value reappears', unshadow(), [99, 1]);

section('Exercise 7 — walking the whole chain');
/* chainOf(obj) returns an array of every prototype up to (not including)
 * null.
 * chainOf({}) -> [Object.prototype]
 * chainOf([]) -> [Array.prototype, Object.prototype]             */
function chainOf(obj) {
  // your code here
}
check('plain object', chainOf({}), [Object.prototype]);
check('array', chainOf([]), [Array.prototype, Object.prototype]);
check('length for a Dog', () => chainOf(new Dog('a')).length, 2);
check('first link for a Dog', () => chainOf(new Dog('a'))[0] === Dog.prototype, true, chainOf);

section('Exercise 8 — an object with NO prototype');
/* Object.create(null) makes a bare dictionary with no inherited anything.
 * It is the safest shape for user-supplied keys — no clash with
 * 'toString' or '__proto__'.
 * bareDict() -> an empty object whose prototype is null.         */
function bareDict() {
  // your code here
}
check('is empty', bareDict(), {});
check('has no prototype', () => Object.getPrototypeOf(bareDict()), null);
check('has no toString', () => typeof bareDict().toString, 'undefined');
log('while a plain object', `has toString as a ${typeof ({}).toString}`);

section('Exercise 9 — why that matters');
/* A naive tally using a plain object breaks on certain keys.
 * safeTally(['a','constructor','a']) -> { a: 2, constructor: 1 }
 * Use Object.create(null) (or a Map) so inherited keys cannot interfere.
 * Return a PLAIN object at the end so the checker can compare it —
 * { ...bare } is enough.                                         */
function safeTally(items) {
  // your code here
}
check('normal keys', safeTally(['a', 'b', 'a']), { a: 2, b: 1 });
check('dangerous key', safeTally(['a', 'constructor', 'a']), { a: 2, constructor: 1 });

section('Exercise 10 — adding to a prototype after the fact');
/* Objects see prototype changes IMMEDIATELY, even ones created earlier.
 * lateAddition() creates a dog, THEN adds a fetch() method to
 * Dog.prototype, then calls the already-created dog's fetch().
 * It must return 'Rex fetches'.                                  */
function lateAddition() {
  // your code here
}
check('live link', lateAddition(), 'Rex fetches');

section('PREDICTIONS');

// P1: the two spellings of the same link
function P1c() {}
let p1 = null;
check('P1  Object.getPrototypeOf(new P1c()) === P1c.prototype', p1,
  Object.getPrototypeOf(new P1c()) === P1c.prototype);

// P2: does an INSTANCE have a .prototype property?
let p2 = null;
check('P2  String(new P1c().prototype)', p2, String(new P1c().prototype));

// P3: where does the chain end?
let p3 = '???';   // placeholder is a string here — write the real value
check('P3  Object.getPrototypeOf(Object.prototype)', p3, Object.getPrototypeOf(Object.prototype));

// P4: writing to an inherited property
const parent4 = { v: 'parent' };
const child4 = Object.create(parent4);
child4.v = 'child';
let p4 = null;
check('P4  parent4.v after child4.v = "child"', p4, parent4.v);

// P5: `in` vs hasOwn
const child5 = Object.create({ inherited: 1 });
let p5 = null;
check('P5  ["inherited" in child5, Object.hasOwn(child5, "inherited")]', p5,
  ['inherited' in child5, Object.hasOwn(child5, 'inherited')]);

// P6: an array's prototype chain length
let p6 = null;
check('P6  chain length of []', p6, (() => {
  let n = 0; let o = [];
  while ((o = Object.getPrototypeOf(o)) !== null) n++;
  return n;
})());

// P7: is a function an object with a prototype chain too?
let p7 = null;
check('P7  Object.getPrototypeOf(function () {}) === Function.prototype', p7,
  Object.getPrototypeOf(function () {}) === Function.prototype);

// P8: mutating a built-in prototype affects everything (do not do this)
Array.prototype.__temp = 'oops';
let p8 = null;
check('P8  [].__temp', p8, [].__temp);
delete Array.prototype.__temp;

log('the one-liner', 'reading walks the chain, writing never does');

report();
