'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 13 — CHALLENGES, LEVEL 2 (final boss)
 *
 * Rebuild pieces of the language and of libraries you use. If you can
 * write these, prototypes hold no more mysteries.
 * ==========================================================================*/

section('1 — implement `new` yourself');
/* myNew(Ctor, ...args) must do all four steps by hand:
 *   make an object, link its prototype, call Ctor with it as `this`,
 *   return it — unless Ctor returned an object of its own.
 * Do NOT use the `new` keyword anywhere inside.                  */
function myNew(Ctor, ...args) {
  // your code here
}
function Point(x, y) { this.x = x; this.y = y; }
Point.prototype.sum = function () { return this.x + this.y; };
function Hijack() { this.a = 1; return { b: 2 }; }
function ReturnsPrimitive() { this.a = 1; return 42; }
check('fields', () => ({ ...myNew(Point, 1, 2) }), { x: 1, y: 2 });
check('prototype linked', () => myNew(Point, 1, 2).sum(), 3);
check('instanceof works', () => myNew(Point, 1, 2) instanceof Point, true, myNew);
check('an object return wins', () => myNew(Hijack), { b: 2 });
check('a primitive return is ignored', () => ({ ...myNew(ReturnsPrimitive) }), { a: 1 });

section('2 — implement instanceof yourself');
/* myInstanceOf(value, Ctor) walks the prototype chain by hand.
 * Do not use the instanceof operator.                            */
function myInstanceOf(value, Ctor) {
  // your code here
}
class A {}
class B extends A {}
check('direct', () => myInstanceOf(new B(), B), true);
check('inherited', () => myInstanceOf(new B(), A), true);
check('and Object', () => myInstanceOf(new B(), Object), true);
check('unrelated', () => myInstanceOf(new B(), Array), false);
check('primitives are false', () => myInstanceOf(5, Object), false);
check('null is false', () => myInstanceOf(null, Object), false);

section('3 — a Money value object');
/* Money(amount, currency) — amount is in the smallest unit (integer).
 *   plus / minus return a NEW Money, throwing 'currency mismatch'
 *   times(n) scales it, rounding to a whole number
 *   equals(other)
 *   valueOf()   -> the amount, so sorting and comparison work
 *   toString()  -> '5.00 INR'
 *   toJSON()    -> { amount, currency }
 *   static zero(currency)                                        */
class Money {
  // your code here
}
check('plus', () => new Money(500, 'INR').plus(new Money(250, 'INR')).amount, 750);
check('minus', () => new Money(500, 'INR').minus(new Money(200, 'INR')).amount, 300);
check('immutable', () => {
  const a = new Money(500, 'INR');
  a.plus(new Money(1, 'INR'));
  return a.amount;
}, 500);
check('times rounds', () => new Money(333, 'INR').times(0.5).amount, 167);
check('mismatch', () => {
  try { new Money(1, 'INR').plus(new Money(1, 'USD')); return 'no throw'; } catch (e) { return e.message; }
}, 'currency mismatch');
check('toString', () => `${new Money(500, 'INR')}`, '5.00 INR');
check('sortable', () => [new Money(300, 'X'), new Money(100, 'X')].sort((a, b) => a - b).map((m) => m.amount),
  [100, 300]);
check('json', () => JSON.stringify(new Money(500, 'INR')), '{"amount":500,"currency":"INR"}');
check('zero', () => Money.zero('INR').amount, 0);
check('equals', () => [new Money(1, 'A').equals(new Money(1, 'A')), new Money(1, 'A').equals(new Money(1, 'B'))],
  [true, false]);

section('4 — an observable Store');
/* Store(initialState)
 *   getState()
 *   setState(partial)  merges, notifies every subscriber with the new
 *                      state, and returns it
 *   subscribe(fn)      returns an unsubscribe function
 *   Subscribers are NOT called when nothing actually changed
 *   (compare each key shallowly).                                */
class Store {
  // your code here
}
check('initial', () => new Store({ n: 0 }).getState(), { n: 0 });
check('merges', () => { const s = new Store({ a: 1, b: 2 }); return s.setState({ b: 3 }); }, { a: 1, b: 3 });
check('notifies', () => {
  const s = new Store({ n: 0 });
  const seen = [];
  s.subscribe((state) => seen.push(state.n));
  s.setState({ n: 1 });
  s.setState({ n: 2 });
  return seen;
}, [1, 2]);
check('unsubscribe', () => {
  const s = new Store({ n: 0 });
  let count = 0;
  const off = s.subscribe(() => { count++; });
  s.setState({ n: 1 });
  off();
  s.setState({ n: 2 });
  return count;
}, 1);
check('no notification for an unchanged value', () => {
  const s = new Store({ n: 1 });
  let count = 0;
  s.subscribe(() => { count++; });
  s.setState({ n: 1 });
  return count;
}, 0);
check('state is not mutated in place', () => {
  const s = new Store({ n: 0 });
  const before = s.getState();
  s.setState({ n: 1 });
  return before.n;
}, 0);

section('5 — an LRU cache class');
/* LRU(max) with get(key), set(key, value) and get size.
 * Reading a key marks it as recently used. get returns null when absent. */
