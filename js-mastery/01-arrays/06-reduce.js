'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 06 — REDUCE (the one method that can do all the others)
 *
 * NOTES:
 *   arr.reduce((accumulator, item, index, arr) => newAccumulator, startValue)
 *
 *   "Carry a value across the array, updating it at each item."
 *   The accumulator can be ANY type: number, string, array, object, Map.
 *
 *   ALWAYS pass a start value. Without it, reduce uses arr[0] as the start
 *   and throws "Reduce of empty array with no initial value" on [].
 *
 *   Whatever you return becomes the accumulator for the next item —
 *   forgetting to return is the #1 reduce bug.
 * ==========================================================================*/

const ORDERS = [
  { customer: 'Asha', item: 'Laptop', qty: 1, price: 1200 },
  { customer: 'Ben', item: 'Mouse', qty: 3, price: 25 },
  { customer: 'Asha', item: 'Cable', qty: 2, price: 8 },
  { customer: 'Cara', item: 'Mouse', qty: 1, price: 25 },
];

section('Exercise 1 — sum & product');
/* sum([1,2,3]) -> 6 , sum([]) -> 0
 * product([2,3,4]) -> 24 , product([]) -> 1                      */
function sum(nums) {
  // your code here
}
function product(nums) {
  // your code here
}
check('sum', sum([1, 2, 3]), 6);
check('sum empty', sum([]), 0);
check('product', product([2, 3, 4]), 24);
check('product empty', product([]), 1);

section('Exercise 2 — maxOf (no Math.max)');
/* Return the largest number, or null for an empty array.
 * maxOf([3, 9, 2]) -> 9                                          */
function maxOf(nums) {
  // your code here
}
check('maxOf', maxOf([3, 9, 2]), 9);
check('maxOf negatives', maxOf([-3, -9]), -3);
check('maxOf empty', maxOf([]), null);

section('Exercise 3 — average');
/* Mean of the numbers, or 0 for an empty array.
 * average([2, 4, 9]) -> 5                                        */
function average(nums) {
  // your code here
}
check('average', average([2, 4, 9]), 5);
check('average empty', average([]), 0);

section('Exercise 4 — totalRevenue');
/* Sum of qty * price across all orders. ORDERS -> 1200 + 75 + 16 + 25 */
function totalRevenue(orders) {
  // your code here
}
check('totalRevenue', totalRevenue(ORDERS), 1316);

section('Exercise 5 — tally (count each value)');
/* Build an object counting how many times each value appears.
 * tally(['a','b','a','c','a']) -> { a: 3, b: 1, c: 1 }
 * Start value: {}   Remember to RETURN the accumulator.          */
function tally(items) {
  // your code here
}
check('tally', tally(['a', 'b', 'a', 'c', 'a']), { a: 3, b: 1, c: 1 });
check('tally empty', tally([]), {});

section('Exercise 6 — groupBy first letter');
/* groupByFirstLetter(['apple','avocado','banana'])
 *   -> { a: ['apple','avocado'], b: ['banana'] }                 */
function groupByFirstLetter(words) {
  // your code here
}
check('groupByFirstLetter',
  groupByFirstLetter(['apple', 'avocado', 'banana']),
  { a: ['apple', 'avocado'], b: ['banana'] });

section('Exercise 7 — spentByCustomer');
/* { Asha: 1216, Ben: 75, Cara: 25 }   (qty * price per order)    */
function spentByCustomer(orders) {
  // your code here
}
check('spentByCustomer', spentByCustomer(ORDERS), { Asha: 1216, Ben: 75, Cara: 25 });

section('Exercise 8 — flattenOnce with reduce');
/* flattenOnce([[1,2],[3],[4,5]]) -> [1,2,3,4,5]
 * Accumulator is an array. Use concat (or spread) — do NOT use .flat(). */
function flattenOnce(arrays) {
  // your code here
}
check('flattenOnce', flattenOnce([[1, 2], [3], [4, 5]]), [1, 2, 3, 4, 5]);
check('flattenOnce empty', flattenOnce([]), []);

