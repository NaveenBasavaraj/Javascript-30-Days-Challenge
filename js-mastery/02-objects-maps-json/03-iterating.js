'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 03 — ITERATING
 *
 * NOTES:
 *   Objects are not iterable, so you convert them to arrays first:
 *     Object.keys(obj)      ['a', 'b']
 *     Object.values(obj)    [1, 2]
 *     Object.entries(obj)   [['a', 1], ['b', 2]]     <- the useful one
 *     Object.fromEntries(pairs)                       <- and the way back
 *
 *   The round trip is the core move of this file:
 *     Object.fromEntries(Object.entries(obj).map(...).filter(...))
 *
 *   for (const key in obj) also walks INHERITED keys — prefer Object.keys.
 *
 *   KEY ORDER is not "insertion order" exactly: integer-like keys come
 *   first in ascending numeric order, then everything else in insertion
 *   order. See P1.
 * ==========================================================================*/

const SCORES = { asha: 91, ben: 64, cara: 78, dev: 55 };

section('Exercise 1 — keys, values, entries');
function keysOf(obj) {
  // your code here
}
function valuesOf(obj) {
  // your code here
}
function entriesOf(obj) {
  // your code here
}
check('keysOf', keysOf(SCORES), ['asha', 'ben', 'cara', 'dev']);
check('valuesOf', valuesOf(SCORES), [91, 64, 78, 55]);
check('entriesOf', entriesOf({ a: 1 }), [['a', 1]]);

section('Exercise 2 — totals');
/* sumValues({a:1, b:2}) -> 3
 * averageValue(SCORES) -> 72                                     */
function sumValues(obj) {
  // your code here
}
function averageValue(obj) {
  // your code here
}
check('sumValues', sumValues({ a: 1, b: 2 }), 3);
check('sumValues empty', sumValues({}), 0);
check('averageValue', averageValue(SCORES), 72);

section('Exercise 3 — formatScores');
/* One string per entry, in key order.
 * -> ['asha: 91', 'ben: 64', 'cara: 78', 'dev: 55']
 * Destructure the pair in the callback: ([name, score]) => ...   */
function formatScores(scores) {
  // your code here
}
check('formatScores', formatScores(SCORES), ['asha: 91', 'ben: 64', 'cara: 78', 'dev: 55']);

section('Exercise 4 — mapValues');
/* Keep every key, transform every value. Return a NEW object.
 * mapValues({a:1, b:2}, n => n * 10) -> { a: 10, b: 20 }
 * This is the entries -> map -> fromEntries round trip.          */
function mapValues(obj, fn) {
  // your code here
}
check('mapValues', mapValues({ a: 1, b: 2 }, (n) => n * 10), { a: 10, b: 20 });
check('mapValues gets the key too', mapValues({ a: 1 }, (v, k) => `${k}${v}`), { a: 'a1' });

section('Exercise 5 — filterValues');
/* Keep only the entries whose VALUE passes.
 * passing(SCORES) -> { asha: 91, cara: 78 }   (score >= 70)      */
function passing(scores) {
  // your code here
}
check('passing', passing(SCORES), { asha: 91, cara: 78 });

section('Exercise 6 — pick / omit');
/* pick({a:1,b:2,c:3}, ['a','c']) -> { a: 1, c: 3 }
 *   keys that do not exist are skipped
 * omit({a:1,b:2,c:3}, ['a']) -> { b: 2, c: 3 }                   */
function pick(obj, keys) {
  // your code here
}
function omit(obj, keys) {
  // your code here
}
check('pick', pick({ a: 1, b: 2, c: 3 }, ['a', 'c']), { a: 1, c: 3 });
check('pick missing key', pick({ a: 1 }, ['a', 'zz']), { a: 1 });
check('omit', omit({ a: 1, b: 2, c: 3 }, ['a']), { b: 2, c: 3 });

section('Exercise 7 — highestScorer');
/* The key with the largest value, or null for an empty object.
 * highestScorer(SCORES) -> 'asha'                                */
function highestScorer(scores) {
  // your code here
}
check('highestScorer', highestScorer(SCORES), 'asha');
check('empty', highestScorer({}), null);

section('Exercise 8 — sortObjectByValue');
/* Return ENTRIES sorted by value, biggest first.
 * -> [['asha',91], ['cara',78], ['ben',64], ['dev',55]]          */
function sortObjectByValue(obj) {
  // your code here
}
check('sorted entries', sortObjectByValue(SCORES),
  [['asha', 91], ['cara', 78], ['ben', 64], ['dev', 55]]);

section('Exercise 9 — countKeysDeep');
/* Count every key at every depth of a nested object.
 * countKeysDeep({ a: 1, b: { c: 2, d: { e: 3 } } }) -> 5
 * (a, b, c, d, e). Values that are arrays count as one key, no recursion
 * into them. Hint: recurse when typeof v === 'object' && v !== null
 * && !Array.isArray(v)                                           */
function countKeysDeep(obj) {
  // your code here
}
check('nested', countKeysDeep({ a: 1, b: { c: 2, d: { e: 3 } } }), 5);
check('flat', countKeysDeep({ a: 1 }), 1);
check('array value', countKeysDeep({ a: [1, 2, 3] }), 1);

section('Exercise 10 — toQueryString');
/* Turn an object into a URL query string, in key order.
 * toQueryString({ q: 'js', page: 2 }) -> 'q=js&page=2'
 * toQueryString({}) -> ''                                        */
function toQueryString(params) {
  // your code here
}
check('query', toQueryString({ q: 'js', page: 2 }), 'q=js&page=2');
check('query empty', toQueryString({}), '');

section('PREDICTIONS');

// P1: key ordering again — integer-like keys jump to the front
let p1 = null;
check('P1  Object.keys({ z: 1, 10: 2, a: 3, 2: 4 })', p1, Object.keys({ z: 1, 10: 2, a: 3, 2: 4 }));

// P2: Object.keys on an ARRAY
let p2 = null;
check('P2  Object.keys(["a","b"])', p2, Object.keys(['a', 'b']));

// P3: Object.entries on a string
let p3 = null;
check('P3  Object.entries("hi")', p3, Object.entries('hi'));

// P4: does fromEntries survive duplicate keys?
let p4 = null;
check('P4  Object.fromEntries([["a",1],["a",2]])', p4, Object.fromEntries([['a', 1], ['a', 2]]));

// P5: Object.keys ignores inherited properties
const parent = { inherited: 1 };
const child = Object.create(parent);
child.own = 2;
let p5 = null;
check('P5  Object.keys(child)', p5, Object.keys(child));

// P6: ...but for...in does not
const seen = [];
for (const k in child) seen.push(k);
let p6 = null;
check('P6  for...in over child', p6, seen);

log('lesson', 'Object.keys = own keys only; for...in also walks the prototype');

report();
