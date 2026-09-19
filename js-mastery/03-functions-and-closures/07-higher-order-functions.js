'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * FUNCTIONS 07 — HIGHER-ORDER FUNCTIONS
 *
 * A higher-order function is one that TAKES a function, RETURNS a function,
 * or both. You have used them since topic 01 — map, filter, sort, reduce all
 * take a callback. This file is about writing your own.
 *
 * NOTES:
 *   Passing a function BY NAME, not calling it:
 *     items.forEach(log)      passes the function
 *     items.forEach(log())    calls it once and passes the RESULT — a bug
 *
 *   A callback receives whatever the caller decides to pass. Array methods
 *   pass (item, index, array) — which is why [1,2,3].map(parseInt) breaks.
 *
 *   Naming convention worth adopting:
 *     predicate   a function returning true/false
 *     transform   a function returning a new value
 *     reducer     (accumulator, item) => newAccumulator
 *     comparator  (a, b) => negative | 0 | positive
 * ==========================================================================*/

const PEOPLE = [
  { name: 'Asha', age: 34, dept: 'eng' },
  { name: 'Ben', age: 28, dept: 'sales' },
  { name: 'Cara', age: 41, dept: 'eng' },
];

section('Exercise 1 — take a function');
/* applyToAll(values, transform) — your own map, with a plain loop.
 * applyToAll([1,2], n => n * 3) -> [3, 6]                        */
function applyToAll(values, transform) {
  // your code here
}
check('applyToAll', applyToAll([1, 2], (n) => n * 3), [3, 6]);
check('gets the index too', applyToAll(['a', 'b'], (v, i) => `${i}:${v}`), ['0:a', '1:b']);

section('Exercise 2 — your own filter and find');
function keepIf(values, predicate) {
  // your code here
}
function firstWhere(values, predicate) {
  // your code here
}
check('keepIf', keepIf([1, 2, 3, 4], (n) => n % 2 === 0), [2, 4]);
check('firstWhere', () => firstWhere(PEOPLE, (p) => p.dept === 'eng').name, 'Asha');
check('firstWhere missing', firstWhere(PEOPLE, () => false), null);

section('Exercise 3 — your own reduce');
/* reduceWith([1,2,3], (acc, n) => acc + n, 0) -> 6
 * The start value is required — no clever defaulting.            */
function reduceWith(values, reducer, start) {
  // your code here
}
check('sum', reduceWith([1, 2, 3], (acc, n) => acc + n, 0), 6);
check('build a string', reduceWith(['a', 'b'], (acc, s) => acc + s, ''), 'ab');
check('empty returns the start', reduceWith([], (acc) => acc, 'start'), 'start');

section('Exercise 4 — return a function');
/* propertyGetter('name') -> a function that pulls .name off an object.
 * PEOPLE.map(propertyGetter('name')) -> ['Asha','Ben','Cara']    */
function propertyGetter(key) {
  // your code here
}
check('as a mapper', () => PEOPLE.map(propertyGetter('name')), ['Asha', 'Ben', 'Cara']);
check('direct call', () => propertyGetter('age')({ age: 9 }), 9);

section('Exercise 5 — build a predicate');
/* isOlderThan(30) -> a predicate.
 * PEOPLE.filter(isOlderThan(30)) -> Asha and Cara                */
function isOlderThan(age) {
  // your code here
}
check('as a filter', () => PEOPLE.filter(isOlderThan(30)).map((p) => p.name), ['Asha', 'Cara']);
check('reusable', () => [isOlderThan(30)({ age: 31 }), isOlderThan(30)({ age: 30 })], [true, false]);

section('Exercise 6 — build a comparator');
/* byKey('age') -> a comparator sorting ascending by that key.
 * Works for numbers and strings.                                 */
function byKey(key) {
  // your code here
}
check('by age', () => [...PEOPLE].sort(byKey('age')).map((p) => p.name), ['Ben', 'Asha', 'Cara'], byKey);
check('by name', () => [...PEOPLE].sort(byKey('name')).map((p) => p.name), ['Asha', 'Ben', 'Cara'], byKey);

