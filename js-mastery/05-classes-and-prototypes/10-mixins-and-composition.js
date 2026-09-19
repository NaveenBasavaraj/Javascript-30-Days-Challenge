'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 10 — MIXINS & COMPOSITION OVER INHERITANCE
 *
 * A class has exactly ONE parent. Real objects need capabilities from
 * several places — a Duck can swim AND fly, and neither belongs in a
 * shared ancestor.
 *
 * THE INHERITANCE TRAP: you start with Animal -> Bird -> Duck, then need a
 * Penguin that swims but cannot fly, and a Bat that flies but is not a
 * bird. The tree cannot express it. Every deep hierarchy hits this.
 *
 * THREE WAYS OUT
 *
 *   1. OBJECT MIXINS — copy methods onto a prototype:
 *        Object.assign(Duck.prototype, canSwim, canFly);
 *
 *   2. CLASS MIXINS — a function taking a class and returning a subclass:
 *        const Swimmer = (Base) => class extends Base { swim() {...} };
 *        class Duck extends Swimmer(Flyer(Animal)) {}
 *      Composable, and `super` still works through the chain.
 *
 *   3. COMPOSITION — hold a collaborator instead of inheriting from it:
 *        class Duck { constructor() { this.engine = new FlightEngine(); } }
 *      Usually the best answer. "Has a" beats "is a" far more often than
 *      object-oriented tutorials suggest.
 *
 * Favour composition. Reach for a mixin when several unrelated classes
 * need the same small behaviour.
 * ==========================================================================*/

section('Exercise 1 — object mixins');
/* Two plain objects of methods, copied onto a class prototype.
 * canSwim.swim() -> '<name> swims'
 * canFly.fly()   -> '<name> flies'
 * Both use this.name, so they must be regular functions.         */
const canSwim = {
  // your code here
};
const canFly = {
  // your code here
};
class Duck {
  constructor(name) { this.name = name; }
}
// your code here: Object.assign(Duck.prototype, canSwim, canFly);
check('swims', () => new Duck('Donald').swim(), 'Donald swims');
check('flies', () => new Duck('Donald').fly(), 'Donald flies');
check('the methods are shared', () => [new Duck('a').swim === new Duck('b').swim, typeof new Duck('a').swim], [true, 'function']);
check('they are not own properties',
  () => [Object.keys(new Duck('a')), Object.hasOwn(new Duck('a'), 'swim'), typeof new Duck('a').swim],
  [['name'], false, 'function']);

section('Exercise 2 — a class mixin');
/* Timestamped(Base) returns a subclass adding a `createdAt` field set to
 * the number passed in, and a getter `age` taking a "now" argument:
 *   ageAt(now) -> now - createdAt
 * class Doc extends Timestamped(Object) {}                       */
const Timestamped = (Base) => class extends Base {
  // your code here
};
class Doc extends Timestamped(Object) {
  constructor(createdAt) {
    super();
    this.createdAt = createdAt;
  }
}
check('ageAt', () => new Doc(100).ageAt(150), 50);
check('still a Doc', () => [new Doc(1) instanceof Doc, typeof new Doc(1).ageAt], [true, 'function']);

section('Exercise 3 — stacking mixins');
/* Two mixins, applied together.
 *   Serialisable(Base) adds toJSONString() -> JSON.stringify(this)
 *   Comparable(Base)   adds equals(other) -> same JSON string
 * class Item extends Serialisable(Comparable(Object)) {}         */
const Serialisable = (Base) => class extends Base {
  // your code here
};
const Comparable = (Base) => class extends Base {
  // your code here
};
class Item extends Serialisable(Comparable(Object)) {
  constructor(id) {
    super();
    this.id = id;
  }
}
check('serialises', () => new Item(1).toJSONString(), '{"id":1}');
check('equal items', () => new Item(1).equals(new Item(1)), true);
check('different items', () => new Item(1).equals(new Item(2)), false);
check('both mixins present', () => {
  const i = new Item(1);
  return [typeof i.toJSONString, typeof i.equals];
}, ['function', 'function']);

section('Exercise 4 — a mixin that calls super');
/* Logged(Base) overrides describe() to wrap the parent version:
 *   '[LOG] <parent result>'
 * That only works because a class mixin creates a real subclass.  */
class Thing {
  describe() { return 'a thing'; }
}
const Logged = (Base) => class extends Base {
  // your code here
};
class LoggedThing extends Logged(Thing) {}
check('wraps the parent', () => new LoggedThing().describe(), '[LOG] a thing');
check('the original is untouched', () => new Thing().describe(), 'a thing', Logged);

