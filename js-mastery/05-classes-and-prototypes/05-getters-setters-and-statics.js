'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 05 — GETTERS, SETTERS & STATIC MEMBERS
 *
 * GETTERS AND SETTERS look like properties and run like functions:
 *   class Circle {
 *     constructor(r) { this.r = r; }
 *     get area() { return Math.PI * this.r ** 2; }     // circle.area
 *     set diameter(d) { this.r = d / 2; }              // circle.diameter = 10
 *   }
 * No parentheses at the call site. Use them for values DERIVED from other
 * fields, and for validation on assignment. Keep them cheap — nobody
 * expects `obj.total` to hit the network.
 *
 * STATIC members belong to the CLASS, not to instances:
 *   static create(...)      a named alternative constructor (factory)
 *   static MAX = 100        a constant that belongs with the class
 *   static #count = 0       private static state
 *   static { ... }          a static initialisation block, runs once
 * Call them as Circle.create(), never as circle.create().
 *
 * A common pairing: a private constructor-ish convention plus static
 * factories with meaningful names — Money.fromRupees(5), Date.now().
 * ==========================================================================*/

section('Exercise 1 — a getter');
/* Circle(r) with a `area` getter and a `circumference` getter.
 * Round both to 2 decimals with Number(x.toFixed(2)).            */
class Circle {
  // your code here
}
check('area', () => new Circle(2).area, 12.57);
check('circumference', () => new Circle(2).circumference, 12.57);
check('no parentheses needed', () => typeof new Circle(1).area, 'number', Circle);
check('stays live', () => {
  const c = new Circle(1);
  c.r = 2;
  return c.area;
}, 12.57);

section('Exercise 2 — a getter and a setter');
/* Temperature stores celsius. `fahrenheit` is a getter AND a setter.
 *   t.celsius = 100  ->  t.fahrenheit === 212
 *   t.fahrenheit = 32 ->  t.celsius === 0                        */
class Temperature {
  // your code here
}
check('get', () => { const t = new Temperature(100); return t.fahrenheit; }, 212);
check('set', () => { const t = new Temperature(0); t.fahrenheit = 212; return t.celsius; }, 100);
check('round trip', () => { const t = new Temperature(37); t.fahrenheit = t.fahrenheit; return t.celsius; }, 37);

section('Exercise 3 — validation in a setter');
/* Person has a `name` setter that trims the value and throws
 * 'name cannot be empty' for a blank one. The getter returns it back. */
class Person {
  // your code here
}
check('trims', () => new Person('  Asha  ').name, 'Asha');
check('rejects blank', () => {
  try { return new Person('   ').name; } catch (e) { return e.message; }
}, 'name cannot be empty', Person);
check('rejects later assignment too', () => {
  const p = new Person('ok');
  try { p.name = ''; return 'no throw'; } catch (e) { return e.message; }
}, 'name cannot be empty', Person);

section('Exercise 4 — a computed getter over a collection');
/* Cart holds items of { name, price, qty }.
 *   add(item) returns this (chainable)
 *   get total     -> sum of price * qty
 *   get count     -> total quantity
 *   get isEmpty   -> true / false                                */
class Cart {
  // your code here
}
check('empty', () => { const c = new Cart(); return [c.total, c.count, c.isEmpty]; }, [0, 0, true], Cart);
check('totals', () => {
  const c = new Cart();
  c.add({ name: 'pen', price: 10, qty: 2 }).add({ name: 'pad', price: 25, qty: 1 });
  return [c.total, c.count, c.isEmpty];
}, [45, 3, false]);

section('Exercise 5 — static methods');
/* MathUtils with static double(n) and static sum(...nums).
 * No instances involved at all.                                  */
class MathUtils {
  // your code here
}
check('double', () => MathUtils.double(4), 8);
check('sum', () => MathUtils.sum(1, 2, 3), 6);
check('sum of nothing', () => MathUtils.sum(), 0);

section('Exercise 6 — static factory methods');
/* Money stores `paise` (an integer).
 *   static fromRupees(5)  -> a Money of 500 paise
 *   static fromPaise(500) -> the same
 *   get rupees            -> 5
 * Both factories return real Money instances.                    */
