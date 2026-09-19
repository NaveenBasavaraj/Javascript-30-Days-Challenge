'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 12 — THE MODERN TOOLBOX (ES2019 -> today)
 *
 * NOTES — the newer methods worth knowing:
 *   at(-1)                    read from the end
 *   flat() / flatMap()        ES2019
 *   findLast() / findLastIndex()   ES2023
 *   toSorted() / toReversed() / toSpliced() / with()   ES2023, non-mutating
 *   Array.from(iterable, mapFn)    build + transform in one step
 *   structuredClone(value)         deep copy, built into the runtime
 *
 * Non-mutating twins cheat sheet:
 *   sort   -> toSorted        reverse -> toReversed
 *   splice -> toSpliced       arr[i] = v -> with(i, v)
 * ==========================================================================*/

section('Exercise 1 — at()');
/* last(arr), secondLast(arr) — both using .at()                  */
function last(arr) {
  // your code here
}
function secondLast(arr) {
  // your code here
}
check('last', last([1, 2, 3]), 3);
check('secondLast', secondLast([1, 2, 3]), 2);
check('last of empty', () => String(last([])), 'undefined', last);

section('Exercise 2 — the non-mutating twins');
/* Each returns a new array; `arr` must stay exactly as it was.
 * sortedDesc([1,3,2]) -> [3,2,1]      (toSorted)
 * reversed([1,2,3])   -> [3,2,1]      (toReversed)
 * replaced([1,2,3], 0, 9) -> [9,2,3]  (with)
 * spliced([1,2,3], 1, 1)  -> [1,3]    (toSpliced)                */
function sortedDesc(arr) {
  // your code here
}
function reversed(arr) {
  // your code here
}
function replaced(arr, i, v) {
  // your code here
}
function spliced(arr, start, count) {
  // your code here
}
const t2 = [1, 3, 2];
check('sortedDesc', sortedDesc(t2), [3, 2, 1]);
check('reversed', reversed([1, 2, 3]), [3, 2, 1]);
check('replaced', replaced([1, 2, 3], 0, 9), [9, 2, 3]);
check('spliced', spliced([1, 2, 3], 1, 1), [1, 3]);
check('t2 untouched', t2, [1, 3, 2]);

section('Exercise 3 — findLast / findLastIndex');
/* mostRecentError(logs) -> the LAST entry whose level is 'error',
 *                          or null if there is none.
 * mostRecentErrorIndex(logs) -> its index, or -1                 */
const LOGS = [
  { level: 'info', msg: 'start' },
  { level: 'error', msg: 'disk full' },
  { level: 'info', msg: 'retry' },
  { level: 'error', msg: 'gave up' },
];
function mostRecentError(logs) {
  // your code here
}
function mostRecentErrorIndex(logs) {
  // your code here
}
check('mostRecentError', mostRecentError(LOGS), { level: 'error', msg: 'gave up' });
check('none', mostRecentError([{ level: 'info' }]), null);
check('mostRecentErrorIndex', mostRecentErrorIndex(LOGS), 3);

section('Exercise 4 — Array.from with a mapper');
/* squares(4) -> [0, 1, 4, 9]      (n items, index squared)
 * alphabet() -> ['a','b',...,'z'] (26 items; String.fromCharCode(97 + i)) */
function squares(n) {
  // your code here
}
function alphabet() {
  // your code here
}
check('squares', squares(4), [0, 1, 4, 9]);
check('alphabet length', () => alphabet().length, 26);
check('alphabet ends', () => [alphabet()[0], alphabet().at(-1)], ['a', 'z']);

section('Exercise 5 — groupBy (write it yourself)');
/* Group items by the string a key function returns.
 * groupBy([6.1, 4.2, 6.3], Math.floor)
 *   -> { 4: [4.2], 6: [6.1, 6.3] }
 * groupBy(['one','two','three'], w => w.length)
 *   -> { 3: ['one','two'], 5: ['three'] }
 * (Newer runtimes ship Object.groupBy — your Node may not have it, and
 *  writing it once teaches you more anyway.)                     */
function groupBy(items, keyFn) {
  // your code here
}
check('groupBy floor', groupBy([6.1, 4.2, 6.3], Math.floor), { 4: [4.2], 6: [6.1, 6.3] });
check('groupBy length', groupBy(['one', 'two', 'three'], (w) => w.length),
  { 3: ['one', 'two'], 5: ['three'] });

section('Exercise 6 — partition');
/* Split into [passing, failing] in one pass.
 * partition([1,2,3,4], n => n % 2 === 0) -> [[2,4], [1,3]]       */
function partition(arr, predicate) {
  // your code here
}
check('partition', partition([1, 2, 3, 4], (n) => n % 2 === 0), [[2, 4], [1, 3]]);
check('partition all pass', partition([2], () => true), [[2], []]);

section('Exercise 7 — copyWithin & fill with ranges');
/* fillRange([0,0,0,0], 9, 1, 3) -> [0,9,9,0]
 * fill(value, start, end) — end is exclusive, and fill MUTATES.  */
function fillRange(arr, value, start, end) {
  // your code here
}
check('fillRange', fillRange([0, 0, 0, 0], 9, 1, 3), [0, 9, 9, 0]);

section('Exercise 8 — chained pipeline');
/* Given the sales array: keep 2024 rows, take the amount, sort them
 * descending, and return the top 2.
 * -> [900, 500]                                                  */
const SALES = [
  { year: 2023, amount: 700 },
  { year: 2024, amount: 500 },
  { year: 2024, amount: 900 },
  { year: 2024, amount: 100 },
];
function top2Amounts2024(sales) {
  // your code here
}
check('pipeline', top2Amounts2024(SALES), [900, 500]);
check('SALES untouched', SALES[1].amount, 500);

section('PREDICTIONS');

// P1: at() with a negative index vs bracket notation
let p1 = null;
check('P1  [1,2,3][-1]', p1, [1, 2, 3][-1]);

// P2: toSpliced can insert too
let p2 = null;
check('P2  [1,2,3].toSpliced(1, 0, "x")', p2, [1, 2, 3].toSpliced(1, 0, 'x'));

// P3: Array.from's mapper gets the index
let p3 = null;
check('P3  Array.from({length: 3}, (_, i) => i * 2)', p3, Array.from({ length: 3 }, (_, i) => i * 2));

// P4: does with() accept a negative index?
let p4 = null;
check('P4  [1,2,3].with(-1, 9)', p4, [1, 2, 3].with(-1, 9));

report();
