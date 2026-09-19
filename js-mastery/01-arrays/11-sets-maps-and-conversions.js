'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 11 — CONVERTING TO/FROM SETS, MAPS, STRINGS & OBJECTS
 *
 * NOTES:
 *   new Set(arr)        unique values, keeps insertion order
 *   [...set]            back to an array
 *   set.has(v)          O(1) lookup — much faster than arr.includes in a loop
 *   new Map(pairs)      key -> value, any key type, keeps insertion order
 *   [...map]            back to [key, value] pairs
 *   Object.entries(o) / Object.keys(o) / Object.values(o) / Object.fromEntries(pairs)
 *   str.split(sep) -> array      arr.join(sep) -> string
 *
 *   Set/Map compare with the same rule as ===, so two different objects
 *   with equal contents both count as "different".
 * ==========================================================================*/

section('Exercise 1 — unique');
/* Remove duplicates, keep first-seen order.
 * unique([3, 1, 3, 2, 1]) -> [3, 1, 2]                           */
function unique(arr) {
  // your code here
}
check('unique', unique([3, 1, 3, 2, 1]), [3, 1, 2]);
check('unique strings', unique(['a', 'a']), ['a']);
check('unique empty', unique([]), []);

section('Exercise 2 — set operations');
/* union([1,2], [2,3])        -> [1,2,3]
 * intersection([1,2,3],[2,3,4]) -> [2,3]
 * difference([1,2,3],[2])    -> [1,3]      (in a, not in b)      */
function union(a, b) {
  // your code here
}
function intersection(a, b) {
  // your code here
}
function difference(a, b) {
  // your code here
}
check('union', union([1, 2], [2, 3]), [1, 2, 3]);
check('intersection', intersection([1, 2, 3], [2, 3, 4]), [2, 3]);
check('difference', difference([1, 2, 3], [2]), [1, 3]);

section('Exercise 3 — hasDuplicates');
/* true if any value appears more than once. One line is possible.
 * hasDuplicates([1,2,1]) -> true                                 */
function hasDuplicates(arr) {
  // your code here
}
check('dupes', hasDuplicates([1, 2, 1]), true);
check('no dupes', hasDuplicates([1, 2]), false);

section('Exercise 4 — strings <-> arrays');
/* csvToArray('a, b ,c') -> ['a','b','c']   (trim each part!)
 * arrayToCsv(['a','b']) -> 'a,b'
 * reverseString('hello') -> 'olleh'   (split, reverse, join)     */
function csvToArray(str) {
  // your code here
}
function arrayToCsv(arr) {
  // your code here
}
function reverseString(str) {
  // your code here
}
check('csvToArray', csvToArray('a, b ,c'), ['a', 'b', 'c']);
check('arrayToCsv', arrayToCsv(['a', 'b']), 'a,b');
check('reverseString', reverseString('hello'), 'olleh');

section('Exercise 5 — countWithMap');
/* Same idea as tally() from file 06, but the accumulator is a Map.
 * countWithMap(['a','b','a']) -> Map { 'a' => 2, 'b' => 1 }
 * Why a Map? Keys keep their type and there is no clash with
 * inherited object keys like "constructor" or "__proto__".       */
function countWithMap(items) {
  // your code here
}
check('countWithMap', countWithMap(['a', 'b', 'a']), new Map([['a', 2], ['b', 1]]));

section('Exercise 6 — mapToArray / arrayToMap');
/* mapToPairs(new Map([['a',1]])) -> [['a', 1]]
 * indexById([{id:'x'}]) -> Map { 'x' => {id:'x'} }               */
function mapToPairs(map) {
  // your code here
}
function indexById(objects) {
  // your code here
}
check('mapToPairs', mapToPairs(new Map([['a', 1], ['b', 2]])), [['a', 1], ['b', 2]]);
check('indexById', indexById([{ id: 'x' }, { id: 'y' }]),
  new Map([['x', { id: 'x' }], ['y', { id: 'y' }]]));

section('Exercise 7 — objects <-> arrays');
/* keysOf({a:1,b:2})     -> ['a','b']
 * valuesOf({a:1,b:2})   -> [1,2]
 * entriesOf({a:1})      -> [['a',1]]
 * objectFrom([['a',1]]) -> {a:1}
 * doubleValues({a:1,b:2}) -> {a:2,b:4}
 *   (entries -> map -> Object.fromEntries)                       */
function keysOf(obj) {
  // your code here
}
function valuesOf(obj) {
  // your code here
}
function entriesOf(obj) {
  // your code here
}
function objectFrom(pairs) {
  // your code here
}
function doubleValues(obj) {
  // your code here
}
check('keysOf', keysOf({ a: 1, b: 2 }), ['a', 'b']);
check('valuesOf', valuesOf({ a: 1, b: 2 }), [1, 2]);
check('entriesOf', entriesOf({ a: 1 }), [['a', 1]]);
check('objectFrom', objectFrom([['a', 1]]), { a: 1 });
check('doubleValues', doubleValues({ a: 1, b: 2 }), { a: 2, b: 4 });

section('Exercise 8 — uniqueBy');
/* Remove duplicates by a KEY function, keeping the first of each.
 * uniqueBy([{id:1},{id:2},{id:1}], u => u.id) -> [{id:1},{id:2}]
 * Hint: a Set of seen keys.                                      */
function uniqueBy(arr, keyFn) {
  // your code here
}
check('uniqueBy', uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], (u) => u.id), [{ id: 1 }, { id: 2 }]);

section('Exercise 9 — array-like to array');
/* `arguments`, NodeLists and { 0:'a', 1:'b', length:2 } are ARRAY-LIKE:
 * indexed + a length, but no array methods. Convert with Array.from.
 * toArray({0:'a', 1:'b', length:2}) -> ['a','b']                 */
function toArray(arrayLike) {
  // your code here
}
check('toArray', toArray({ 0: 'a', 1: 'b', length: 2 }), ['a', 'b']);
check('toArray from a Set', toArray(new Set([1, 2])), [1, 2]);

section('PREDICTIONS');

// P1: what does a Set do with objects that look the same?
let p1 = null;
check('P1  new Set([{a:1}, {a:1}]).size', p1, new Set([{ a: 1 }, { a: 1 }]).size);

// P2: Set membership for NaN
let p2 = null;
check('P2  new Set([NaN, NaN]).size', p2, new Set([NaN, NaN]).size);

// P3: does a Set keep insertion order?
let p3 = null;
check('P3  [...new Set([3,1,3,2])]', p3, [...new Set([3, 1, 3, 2])]);

// P4: join on nested arrays and null
let p4 = null;
check('P4  [1, null, [2,3]].join("-")', p4, [1, null, [2, 3]].join('-'));

// P5: object keys are always strings
let p5 = null;
check('P5  Object.keys({1: "a"})', p5, Object.keys({ 1: 'a' }));

log('tip', 'reach for a Set the moment you write includes() inside a loop');

report();
