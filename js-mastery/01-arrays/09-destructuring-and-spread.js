'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 09 — DESTRUCTURING, SPREAD & REST
 *
 * NOTES:
 *   const [a, b] = arr             pull items out by position
 *   const [a, , c] = arr           skip a position with a bare comma
 *   const [a = 10] = arr           default, used only when the value is undefined
 *   const [first, ...rest] = arr   `rest` collects everything left (an array)
 *   const [[x, y]] = nested        destructuring nests
 *
 *   SPREAD  ...arr  in a literal or call  -> "unpack the items here"
 *   REST    ...name in a parameter list or pattern -> "collect the rest"
 *   Same three dots, opposite jobs: spread expands, rest gathers.
 * ==========================================================================*/

section('Exercise 1 — swap');
/* Return [b, a] using destructuring, no temp variable.
 * swap([1, 2]) -> [2, 1]                                         */
function swap(pair) {
  // your code here
}
check('swap', swap([1, 2]), [2, 1]);

section('Exercise 2 — headAndTail');
/* Return { head, tail } where head is the first item and tail is
 * an ARRAY of everything else.
 * headAndTail([1,2,3]) -> { head: 1, tail: [2, 3] }
 * headAndTail([])      -> { head: undefined, tail: [] }          */
function headAndTail(arr) {
  // your code here
}
check('headAndTail', headAndTail([1, 2, 3]), { head: 1, tail: [2, 3] });
check('headAndTail empty', headAndTail([]), { head: undefined, tail: [] });

section('Exercise 3 — thirdItem (skipping)');
/* Use `const [, , third] = arr` — no indexing with [2].
 * thirdItem(['a','b','c','d']) -> 'c'                            */
function thirdItem(arr) {
  // your code here
}
check('thirdItem', thirdItem(['a', 'b', 'c', 'd']), 'c');

section('Exercise 4 — coords with defaults');
/* Destructure with defaults x = 0, y = 0, z = 0 and return {x, y, z}.
 * coords([5]) -> { x: 5, y: 0, z: 0 }                            */
function coords(arr) {
  // your code here
}
check('coords partial', coords([5]), { x: 5, y: 0, z: 0 });
check('coords full', coords([1, 2, 3]), { x: 1, y: 2, z: 3 });

section('Exercise 5 — nested destructuring');
/* Given [[a, b], [c, d]] return a + b + c + d, destructuring in ONE line.
 * addGrid([[1,2],[3,4]]) -> 10                                   */
function addGrid(grid) {
  // your code here
}
check('addGrid', addGrid([[1, 2], [3, 4]]), 10);

section('Exercise 6 — copy & merge with spread');
/* copy(arr)          -> a new array with the same items
 * mergeAll(a, b, c)  -> all three joined into one new array
 * withExtra(arr, x)  -> a NEW array with x appended (arr unchanged) */
function copy(arr) {
  // your code here
}
function mergeAll(a, b, c) {
  // your code here
}
function withExtra(arr, x) {
  // your code here
}
const t6 = [1, 2];
check('copy equal', copy(t6), [1, 2]);
check('copy is new', () => copy(t6) !== t6, true);
check('mergeAll', mergeAll([1], [2, 3], [4]), [1, 2, 3, 4]);
check('withExtra', withExtra(t6, 3), [1, 2, 3]);
check('withExtra did not mutate', t6, [1, 2]);

section('Exercise 7 — insertInMiddle (spread, no splice)');
/* Build a NEW array: items before index, then `item`, then the rest.
 * insertInMiddle(['a','d'], 1, 'x') -> ['a','x','d']             */
function insertInMiddle(arr, index, item) {
  // your code here
}
check('insertInMiddle', insertInMiddle(['a', 'd'], 1, 'x'), ['a', 'x', 'd']);
check('insert at 0', insertInMiddle(['b'], 0, 'a'), ['a', 'b']);

section('Exercise 8 — maxOf with spread');
/* Math.max takes separate arguments, not an array. Spread it in.
 * maxOf([3, 9, 2]) -> 9                                          */
function maxOf(nums) {
  // your code here
}
check('maxOf', maxOf([3, 9, 2]), 9);

section('Exercise 9 — rest parameters');
/* sumAll(1, 2, 3) -> 6   (any number of arguments, including none -> 0)
 * tagAll('x', 1, 2) -> ['x1', 'x2']   (first arg is the prefix)  */
function sumAll(...nums) {
  // your code here
}
function tagAll(prefix, ...items) {
  // your code here
}
check('sumAll', sumAll(1, 2, 3), 6);
check('sumAll none', sumAll(), 0);
check('tagAll', tagAll('x', 1, 2), ['x1', 'x2']);

section('Exercise 10 — destructuring in a loop');
/* Each entry is [name, score]. Return ['Asha: 10', 'Ben: 7'].
 * Destructure right in the parameter list:  ([name, score]) => ... */
function formatScores(entries) {
  // your code here
}
check('formatScores', formatScores([['Asha', 10], ['Ben', 7]]), ['Asha: 10', 'Ben: 7']);

section('Exercise 11 — unzip');
/* Split pairs into two arrays.
 * unzip([[1,'a'], [2,'b']]) -> [[1, 2], ['a', 'b']]              */
function unzip(pairs) {
  // your code here
}
check('unzip', unzip([[1, 'a'], [2, 'b']]), [[1, 2], ['a', 'b']]);

section('PREDICTIONS');

// P1: destructuring past the end
let p1 = null;
const [, , third1] = ['a', 'b'];
check('P1  third of a 2-item array', p1, third1);

// P2: does a default kick in for null?
let p2 = '???';   // this one's placeholder is a string — write the real value
const [v2 = 'fallback'] = [null];
check('P2  const [v = "fallback"] = [null]', p2, v2);

// P3: spreading a string
let p3 = null;
check('P3  [..."hi"]', p3, [...'hi']);

// P4: does spread copy deeply?
const inner = { n: 1 };
const orig4 = [inner];
const copy4 = [...orig4];
copy4[0].n = 99;
let p4 = null;
check('P4  inner.n after mutating the copy', p4, inner.n);
log('lesson', 'spread makes a SHALLOW copy — nested objects are shared');

// P5: rest must be last
let p5 = null;              // guess 'works' or 'SyntaxError'
check('P5  const [...rest, last] = arr', p5, 'SyntaxError');

report();
