'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 08 — POLYMORPHISM & TYPE CHECKS
 *
 * POLYMORPHISM: write code against an INTERFACE, not a type. If every
 * shape has an area(), your total() never needs to know which shapes it
 * was handed.
 *
 *   shapes.reduce((sum, s) => sum + s.area(), 0)
 *
 * That one line is the entire point of inheritance. Everything else is
 * bookkeeping.
 *
 * CHECKING TYPES, best to worst:
 *   DUCK TYPING       typeof value.area === 'function'
 *                     "if it has the method, it will do" — most flexible,
 *                     works across module and frame boundaries.
 *   instanceof        walks the prototype chain. Breaks for objects from
 *                     another realm (an iframe, a different copy of a
 *                     library), and lies if someone reassigns prototypes.
 *   #brand in obj     unforgeable, from file 06 — best for "is this really
 *                     one of mine?"
 *   constructor.name  a string. Fine for messages, never for logic:
 *                     minifiers rename classes.
 *
 * Symbol.hasInstance lets a class define what instanceof MEANS for it.
 * ==========================================================================*/

class Shape {
  area() { throw new Error('not implemented'); }
  describe() { return `${this.constructor.name} of area ${this.area()}`; }
}
class Square extends Shape {
  constructor(side) { super(); this.side = side; }
  area() { return this.side ** 2; }
}
class Rect extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
}

section('Exercise 1 — a polymorphic total');
/* totalArea([...]) adds up area() across any mix of shapes.
 * One line, no type checks at all.                               */
function totalArea(shapes) {
  // your code here
}
check('mixed shapes', totalArea([new Square(2), new Rect(2, 3)]), 10);
check('empty', totalArea([]), 0);
check('works for a brand-new subclass', () => {
  class Circle extends Shape {
    constructor(r) { super(); this.r = r; }
    area() { return 12; }
  }
  return totalArea([new Square(1), new Circle(1)]);
}, 13);

section('Exercise 2 — describe uses the subclass name');
/* Shape.describe() is written ONCE on the base and reports the right name
 * for every subclass. Just call it.                              */
function describeAll(shapes) {
  // your code here
}
check('names', describeAll([new Square(2), new Rect(2, 3)]),
  ['Square of area 4', 'Rect of area 6']);

section('Exercise 3 — duck typing');
/* canFly(value) -> true when value has a fly() METHOD, whatever its class.
 * Nothing else about it matters.                                 */
function canFly(value) {
  // your code here
}
check('a plain object with fly', canFly({ fly: () => 'up' }), true);
check('no fly', canFly({ swim: () => 'along' }), false);
check('fly is not a function', canFly({ fly: 'yes' }), false);
check('null is safe', canFly(null), false);
check('undefined is safe', canFly(undefined), false);

section('Exercise 4 — instanceof');
/* classify(value) returns:
 *   'square' for a Square, 'shape' for any other Shape,
 *   'other' for everything else.
 * Order matters — check the most specific first.                 */
function classify(value) {
  // your code here
}
check('square', classify(new Square(1)), 'square');
check('other shape', classify(new Rect(1, 1)), 'shape');
check('plain object', classify({}), 'other');
check('null', classify(null), 'other');

section('Exercise 5 — why instanceof is not always enough');
/* An object that LOOKS like a Square but was never built by it.
 * lookalike() returns { side: 2, area() { return 4; } }.
 * Then report [instanceof result, duck-typing result] -> [false, true]  */
function lookalike() {
  // your code here
}
function compareChecks() {
  // your code here: return [lookalike() instanceof Square,
  //                         typeof lookalike().area === 'function']
}
check('the contrast', compareChecks(), [false, true]);
check('and it still totals correctly', () => totalArea([lookalike()]), 4);

section('Exercise 6 — an unforgeable brand');
/* Token has a private #id. Token.isToken(value) must return true ONLY for
 * real Tokens, using  #id in value  inside a try/catch-free expression.  */
class Token {
  #id;

