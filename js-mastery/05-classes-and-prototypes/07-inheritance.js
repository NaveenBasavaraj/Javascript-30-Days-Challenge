'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 07 — INHERITANCE
 *
 *   class Dog extends Animal { ... }
 *
 * `extends` does two links at once:
 *   Dog.prototype  -> Animal.prototype     (instance methods)
 *   Dog            -> Animal               (static methods are inherited too)
 *
 * `super` has two jobs:
 *   super(args)      in a constructor: run the parent constructor.
 *                    You MUST call it before touching `this`, and you must
 *                    call it at all if your subclass has a constructor.
 *   super.method()   anywhere else: call the parent's version of a method,
 *                    which is how you EXTEND behaviour instead of replacing
 *                    it.
 *
 * OVERRIDING is just defining a method with the same name lower down the
 * chain. Lookup finds the nearest one and stops.
 *
 * If a subclass declares NO constructor, it gets an implicit one:
 *   constructor(...args) { super(...args); }
 *
 * #PRIVATE FIELDS ARE NOT INHERITED. A subclass cannot see its parent's
 * #fields — expose them through a protected-by-convention getter if the
 * subclass genuinely needs them.
 * ==========================================================================*/

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  describe() {
    return `${this.name}: ${this.speak()}`;
  }

  static create(name) {
    return new this(name);
  }
}

section('Exercise 1 — extends with no constructor');
/* Fish extends Animal and only overrides speak() -> '<name> blubs'.
 * It needs no constructor of its own.                            */
class Fish extends Animal {
  // your code here
}
check('inherits the constructor', () => new Fish('Nemo').name, 'Nemo', Fish);
check('overrides speak', () => new Fish('Nemo').speak(), 'Nemo blubs');
check('inherits describe', () => new Fish('Nemo').describe(), 'Nemo: Nemo blubs');
check('is a Fish', () => new Fish('x') instanceof Fish, true, Fish);
check('is also an Animal', () => new Fish('x') instanceof Animal, true, Fish);

section('Exercise 2 — a subclass constructor');
/* Dog extends Animal, takes (name, breed), calls super(name), stores
 * this.breed, and overrides speak() -> '<name> says woof'.       */
class Dog extends Animal {
  // your code here
}
check('name from super', () => new Dog('Rex', 'lab').name, 'Rex', Dog);
check('own field', () => new Dog('Rex', 'lab').breed, 'lab');
check('speak', () => new Dog('Rex', 'lab').speak(), 'Rex says woof');
check('describe uses the override', () => new Dog('Rex', 'lab').describe(), 'Rex: Rex says woof');

section('Exercise 3 — forgetting super');
/* Broken extends Animal with a constructor that assigns this.x = 1
 * WITHOUT calling super first. Report the error constructor name.  */
class Broken extends Animal {
  // your code here
}
function buildBroken() {
  try { return new Broken('x'); } catch (e) { return e.constructor.name; }
}
check('this before super throws', buildBroken(), 'ReferenceError');

section('Exercise 4 — extending, not replacing');
/* LoudDog extends Dog. Its speak() calls super.speak() and uppercases
 * the result. No duplicated wording.
 * new LoudDog('Rex', 'lab').speak() -> 'REX SAYS WOOF'           */
class LoudDog extends Dog {
  // your code here
}
check('extends the parent method', () => new LoudDog('Rex', 'lab').speak(), 'REX SAYS WOOF');
check('still has breed', () => new LoudDog('Rex', 'lab').breed, 'lab');
check('three levels of instanceof', () => {
  const d = new LoudDog('a', 'b');
  return [d instanceof LoudDog, d instanceof Dog, d instanceof Animal];
}, [true, true, true], LoudDog);

section('Exercise 5 — the prototype chain of a subclass');
/* chainNames(new LoudDog('a','b')) -> the constructor names up the chain
 * -> ['LoudDog', 'Dog', 'Animal', 'Object']
 * Walk with Object.getPrototypeOf and read .constructor.name.    */
function chainNames(instance) {
  // your code here
}
check('three levels plus Object', chainNames(new LoudDog('a', 'b')),
  ['LoudDog', 'Dog', 'Animal', 'Object']);
check('a plain object', chainNames({}), ['Object']);

section('Exercise 6 — inherited statics');
/* Animal.create uses `new this(name)`, so a subclass inherits it AND
 * builds the right type.
 * Fish.create('Nemo') must be a Fish, not a plain Animal.        */
