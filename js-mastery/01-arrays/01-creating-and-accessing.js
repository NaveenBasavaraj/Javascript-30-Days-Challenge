'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 01 — CREATING & ACCESSING
 * Run with:  node 01-arrays/01-creating-and-accessing.js
 *
 * NOTES (read once, then start writing):
 *   • An array is an ordered list. Index starts at 0.
 *   • arr.length is always (last index + 1). It is writable!
 *   • arr[i] out of range -> undefined (NOT an error).
 *   • arr.at(-1) reads from the end. arr[-1] does NOT.
 *   • Ways to build: literal [], Array(n), Array.of(...), Array.from(iterable)
 *   • typeof [] is "object" -> use Array.isArray() to test for an array.
 * ==========================================================================*/

section('Exercise 1 — firstAndLast');
/* Return a 2-item array: [first element, last element].
 * firstAndLast(['a','b','c']) -> ['a','c']
 * Do NOT hardcode index 2 — it must work for any length.       */
function firstAndLast(arr) {
  // your code here
}
check('firstAndLast(3 items)', firstAndLast(['a', 'b', 'c']), ['a', 'c']);
check('firstAndLast(1 item)', firstAndLast([7]), [7, 7]);

section('Exercise 2 — secondToLast (use .at)');
/* Return the second-to-last element using arr.at().
 * secondToLast([10, 20, 30, 40]) -> 30                          */
function secondToLast(arr) {
  // your code here
}
check('secondToLast', secondToLast([10, 20, 30, 40]), 30);
check('secondToLast 2 items', secondToLast(['x', 'y']), 'x');
// String(...) so an unwritten function cannot pass by accident:
check('secondToLast too short', () => String(secondToLast([1])), 'undefined', secondToLast);

section('Exercise 3 — describe');
/* Return the string "<length> items, first is <first>".
 * describe(['x','y']) -> "2 items, first is x"
 * Use a template literal (backticks).                           */
function describe(arr) {
  // your code here
}
check('describe', describe(['x', 'y']), '2 items, first is x');

section('Exercise 4 — filled');
/* Return an array of length n where every slot is `value`.
 * filled(3, 'x') -> ['x','x','x']
 * Hint: new Array(n).fill(value)                                */
function filled(n, value) {
  // your code here
}
check('filled', filled(3, 'x'), ['x', 'x', 'x']);
check('filled zeros', filled(4, 0), [0, 0, 0, 0]);

section('Exercise 5 — charsOf');
/* Turn a string into an array of its characters.
 * charsOf('hey') -> ['h','e','y']
 * Try it with Array.from(...) AND with .split('') — both work.  */
function charsOf(str) {
  // your code here
}
check('charsOf', charsOf('hey'), ['h', 'e', 'y']);

section('Exercise 6 — range');
/* Return all whole numbers from start to end, INCLUSIVE.
 * range(2, 6) -> [2, 3, 4, 5, 6]
 * range(0, 0) -> [0]
 * Hint (pick one):
 *   a) a for loop that pushes
 *   b) Array.from({ length: n }, (_, i) => ...)                 */
function range(start, end) {
  // your code here
}
check('range(2,6)', range(2, 6), [2, 3, 4, 5, 6]);
check('range(0,0)', range(0, 0), [0]);
check('range(-2,1)', range(-2, 1), [-2, -1, 0, 1]);

section('Exercise 7 — isRealArray');
/* Return true only if the value is a real array.
 * isRealArray([1]) -> true ; isRealArray('abc') -> false
 * isRealArray({ length: 2 }) -> false                           */
function isRealArray(value) {
  // your code here
}
check('array', isRealArray([1]), true);
check('string', isRealArray('abc'), false);
check('array-like object', isRealArray({ length: 2 }), false);
check('null', isRealArray(null), false);

section('Exercise 8 — truncate (length is writable)');
/* Shorten the array IN PLACE to n items by assigning to .length,
 * then return the same array.
 * truncate([1,2,3,4,5], 2) -> [1,2]                             */
function truncate(arr, n) {
  // your code here
}
const t8 = [1, 2, 3, 4, 5];
check('truncate returns', truncate(t8, 2), [1, 2]);
check('truncate mutated the original', t8, [1, 2]);

section('PREDICTIONS — guess before you run');
/* Replace each `null` with what you think the value is.
 * A failing check reveals the truth — read it and remember it.  */

// P1: What does an out-of-range index give you?
let p1 = null;                  // e.g. 0 / undefined / an error
check('P1  ["a","b"][9]', p1, ['a', 'b'][9]);

// P2: What is typeof [] ?
let p2 = null;                  // a string like 'array'
check('P2  typeof []', p2, typeof []);

// P3: What is the length of this array?
let p3 = null;
const holey = [1, 2, 3];
holey[7] = 8;
check('P3  length after holey[7] = 8', p3, holey.length);

// P4: Array(3) makes an array of 3 EMPTY slots. What is Array(3)[0]?
let p4 = null;
check('P4  Array(3)[0]', p4, Array(3)[0]);

// P5: Array.of(3) vs Array(3) — what is Array.of(3).length?
let p5 = null;
check('P5  Array.of(3).length', p5, Array.of(3).length);

log('for reference, a holey array prints as', holey);

report();
