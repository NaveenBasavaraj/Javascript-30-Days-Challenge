'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 01 — CREATING & READING
 * Run with:  node 04-strings-and-regex/01-creating-and-reading.js
 *
 * NOTES:
 *   'single'  "double"  `backtick`   — all the same type. Pick one style
 *   and stay with it; use backticks whenever you need to embed a value.
 *
 *   STRINGS ARE IMMUTABLE. Every method returns a NEW string; none of them
 *   ever change the original. str[0] = 'X' silently does nothing.
 *
 *   READING
 *     str.length          number of UTF-16 units (not always "characters")
 *     str[i]              undefined when out of range
 *     str.at(-1)          counts from the end
 *     str.charAt(i)       '' when out of range — differs from str[i]
 *
 *   TEMPLATE LITERALS
 *     `Hi ${name}, ${1 + 2}`   any expression goes inside ${}
 *     They keep real newlines, so multi-line text needs no \n.
 *
 *   ESCAPES:  \n newline   \t tab   \\ backslash   \' \"  quotes
 *             é -> é   \u{1F600} -> an emoji
 * ==========================================================================*/

section('Exercise 1 — building a greeting');
/* Use a template literal.
 * greet('Asha', 3) -> 'Hi Asha, you have 3 messages'             */
function greet(name, count) {
  // your code here
}
check('greet', greet('Asha', 3), 'Hi Asha, you have 3 messages');

section('Exercise 2 — expressions inside a template');
/* priceLine('Pen', 2, 1.5) -> 'Pen x2 = $3.00'
 * Do the multiplication INSIDE the ${}, and use toFixed(2).      */
function priceLine(item, qty, price) {
  // your code here
}
check('priceLine', priceLine('Pen', 2, 1.5), 'Pen x2 = $3.00');

section('Exercise 3 — multi-line text');
/* Return exactly:
 *   Dear Asha,
 *   Welcome.
 * (two lines, no trailing newline). Use a template literal with a real
 * line break in it, not \n.                                      */
function letter(name) {
  // your code here
}
check('letter', letter('Asha'), 'Dear Asha,\nWelcome.');
check('two lines', () => letter('x').split('\n').length, 2);

section('Exercise 4 — reading characters');
/* first('hello') -> 'h'
 * last('hello') -> 'o'          use .at()
 * nth('hello', 1) -> 'e'                                         */
function first(str) {
  // your code here
}
function last(str) {
  // your code here
}
function nth(str, i) {
  // your code here
}
check('first', first('hello'), 'h');
check('last', last('hello'), 'o');
check('nth', nth('hello', 1), 'e');

section('Exercise 5 — immutability');
/* Strings cannot be changed in place. In THIS file ('use strict' is on at
 * the top) even trying throws a TypeError. Prove it:
 *   tryToMutate('hello') attempts str[0] = 'X' inside a try/catch and
 *   returns the error's constructor name, or the string if it somehow
 *   succeeded.
 * Then write the version that works, by building a NEW string.
 *   replaceFirst('hello', 'J') -> 'Jello'                        */
function tryToMutate(str) {
  // your code here
}
function replaceFirst(str, ch) {
  // your code here
}
check('assignment throws in strict mode', tryToMutate('hello'), 'TypeError');
check('rebuilding works', replaceFirst('hello', 'J'), 'Jello');
check('the source string is untouched', () => {
  const s = 'hello';
  replaceFirst(s, 'J');
  return s;
}, 'hello', replaceFirst);

section('Exercise 6 — length');
/* charCount('hello') -> 5
 * isLongerThan('hello', 3) -> true
 * longest(['a','abc','ab']) -> 'abc'                             */
function charCount(str) {
  // your code here
}
function isLongerThan(str, n) {
  // your code here
}
function longest(words) {
  // your code here
}
check('charCount', charCount('hello'), 5);
check('isLongerThan', isLongerThan('hello', 3), true);
check('longest', longest(['a', 'abc', 'ab']), 'abc');

section('Exercise 7 — escapes');
/* Return the literal string:  He said "it's \ok"
 * (with the double quotes, the apostrophe and ONE backslash before ok) */
function tricky() {
  // your code here
}
check('escapes', tricky(), 'He said "it\'s \\ok"');
check('length is right', () => tricky().length, 18);

section('Exercise 8 — a tab-separated row');
/* row(['a','b','c']) -> 'a\tb\tc'                                */
function row(cells) {
  // your code here
}
check('row', row(['a', 'b', 'c']), 'a\tb\tc');

section('Exercise 9 — String() vs toString()');
/* safeText(value) converts ANY value to a string, including null and
 * undefined, without throwing.
 * safeText(null) -> 'null' ; safeText(undefined) -> 'undefined'
 * safeText(12) -> '12'                                           */
function safeText(value) {
  // your code here
}
check('null', safeText(null), 'null');
check('undefined', safeText(undefined), 'undefined');
check('number', safeText(12), '12');

section('Exercise 10 — comparing');
/* isSame('abc', 'abc') -> true
 * isSameIgnoringCase('ABC', 'abc') -> true
 * comesFirst('apple', 'banana') -> 'apple'    (alphabetically)   */
function isSame(a, b) {
  // your code here
}
function isSameIgnoringCase(a, b) {
  // your code here
}
function comesFirst(a, b) {
  // your code here
}
check('isSame', isSame('abc', 'abc'), true);
check('isSameIgnoringCase', isSameIgnoringCase('ABC', 'abc'), true);
check('comesFirst', comesFirst('banana', 'apple'), 'apple');

section('PREDICTIONS — guess before you run');

// P1: reading past the end with brackets
let p1 = null;
check('P1  String("abc"[9])', p1, String('abc'[9]));

// P2: ...and with charAt
let p2 = null;
check('P2  "abc".charAt(9)', p2, 'abc'.charAt(9));

// P3: does assignment to an index throw in strict mode?
let outcome3;
try { const s = 'abc'; s[0] = 'X'; outcome3 = s; } catch (e) { outcome3 = e.constructor.name; }
let p3 = null;
check('P3  s[0] = "X" on a string', p3, outcome3);

// P4: adding a number to a string
let p4 = null;
check('P4  "5" + 3', p4, '5' + 3);

// P5: subtracting one
let p5 = null;
check('P5  "5" - 3', p5, '5' - 3);

// P6: comparing strings with <
let p6 = null;
check('P6  "apple" < "banana"', p6, 'apple' < 'banana');

// P7: and uppercase vs lowercase
let p7 = null;
check('P7  "Z" < "a"', p7, 'Z' < 'a');
log('why', 'comparison uses character codes: A-Z are 65-90, a-z are 97-122');

report();
