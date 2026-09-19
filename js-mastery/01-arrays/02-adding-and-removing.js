'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 02 — ADDING & REMOVING ITEMS
 *
 * NOTES:
 *   MUTATING (change the array you were given):
 *     push(...items)     add to END      -> returns NEW LENGTH
 *     pop()              remove from END -> returns REMOVED ITEM
 *     unshift(...items)  add to START    -> returns NEW LENGTH
 *     shift()            remove at START -> returns REMOVED ITEM
 *     splice(start, deleteCount, ...insert) -> returns array of REMOVED items
 *   NON-MUTATING (build a new array, original untouched):
 *     slice(start, end)  end is EXCLUSIVE; negatives count from the end
 *     concat(other)      glue arrays together
 *
 *   Rule of thumb: "spl-I-ce" mutates, "sl-I-ce" copies.
 * ==========================================================================*/

section('Exercise 1 — pushAll');
/* Add every item to the END of arr (mutating) and return arr.
 * pushAll([1], 2, 3) -> [1, 2, 3]
 * Hint: rest parameters  function pushAll(arr, ...items)         */
function pushAll(arr, ...items) {
  // your code here
}
check('pushAll', pushAll([1], 2, 3), [1, 2, 3]);
check('pushAll none', pushAll(['a']), ['a']);

section('Exercise 2 — takeLast / takeFirst');
/* takeLast removes and RETURNS the last item.
 * takeFirst removes and RETURNS the first item.                  */
function takeLast(arr) {
  // your code here
}
function takeFirst(arr) {
  // your code here
}
const t2 = ['a', 'b', 'c'];
check('takeLast value', takeLast(t2), 'c');
check('array after takeLast', t2, ['a', 'b']);
check('takeFirst value', takeFirst(t2), 'a');
check('array after takeFirst', t2, ['b']);

section('Exercise 3 — insertAt');
/* Insert `item` at `index`, shifting the rest right. Mutate + return arr.
 * insertAt(['a','c'], 1, 'b') -> ['a','b','c']
 * Hint: splice(index, 0, item)                                   */
function insertAt(arr, index, item) {
  // your code here
}
check('insertAt middle', insertAt(['a', 'c'], 1, 'b'), ['a', 'b', 'c']);
check('insertAt start', insertAt([2, 3], 0, 1), [1, 2, 3]);

section('Exercise 4 — removeAt');
/* Remove the item at `index` and RETURN THE REMOVED ITEM (not the array).
 * removeAt(['a','b','c'], 1) -> 'b'
 * Careful: splice returns an ARRAY of removed items.             */
function removeAt(arr, index) {
  // your code here
}
const t4 = ['a', 'b', 'c'];
check('removeAt returns item', removeAt(t4, 1), 'b');
check('array after removeAt', t4, ['a', 'c']);

section('Exercise 5 — replaceAt');
/* Replace the item at `index` with `item` (mutating), return arr.
 * replaceAt(['a','X','c'], 1, 'b') -> ['a','b','c']              */
function replaceAt(arr, index, item) {
  // your code here
}
check('replaceAt', replaceAt(['a', 'X', 'c'], 1, 'b'), ['a', 'b', 'c']);

section('Exercise 6 — slice practice (no mutation allowed)');
/* firstThree(['a','b','c','d','e'])       -> ['a','b','c']
 * lastTwo(['a','b','c','d','e'])          -> ['d','e']
 * withoutEnds(['a','b','c','d','e'])      -> ['b','c','d']
 * copyOf(arr) -> a NEW array with the same items                 */
function firstThree(arr) {
  // your code here
}
function lastTwo(arr) {
  // your code here
}
function withoutEnds(arr) {
  // your code here
}
function copyOf(arr) {
  // your code here
}
const t6 = ['a', 'b', 'c', 'd', 'e'];
check('firstThree', firstThree(t6), ['a', 'b', 'c']);
check('lastTwo', lastTwo(t6), ['d', 'e']);
check('withoutEnds', withoutEnds(t6), ['b', 'c', 'd']);
check('copyOf equals', copyOf(t6), t6);
check('copyOf is a NEW array', copyOf(t6) !== t6, true);
check('original untouched', t6, ['a', 'b', 'c', 'd', 'e']);

section('Exercise 7 — merge (non-mutating)');
/* Return a new array with all items of a then all of b.
 * merge([1,2],[3]) -> [1,2,3]   and a must stay [1,2]            */
function merge(a, b) {
  // your code here
}
const m7 = [1, 2];
check('merge', merge(m7, [3]), [1, 2, 3]);
check('merge did not mutate a', m7, [1, 2]);

section('Exercise 8 — clear');
/* Empty the array IN PLACE (so other references see it empty too)
 * and return it. Hint: one line, using .length                   */
function clear(arr) {
  // your code here
}
const t8 = [1, 2, 3];
const alias8 = t8;
clear(t8);
check('cleared', t8, []);
check('alias sees it too', alias8, []);

section('Exercise 9 — rotateLeft');
/* Move the first item to the end, n times. Return a NEW array.
 * rotateLeft([1,2,3,4], 1) -> [2,3,4,1]
 * rotateLeft([1,2,3,4], 2) -> [3,4,1,2]
 * Hint: slice(n) then slice(0, n)                                */
function rotateLeft(arr, n) {
  // your code here
}
check('rotateLeft 1', rotateLeft([1, 2, 3, 4], 1), [2, 3, 4, 1]);
check('rotateLeft 2', rotateLeft([1, 2, 3, 4], 2), [3, 4, 1, 2]);
check('rotateLeft 0', rotateLeft([1, 2, 3, 4], 0), [1, 2, 3, 4]);

section('PREDICTIONS');

// P1: push returns what?
let p1 = null;
check('P1  [1,2].push(3)', p1, [1, 2].push(3));

// P2: splice returns what? (removing 2 items from index 1)
let p2 = null;
check('P2  ["a","b","c","d"].splice(1,2)', p2, ['a', 'b', 'c', 'd'].splice(1, 2));

// P3: slice with a negative start
let p3 = null;
check('P3  [1,2,3,4,5].slice(-2)', p3, [1, 2, 3, 4, 5].slice(-2));

// P4: `delete` on an array — what is the length afterwards?
const d = [1, 2, 3];
delete d[1];
let p4 = null;
check('P4  length after delete d[1]', p4, d.length);
log('and d itself is', d);   // <- this is why we use splice, not delete

report();
