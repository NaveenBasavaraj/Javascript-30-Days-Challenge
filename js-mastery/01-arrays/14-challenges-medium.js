'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 14 — CHALLENGES, LEVEL 2
 *
 * These take a few lines each and combine two or three ideas. Read the
 * examples carefully — the edge cases are where the real learning is.
 * ==========================================================================*/

section('1 — sortBy (multi-key, generic)');
/* Sort by several keys. Each key may be 'name' or '-name' for descending.
 * sortBy(people, ['dept', '-age']) -> group by dept A-Z, oldest first inside.
 * Must not mutate the input.                                     */
const PEOPLE = [
  { name: 'Asha', dept: 'eng', age: 34 },
  { name: 'Ben', dept: 'ops', age: 28 },
  { name: 'Cara', dept: 'eng', age: 41 },
  { name: 'Dev', dept: 'eng', age: 28 },
];
function sortBy(items, keys) {
  // your code here
}
check('sortBy', () => sortBy(PEOPLE, ['dept', '-age']).map((p) => p.name),
  ['Cara', 'Asha', 'Dev', 'Ben']);
check('sortBy single', () => sortBy(PEOPLE, ['name']).map((p) => p.name),
  ['Asha', 'Ben', 'Cara', 'Dev']);
check('input untouched', PEOPLE[0].name, 'Asha');

section('2 — paginate');
/* paginate(items, page, perPage) — page is 1-based.
 * paginate([1,2,3,4,5], 2, 2) -> [3, 4]
 * A page past the end -> []                                      */
function paginate(items, page, perPage) {
  // your code here
}
check('page 2', paginate([1, 2, 3, 4, 5], 2, 2), [3, 4]);
check('page 3', paginate([1, 2, 3, 4, 5], 3, 2), [5]);
check('page 9', paginate([1, 2], 9, 2), []);

section('3 — movingAverage');
/* Average of each window of `size` consecutive items.
 * movingAverage([1,2,3,4], 2) -> [1.5, 2.5, 3.5]
 * Window bigger than the array -> []                             */
function movingAverage(nums, size) {
  // your code here
}
check('movingAverage', movingAverage([1, 2, 3, 4], 2), [1.5, 2.5, 3.5]);
check('window 3', movingAverage([1, 2, 3, 4], 3), [2, 3]);
check('too big', movingAverage([1], 3), []);

section('4 — runLengthEncode / decode');
/* rle(['a','a','b','a']) -> [['a',2], ['b',1], ['a',1]]
 * unRle([['a',2],['b',1]]) -> ['a','a','b']                      */
function rle(arr) {
  // your code here
}
function unRle(pairs) {
  // your code here
}
check('rle', rle(['a', 'a', 'b', 'a']), [['a', 2], ['b', 1], ['a', 1]]);
check('rle empty', rle([]), []);
check('unRle', unRle([['a', 2], ['b', 1]]), ['a', 'a', 'b']);

section('5 — mergeSorted');
/* Merge two ALREADY sorted arrays into one sorted array, in one pass
 * (walk both with two index pointers — do not concat + sort).
 * mergeSorted([1,4], [2,3,5]) -> [1,2,3,4,5]                     */
function mergeSorted(a, b) {
  // your code here
}
check('mergeSorted', mergeSorted([1, 4], [2, 3, 5]), [1, 2, 3, 4, 5]);
check('one empty', mergeSorted([], [1, 2]), [1, 2]);
check('duplicates', mergeSorted([1, 1], [1]), [1, 1, 1]);

section('6 — twoSum');
/* Indexes of the two numbers that add up to target, or null.
 * twoSum([2, 7, 11, 15], 9) -> [0, 1]
 * Try the nested-loop version first, then redo it with a Map in one pass. */
function twoSum(nums, target) {
  // your code here
}
check('twoSum', twoSum([2, 7, 11, 15], 9), [0, 1]);
check('twoSum later', twoSum([3, 2, 4], 6), [1, 2]);
check('twoSum none', twoSum([1, 2], 99), null);

section('7 — maxSubarraySum');
/* Largest sum of any run of consecutive items (at least one item).
 * maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]) -> 6   (from 4,-1,2,1)
 * All negatives -> the least negative number.                    */
function maxSubarraySum(nums) {
  // your code here
}
check('classic', maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
check('all negative', maxSubarraySum([-3, -1, -7]), -1);
check('single', maxSubarraySum([5]), 5);

section('8 — flattenDeep with a depth limit');
/* flattenDepth([1,[2,[3,[4]]]], 2) -> [1, 2, 3, [4]]
 * Write it recursively — do NOT call the built-in .flat().       */
function flattenDepth(arr, depth) {
  // your code here
}
check('depth 1', flattenDepth([1, [2, [3, [4]]]], 1), [1, 2, [3, [4]]]);
check('depth 2', flattenDepth([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);
check('depth 0', flattenDepth([1, [2]], 0), [1, [2]]);

section('9 — groupAndCount');
/* Group by a key function and return counts, not items.
 * groupAndCount(['apple','avocado','beet'], w => w[0])
 *   -> { a: 2, b: 1 }                                            */
function groupAndCount(items, keyFn) {
  // your code here
}
check('groupAndCount', groupAndCount(['apple', 'avocado', 'beet'], (w) => w[0]), { a: 2, b: 1 });

section('10 — joinOn (a table join)');
/* Attach each order to its user by userId.
 * Result: [{ id: 1, user: 'Asha', total: 30 }, ...] in ORDERS order.
 * Orders whose user does not exist are dropped.                  */
const USERS = [{ id: 'u1', name: 'Asha' }, { id: 'u2', name: 'Ben' }];
const ORDERS = [
  { id: 1, userId: 'u1', total: 30 },
  { id: 2, userId: 'u9', total: 10 },
  { id: 3, userId: 'u2', total: 50 },
];
function joinOrders(orders, users) {
  // your code here
}
check('joinOrders', joinOrders(ORDERS, USERS), [
  { id: 1, user: 'Asha', total: 30 },
  { id: 3, user: 'Ben', total: 50 },
]);

section('11 — rotate (both directions)');
/* Positive n rotates left, negative rotates right, and n may be
 * larger than the array.
 * rotate([1,2,3,4], 1)  -> [2,3,4,1]
 * rotate([1,2,3,4], -1) -> [4,1,2,3]
 * rotate([1,2,3,4], 6)  -> [3,4,1,2]
 * Hint: ((n % len) + len) % len makes any n a valid left-shift.  */
function rotate(arr, n) {
  // your code here
}
check('left 1', rotate([1, 2, 3, 4], 1), [2, 3, 4, 1]);
check('right 1', rotate([1, 2, 3, 4], -1), [4, 1, 2, 3]);
check('wrap around', rotate([1, 2, 3, 4], 6), [3, 4, 1, 2]);
check('empty', rotate([], 3), []);

section('12 — permutations');
/* All orderings of the items. Order of the results does not matter to
 * the checker (it sorts them), but each permutation is an array.
 * permutations([1,2,3]) -> 6 arrays                              */
function permutations(arr) {
  // your code here
}
check('count', () => permutations([1, 2, 3]).length, 6);
check('contents', () => permutations([1, 2, 3]).map((p) => p.join('')).sort(),
  ['123', '132', '213', '231', '312', '321']);
check('single', permutations([1]), [[1]]);

log('when these pass', 'you are past the hard part — finish with 15-challenges-hard.js');
report();
