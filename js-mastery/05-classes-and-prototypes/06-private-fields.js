'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 06 — PRIVACY & ENCAPSULATION
 *
 * Four ways to keep data out of reach, weakest to strongest:
 *
 *   1. CONVENTION   this._secret
 *      Not private at all. A signpost saying "do not touch". Still the most
 *      common thing you will see in older code.
 *
 *   2. CLOSURE      a variable inside a factory (topic 03)
 *      Genuinely private, but every instance gets its own copy of every
 *      method that uses it.
 *
 *   3. WeakMap      a module-level WeakMap keyed by the instance
 *      Genuinely private, methods stay shared. The pre-2022 answer.
 *
 *   4. #PRIVATE FIELDS   class C { #secret = 1; }
 *      The real thing, and what you should use now.
 *        • Unreachable from outside — not by obj['#secret'], not by
 *          Object.keys, not by JSON.stringify.
 *        • Touching one from outside is a SYNTAX error, not undefined.
 *        • #method() works too, and so does static #field.
 *        • `#x in obj` is the way to test whether an object has one.
 *
 * Private fields are NOT inherited by subclasses — a subclass cannot see
 * its parent's #fields. That is deliberate.
 * ==========================================================================*/

section('Exercise 1 — the convention');
/* Account with this._balance, a deposit() and a getBalance().
 * Show that _balance is still completely reachable from outside:
 * exposeUnderscore() -> the raw balance read straight off the object.  */
class Account {
  // your code here
}
function exposeUnderscore() {
  // your code here: make an Account with 100 and read a._balance directly
}
check('deposit works', () => { const a = new Account(100); a.deposit(50); return a.getBalance(); }, 150);
check('the underscore hides nothing', exposeUnderscore(), 100);
check('and it shows up in the keys', () => Object.keys(new Account(1)), ['_balance'], Account);

section('Exercise 2 — real private fields');
/* SafeAccount with #balance.
 *   deposit(n)  returns the new balance, throws 'invalid amount' for n <= 0
 *   withdraw(n) returns the new balance, throws 'insufficient funds'
 *   get balance a getter                                         */
class SafeAccount {
  // your code here
}
check('starts', () => new SafeAccount(100).balance, 100);
check('deposit', () => { const a = new SafeAccount(100); return a.deposit(50); }, 150);
check('withdraw', () => { const a = new SafeAccount(100); return a.withdraw(40); }, 60);
check('rejects a bad deposit', () => {
  try { new SafeAccount(100).deposit(0); return 'no throw'; } catch (e) { return e.message; }
}, 'invalid amount', SafeAccount);
check('rejects an overdraft', () => {
  try { new SafeAccount(10).withdraw(50); return 'no throw'; } catch (e) { return e.message; }
}, 'insufficient funds', SafeAccount);
check('a refused withdrawal changes nothing', () => {
  const a = new SafeAccount(10);
  try { a.withdraw(50); } catch { /* expected */ }
  return a.balance;
}, 10);

section('Exercise 3 — proving it is private');
/* All three must show the field is invisible from outside.
 * keysOf(new SafeAccount(1)) -> []
 * jsonOf(new SafeAccount(1)) -> '{}'
 * bracketAccess(new SafeAccount(1)) -> 'undefined'
 *   (obj['#balance'] is just a normal string key — it finds nothing) */
function keysOf(obj) {
  // your code here
}
function jsonOf(obj) {
  // your code here
}
function bracketAccess(obj) {
  // your code here: return String(obj['#balance'])
}
check('no keys', keysOf(new SafeAccount(1)), []);
check('nothing to serialise', jsonOf(new SafeAccount(1)), '{}');
check('bracket access finds nothing', bracketAccess(new SafeAccount(1)), 'undefined');

section('Exercise 4 — private methods');
/* Order with a #calculateTax() private method used by get total.
 * Tax is 10% of the subtotal, rounded to 2 decimals.
 * new Order(100).total -> 110                                    */
class Order {
  // your code here
}
check('total', () => new Order(100).total, 110);
check('rounds', () => new Order(99.99).total, 109.99);
check('the private method is not exposed', () => typeof new Order(1).calculateTax, 'undefined', Order);

section('Exercise 5 — testing for a private field');
/* `#x in obj` is the safe way to check whether something is really one of
 * yours — it cannot be faked by a lookalike object.
 * SafeAccount.isOne(value) -> true only for real SafeAccounts.
 * Write it as a static method using  #balance in value.          */