class Money {
  // your code here
}
check('fromRupees', () => Money.fromRupees(5).paise, 500);
check('fromPaise', () => Money.fromPaise(500).rupees, 5);
check('is a Money', () => Money.fromRupees(1) instanceof Money, true, Money);
check('fractional rupees', () => Money.fromRupees(2.5).paise, 250);

section('Exercise 7 — static properties');
/* Config with a static DEFAULTS object and a static merge(overrides)
 * returning a new object of DEFAULTS plus the overrides.
 * DEFAULTS is { host: 'localhost', port: 80 } and must not be mutated. */
class Config {
  // your code here
}
check('defaults exist', () => Config.DEFAULTS, { host: 'localhost', port: 80 });
check('merge', () => Config.merge({ port: 443 }), { host: 'localhost', port: 443 });
check('merge of nothing', () => Config.merge({}), { host: 'localhost', port: 80 });
check('DEFAULTS untouched', () => { Config.merge({ port: 1 }); return Config.DEFAULTS.port; }, 80);

section('Exercise 8 — a static instance counter');
/* Every new Widget bumps Widget.count. Widget.reset() zeroes it.
 * Use a static field initialised to 0.                           */
class Widget {
  // your code here
}
check('counts', () => {
  Widget.reset();
  new Widget(); new Widget(); new Widget();
  return Widget.count;
}, 3);
check('reset', () => { Widget.reset(); return Widget.count; }, 0);

section('Exercise 9 — statics are not on instances');
/* Prove it: return [typeof Widget.reset, typeof new Widget().reset]
 * -> ['function', 'undefined']                                   */
function staticsAreNotInherited() {
  // your code here
}
check('class only', staticsAreNotInherited(), ['function', 'undefined']);

section('Exercise 10 — a registry with static state');
/* Registry keeps a static Map of name -> value.
 *   static set(name, value)  returns the Registry class itself (chainable)
 *   static get(name)         the value, or null
 *   static has(name)         true / false
 *   static clear()           empties it
 *   static get size()        a STATIC getter                     */
class Registry {
  // your code here
}
check('set and get', () => {
  Registry.clear();
  Registry.set('a', 1);
  return Registry.get('a');
}, 1);
check('chainable', () => {
  Registry.clear();
  Registry.set('a', 1).set('b', 2);
  return Registry.size;
}, 2);
check('missing', () => { Registry.clear(); return Registry.get('nope'); }, null);
check('has', () => { Registry.clear(); Registry.set('x', 0); return [Registry.has('x'), Registry.has('y')]; }, [true, false]);
check('a stored zero is still found', () => { Registry.clear(); Registry.set('x', 0); return Registry.get('x'); }, 0);

section('PREDICTIONS');

// P1: does a getter appear in Object.keys of an instance?
class P1c { constructor() { this.a = 1; } get b() { return 2; } }
let p1 = null;
check('P1  Object.keys(new P1c())', p1, Object.keys(new P1c()));

// P2: what does JSON.stringify do with a getter?
let p2 = null;
check('P2  JSON.stringify(new P1c())', p2, JSON.stringify(new P1c()));

// P3: a getter with no setter, assigned to, in strict mode
class P3c { get v() { return 1; } }
const o3 = new P3c();
let outcome3;
try { o3.v = 99; outcome3 = o3.v; } catch (e) { outcome3 = e.constructor.name; }
let p3 = null;
check('P3  assigning to a getter-only property', p3, outcome3);

// P4: is a static method on the prototype?
class P4c { static go() {} }
let p4 = null;
check('P4  typeof P4c.prototype.go', p4, typeof P4c.prototype.go);

// P5: can an instance reach a static?
let p5 = null;
check('P5  typeof new P4c().go', p5, typeof new P4c().go);

// P6: `this` inside a static method
class P6c { static who() { return this === P6c; } }
let p6 = null;
check('P6  P6c.who()', p6, P6c.who());

// P7: the infinite-loop trap — a setter that assigns to itself
class P7c {
  set v(value) { this.v = value; }   // this calls the setter again
}
let outcome7;
try { new P7c().v = 1; outcome7 = 'fine'; } catch (e) { outcome7 = e.constructor.name; }
let p7 = null;
check('P7  a setter assigning to its own name', p7, outcome7);
log('the fix for P7', 'store the value under a different name: this._v, or a #private field');

report();
