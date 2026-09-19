'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 05 — SPREAD, MERGING & COPYING
 *
 * NOTES:
 *   { ...obj }                    shallow copy
 *   { ...a, ...b }                merge; on a clash, the LAST one wins
 *   { ...obj, name: 'new' }       copy with one field changed  <- the pattern
 *                                 you will write ten times a day in React
 *   { name: 'new', ...obj }       careful: now obj wins instead
 *   Object.assign(target, ...src) same merge, but MUTATES `target`
 *   Object.assign({}, a, b)       ...which is why people pass {} as target
 *
 *   ALL of these are SHALLOW. A nested object is shared between the copy
 *   and the original. Deep copy: structuredClone(obj).
 * ==========================================================================*/

section('Exercise 1 — copyOf');
/* A shallow copy that is a different object.                     */
function copyOf(obj) {
  // your code here
}
const t1 = { a: 1 };
check('same contents', copyOf(t1), { a: 1 });
check('different object', () => copyOf(t1) !== t1, true, copyOf);

section('Exercise 2 — merge');
/* merge({a:1, b:1}, {b:2, c:2}) -> { a: 1, b: 2, c: 2 }
 * Later values win. Neither input may be mutated.                */
function merge(a, b) {
  // your code here
}
const m1 = { a: 1, b: 1 };
check('merge', merge(m1, { b: 2, c: 2 }), { a: 1, b: 2, c: 2 });
check('first input untouched', m1, { a: 1, b: 1 });

section('Exercise 3 — mergeAll');
/* Any number of objects, left to right.
 * mergeAll({a:1}, {a:2}, {b:3}) -> { a: 2, b: 3 }
 * mergeAll() -> {}                                               */
function mergeAll(...objects) {
  // your code here
}
check('mergeAll', mergeAll({ a: 1 }, { a: 2 }, { b: 3 }), { a: 2, b: 3 });
check('mergeAll none', mergeAll(), {});

section('Exercise 4 — updated (the React pattern)');
/* Return a NEW object with one key changed.
 * updated({ name: 'a', age: 1 }, 'age', 2) -> { name: 'a', age: 2 }  */
function updated(obj, key, value) {
  // your code here
}
const t4 = { name: 'a', age: 1 };
check('updated', updated(t4, 'age', 2), { name: 'a', age: 2 });
check('original untouched', t4, { name: 'a', age: 1 });

section('Exercise 5 — applyDefaults');
/* Defaults first, user settings on top.
 * applyDefaults({ theme: 'dark' }, { theme: 'light', lang: 'en' })
 *   -> { theme: 'dark', lang: 'en' }
 * Think hard about which object goes first in the spread.        */
function applyDefaults(settings, defaults) {
  // your code here
}
check('user wins', applyDefaults({ theme: 'dark' }, { theme: 'light', lang: 'en' }),
  { theme: 'dark', lang: 'en' });
check('empty settings', applyDefaults({}, { lang: 'en' }), { lang: 'en' });

section('Exercise 6 — updateNested');
/* Change user.address.city WITHOUT mutating anything.
 * Every level you change needs its own spread:
 *   { ...user, address: { ...user.address, city } }
 * moveTo({ name:'a', address:{ city:'Pune', zip:'1' } }, 'Goa')
 *   -> { name:'a', address:{ city:'Goa', zip:'1' } }             */
function moveTo(user, city) {
  // your code here
}
const t6 = { name: 'a', address: { city: 'Pune', zip: '1' } };
check('moved', moveTo(t6, 'Goa'), { name: 'a', address: { city: 'Goa', zip: '1' } });
check('original untouched', t6.address.city, 'Pune');
check('address really is a new object', () => moveTo(t6, 'Goa').address !== t6.address, true, moveTo);

section('Exercise 7 — deepCopy');
/* A copy so deep that nothing is shared.                         */
function deepCopy(obj) {
  // your code here
}
const t7 = { list: [1, 2], nested: { n: 1 } };
check('equal', deepCopy(t7), { list: [1, 2], nested: { n: 1 } });
check('nested is new', () => {
  const c = deepCopy(t7);
  c.nested.n = 99;
  c.list.push(3);
  return t7;
}, { list: [1, 2], nested: { n: 1 } });

section('Exercise 8 — deepMerge');
/* Merge two objects recursively: plain objects get merged, anything
 * else (numbers, strings, arrays) is simply overwritten by `b`.
 * deepMerge({ a: { x: 1, y: 2 }, keep: 1 }, { a: { y: 99 } })
 *   -> { a: { x: 1, y: 99 }, keep: 1 }
 * A shallow merge would have thrown away x — that is the point.  */
function deepMerge(a, b) {
  // your code here
}
check('deepMerge', deepMerge({ a: { x: 1, y: 2 }, keep: 1 }, { a: { y: 99 } }),
  { a: { x: 1, y: 99 }, keep: 1 });
check('arrays overwrite', deepMerge({ list: [1, 2] }, { list: [3] }), { list: [3] });
check('three levels', deepMerge({ a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 9 } } }),
  { a: { b: { c: 9, d: 2 } } });

section('Exercise 9 — objectFromKeys');
/* Build an object from a list of keys, all sharing one value.
 * objectFromKeys(['a','b'], 0) -> { a: 0, b: 0 }                 */
function objectFromKeys(keys, value) {
  // your code here
}
check('objectFromKeys', objectFromKeys(['a', 'b'], 0), { a: 0, b: 0 });

section('Exercise 10 — spread into a function call');
/* The object holds the arguments. Call fn with them in order.
 * apply((a, b) => a - b, { a: 10, b: 4 }) -> 6                   */
function apply(fn, args) {
  // your code here
}
check('apply', apply((a, b) => a - b, { a: 10, b: 4 }), 6);

section('PREDICTIONS');

// P1: which side wins?
let p1 = null;
check('P1  { ...{a:1}, ...{a:2} }', p1, { ...{ a: 1 }, ...{ a: 2 } });

// P2: explicit key AFTER the spread
let p2 = null;
check('P2  { ...{a:1}, a: 9 }', p2, { ...{ a: 1 }, a: 9 });

// P3: explicit key BEFORE the spread
let p3 = null;
check('P3  { a: 9, ...{a:1} }', p3, { a: 9, ...{ a: 1 } });

// P4: spreading an array into an object
let p4 = null;
check('P4  { ...["x","y"] }', p4, { ...['x', 'y'] });

// P5: spreading null or undefined
let outcome5;
try { outcome5 = { ...null, a: 1 }; } catch (e) { outcome5 = e.constructor.name; }
let p5 = null;
check('P5  { ...null, a: 1 }', p5, outcome5);

// P6: is the copy deep?
const inner6 = { n: 1 };
const copy6 = { ...{ inner: inner6 } };
copy6.inner.n = 99;
let p6 = null;
check('P6  inner6.n after mutating the copy', p6, inner6.n);

report();
