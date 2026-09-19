'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 04 — THE CLASS SYNTAX
 *
 * Everything from files 02 and 03, with nicer spelling. A class IS a
 * function, and its methods DO live on the prototype — check it yourself
 * in the predictions at the bottom.
 *
 *   class Dog {
 *     constructor(name) { this.name = name; }   // runs on `new`
 *     speak() { return `${this.name} says woof`; }   // on Dog.prototype
 *   }
 *
 * WHAT CLASSES ADD OVER CONSTRUCTOR FUNCTIONS
 *   • The body is always strict mode.
 *   • Calling one without `new` always throws — no silent global writes.
 *   • Declarations are NOT hoisted the way functions are: a class sits in
 *     the temporal dead zone until its definition runs.
 *   • Clean syntax for getters, statics, private fields and `extends`.
 *
 *   INSTANCE FIELDS can be declared directly in the body:
 *     class Counter { count = 0; }
 *   Those are OWN properties of each instance, assigned before the
 *   constructor body runs.
 *
 *   Classes can also be expressions:  const C = class { ... };
 * ==========================================================================*/

section('Exercise 1 — your first class');
/* Point with x and y, and a toString() returning '(1, 2)'.       */
class Point {
  // your code here
}
check('fields', () => ({ ...new Point(1, 2) }), { x: 1, y: 2 }, Point);
check('toString', () => new Point(1, 2).toString(), '(1, 2)', Point);
check('instanceof', () => new Point(1, 2) instanceof Point, true, Point);

section('Exercise 2 — methods live on the prototype');
/* Dog(name) with speak() -> '<name> says woof'.
 * Then confirm every dog shares ONE speak function.              */
class Dog {
  // your code here
}
check('speak', () => new Dog('Rex').speak(), 'Rex says woof');
check('shared method', () => new Dog('a').speak === new Dog('b').speak, true, Dog);
check('not an own property', () => Object.hasOwn(new Dog('a'), 'speak'), false, Dog);
check('it is on Dog.prototype', () => Object.hasOwn(Dog.prototype, 'speak'), true, Dog);

section('Exercise 3 — instance fields');
/* Counter with a `count` field starting at 0 (declared in the class body,
 * NOT in a constructor) and an increment() returning the new count.  */
class Counter {
  // your code here
}
check('starts at 0', () => new Counter().count, 0);
check('increments', () => { const c = new Counter(); c.increment(); return c.increment(); }, 2);
check('counters are independent', () => {
  const a = new Counter(); const b = new Counter();
  a.increment();
  return b.count;
}, 0);
check('count IS an own property', () => Object.hasOwn(new Counter(), 'count'), true, Counter);

section('Exercise 4 — methods calling other methods');
/* Rectangle(w, h) with area(), perimeter() and describe().
 * describe() must CALL the other two, not repeat their maths.
 * new Rectangle(3, 4).describe() -> '3x4: area 12, perimeter 14' */
class Rectangle {
  // your code here
}
check('area', () => new Rectangle(3, 4).area(), 12);
check('perimeter', () => new Rectangle(3, 4).perimeter(), 14);
check('describe', () => new Rectangle(3, 4).describe(), '3x4: area 12, perimeter 14');

section('Exercise 5 — a class with a collection inside');
/* Playlist starts empty.
 *   add(song)    returns the new length
 *   remove(song) returns true if it was there, false otherwise
 *   has(song)    true / false
 *   get size     — a GETTER, so playlist.size has no parentheses
 *   all()        returns a COPY of the songs                     */
class Playlist {
  // your code here
}
check('add', () => { const p = new Playlist(); p.add('a'); return p.add('b'); }, 2);
check('has', () => { const p = new Playlist(); p.add('a'); return [p.has('a'), p.has('z')]; }, [true, false]);
check('remove', () => { const p = new Playlist(); p.add('a'); return [p.remove('a'), p.remove('a')]; }, [true, false]);
check('size getter', () => { const p = new Playlist(); p.add('a'); return p.size; }, 1);
check('all returns a copy', () => {
  const p = new Playlist();
  p.add('a');
  p.all().push('hacked');
  return p.size;
}, 1);