section('Exercise 5 — composition instead');
/* The same capability, held rather than inherited.
 * Engine has start() -> 'vroom'.
 * Car HOLDS an Engine and delegates: car.start() -> 'vroom'.
 * Car must NOT extend Engine.                                    */
class Engine {
  start() { return 'vroom'; }
}
class Car {
  // your code here
}
check('delegates', () => new Car().start(), 'vroom');
check('is NOT an Engine', () => new Car() instanceof Engine, false, Car);
check('holds one', () => new Car().engine instanceof Engine, true, Car);

section('Exercise 6 — swapping a collaborator');
/* Because it is composition, the collaborator can be replaced at runtime.
 * Car(engine) takes one; default to a new Engine.
 * new Car(new ElectricEngine()).start() -> 'hum'                 */
class ElectricEngine {
  start() { return 'hum'; }
}
class FlexibleCar {
  // your code here
}
check('default engine', () => new FlexibleCar().start(), 'vroom');
check('injected engine', () => new FlexibleCar(new ElectricEngine()).start(), 'hum');
check('a test double works too', () => new FlexibleCar({ start: () => 'fake' }).start(), 'fake');

section('Exercise 7 — the hierarchy that does not fit');
/* Build three creatures from mixins, each with a different combination.
 * Use the object-mixin style with a shared base.
 *   makeCreature('Donald', ['swim', 'fly'])  -> can do both
 *   makeCreature('Pingu', ['swim'])          -> swims only
 * abilitiesOf(creature) -> the sorted list of ability names it has.  */
const ABILITIES = {
  swim() { return `${this.name} swims`; },
  fly() { return `${this.name} flies`; },
  run() { return `${this.name} runs`; },
};
function makeCreature(name, abilities) {
  // your code here
}
function abilitiesOf(creature) {
  // your code here: which of 'fly', 'run', 'swim' are functions on it
}
check('duck', () => makeCreature('Donald', ['swim', 'fly']).fly(), 'Donald flies');
check('penguin swims', () => makeCreature('Pingu', ['swim']).swim(), 'Pingu swims');
check('penguin cannot fly', () => typeof makeCreature('Pingu', ['swim']).fly, 'undefined');
check('abilities list', () => abilitiesOf(makeCreature('Donald', ['swim', 'fly'])), ['fly', 'swim']);
check('one ability', () => abilitiesOf(makeCreature('Pingu', ['swim'])), ['swim']);

section('Exercise 8 — delegation with a missing method');
/* Wrapper holds a target and forwards any call through call(name, ...args),
 * returning 'no such method' when the target lacks it.           */
class Wrapper {
  // your code here
}
check('forwards', () => new Wrapper({ go: (n) => n * 2 }).call('go', 5), 10);
check('missing', () => new Wrapper({}).call('nope'), 'no such method');
check('passes several arguments', () => new Wrapper({ add: (a, b) => a + b }).call('add', 2, 3), 5);

section('PREDICTIONS');

// P1: how many parents can a class have?
class P1a {}
class P1b {}
let outcome1;
try {
  // eslint-disable-next-line no-eval
  eval('class P1c extends P1a, P1b {}');
  outcome1 = 'allowed';
} catch (e) { outcome1 = e.constructor.name; }
let p1 = null;
check('P1  class C extends A, B {}', p1, outcome1);

// P2: does Object.assign onto a prototype affect existing instances?
class P2c {}
const made = new P2c();
Object.assign(P2c.prototype, { late() { return 'yes'; } });
let p2 = null;
check('P2  made.late() on an instance created earlier', p2, made.late());

// P3: are mixed-in methods own properties of the prototype?
let p3 = null;
check('P3  Object.hasOwn(P2c.prototype, "late")', p3, Object.hasOwn(P2c.prototype, 'late'));

// P4: a class mixin produces a real subclass
const Mix = (Base) => class extends Base {};
class P4a {}
class P4b extends Mix(P4a) {}
let p4 = null;
check('P4  new P4b() instanceof P4a', p4, new P4b() instanceof P4a);

// P5: what is the name of an anonymous mixin class?
let p5 = null;
check('P5  Object.getPrototypeOf(P4b).name', p5, Object.getPrototypeOf(P4b).name);

log('the rule of thumb', 'inherit to share identity, compose to share behaviour');

report();