class LRU {
  // your code here
}
check('stores', () => { const c = new LRU(2); c.set('a', 1); return c.get('a'); }, 1);
check('missing', () => new LRU(2).get('nope'), null);
check('evicts the oldest', () => {
  const c = new LRU(2);
  c.set('a', 1); c.set('b', 2); c.set('c', 3);
  return [c.get('a'), c.get('b'), c.get('c')];
}, [null, 2, 3]);
check('reading refreshes', () => {
  const c = new LRU(2);
  c.set('a', 1); c.set('b', 2);
  c.get('a');
  c.set('c', 3);
  return [c.get('a'), c.get('b')];
}, [1, null]);
check('size never exceeds max', () => {
  const c = new LRU(2);
  c.set('a', 1); c.set('b', 2); c.set('c', 3);
  return c.size;
}, 2);

section('6 — a chainable validator');
/* Validator.string().min(3).max(5) builds a rule set.
 *   .validate(value) -> { valid: true } or { valid: false, errors: [...] }
 * Messages: 'must be a string', 'too short', 'too long'.
 * Each method returns a NEW validator so chains can be branched safely. */
class Validator {
  // your code here
}
check('passes', () => Validator.string().min(3).validate('abcd'), { valid: true });
check('too short', () => Validator.string().min(3).validate('ab'), { valid: false, errors: ['too short'] });
check('not a string', () => Validator.string().validate(5), { valid: false, errors: ['must be a string'] });
check('several errors stop at the type', () => Validator.string().min(3).validate(5),
  { valid: false, errors: ['must be a string'] });
check('too long', () => Validator.string().max(3).validate('abcd'), { valid: false, errors: ['too long'] });
check('branches do not leak', () => {
  const base = Validator.string().min(2);
  const strict = base.min(5);
  return [base.validate('abc').valid, strict.validate('abc').valid];
}, [true, false]);

section('7 — a class registry with automatic subclass tracking');
/* Plugin.register() is inherited; every subclass that calls
 * SubClass.register() is recorded under its own name.
 *   static register()      adds `this` to the shared registry
 *   static get registered() -> sorted names
 *   static create(name, ...args) -> a new instance of that subclass
 *   static clear()                                               */
class Plugin {
  // your code here
}
check('registers subclasses', () => {
  Plugin.clear();
  class Alpha extends Plugin {}
  class Beta extends Plugin {}
  Alpha.register(); Beta.register();
  return Plugin.registered;
}, ['Alpha', 'Beta']);
check('creates the right type', () => {
  Plugin.clear();
  class Gamma extends Plugin { hello() { return 'hi from gamma'; } }
  Gamma.register();
  return Plugin.create('Gamma').hello();
}, 'hi from gamma');
check('unknown name', () => { Plugin.clear(); return Plugin.create('Nope'); }, null);

section('8 — deep clone that preserves class identity');
/* structuredClone loses the class. Write one that keeps it, for plain
 * objects, arrays and class instances with public fields.
 * Use Object.create(Object.getPrototypeOf(value)) for instances.  */
function deepCloneTyped(value) {
  // your code here
}
class Node2 {
  constructor(name, children = []) {
    this.name = name;
    this.children = children;
  }

  describe() { return `node ${this.name}`; }
}
check('plain values pass through', deepCloneTyped(5), 5);
check('arrays', deepCloneTyped([1, [2]]), [1, [2]]);
check('keeps the class', () => deepCloneTyped(new Node2('a')) instanceof Node2, true, deepCloneTyped);
check('keeps the methods', () => deepCloneTyped(new Node2('a')).describe(), 'node a');
check('deep', () => deepCloneTyped(new Node2('a', [new Node2('b')])).children[0].describe(), 'node b');
check('really a copy', () => {
  const src = new Node2('a', [new Node2('b')]);
  const copy = deepCloneTyped(src);
  copy.children[0].name = 'changed';
  return src.children[0].name;
}, 'b');

section('9 — method decoration on the prototype');
/* withTiming(Class, methodName, log) replaces that method on the prototype
 * with a version that pushes `${methodName} called` into `log` and then
 * calls the original. It must keep working for all instances, including
 * ones already created, and must return the original result.     */
function withTiming(Class, methodName, log) {
  // your code here
}
class Service {
  fetch(id) { return `data ${id}`; }
}
check('wraps', () => {
  const log = [];
  withTiming(Service, 'fetch', log);
  const result = new Service().fetch(7);
  return [result, log];
}, ['data 7', ['fetch called']]);
check('affects existing instances', () => {
  class S2 { go() { return 'ok'; } }
  const before = new S2();
  const log = [];
  withTiming(S2, 'go', log);
  return [before.go(), log];
}, ['ok', ['go called']]);

section('10 — a template method pattern');
/* Report has a final render() that calls three steps in order:
 *   header(), body(), footer()
 * and joins them with '\n'. header and footer have defaults
 * ('=== REPORT ===' and '=== END ==='); body() throws 'not implemented'.
 * SalesReport overrides body() and header().                     */
class Report {
  // your code here
}
class SalesReport extends Report {
  // your code here
}
check('default skeleton', () => {
  class Minimal extends Report { body() { return 'x'; } }
  return new Minimal().render();
}, '=== REPORT ===\nx\n=== END ===');
check('overridden', () => new SalesReport(100).render(), '=== SALES ===\ntotal: 100\n=== END ===');
check('abstract body', () => {
  class Broken extends Report {}
  try { return new Broken().render(); } catch (e) { return e.message; }
}, 'not implemented');

log('finished?', 'that is topic 05 — classes, prototypes and the whole object model');
report();
