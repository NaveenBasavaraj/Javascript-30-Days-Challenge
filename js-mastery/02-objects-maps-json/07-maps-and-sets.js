'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 07 — MAP & SET
 *
 * NOTES — Map vs plain object:
 *   • Map keys can be ANY value: objects, numbers, functions. Object keys
 *     are always strings, so obj[1] and obj['1'] are the same key.
 *   • Map remembers true insertion order. Objects put integer-like keys first.
 *   • map.size is instant; Object.keys(obj).length builds an array first.
 *   • A Map has no prototype keys, so there is no clash with 'constructor'
 *     or '__proto__' — safer for user-supplied keys.
 *   • JSON.stringify understands objects, NOT Maps. Converting for storage
 *     is on you.
 *
 *   API:  new Map([[k, v]])  get/set/has/delete/clear/size
 *         keys() values() entries()  — iterables, spread them to get arrays
 *         new Set([...])     add/has/delete/size, iterable, no duplicates
 *
 *   WeakMap: keys must be objects and are not kept alive by the map.
 *   Used for attaching private data to an object without leaking memory.
 * ==========================================================================*/

section('Exercise 1 — Map basics');
/* Build a Map from pairs, then read one key back.
 * makeMap([['a',1]]) -> Map { 'a' => 1 }
 * getFrom(map, 'a') -> 1 ; getFrom(map, 'zz') -> undefined       */
function makeMap(pairs) {
  // your code here
}
function getFrom(map, key) {
  // your code here
}
check('makeMap', makeMap([['a', 1], ['b', 2]]), new Map([['a', 1], ['b', 2]]));
check('getFrom', getFrom(new Map([['a', 1]]), 'a'), 1);
check('getFrom missing', () => String(getFrom(new Map(), 'zz')), 'undefined', getFrom);

section('Exercise 2 — objectToMap / mapToObject');
/* objectToMap({ a: 1 }) -> Map { 'a' => 1 }
 * mapToObject(new Map([['a', 1]])) -> { a: 1 }                   */
function objectToMap(obj) {
  // your code here
}
function mapToObject(map) {
  // your code here
}
check('objectToMap', objectToMap({ a: 1, b: 2 }), new Map([['a', 1], ['b', 2]]));
check('mapToObject', mapToObject(new Map([['a', 1]])), { a: 1 });

section('Exercise 3 — object keys are objects');
/* Count how many times each OBJECT appears, using the objects themselves
 * as keys. A plain object could not do this — every key would become
 * the string '[object Object]'.
 * const a = {}, b = {};
 * countRefs([a, b, a]) -> Map { a => 2, b => 1 }                 */
function countRefs(objects) {
  // your code here
}
const oA = { n: 'a' }, oB = { n: 'b' };
check('countRefs', countRefs([oA, oB, oA]), new Map([[oA, 2], [oB, 1]]));

section('Exercise 4 — tallyWithMap');
/* tallyWithMap(['x','y','x']) -> Map { 'x' => 2, 'y' => 1 }
 * Insertion order must be first-seen order.                      */
function tallyWithMap(items) {
  // your code here
}
check('tally', tallyWithMap(['x', 'y', 'x']), new Map([['x', 2], ['y', 1]]));
check('tally order', () => [...tallyWithMap(['b', 'a', 'b']).keys()], ['b', 'a']);

section('Exercise 5 — map iteration');
/* sortedByValueDesc(map) -> array of [key, value] pairs, largest first.
 * A Map is directly iterable, so [...map] gives you the pairs.   */
function sortedByValueDesc(map) {
  // your code here
}
check('sorted', sortedByValueDesc(new Map([['a', 1], ['b', 3], ['c', 2]])),
  [['b', 3], ['c', 2], ['a', 1]]);

section('Exercise 6 — Set basics');
/* uniqueSet(['a','a','b']) -> Set { 'a', 'b' }
 * setToArray(new Set([1,2])) -> [1, 2]
 * hasAll(new Set([1,2,3]), [1,3]) -> true                        */