section('Exercise 7 — combining predicates');
/* not(fn)       -> a predicate returning the opposite
 * both(a, b)    -> true only when both pass
 * either(a, b)  -> true when at least one passes                 */
function not(predicate) {
  // your code here
}
function both(a, b) {
  // your code here
}
function either(a, b) {
  // your code here
}
const isEven = (n) => n % 2 === 0;
const isBig = (n) => n > 10;
check('not', () => [1, 2, 3, 4].filter(not(isEven)), [1, 3]);
check('both', () => [2, 12, 13].filter(both(isEven, isBig)), [12]);
check('either', () => [2, 11, 5].filter(either(isEven, isBig)), [2, 11]);

section('Exercise 8 — a function that wraps a function');
/* withLogging(fn, log) returns a function that pushes a line into `log`
 * before returning fn's result.
 * The line is `called with 2,3` for arguments 2 and 3.           */
function withLogging(fn, log) {
  // your code here
}
check('wrapping', () => {
  const lines = [];
  const add = withLogging((a, b) => a + b, lines);
  const result = add(2, 3);
  return [result, lines];
}, [5, ['called with 2,3']]);

section('Exercise 9 — a counting wrapper');
/* countCalls(fn) returns [wrapped, getCount].                    */
function countCalls(fn) {
  // your code here
}
check('counts', () => {
  const [wrapped, getCount] = countCalls((n) => n * 2);
  wrapped(1); wrapped(2);
  return [wrapped(3), getCount()];
}, [6, 3]);

section('Exercise 10 — a pipeline of transforms');
/* applyAll(value, fns) runs each function in turn, left to right.
 * applyAll('  Hi  ', [s => s.trim(), s => s.toLowerCase()]) -> 'hi'  */
function applyAll(value, fns) {
  // your code here
}
check('pipeline', applyAll('  Hi  ', [(s) => s.trim(), (s) => s.toLowerCase()]), 'hi');
check('no transforms', applyAll(5, []), 5);

section('Exercise 11 — a dispatch table');
/* Replace a switch with an object of functions.
 * calculate('add', 2, 3) -> 5 ; calculate('mul', 2, 3) -> 6
 * An unknown operation returns null.                             */
function calculate(op, a, b) {
  // your code here
}
check('add', calculate('add', 2, 3), 5);
check('sub', calculate('sub', 5, 3), 2);
check('mul', calculate('mul', 2, 3), 6);
check('unknown', calculate('nope', 1, 1), null);

section('Exercise 12 — a callback with an early exit');
/* everyUntilFalse(values, predicate) returns how many items were CHECKED
 * before one failed (counting the failing one). All passing -> the length.
 * everyUntilFalse([2,4,5,6], isEven) -> 3                        */
function everyUntilFalse(values, predicate) {
  // your code here
}
check('stops at the failure', everyUntilFalse([2, 4, 5, 6], isEven), 3);
check('all pass', everyUntilFalse([2, 4], isEven), 2);
check('first fails', everyUntilFalse([1, 2], isEven), 1);

section('PREDICTIONS');

// P1: passing a function vs calling it
const calls = [];
function record() { calls.push('ran'); return 'result'; }
[1, 2].forEach(record);
let p1 = null;
check('P1  calls.length after forEach(record)', p1, calls.length);

// P2: what arguments do array methods pass?
const seen = [];
['a'].forEach((...args) => seen.push(args.length));
let p2 = null;
check('P2  how many arguments forEach passes', p2, seen[0]);

// P3: the parseInt classic, one more time
let p3 = null;
check('P3  ["10","10","10"].map(parseInt)', p3, ['10', '10', '10'].map(parseInt));

// P4: a function stored in an object, pulled out and called
const holder = { fn: (n) => n * 2 };
const pulled = holder.fn;
let p4 = null;
check('P4  pulled(4)', p4, pulled(4));

// P5: comparing two references to the same function
const f5 = () => 1;
const g5 = f5;
let p5 = null;
check('P5  f5 === g5', p5, f5 === g5);

// P6: and two identical-looking functions
let p6 = null;
check('P6  (() => 1) === (() => 1)', p6, (() => 1) === (() => 1));

log('habit', 'when a function needs configuring, return a function instead of adding a flag');

report();