section('Exercise 6 — calling a class without new');
/* Return the error constructor name when Point is called bare.
 * Unlike a constructor function, this ALWAYS throws.             */
function callWithoutNew() {
  // your code here
}
check('always throws', callWithoutNew(), 'TypeError');

section('Exercise 7 — a class expression');
/* Assign an anonymous class to `Temp` with a constructor taking celsius
 * and a fahrenheit() method.                                     */
const Temp = null; // replace with a class expression
check('celsius stored', () => new Temp(100).celsius, 100);
check('converts', () => new Temp(100).fahrenheit(), 212);
check('freezing', () => new Temp(0).fahrenheit(), 32);

section('Exercise 8 — methods that return this');
/* QueryBuilder chains:
 *   new QueryBuilder().select('a').where('b > 1').build()
 *     -> 'SELECT a WHERE b > 1'
 *   new QueryBuilder().build() -> 'SELECT * WHERE 1'
 * Multiple selects join with ', ' and multiple wheres with ' AND '.  */
class QueryBuilder {
  // your code here
}
check('chained', () => new QueryBuilder().select('a').where('b > 1').build(),
  'SELECT a WHERE b > 1');
check('defaults', () => new QueryBuilder().build(), 'SELECT * WHERE 1');
check('multiple', () => new QueryBuilder().select('a').select('b').where('x').where('y').build(),
  'SELECT a, b WHERE x AND y');

section('Exercise 9 — comparing instances');
/* Money(amount, currency) with equals(other) comparing BOTH fields,
 * and add(other) returning a NEW Money — or throwing
 * 'currency mismatch' when the currencies differ.                */
class Money {
  // your code here
}
check('equals', () => new Money(5, 'INR').equals(new Money(5, 'INR')), true);
check('different amount', () => new Money(5, 'INR').equals(new Money(6, 'INR')), false);
check('different currency', () => new Money(5, 'INR').equals(new Money(5, 'USD')), false);
check('add', () => new Money(5, 'INR').add(new Money(3, 'INR')).amount, 8);
check('add returns a new Money', () => new Money(5, 'INR').add(new Money(3, 'INR')) instanceof Money, true, Money);
check('add does not mutate', () => {
  const a = new Money(5, 'INR');
  a.add(new Money(3, 'INR'));
  return a.amount;
}, 5);
check('mismatch throws', () => {
  try { new Money(5, 'INR').add(new Money(1, 'USD')); return 'no throw'; } catch (e) { return e.message; }
}, 'currency mismatch');

section('PREDICTIONS');

// P1: what IS a class, at the type level?
class P1c {}
let p1 = null;
check('P1  typeof P1c', p1, typeof P1c);

// P2: are methods enumerable own properties of an instance?
class P2c { go() {} }
let p2 = null;
check('P2  Object.keys(new P2c())', p2, Object.keys(new P2c()));

// P3: does a for...in loop see class methods?
const seen3 = [];
for (const k in new P2c()) seen3.push(k);
let p3 = null;
check('P3  for...in over an instance', p3, seen3);

// P4: are instance fields own properties?
class P4c { field = 1; }
let p4 = null;
check('P4  Object.keys(new P4c())', p4, Object.keys(new P4c()));

// P5: class declarations and hoisting
let outcome5;
try { outcome5 = new P5c(); } catch (e) { outcome5 = e.constructor.name; }
class P5c {}
let p5 = null;
check('P5  using a class above its declaration', p5, outcome5);

// P6: is the class body strict mode even without 'use strict'?
class P6c { go() { return typeof this; } }
const loose6 = new P6c().go;
let outcome6;
try { outcome6 = loose6(); } catch (e) { outcome6 = e.constructor.name; }
let p6 = null;
check('P6  a detached class method called bare', p6, outcome6);

// P7: where does an instance method come from?
let p7 = null;
check('P7  Object.getPrototypeOf(new P2c()) === P2c.prototype', p7,
  Object.getPrototypeOf(new P2c()) === P2c.prototype);

log('the summary', 'class is real syntax sugar — same prototypes, safer defaults');

report();
