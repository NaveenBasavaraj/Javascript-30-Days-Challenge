'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 03 — LOOPING
 *
 * NOTES:
 *   for (let i = 0; i < arr.length; i++)   full control: break, continue, step
 *   for (const item of arr)                cleanest when you only need values
 *   arr.forEach((item, index) => { ... })  callback; returns undefined;
 *                                          you CANNOT break out of it
 *   for (const [i, v] of arr.entries())    index + value with for...of
 *
 *   for...IN is for object keys — on arrays it gives you STRING indexes.
 *   Avoid it for arrays.
 * ==========================================================================*/

section('Exercise 1 — sumWithForLoop');
/* Add up all numbers using a classic for loop. sum([1,2,3]) -> 6
 * Empty array -> 0                                               */
function sumWithForLoop(nums) {
  // your code here
}
check('sum [1,2,3]', sumWithForLoop([1, 2, 3]), 6);
check('sum []', sumWithForLoop([]), 0);
check('sum negatives', sumWithForLoop([-5, 5, 10]), 10);

section('Exercise 2 — joinWithForOf');
/* Glue words together with a space between them, using for...of.
 * Do NOT use .join() here — build it manually.
 * joinWithForOf(['I','love','JS']) -> 'I love JS'
 * joinWithForOf([]) -> ''                                        */
function joinWithForOf(words) {
  // your code here
}
check('join words', joinWithForOf(['I', 'love', 'JS']), 'I love JS');
check('join one', joinWithForOf(['hi']), 'hi');
check('join empty', joinWithForOf([]), '');

section('Exercise 3 — shoutAll (forEach)');
/* Use forEach to build a NEW array of UPPERCASE words.
 * (Yes, .map() is better here — you will meet it in file 05.
 *  For now practise the forEach + push pattern.)
 * shoutAll(['a','b']) -> ['A','B']                               */
function shoutAll(words) {
  // your code here
}
check('shoutAll', shoutAll(['hey', 'you']), ['HEY', 'YOU']);
check('shoutAll empty', shoutAll([]), []);

section('Exercise 4 — numberedList');
/* Return lines like "1. apple". Numbering starts at 1, not 0.
 * numberedList(['apple','pear']) -> ['1. apple', '2. pear']      */
function numberedList(items) {
  // your code here
}
check('numberedList', numberedList(['apple', 'pear']), ['1. apple', '2. pear']);

section('Exercise 5 — countdown');
/* Count down from n to 1. countdown(4) -> [4,3,2,1]
 * countdown(0) -> []                                             */
function countdown(n) {
  // your code here
}
check('countdown 4', countdown(4), [4, 3, 2, 1]);
check('countdown 0', countdown(0), []);

section('Exercise 6 — firstNegative (needs an early exit)');
/* Return the FIRST negative number, or null if there is none.
 * Stop looping as soon as you find it (use `break` or `return`).
 * This is the exercise that shows why forEach is not always enough.
 * firstNegative([3, 5, -2, -9]) -> -2                            */
function firstNegative(nums) {
  // your code here
}
check('found', firstNegative([3, 5, -2, -9]), -2);
check('none', firstNegative([1, 2]), null);

section('Exercise 7 — everyOther');
/* Keep items at index 0, 2, 4, ... using a loop with a step of 2.
 * everyOther(['a','b','c','d','e']) -> ['a','c','e']             */
function everyOther(arr) {
  // your code here
}
check('everyOther', everyOther(['a', 'b', 'c', 'd', 'e']), ['a', 'c', 'e']);

section('Exercise 8 — reverseManually');
/* Reverse WITHOUT using .reverse(). Return a NEW array;
 * the input must stay untouched.
 * reverseManually([1,2,3]) -> [3,2,1]                            */
function reverseManually(arr) {
  // your code here
}
const t8 = [1, 2, 3];
check('reversed', reverseManually(t8), [3, 2, 1]);
check('input untouched', t8, [1, 2, 3]);

section('Exercise 9 — indexOfLongest');
/* Return the INDEX of the longest word. On a tie, the first one wins.
 * indexOfLongest(['hi','hello','hey']) -> 1
 * Empty array -> -1                                              */
function indexOfLongest(words) {
  // your code here
}
check('longest', indexOfLongest(['hi', 'hello', 'hey']), 1);
check('tie keeps first', indexOfLongest(['aaa', 'bbb']), 0);
check('empty', indexOfLongest([]), -1);

section('Exercise 10 — pairsFromEntries');
/* Use `for (const [i, v] of arr.entries())` to build "i:v" strings.
 * pairsFromEntries(['a','b']) -> ['0:a', '1:b']                  */
function pairsFromEntries(arr) {
  // your code here
}
check('entries', pairsFromEntries(['a', 'b']), ['0:a', '1:b']);

section('PREDICTIONS');

// P1: what does forEach RETURN?
let p1 = null;
check('P1  [1,2].forEach(x => x)', p1, [1, 2].forEach((x) => x));

// P2: for...in over an array gives you what kind of value?
let p2 = null;                     // 'number' or 'string'?
let firstKey;
for (const k in ['a', 'b']) { firstKey = k; break; }
check('P2  typeof key in for...in', p2, typeof firstKey);

// P3: can a loop see items pushed while it runs?
const grow = [1, 2, 3];
let count = 0;
grow.forEach(() => { count++; if (count < 5) grow.push(99); });
let p3 = null;
check('P3  forEach ran this many times', p3, count);
log('grow is now', grow);   // forEach locks in the length it started with

report();