function staticInheritance() {
  // your code here: return [Fish.create('Nemo') instanceof Fish,
  //                         Fish.create('Nemo').speak()]
}
check('statics are inherited and polymorphic', staticInheritance(), [true, 'Nemo blubs']);

section('Exercise 7 — an abstract base class');
/* Shape cannot be instantiated directly — its constructor throws
 * 'Shape is abstract' when new.target is Shape itself.
 * area() throws 'not implemented' unless a subclass overrides it.
 * Square extends Shape and implements area().                    */
class Shape {
  // your code here
}
class Square extends Shape {
  // your code here
}
check('cannot build a Shape', () => {
  try { return new Shape(); } catch (e) { return e.message; }
}, 'Shape is abstract');
check('subclasses are fine', () => new Square(3).area(), 9);
check('a subclass that forgets area', () => {
  class Blob extends Shape {}
  try { return new Blob().area(); } catch (e) { return e.message; }
}, 'not implemented');

section('Exercise 8 — overriding a getter');
/* Employee extends Person. Person has a `label` getter returning the name;
 * Employee's returns '<name> (<role>)'.                          */
class Person {
  constructor(name) { this.name = name; }
  get label() { return this.name; }
}
class Employee extends Person {
  // your code here
}
check('parent getter', () => new Person('Asha').label, 'Asha', Employee);
check('child getter', () => new Employee('Asha', 'dev').label, 'Asha (dev)');
check('reaching the parent getter with super', () => {
  class Shouty extends Employee {
    get label() { return super.label.toUpperCase(); }
  }
  return new Shouty('Asha', 'dev').label;
}, 'ASHA (DEV)');

section('Exercise 9 — extending a built-in');
/* Stack extends Array with a peek() returning the last item and a
 * top getter doing the same.
 * Built-ins can be extended, but think twice before doing it in real
 * code — every Array method still applies.                       */
class Stack extends Array {
  // your code here
}
check('peek', () => { const s = new Stack(); s.push('a', 'b'); return s.peek(); }, 'b');
check('empty peek', () => String(new Stack().peek()), 'undefined');
check('still an Array', () => {
  const s = new Stack();
  s.push(1, 2, 3);
  return [s.length, Array.isArray(s), s.filter((n) => n > 1).length];
}, [3, true, 2], Stack);

section('Exercise 10 — super in a static method');
/* Base has a static describe() returning 'base'.
 * Derived's static describe() returns 'derived of <parent result>'.  */
class Base {
  static describe() { return 'base'; }
}
class Derived extends Base {
  // your code here
}
check('static super', () => Derived.describe(), 'derived of base');
check('parent unchanged', () => Base.describe(), 'base', Derived);

section('PREDICTIONS');

// P1: the two links extends creates
class P1a {}
class P1b extends P1a {}
let p1 = null;
check('P1  Object.getPrototypeOf(P1b.prototype) === P1a.prototype', p1,
  Object.getPrototypeOf(P1b.prototype) === P1a.prototype);

// P2: and the static link
let p2 = null;
check('P2  Object.getPrototypeOf(P1b) === P1a', p2, Object.getPrototypeOf(P1b) === P1a);

// P3: which speak() runs when the parent calls it?
class P3a {
  speak() { return 'parent'; }
  run() { return this.speak(); }
}
class P3b extends P3a { speak() { return 'child'; } }
let p3 = null;
check('P3  new P3b().run()', p3, new P3b().run());

// P4: does a subclass see the parent's private field?
class P4a { #v = 1; getV() { return this.#v; } }
class P4b extends P4a {}
let p4 = null;
check('P4  new P4b().getV()', p4, new P4b().getV());

// P5: the implicit subclass constructor
class P5a { constructor(a, b) { this.sum = a + b; } }
class P5b extends P5a {}
let p5 = null;
check('P5  new P5b(2, 3).sum', p5, new P5b(2, 3).sum);

// P6: constructor.name after extending
class P6a {}
class P6b extends P6a {}
let p6 = null;
check('P6  new P6b().constructor.name', p6, new P6b().constructor.name);

// P7: instanceof up the chain
let p7 = null;
check('P7  new P6b() instanceof P6a', p7, new P6b() instanceof P6a);

log('the mental model', 'extends just wires two prototype chains — one for instances, one for statics');

report();
