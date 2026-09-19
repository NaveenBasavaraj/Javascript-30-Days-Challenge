'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 07 — SORTING
 *
 * NOTES:
 *   arr.sort()  MUTATES the array and, with no comparator, sorts by the
 *   STRING form of each item. That is why [10, 9, 1].sort() -> [1, 10, 9].
 *
 *   Always pass a comparator for numbers:
 *     (a, b) => a - b      ascending
 *     (a, b) => b - a      descending
 *   The rule: return a NEGATIVE number to put `a` first, POSITIVE to put `b`
 *   first, 0 to keep their relative order (JS sort is stable).
 *
 *   Strings: (a, b) => a.localeCompare(b)
 *   Non-mutating twins (Node 20+): toSorted(), toReversed(), with(), toSpliced()
 * ==========================================================================*/

const PEOPLE = [
  { name: 'Cara', age: 28, dept: 'eng' },
  { name: 'Asha', age: 34, dept: 'sales' },
  { name: 'Ben', age: 28, dept: 'eng' },
  { name: 'Dev', age: 19, dept: 'sales' },
];

section('Exercise 1 — sortNumbers (do not mutate the input)');
/* ascending([10, 9, 1]) -> [1, 9, 10]
 * descending([10, 9, 1]) -> [10, 9, 1]
 * The input array must be unchanged — copy first, or use toSorted(). */
function ascending(nums) {
  // your code here
}
function descending(nums) {
  // your code here
}
const t1 = [10, 9, 1];
check('ascending', ascending(t1), [1, 9, 10]);
check('descending', descending(t1), [10, 9, 1]);
check('input untouched', t1, [10, 9, 1]);

section('Exercise 2 — sortWords');
/* Alphabetical, case-insensitive. Return a new array.
 * sortWords(['banana','Apple','cherry']) -> ['Apple','banana','cherry'] */
function sortWords(words) {
  // your code here
}
check('sortWords', sortWords(['banana', 'Apple', 'cherry']), ['Apple', 'banana', 'cherry']);
// only the letter order is checked here, not how ties between 'a' and 'A' land:
check('sortWords case', () => sortWords(['b', 'A', 'a', 'B']).map((w) => w.toLowerCase()).join(''), 'aabb');

section('Exercise 3 — sortByAge');
/* Youngest first. Return a new array of the SAME objects.
 * sortByAge(PEOPLE) -> Dev, Cara, Ben, Asha
 * Because sort is stable, Cara stays ahead of Ben (both 28).     */
function sortByAge(people) {
  // your code here
}
check('sortByAge',
  () => sortByAge(PEOPLE).map((p) => p.name),
  ['Dev', 'Cara', 'Ben', 'Asha']);

section('Exercise 4 — sortByKey (generic)');
/* Sort by any numeric OR string property name.
 * sortByKey(PEOPLE, 'name') -> Asha, Ben, Cara, Dev
 * Hint: compare with < and > so it works for both types, or branch
 *       on typeof.                                               */
function sortByKey(items, key) {
  // your code here
}
check('sortByKey name', () => sortByKey(PEOPLE, 'name').map((p) => p.name), ['Asha', 'Ben', 'Cara', 'Dev']);
check('sortByKey age', () => sortByKey(PEOPLE, 'age').map((p) => p.age), [19, 28, 28, 34]);

section('Exercise 5 — sortByAgeThenName');
/* Age ascending; when ages tie, name alphabetically.
 * -> Dev(19), Ben(28), Cara(28), Asha(34)
 * Hint: compute the age difference; if it is 0, fall back to names. */
function sortByAgeThenName(people) {
  // your code here
}
check('two keys',
  () => sortByAgeThenName(PEOPLE).map((p) => p.name),
  ['Dev', 'Ben', 'Cara', 'Asha']);

section('Exercise 6 — sortByLengthThenAlpha');
/* Shortest word first; equal lengths sort alphabetically.
 * ['pear','fig','apple','kiwi'] -> ['fig','kiwi','pear','apple']  */
function sortByLengthThenAlpha(words) {
  // your code here
}
check('length then alpha',
  sortByLengthThenAlpha(['pear', 'fig', 'apple', 'kiwi']),
  ['fig', 'kiwi', 'pear', 'apple']);

section('Exercise 7 — topN');
/* The n largest numbers, largest first.
 * topN([5, 1, 9, 3], 2) -> [9, 5]                                */
function topN(nums, n) {
  // your code here
}
check('topN', topN([5, 1, 9, 3], 2), [9, 5]);
check('topN more than length', topN([5, 1], 10), [5, 1]);

section('Exercise 8 — reverseCopy');
/* Return a reversed COPY. The input must not change.
 * reverseCopy([1,2,3]) -> [3,2,1]                                */
function reverseCopy(arr) {
  // your code here
}
const t8 = [1, 2, 3];
check('reverseCopy', reverseCopy(t8), [3, 2, 1]);
check('input untouched', t8, [1, 2, 3]);

section('Exercise 9 — shuffleIsRandom (sanity check only)');
/* Return a NEW array with the same items in some order.
 * Use the Fisher-Yates shuffle: walk from the end, swap with a random
 * earlier index.  (Never use .sort(() => Math.random() - 0.5) — it is
 * biased and not a real shuffle.)                                */
function shuffle(arr) {
  // your code here
}
const src9 = [1, 2, 3, 4, 5];
check('same items', () => [...shuffle(src9)].sort((a, b) => a - b), [1, 2, 3, 4, 5]);
check('returns a new array', () => shuffle(src9) !== src9, true, shuffle);
check('input untouched', src9, [1, 2, 3, 4, 5]);

section('PREDICTIONS');

// P1: the default sort
let p1 = null;
check('P1  [10, 9, 1].sort()', p1, [10, 9, 1].sort());

// P2: sort's return value — a copy or the same array?
const a2 = [3, 1];
let p2 = null;
check('P2  a.sort() === a', p2, a2.sort() === a2);

// P3: does toSorted mutate?
const a3 = [3, 1];
a3.toSorted();
let p3 = null;
check('P3  a3 after a3.toSorted()', p3, a3);

// P4: how undefined sorts
let p4 = null;
check('P4  [3, undefined, 1].sort()', p4, [3, undefined, 1].sort());

// P5: .with(index, value) — non-mutating replace
let p5 = null;
check('P5  [1,2,3].with(1, 99)', p5, [1, 2, 3].with(1, 99));

log('tip', 'sort/reverse/splice mutate; toSorted/toReversed/toSpliced/with copy');

report();