  constructor(id) { this.#id = id; }

  get id() { return this.#id; }

  static isToken(value) {
    // your code here
  }
}
check('real', () => Token.isToken(new Token('a')), true);
check('lookalike', () => Token.isToken({ id: 'a' }), false);
check('null', () => Token.isToken(null), false);
check('a string', () => Token.isToken('a'), false);

section('Exercise 7 — typeName');
/* A single function that names anything sensibly:
 *   typeName(null) -> 'null'
 *   typeName([]) -> 'Array'
 *   typeName({}) -> 'Object'
 *   typeName(new Square(1)) -> 'Square'
 *   typeName(5) -> 'Number'
 *   typeName('x') -> 'String'
 *   typeName(undefined) -> 'undefined'
 * Hint: handle null and undefined first, then use
 * value.constructor.name.                                        */
function typeName(value) {
  // your code here
}
check('null', typeName(null), 'null');
check('undefined', typeName(undefined), 'undefined');
check('array', typeName([]), 'Array');
check('object', typeName({}), 'Object');
check('instance', typeName(new Square(1)), 'Square');
check('number', typeName(5), 'Number');
check('string', typeName('x'), 'String');

section('Exercise 8 — dispatch without if-chains');
/* Replace a switch on type with polymorphism. Each handler is a class
 * with a handle() method; route(event) finds the right one by its
 * static `type` and calls handle.
 * route({ type: 'click', x: 1 }) -> 'clicked at 1'
 * An unknown type -> 'unhandled'                                 */
class ClickHandler {
  static type = 'click';
  handle(event) { return `clicked at ${event.x}`; }
}
class KeyHandler {
  static type = 'key';
  handle(event) { return `pressed ${event.key}`; }
}
const HANDLERS = [ClickHandler, KeyHandler];
function route(event) {
  // your code here
}
check('click', route({ type: 'click', x: 1 }), 'clicked at 1');
check('key', route({ type: 'key', key: 'a' }), 'pressed a');
check('unknown', route({ type: 'scroll' }), 'unhandled');

section('Exercise 9 — Symbol.hasInstance');
/* Make `instanceof` mean "has a fly method" for the Flyer class, by
 * defining a static [Symbol.hasInstance](value).
 * ({ fly() {} }) instanceof Flyer -> true                        */
class Flyer {
  // your code here
}
check('duck passes', () => ({ fly() {} }) instanceof Flyer, true, Flyer);
check('non-duck fails', () => ({}) instanceof Flyer, false, Flyer);
check('null is safe', () => (null) instanceof Flyer, false, Flyer);

section('Exercise 10 — a shape sorter');
/* Sort a mixed array of shapes by area, smallest first, and return their
 * describe() strings. Do not mutate the input.                   */
function sortedDescriptions(shapes) {
  // your code here
}
const MIXED = [new Rect(3, 3), new Square(1), new Rect(1, 2)];
check('sorted', sortedDescriptions(MIXED),
  ['Square of area 1', 'Rect of area 2', 'Rect of area 9']);
check('input untouched', () => MIXED[0].area(), 9);

section('PREDICTIONS');

// P1: instanceof on a primitive
let p1 = null;
check('P1  "abc" instanceof String', p1, 'abc' instanceof String);

// P2: and on the object wrapper
let p2 = null;
check('P2  new String("abc") instanceof String', p2, new String('abc') instanceof String);

// P3: constructor.name of a plain object
let p3 = null;
check('P3  ({}).constructor.name', p3, ({}).constructor.name);

// P4: typeof a class instance
let p4 = null;
check('P4  typeof new Square(1)', p4, typeof new Square(1));

// P5: instanceof Object for an array
let p5 = null;
check('P5  [] instanceof Object', p5, [] instanceof Object);

// P6: what breaks constructor.name in production?
class P6c {}
const renamed = P6c;
let p6 = null;
check('P6  renamed.name', p6, renamed.name);
log('why P6 matters', 'a minifier renames the class, so never branch on constructor.name');

// P7: instanceof with an object that has no prototype
let p7 = null;
check('P7  Object.create(null) instanceof Object', p7, Object.create(null) instanceof Object);

report();