class Vault {
  #contents = [];

  static isOne(value) {
    // your code here
  }

  add(item) {
    this.#contents.push(item);
    return this.#contents.length;
  }
}
check('a real one', () => Vault.isOne(new Vault()), true);
check('a lookalike', () => Vault.isOne({ contents: [] }), false);
check('null is safe', () => Vault.isOne(null), false);
check('a number is safe', () => Vault.isOne(42), false);

section('Exercise 6 — private static state');
/* IdMaker with a private static counter.
 *   static next() -> 'id-1', 'id-2', ...
 *   static reset()
 * Nothing about the counter may be visible on the class.         */
class IdMaker {
  // your code here
}
check('sequence', () => { IdMaker.reset(); return [IdMaker.next(), IdMaker.next()]; }, ['id-1', 'id-2']);
check('reset', () => { IdMaker.reset(); return IdMaker.next(); }, 'id-1');
check('the counter is hidden', () => Object.keys(IdMaker), [], IdMaker);

section('Exercise 7 — the WeakMap technique');
/* The pre-2022 way, still worth being able to read.
 * A module-level WeakMap holds the secret, keyed by the instance.
 * Methods stay on the prototype and shared.
 * WeakAccount(100).balance() -> 100                              */
const secrets = new WeakMap();
class WeakAccount {
  // your code here: constructor stores into secrets, balance() reads it
}
check('stores and reads', () => new WeakAccount(100).balance(), 100);
check('instances are separate', () => {
  const a = new WeakAccount(1); const b = new WeakAccount(2);
  return [a.balance(), b.balance()];
}, [1, 2]);
check('nothing on the instance', () => Object.keys(new WeakAccount(1)), [], WeakAccount);
check('the method is still shared', () => new WeakAccount(1).balance === new WeakAccount(2).balance, true, WeakAccount);

section('Exercise 8 — an immutable value object');
/* Point with #x and #y, getters for both, and a moveBy() that returns a
 * NEW Point rather than changing this one.                       */
class Point {
  // your code here
}
check('reads', () => { const p = new Point(1, 2); return [p.x, p.y]; }, [1, 2], Point);
check('moveBy returns a new point', () => {
  const p = new Point(1, 2);
  const q = p.moveBy(10, 10);
  return [q.x, q.y, p.x, p.y];
}, [11, 12, 1, 2]);
check('really a new object', () => {
  const p = new Point(1, 2);
  return p.moveBy(0, 0) !== p;
}, true, Point);
check('no settable x', () => {
  const p = new Point(1, 2);
  try { p.x = 99; return p.x; } catch (e) { return e.constructor.name; }
}, 'TypeError', Point);

section('PREDICTIONS');

// P1: do private fields show up in Object.keys?
class P1c { #hidden = 1; shown = 2; }
let p1 = null;
check('P1  Object.keys(new P1c())', p1, Object.keys(new P1c()));

// P2: and in JSON?
let p2 = null;
check('P2  JSON.stringify(new P1c())', p2, JSON.stringify(new P1c()));

// P3: does the underscore convention hide anything?
class P3c { constructor() { this._x = 1; } }
let p3 = null;
check('P3  Object.keys(new P3c())', p3, Object.keys(new P3c()));

// P4: reading a #field from outside is a SYNTAX error, so we cannot even
//     write it here. What does a same-named STRING key give instead?
class P4c { #v = 'secret'; }
let p4 = null;
check('P4  String(new P4c()["#v"])', p4, String(new P4c()['#v']));

// P5: spreading an instance with private fields
class P5c { #a = 1; b = 2; }
let p5 = null;
check('P5  { ...new P5c() }', p5, { ...new P5c() });

// P6: does structuredClone carry private fields?
class P6c { #a = 1; b = 2; }
let p6 = null;
check('P6  structuredClone(new P6c())', p6, structuredClone(new P6c()));

// P7: can two instances of the same class read each other's #fields?
class P7c {
  #v;
  constructor(v) { this.#v = v; }
  peekAt(other) { return other.#v; }    // allowed — same class body
}
let p7 = null;
check('P7  new P7c(1).peekAt(new P7c(2))', p7, new P7c(1).peekAt(new P7c(2)));
log('note P7', 'privacy is per-CLASS, not per-instance — which is what makes equals() possible');

report();