section('Exercise 9 — myJoin (rebuild .join with reduce)');
/* myJoin(['a','b','c'], '-') -> 'a-b-c'   (no trailing separator!)
 * myJoin([], '-') -> ''                                          */
function myJoin(arr, separator) {
  // your code here
}
check('myJoin', myJoin(['a', 'b', 'c'], '-'), 'a-b-c');
check('myJoin one', myJoin(['a'], '-'), 'a');
check('myJoin empty', myJoin([], '-'), '');

section('Exercise 10 — fromPairs');
/* Turn [key, value] pairs into an object.
 * fromPairs([['a',1],['b',2]]) -> { a: 1, b: 2 }                 */
function fromPairs(pairs) {
  // your code here
}
check('fromPairs', fromPairs([['a', 1], ['b', 2]]), { a: 1, b: 2 });

section('Exercise 11 — myMap and myFilter, built on reduce');
/* Same behaviour as the real methods, but implemented with reduce.
 * myMap([1,2], x => x * 10) -> [10, 20]
 * myFilter([1,2,3], x => x > 1) -> [2, 3]                        */
function myMap(arr, fn) {
  // your code here
}
function myFilter(arr, fn) {
  // your code here
}
check('myMap', myMap([1, 2], (x) => x * 10), [10, 20]);
check('myMap gets the index', myMap(['a', 'b'], (x, i) => `${i}${x}`), ['0a', '1b']);
check('myFilter', myFilter([1, 2, 3], (x) => x > 1), [2, 3]);

section('Exercise 12 — longestWord');
/* Longest word; on a tie the FIRST one wins. '' for an empty array.
 * longestWord(['hi','hello','hey']) -> 'hello'                   */
function longestWord(words) {
  // your code here
}
check('longestWord', longestWord(['hi', 'hello', 'hey']), 'hello');
check('longestWord tie', longestWord(['aaa', 'bbb']), 'aaa');
check('longestWord empty', longestWord([]), '');

section('Exercise 13 — minMax in ONE pass');
/* Return { min, max } using a single reduce.
 * minMax([3, 1, 9]) -> { min: 1, max: 9 }
 * minMax([]) -> { min: null, max: null }                         */
function minMax(nums) {
  // your code here
}
check('minMax', minMax([3, 1, 9]), { min: 1, max: 9 });
check('minMax empty', minMax([]), { min: null, max: null });

section('Exercise 14 — pipe (reduce over FUNCTIONS)');
/* Run the value through every function, left to right.
 * pipe(3, [x => x + 1, x => x * 2]) -> 8
 * This is how function composition works — the accumulator is the value. */
function pipe(value, fns) {
  // your code here
}
check('pipe', pipe(3, [(x) => x + 1, (x) => x * 2]), 8);
check('pipe empty', pipe(3, []), 3);

section('PREDICTIONS');

// P1: no start value on an empty array
let p1 = null;   // guess: a number, undefined, or the string 'throws'
let result1;
try { result1 = [].reduce((a, b) => a + b); } catch { result1 = 'throws'; }
check('P1  [].reduce((a,b) => a+b)', p1, result1);

// P2: no start value on a ONE-item array — is the callback even called?
let calls = 0;
const r2 = [7].reduce((a, b) => { calls++; return a + b; });
let p2 = null;
check('P2  [7].reduce(...) result', p2, r2);
let p2b = null;
check('P2b callback call count', p2b, calls);

// P3: forgetting the return
let p3 = null;
check('P3  [1,2,3].reduce((acc, x) => { acc + x }, 0)', p3, [1, 2, 3].reduce((acc, x) => { acc + x; }, 0));

// P4: reduceRight goes the other way
let p4 = null;
check('P4  ["a","b","c"].reduceRight((a,b) => a+b)', p4, ['a', 'b', 'c'].reduceRight((a, b) => a + b));

report();
