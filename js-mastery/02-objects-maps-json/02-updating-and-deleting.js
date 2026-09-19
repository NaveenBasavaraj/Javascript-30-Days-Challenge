'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 02 — UPDATING, DELETING & SAFE ACCESS
 *
 * NOTES:
 *   obj.key = value      add or overwrite (works on a `const` object!)
 *   delete obj.key       remove the key entirely
 *
 *   OPTIONAL CHAINING   a?.b      -> undefined if `a` is null/undefined,
 *                                    instead of throwing
 *                       a?.[k]    same, with brackets
 *                       fn?.()    only calls fn if it exists
 *
 *   NULLISH COALESCING  a ?? b    -> b only when a is null or undefined
 *                       a || b    -> b for ANY falsy a (0, '', false too)
 *   That difference is the source of a lot of real bugs. See P3/P4 below.
 *
 *   LOGICAL ASSIGNMENT  obj.x ??= 1   set only if currently null/undefined
 *                       obj.x ||= 1   set if falsy
 *                       obj.x &&= 1   set only if already truthy
 * ==========================================================================*/

section('Exercise 1 — setKey (mutating)');
/* Add or overwrite a key on the object it is given and return that object.
 * setKey({a:1}, 'b', 2) -> { a: 1, b: 2 }                        */
function setKey(obj, key, value) {
  // your code here
}
const t1 = { a: 1 };
check('setKey returns', setKey(t1, 'b', 2), { a: 1, b: 2 });
check('setKey mutated the original', t1, { a: 1, b: 2 });

section('Exercise 2 — removeKey (mutating)');
/* Delete the key and return the object.
 * removeKey({a:1, b:2}, 'a') -> { b: 2 }                         */
function removeKey(obj, key) {
  // your code here
}
check('removeKey', removeKey({ a: 1, b: 2 }, 'a'), { b: 2 });

section('Exercise 3 — without (NON-mutating)');
/* Return a NEW object without that key. The input must be untouched.
 * without({a:1, b:2}, 'a') -> { b: 2 }
 * Hint: destructuring with rest —
 *   const { [key]: removed, ...rest } = obj;                     */
function without(obj, key) {
  // your code here
}
const t3 = { a: 1, b: 2 };
check('without', without(t3, 'a'), { b: 2 });
check('input untouched', t3, { a: 1, b: 2 });

section('Exercise 4 — cityOf (optional chaining)');
/* Return user.address.city, or undefined when address is missing.
 * It must NOT throw for cityOf({}) — use ?.
 * cityOf({ address: { city: 'Pune' } }) -> 'Pune'                */
function cityOf(user) {
  // your code here
}
check('city present', cityOf({ address: { city: 'Pune' } }), 'Pune');
check('no address', () => String(cityOf({})), 'undefined', cityOf);
check('null user', () => String(cityOf(null)), 'undefined', cityOf);

section('Exercise 5 — cityOrUnknown');
/* Same, but fall back to 'unknown' when there is no city.
 * An EMPTY STRING city is still a real value and must be kept as ''.
 * cityOrUnknown({ address: { city: '' } }) -> ''
 * Hint: ?. together with ??                                      */
function cityOrUnknown(user) {
  // your code here
}
check('present', cityOrUnknown({ address: { city: 'Pune' } }), 'Pune');
check('missing', cityOrUnknown({}), 'unknown');
check('empty string is kept', cityOrUnknown({ address: { city: '' } }), '');

section('Exercise 6 — callIfPresent');
/* obj.onSave may or may not exist. Call it with `value` if it does and
 * return its result; otherwise return null. Use ?.() — no if statement.
 * callIfPresent({ onSave: (v) => v * 2 }, 4) -> 8
 * callIfPresent({}, 4) -> null                                   */
function callIfPresent(obj, value) {
  // your code here
}
check('calls it', callIfPresent({ onSave: (v) => v * 2 }, 4), 8);
check('missing handler', callIfPresent({}, 4), null);

section('Exercise 7 — withDefaults (??=)');
/* Fill in any MISSING setting, leaving existing ones alone —
 * including ones that are 0 or false.
 * defaults are: { retries: 3, debug: false, name: 'app' }
 * withDefaults({ retries: 0 }) -> { retries: 0, debug: false, name: 'app' }
 * Mutating the copy is fine, but do not mutate the argument.     */
function withDefaults(settings) {
  // your code here
}
check('fills gaps', withDefaults({}), { retries: 3, debug: false, name: 'app' });
check('keeps a zero', withDefaults({ retries: 0 }), { retries: 0, debug: false, name: 'app' });
const t7 = { name: 'mine' };
check('keeps existing', withDefaults(t7), { retries: 3, debug: false, name: 'mine' });
check('argument untouched', t7, { name: 'mine' });

section('Exercise 8 — increment');
/* Add 1 to obj[key], starting from 0 when the key is missing.
 * increment({}, 'hits') -> { hits: 1 }
 * increment({ hits: 4 }, 'hits') -> { hits: 5 }                  */
function increment(obj, key) {
  // your code here
}
check('from nothing', increment({}, 'hits'), { hits: 1 });
check('from a number', increment({ hits: 4 }, 'hits'), { hits: 5 });

section('Exercise 9 — setDeep');
/* Set a nested value, creating the missing levels as you go.
 * setDeep({}, 'a', 'b', 1) -> { a: { b: 1 } }
 * setDeep({ a: { z: 0 } }, 'a', 'b', 1) -> { a: { z: 0, b: 1 } }
 * Only two levels — no recursion needed yet.                     */
function setDeep(obj, k1, k2, value) {
  // your code here
}
check('creates levels', setDeep({}, 'a', 'b', 1), { a: { b: 1 } });
check('keeps siblings', setDeep({ a: { z: 0 } }, 'a', 'b', 1), { a: { z: 0, b: 1 } });

section('Exercise 10 — renameKey');
/* Return a NEW object with `from` renamed to `to`, other keys intact.
 * renameKey({ a: 1, b: 2 }, 'a', 'x') -> { x: 1, b: 2 }
 * If `from` is missing, return a plain copy.                     */
function renameKey(obj, from, to) {
  // your code here
}
check('renameKey', renameKey({ a: 1, b: 2 }, 'a', 'x'), { x: 1, b: 2 });
check('missing key', renameKey({ b: 2 }, 'a', 'x'), { b: 2 });

section('PREDICTIONS');

// P1: a const object
const c1 = { a: 1 };
c1.a = 99;
let p1 = null;
check('P1  c1 after c1.a = 99 (const object)', p1, c1);

// P2: what does `delete` return?
let p2 = null;
check('P2  delete ({a:1}).a', p2, delete { a: 1 }.a);

// P3: || with a zero
let p3 = null;
check('P3  0 || 99', p3, 0 || 99);

// P4: ?? with a zero
let p4 = null;
check('P4  0 ?? 99', p4, 0 ?? 99);

// P5: optional chaining short-circuits the WHOLE chain
let p5 = null;
check('P5  String(({}).a?.b.c)', p5, String(({}).a?.b.c));

// P6: does ?. protect an undeclared variable? (it does not — only null/undefined values)
let outcome6;
try { outcome6 = notDeclared?.x; } catch (e) { outcome6 = e.constructor.name; }
let p6 = null;
check('P6  notDeclared?.x', p6, outcome6);

log('rule of thumb', 'use ?? for defaults, || only when every falsy value really is "empty"');

report();
