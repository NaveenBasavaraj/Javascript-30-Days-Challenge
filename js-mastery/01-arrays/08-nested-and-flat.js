'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 08 — NESTED ARRAYS, FLAT & FLATMAP
 *
 * NOTES:
 *   arr.flat()          one level deep
 *   arr.flat(2)         two levels
 *   arr.flat(Infinity)  all the way down
 *   arr.flatMap(fn)     map, then flatten ONE level — great when each item
 *                       turns into 0, 1 or many items
 *   A matrix is just an array of row arrays: matrix[row][col]
 * ==========================================================================*/

const MATRIX = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

section('Exercise 1 — flatten levels');
/* flattenOne([1, [2, [3]]])   -> [1, 2, [3]]
 * flattenAll([1, [2, [3, [4]]]]) -> [1, 2, 3, 4]                 */
function flattenOne(arr) {
  // your code here
}
function flattenAll(arr) {
  // your code here
}
check('flattenOne', flattenOne([1, [2, [3]]]), [1, 2, [3]]);
check('flattenAll', flattenAll([1, [2, [3, [4]]]]), [1, 2, 3, 4]);

section('Exercise 2 — flattenManually (recursion, no .flat)');
/* Same as flattenAll but written by hand.
 * For each item: if Array.isArray(item), flatten it and spread the
 * result in; otherwise push the item.                            */
function flattenManually(arr) {
  // your code here
}
check('manual deep', flattenManually([1, [2, [3, [4, [5]]]]]), [1, 2, 3, 4, 5]);
check('manual empty', flattenManually([]), []);
check('manual no nesting', flattenManually([1, 2]), [1, 2]);

section('Exercise 3 — allWords (flatMap)');
/* Split each sentence into words and return one flat list.
 * allWords(['hello there', 'you']) -> ['hello','there','you']    */
function allWords(sentences) {
  // your code here
}
check('allWords', allWords(['hello there', 'you']), ['hello', 'there', 'you']);

section('Exercise 4 — duplicateEach');
/* Every item appears twice, in place.
 * duplicateEach([1, 2]) -> [1, 1, 2, 2]                          */
function duplicateEach(arr) {
  // your code here
}
check('duplicateEach', duplicateEach([1, 2]), [1, 1, 2, 2]);

section('Exercise 5 — keepPositive with flatMap');
/* flatMap can also REMOVE items: return [] to drop one, [x] to keep it.
 * keepPositive([1, -2, 3]) -> [1, 3]                             */
function keepPositive(nums) {
  // your code here
}
check('keepPositive', keepPositive([1, -2, 3]), [1, 3]);

section('Exercise 6 — matrix basics');
/* getRow(MATRIX, 1)    -> [4, 5, 6]
 * getColumn(MATRIX, 1) -> [2, 5, 8]
 * diagonal(MATRIX)     -> [1, 5, 9]
 * sumMatrix(MATRIX)    -> 45                                     */
function getRow(matrix, r) {
  // your code here
}
function getColumn(matrix, c) {
  // your code here
}
function diagonal(matrix) {
  // your code here
}
function sumMatrix(matrix) {
  // your code here
}
check('getRow', getRow(MATRIX, 1), [4, 5, 6]);
check('getColumn', getColumn(MATRIX, 1), [2, 5, 8]);
check('diagonal', diagonal(MATRIX), [1, 5, 9]);
check('sumMatrix', sumMatrix(MATRIX), 45);

section('Exercise 7 — transpose');
/* Turn rows into columns.
 * transpose([[1,2],[3,4],[5,6]]) -> [[1,3,5],[2,4,6]]            */
function transpose(matrix) {
  // your code here
}
check('transpose', transpose([[1, 2], [3, 4], [5, 6]]), [[1, 3, 5], [2, 4, 6]]);
check('transpose square', transpose(MATRIX), [[1, 4, 7], [2, 5, 8], [3, 6, 9]]);

section('Exercise 8 — buildMatrix (mind the fill trap)');
/* Return a rows x cols grid filled with `value`.
 * buildMatrix(2, 3, 0) -> [[0,0,0],[0,0,0]]
 * Each row must be an INDEPENDENT array — see prediction P3 below.
 * Hint: Array.from({ length: rows }, () => ...)                  */
function buildMatrix(rows, cols, value) {
  // your code here
}
check('shape', buildMatrix(2, 3, 0), [[0, 0, 0], [0, 0, 0]]);
check('rows are independent', () => {
  const g = buildMatrix(2, 3, 0);
  g[0][0] = 9;
  return g;
}, [[9, 0, 0], [0, 0, 0]]);

section('Exercise 9 — deepSum');
/* Add every number no matter how deeply nested.
 * deepSum([1, [2, [3, [4]]], 5]) -> 15                           */
function deepSum(arr) {
  // your code here
}
check('deepSum', deepSum([1, [2, [3, [4]]], 5]), 15);

section('Exercise 10 — pairsOf (cartesian product)');
/* Every combination of one item from a and one from b.
 * pairsOf([1,2], ['a','b'])
 *   -> [[1,'a'], [1,'b'], [2,'a'], [2,'b']]
 * Hint: a.flatMap(x => b.map(y => [x, y]))                       */
function pairsOf(a, b) {
  // your code here
}
check('pairsOf', pairsOf([1, 2], ['a', 'b']), [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]);

section('PREDICTIONS');

// P1: how deep does flat() go by default?
let p1 = null;
check('P1  [1,[2,[3,[4]]]].flat()', p1, [1, [2, [3, [4]]]].flat());

// P2: flat also drops empty slots
let p2 = null;
check('P2  [1, , 3].flat()', p2, [1, , 3].flat());

// P3: THE FILL TRAP — three rows, or one row three times?
const trap = Array(3).fill([]);
trap[0].push('x');
let p3 = null;
check('P3  trap after trap[0].push("x")', p3, trap);
log('lesson', 'fill() stores the SAME array reference in every slot');

// P4: flatMap flattens how many levels?
let p4 = null;
check('P4  [1,2].flatMap(x => [[x]])', p4, [1, 2].flatMap((x) => [[x]]));

report();