function uniqueSet(items) {
  // your code here
}
function setToArray(set) {
  // your code here
}
function hasAll(set, values) {
  // your code here
}
check('uniqueSet', uniqueSet(['a', 'a', 'b']), new Set(['a', 'b']));
check('setToArray', setToArray(new Set([1, 2])), [1, 2]);
check('hasAll yes', hasAll(new Set([1, 2, 3]), [1, 3]), true);
check('hasAll no', hasAll(new Set([1]), [1, 9]), false);

section('Exercise 7 — why a Set is worth it');
/* Return the values of `needles` that appear in `haystack`.
 * Build ONE Set from haystack first, then filter — do not call
 * haystack.includes() inside the loop.
 * commonValues([1,2,3,4], [3,9,1]) -> [3, 1]   (needles order)   */
function commonValues(haystack, needles) {
  // your code here
}
check('commonValues', commonValues([1, 2, 3, 4], [3, 9, 1]), [3, 1]);
check('none', commonValues([1], [9]), []);

section('Exercise 8 — groupToMap');
/* Like groupBy, but into a Map so the group order is insertion order
 * even when the keys look like numbers.
 * groupToMap([1.2, 2.7, 1.9], Math.floor)
 *   -> Map { 1 => [1.2, 1.9], 2 => [2.7] }
 * Note the keys are real NUMBERS here, not strings.              */
function groupToMap(items, keyFn) {
  // your code here
}
check('groupToMap', groupToMap([1.2, 2.7, 1.9], Math.floor),
  new Map([[1, [1.2, 1.9]], [2, [2.7]]]));

section('Exercise 9 — cache with a Map');
/* Return a function that remembers what it has already computed.
 * const slow = (n) => n * 2;
 * const fast = memoize(slow);
 * fast(2) -> 4, fast(2) again -> 4 but WITHOUT calling slow a second time.
 * Track calls with a counter to prove it.                        */
function memoize(fn) {
  // your code here
}
let calls = 0;
const doubled = () => memoize((n) => { calls++; return n * 2; });
check('computes', () => { calls = 0; const f = doubled(); return [f(2), f(2), calls]; }, [4, 4, 1]);
check('different args', () => { calls = 0; const f = doubled(); f(1); f(2); return calls; }, 2);

section('Exercise 10 — setOps');
/* union / intersection / difference, all returning SETS this time.
 * union(new Set([1,2]), new Set([2,3])) -> Set { 1, 2, 3 }       */
function union(a, b) {
  // your code here
}
function intersection(a, b) {
  // your code here
}
function difference(a, b) {
  // your code here
}
check('union', union(new Set([1, 2]), new Set([2, 3])), new Set([1, 2, 3]));
check('intersection', intersection(new Set([1, 2]), new Set([2, 3])), new Set([2]));
check('difference', difference(new Set([1, 2]), new Set([2])), new Set([1]));

section('PREDICTIONS');

// P1: object keys are stringified
const o1 = {};
o1[1] = 'a';
o1['1'] = 'b';
let p1 = null;
check('P1  Object.keys(o1) after setting o1[1] and o1["1"]', p1, Object.keys(o1));

// P2: Map keys are not
const m2 = new Map();
m2.set(1, 'a').set('1', 'b');
let p2 = null;
check('P2  m2.size', p2, m2.size);

// P3: two identical-looking objects as Map keys
const m3 = new Map();
m3.set({ a: 1 }, 'x').set({ a: 1 }, 'y');
let p3 = null;
check('P3  m3.size', p3, m3.size);

// P4: what does JSON.stringify do with a Map?
let p4 = null;
check('P4  JSON.stringify(new Map([["a",1]]))', p4, JSON.stringify(new Map([['a', 1]])));

// P5: Set and NaN
let p5 = null;
check('P5  new Set([NaN, NaN, 0, -0]).size', p5, new Set([NaN, NaN, 0, -0]).size);

// P6: does map.set return the value or the map?
const m6 = new Map();
let p6 = null;                    // guess: 'map' or 'value'
check('P6  typeof m6.set("a", 1)', p6, m6.set('a', 1) instanceof Map ? 'map' : 'value');

log('rule of thumb', 'user-supplied or non-string keys -> Map; fixed known fields -> object');

report();
