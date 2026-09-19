'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 11 — EQUALITY & CLONING
 *
 * NOTES:
 *   For objects, === asks "are these the same object in memory?", never
 *   "do these hold the same data?". There is NO built-in deep comparison
 *   in JavaScript. You write it (this file) or you import one.
 *
 *   Three kinds of equality:
 *     ==            loose, coerces types — avoid
 *     ===           strict; NaN !== NaN, and 0 === -0
 *     Object.is()   like ===, except Object.is(NaN, NaN) is true
 *                   and Object.is(0, -0) is false
 *
 *   Copying, cheapest to most thorough:
 *     { ...obj }            shallow, plain objects only
 *     structuredClone(obj)  deep; handles Date, Map, Set, arrays, cycles;
 *                           THROWS on functions; drops class identity
 * ==========================================================================*/

section('Exercise 1 — shallowEqual');
/* Same keys, and every value === the other. One level only.
 * shallowEqual({a:1}, {a:1}) -> true
 * shallowEqual({a:{}}, {a:{}}) -> false   (different inner objects)
 * shallowEqual({a:1}, {a:1, b:2}) -> false                       */
function shallowEqual(a, b) {
  // your code here
}
check('same', shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 }), true);
check('key order does not matter', shallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
check('nested objects differ', shallowEqual({ a: {} }, { a: {} }), false);
check('extra key', shallowEqual({ a: 1 }, { a: 1, b: 2 }), false);
check('both empty', shallowEqual({}, {}), true);

section('Exercise 2 — deepEqual');
/* Compare recursively. Handle: primitives, nested objects, arrays, null.
 * An array and an object are never equal, even with matching keys.
 *   deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } }) -> true
 *   deepEqual([1], { 0: 1 }) -> false                            */
function deepEqual(a, b) {
  // your code here
}
check('nested', deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } }), true);
check('nested differs', deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 3] } }), false);
check('primitives', deepEqual(1, 1), true);
check('null vs object', deepEqual(null, {}), false);
check('null vs null', deepEqual(null, null), true);
check('array vs object', deepEqual([1], { 0: 1 }), false);
check('different lengths', deepEqual([1], [1, 2]), false);

section('Exercise 3 — changedKeys');
/* Which top-level keys differ between two objects? Sorted alphabetically.
 * Keys present in only one of them count as changed.
 * changedKeys({a:1, b:2}, {a:1, b:99, c:3}) -> ['b', 'c']        */
function changedKeys(before, after) {
  // your code here
}
check('changed and added', changedKeys({ a: 1, b: 2 }, { a: 1, b: 99, c: 3 }), ['b', 'c']);
check('removed', changedKeys({ a: 1, b: 2 }, { a: 1 }), ['b']);
check('identical', changedKeys({ a: 1 }, { a: 1 }), []);

section('Exercise 4 — diff');
/* A summary object of what changed:
 * diff({a:1, b:2}, {a:1, b:99, c:3})
 *   -> { added: ['c'], removed: [], changed: ['b'] }
 * All three arrays sorted alphabetically.                        */
function diff(before, after) {
  // your code here
}
check('diff', diff({ a: 1, b: 2 }, { a: 1, b: 99, c: 3 }),
  { added: ['c'], removed: [], changed: ['b'] });
check('diff removal', diff({ a: 1, x: 0 }, { a: 1 }),
  { added: [], removed: ['x'], changed: [] });

section('Exercise 5 — clone with structuredClone');
/* Deep, and it must survive a Date, a Map and an array.          */
function clone(value) {
  // your code here
}
const src5 = { when: new Date(0), tags: new Map([['a', 1]]), list: [1, [2]] };
check('equal', clone(src5), { when: new Date(0), tags: new Map([['a', 1]]), list: [1, [2]] });
check('Date survives', () => clone(src5).when instanceof Date, true);
check('Map survives', () => clone(src5).tags instanceof Map, true);
check('nested array is new', () => clone(src5).list[1] !== src5.list[1], true, clone);

section('Exercise 6 — cloneWithout functions');
/* structuredClone throws on a function. Return a deep copy that simply
 * DROPS any function-valued key instead.
 * cloneData({ a: 1, run: () => {} }) -> { a: 1 }
 * Nested too: { x: { b: 2, f: () => {} } } -> { x: { b: 2 } }
 * Write it recursively; do not call structuredClone.             */
function cloneData(value) {
  // your code here
}
check('drops top level', cloneData({ a: 1, run: () => {} }), { a: 1 });
check('drops nested', cloneData({ x: { b: 2, f: () => {} } }), { x: { b: 2 } });
check('keeps arrays', cloneData({ list: [1, 2] }), { list: [1, 2] });
check('really is a copy', () => {
  const src = { x: { b: 2 } };
  const c = cloneData(src);
  c.x.b = 99;
  return src.x.b;
}, 2);

section('Exercise 7 — sameShape');
/* True when both objects have the same keys AND the same typeof for each
 * value, whatever the values are. Top level only.
 * sameShape({ a: 1, b: 'x' }, { a: 99, b: 'y' }) -> true
 * sameShape({ a: 1 }, { a: '1' }) -> false                       */
function sameShape(a, b) {
  // your code here
}
check('same shape', sameShape({ a: 1, b: 'x' }, { a: 99, b: 'y' }), true);
check('different types', sameShape({ a: 1 }, { a: '1' }), false);
check('different keys', sameShape({ a: 1 }, { b: 1 }), false);

section('Exercise 8 — dedupeObjects');
/* Remove duplicate objects from an array, comparing by CONTENT.
 * dedupeObjects([{a:1},{a:1},{a:2}]) -> [{a:1},{a:2}]
 * Hint: a JSON string of each object makes a workable key — but only
 * because these objects have their keys in the same order. Mention that
 * limitation to yourself; it is a real bug in real code.         */
function dedupeObjects(items) {
  // your code here
}
check('dedupe', dedupeObjects([{ a: 1 }, { a: 1 }, { a: 2 }]), [{ a: 1 }, { a: 2 }]);
check('keeps order', dedupeObjects([{ n: 2 }, { n: 1 }, { n: 2 }]), [{ n: 2 }, { n: 1 }]);

section('PREDICTIONS');

// P1: NaN
let p1 = null;
check('P1  NaN === NaN', p1, NaN === NaN);

// P2: Object.is and NaN
let p2 = null;
check('P2  Object.is(NaN, NaN)', p2, Object.is(NaN, NaN));

// P3: negative zero
let p3 = null;
check('P3  Object.is(0, -0)', p3, Object.is(0, -0));

// P4: loose equality with an object
let p4 = null;
check('P4  [] == false', p4, [] == false);

// P5: does structuredClone keep a class instance a class instance?
class Point { constructor(x) { this.x = x; } }
const cloned5 = structuredClone(new Point(1));
let p5 = null;
check('P5  structuredClone(new Point(1)) instanceof Point', p5, cloned5 instanceof Point);

// P6: does it handle a circular reference?
const circ = { n: 1 };
circ.self = circ;
let outcome6;
try { outcome6 = structuredClone(circ).self.n; } catch (e) { outcome6 = e.constructor.name; }
let p6 = null;
check('P6  structuredClone(circular).self.n', p6, outcome6);

log('remember', 'no === for data comparison; write deepEqual or reach for a library');

report();
