'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 02 — CONSTRUCTOR FUNCTIONS & `new`
 *
 * Before `class` there were constructor functions. `class` is built on top
 * of exactly this, so understanding `new` is understanding classes.
 *
 * WHAT `new Foo(args)` ACTUALLY DOES — four steps, memorise them:
 *   1. Creates a brand new empty object.
 *   2. Links it: newObject's prototype = Foo.prototype.
 *   3. Calls Foo with `this` set to that new object.
 *   4. Returns the new object — UNLESS the function returns an object of
 *      its own, in which case that wins. (Returning a primitive is ignored.)
 *
 * CONVENTION: constructor functions get a Capital First Letter. It is only
 * a convention, but every JavaScript developer relies on it.
 *
 * FORGETTING `new` is the classic bug. In strict mode `this` is undefined,
 * so it throws. In sloppy mode it silently writes to the global object.
 * `new.target` tells you inside the function whether `new` was used.
 * ==========================================================================*/

section('Exercise 1 — your first constructor');
/* Point(1, 2) used with `new` gives { x: 1, y: 2 }.
 * Assign to `this` — do not return anything.                     */
function Point(x, y) {
  // your code here
}
check('fields', () => ({ ...new Point(1, 2) }), { x: 1, y: 2 }, Point);
check('is a Point', () => new Point(1, 2) instanceof Point, true, Point);
check('two points are separate', () => new Point(1, 2) !== new Point(1, 2), true, Point);

section('Exercise 2 — methods inside the constructor');
/* Dog(name) gets a name and a speak() method defined INSIDE the
 * constructor. speak() returns '<name> says woof'.
 * Note this is the factory problem again: every dog gets its own copy.  */
function Dog(name) {
  // your code here
}
check('speak', () => new Dog('Rex').speak(), 'Rex says woof');
check('each instance has its own copy', () => new Dog('a').speak !== new Dog('b').speak, true, Dog);

section('Exercise 3 — methods on the prototype');
/* Same thing, done properly. Cat(name) only sets this.name, and speak
 * lives on Cat.prototype so every cat SHARES one function.
 * Write the constructor, then attach the method after it.        */
function Cat(name) {
  // your code here
}
// your code here: Cat.prototype.speak = function () { ... };
check('speak', () => new Cat('Tom').speak(), 'Tom says meow');
check('the method is shared', () => new Cat('a').speak === new Cat('b').speak, true, Cat);
check('name is an own property', () => Object.keys(new Cat('Tom')), ['name'], Cat);
check('speak is NOT an own property', () => Object.keys(new Cat('Tom')).includes('speak'), false, Cat);

section('Exercise 4 — forgetting new');
/* Call Point WITHOUT new inside a try/catch and report what happens.
 * In this strict-mode file `this` is undefined, so assigning to
 * this.x throws. Return the error constructor name.              */
function callWithoutNew() {
  // your code here
}
check('throws without new', callWithoutNew(), 'TypeError');

section('Exercise 5 — new.target');
/* SafePoint works with OR without `new`: when called without it, it
 * calls itself properly and returns the result.
 * Hint: if (!new.target) return new SafePoint(x, y);             */
function SafePoint(x, y) {
  // your code here
}
check('with new', () => ({ ...new SafePoint(1, 2) }), { x: 1, y: 2 }, SafePoint);
check('without new', () => ({ ...SafePoint(3, 4) }), { x: 3, y: 4 }, SafePoint);
check('still a SafePoint', () => SafePoint(1, 2) instanceof SafePoint, true, SafePoint);

section('Exercise 6 — returning an object overrides `new`');
/* Weird(x) sets this.x = x but then RETURNS a different object entirely.
 * Return { hijacked: true } from it and watch `new` hand that back.  */
function Weird(x) {
  // your code here
}
check('the returned object wins', () => new Weird(1), { hijacked: true }, Weird);
check('so it is not a Weird', () => new Weird(1) instanceof Weird, false, Weird);

section('Exercise 7 — returning a primitive is ignored');
/* Ignored(x) sets this.x = x and then returns the number 42.
 * `new` throws the primitive away and gives you the object.      */
function Ignored(x) {
  // your code here
}
check('primitive is discarded', () => ({ ...new Ignored(5) }), { x: 5 }, Ignored);
check('still an Ignored', () => new Ignored(5) instanceof Ignored, true, Ignored);

section('Exercise 8 — constructor with defaults and validation');
/* User(name, role) defaults role to 'user' and throws 'name is required'
 * with no name.                                                  */
function User(name, role = 'user') {
  // your code here
}
check('defaults', () => ({ ...new User('Asha') }), { name: 'Asha', role: 'user' }, User);
check('explicit role', () => ({ ...new User('Ben', 'admin') }), { name: 'Ben', role: 'admin' }, User);
check('throws', () => {
  try { return new User(); } catch (e) { return e.message; }
}, 'name is required', User);

section('Exercise 9 — several prototype methods');
/* Rectangle(w, h) with area(), perimeter() and describe() on the
 * prototype. describe() returns '3x4 area 12'.
 * Build them with Object.assign(Rectangle.prototype, { ... }).   */
function Rectangle(w, h) {
  // your code here
}
// your code here: Object.assign(Rectangle.prototype, { area() {...}, ... });
check('area', () => new Rectangle(3, 4).area(), 12);
check('perimeter', () => new Rectangle(3, 4).perimeter(), 14);
check('describe', () => new Rectangle(3, 4).describe(), '3x4 area 12');
check('all shared', () => {
  const a = new Rectangle(1, 1); const b = new Rectangle(2, 2);
  return a.area === b.area && a.describe === b.describe;
}, true, Rectangle);

section('Exercise 10 — an instance counter');
/* Every Widget() increments a count stored on the CONSTRUCTOR itself
 * (functions are objects, so Widget.count works).
 * Widget.count starts at 0 and rises with each new Widget.
 * Widget.reset() sets it back to 0.                              */
function Widget() {
  // your code here
}
Widget.count = 0;
// your code here: Widget.reset = function () { ... };
check('counts', () => {
  Widget.reset();
  new Widget(); new Widget();
  return Widget.count;
}, 2, Widget);
check('reset', () => { Widget.reset(); return Widget.count; }, 0);

section('PREDICTIONS');

// P1: what is `this` inside a constructor called with new?
function P1c() { this.tag = 'set'; }
let p1 = null;
check('P1  new P1c().tag', p1, new P1c().tag);

// P2: does a constructor return anything by default?
function P2c() { this.a = 1; }
let p2 = null;
check('P2  Object.keys(new P2c())', p2, Object.keys(new P2c()));

// P3: where do prototype methods show up?
function P3c() {}
P3c.prototype.go = function () {};
let p3 = null;
check('P3  Object.keys(new P3c())', p3, Object.keys(new P3c()));

// P4: ...but are they reachable?
let p4 = null;
check('P4  typeof new P3c().go', p4, typeof new P3c().go);

// P5: is the prototype property on the instance or the function?
let p5 = null;
check('P5  String(new P3c().prototype)', p5, String(new P3c().prototype));

// P6: new.target when called normally
function P6c() { return new.target === undefined ? 'no new' : 'new'; }
let p6 = null;
check('P6  P6c() called without new', p6, P6c());

// P7: the constructor property of an instance
function P7c() {}
let p7 = null;
check('P7  new P7c().constructor === P7c', p7, new P7c().constructor === P7c);

log('remember', '`new` does four things — new object, link prototype, run with this, return it');

report();
