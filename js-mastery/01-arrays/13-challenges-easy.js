'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 13 — CHALLENGES, LEVEL 1
 *
 * No new syntax from here on. These are the classic interview warm-ups.
 * Any approach that passes is a correct approach — get it working first,
 * then try to shorten it.
 * ==========================================================================*/

section('1 — chunk');
/* Split into groups of size n. The last group may be shorter.
 * chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]                     */
function chunk(arr, size) {
  // your code here
}
check('chunk 2', chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
check('chunk 3', chunk([1, 2, 3], 3), [[1, 2, 3]]);
check('chunk empty', chunk([], 2), []);

section('2 — zip');
/* Pair up items by position. Stop at the shorter array.
 * zip([1,2,3], ['a','b']) -> [[1,'a'], [2,'b']]                  */
function zip(a, b) {
  // your code here
}
check('zip', zip([1, 2, 3], ['a', 'b']), [[1, 'a'], [2, 'b']]);
check('zip empty', zip([], ['a']), []);

section('3 — fizzBuzz');
/* 1..n as an array of strings. Multiples of 3 -> 'Fizz',
 * of 5 -> 'Buzz', of both -> 'FizzBuzz', otherwise the number as a string.
 * fizzBuzz(5) -> ['1','2','Fizz','4','Buzz']                     */
function fizzBuzz(n) {
  // your code here
}
check('fizzBuzz 5', fizzBuzz(5), ['1', '2', 'Fizz', '4', 'Buzz']);
check('fizzBuzz 15 last', () => fizzBuzz(15).at(-1), 'FizzBuzz');

section('4 — countVowels');
/* Vowels in each word (a e i o u, case-insensitive).
 * countVowels(['Apple','sky']) -> [2, 0]                         */
function countVowels(words) {
  // your code here
}
check('countVowels', countVowels(['Apple', 'sky', 'AEIOU']), [2, 0, 5]);

section('5 — titleCase');
/* Capitalise the first letter of every word, lowercase the rest.
 * titleCase('hello BIG world') -> 'Hello Big World'              */
function titleCase(sentence) {
  // your code here
}
check('titleCase', titleCase('hello BIG world'), 'Hello Big World');
check('titleCase one word', titleCase('js'), 'Js');

section('6 — sumEvenSquares');
/* Take the even numbers, square them, add them up.
 * sumEvenSquares([1,2,3,4]) -> 4 + 16 = 20                       */
function sumEvenSquares(nums) {
  // your code here
}
check('sumEvenSquares', sumEvenSquares([1, 2, 3, 4]), 20);
check('sumEvenSquares none', sumEvenSquares([1, 3]), 0);

section('7 — isPalindrome');
/* Ignore case, spaces and punctuation.
 * isPalindrome('A man, a plan, a canal: Panama') -> true
 * Hint: strip with str.replace(/[^a-z0-9]/gi, '')                */
function isPalindrome(str) {
  // your code here
}
check('palindrome', isPalindrome('A man, a plan, a canal: Panama'), true);
check('not palindrome', isPalindrome('hello'), false);
check('empty', isPalindrome(''), true);

section('8 — mostFrequent');
/* The value that appears most often. On a tie, the one that reached its
 * highest count first wins.
 * mostFrequent(['a','b','a']) -> 'a'  ;  mostFrequent([]) -> null */
function mostFrequent(arr) {
  // your code here
}
check('mostFrequent', mostFrequent(['a', 'b', 'a']), 'a');
check('mostFrequent tie', mostFrequent(['x', 'y']), 'x');
check('mostFrequent empty', mostFrequent([]), null);

section('9 — missingNumber');
/* An array holds all numbers from 1..n with exactly one missing.
 * missingNumber([1, 2, 4, 5]) -> 3
 * (n is the array length + 1. There is a formula: n*(n+1)/2.)    */
function missingNumber(nums) {
  // your code here
}
check('missing middle', missingNumber([1, 2, 4, 5]), 3);
check('missing last', missingNumber([1, 2, 3]), 4);
check('missing first', missingNumber([2, 3]), 1);

section('10 — movingSum');
/* Running totals: each item is the sum of everything up to it.
 * movingSum([1,2,3]) -> [1, 3, 6]                                */
function movingSum(nums) {
  // your code here
}
check('movingSum', movingSum([1, 2, 3]), [1, 3, 6]);
check('movingSum empty', movingSum([]), []);

section('11 — intersperse');
/* Put `sep` between every pair of items.
 * intersperse([1,2,3], 0) -> [1,0,2,0,3]                         */
function intersperse(arr, sep) {
  // your code here
}
check('intersperse', intersperse([1, 2, 3], 0), [1, 0, 2, 0, 3]);
check('intersperse one', intersperse([1], 0), [1]);
check('intersperse empty', intersperse([], 0), []);

section('12 — takeWhile / dropWhile');
/* takeWhile([1,2,5,1], n => n < 3) -> [1, 2]     (stop at the first fail)
 * dropWhile([1,2,5,1], n => n < 3) -> [5, 1]                     */
function takeWhile(arr, fn) {
  // your code here
}
function dropWhile(arr, fn) {
  // your code here
}
check('takeWhile', takeWhile([1, 2, 5, 1], (n) => n < 3), [1, 2]);
check('dropWhile', dropWhile([1, 2, 5, 1], (n) => n < 3), [5, 1]);
check('takeWhile none', takeWhile([9], (n) => n < 3), []);

log('when all 12 pass', 'move on to 14-challenges-medium.js');
report();
