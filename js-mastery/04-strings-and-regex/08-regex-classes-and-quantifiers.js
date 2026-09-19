'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 08 — REGEX PART 2: CHARACTER CLASSES & QUANTIFIERS
 *
 * CHARACTER CLASSES — one character from a set
 *   [abc]      a, b or c
 *   [a-z]      a range
 *   [a-zA-Z0-9] several ranges
 *   [^abc]     NOT a, b or c
 *   \d  a digit        \D  not a digit
 *   \w  [A-Za-z0-9_]   \W  not that
 *   \s  whitespace     \S  not whitespace
 *   .   anything except a newline
 *
 * QUANTIFIERS — how many of the thing before
 *   *      0 or more
 *   +      1 or more
 *   ?      0 or 1  (optional)
 *   {3}    exactly 3
 *   {2,4}  2 to 4
 *   {2,}   2 or more
 *
 * GREEDY vs LAZY
 *   .*  takes as MUCH as it can, then gives back
 *   .*? takes as LITTLE as it can
 *   On '<a><b>', /<.*>/ matches the whole thing; /<.*?>/ matches '<a>'.
 *
 * ANCHORS & BOUNDARIES
 *   ^   start of the string (or of a line with the m flag)
 *   $   end
 *   \b  a word boundary — between a \w and a non-\w
 *   \B  not a word boundary
 * ==========================================================================*/

section('Exercise 1 — classes');
/* onlyLetters('abc') -> true, onlyLetters('ab1') -> false
 * onlyWordChars('a_1') -> true, onlyWordChars('a-1') -> false
 * hasWhitespace('a b') -> true                                   */
function onlyLetters(str) {
  // your code here
}
function onlyWordChars(str) {
  // your code here
}
function hasWhitespace(str) {
  // your code here
}
check('letters', onlyLetters('abc'), true);
check('letters with a digit', onlyLetters('ab1'), false);
check('word chars', onlyWordChars('a_1'), true);
check('a dash is not a word char', onlyWordChars('a-1'), false);
check('whitespace', hasWhitespace('a b'), true);
check('no whitespace', hasWhitespace('ab'), false);

section('Exercise 2 — negated classes');
/* hasNonDigit('12a') -> true
 * stripVowels('banana') -> 'bnn'      (replace all vowels with '')  */
function hasNonDigit(str) {
  // your code here
}
function stripVowels(str) {
  // your code here
}
check('has a letter', hasNonDigit('12a'), true);
check('all digits', hasNonDigit('123'), false);
check('stripVowels', stripVowels('banana'), 'bnn');

section('Exercise 3 — quantifiers');
/* isPin('1234') -> true          exactly 4 digits
 * isUkPostcodeish('AB1 2CD') -> true    2 letters, 1-2 digits, space,
 *                                        1 digit, 2 letters
 * hasRepeatedLetter('hello') -> true    the same letter twice in a row
 *   (that one needs a backreference: \1 — you will meet it properly in
 *    file 09, so for now use ([a-z])\1 )                          */
function isPin(str) {
  // your code here
}
function isUkPostcodeish(str) {
  // your code here
}
function hasRepeatedLetter(str) {
  // your code here
}
check('pin', isPin('1234'), true);
check('pin too short', isPin('123'), false);
check('pin with a letter', isPin('12a4'), false);
check('postcode', isUkPostcodeish('AB1 2CD'), true);
check('postcode two digits', isUkPostcodeish('AB12 3CD'), true);
check('postcode bad', isUkPostcodeish('A1 2CD'), false);
check('repeated', hasRepeatedLetter('hello'), true);
check('not repeated', hasRepeatedLetter('help'), false);

section('Exercise 4 — optional parts');
/* isColourWord('color') -> true and isColourWord('colour') -> true,
 * using ? to make the u optional.                                */
function isColourWord(str) {
  // your code here
}
check('american', isColourWord('color'), true);
check('british', isColourWord('colour'), true);
check('neither', isColourWord('colr'), false);

section('Exercise 5 — greedy vs lazy');
/* firstTag('<a><b>') -> '<a>'       lazy
 * everything('<a><b>') -> '<a><b>'  greedy                       */
function firstTag(str) {
  // your code here
}
function everything(str) {
  // your code here
}
check('lazy', firstTag('<a><b>'), '<a>');
check('greedy', everything('<a><b>'), '<a><b>');

section('Exercise 6 — anchors');
/* startsWithHash('#tag') -> true
 * endsWithNumber('abc42') -> true
 * isExactly('abc', 'abc') -> true   — build the regex from the word,
 *                                     anchored at both ends       */
function startsWithHash(str) {
  // your code here
}
function endsWithNumber(str) {
  // your code here
}
check('hash', startsWithHash('#tag'), true);
check('no hash', startsWithHash('tag'), false);
check('ends with a number', endsWithNumber('abc42'), true);
check('ends with a letter', endsWithNumber('42abc'), false);

section('Exercise 7 — word boundaries');
/* containsWord('the cat sat', 'cat') -> true
 * containsWord('concatenate', 'cat') -> false     <- the boundary matters
 * Build the regex from the word with \b on both sides.           */
function containsWord(text, word) {
  // your code here
}
check('whole word', containsWord('the cat sat', 'cat'), true);
check('inside another word', containsWord('concatenate', 'cat'), false);
check('at the end', containsWord('a cat', 'cat'), true);

section('Exercise 8 — the multiline flag');
/* countLinesStartingWith('a1\nb2\na3', 'a') -> 2
 * Use ^ with the m flag and a global match.                      */
function countLinesStartingWith(text, prefix) {
  // your code here
}
check('two lines', countLinesStartingWith('a1\nb2\na3', 'a'), 2);
check('none', countLinesStartingWith('b1\nb2', 'a'), 0);

section('Exercise 9 — the dotAll flag');
/* betweenMarkers('START\nmiddle\nEND') -> '\nmiddle\n'
 * Match everything between START and END, INCLUDING newlines.
 * Without the s flag, . refuses to cross a line break.           */
function betweenMarkers(text) {
  // your code here
}
check('across lines', betweenMarkers('START\nmiddle\nEND'), '\nmiddle\n');

section('Exercise 10 — practical validators');
/* isUsername('ab_12') -> true     3-16 chars of [a-z0-9_], lowercase only
 * isStrongPassword('abcD1234') -> true
 *   at least 8 characters, with at least one lowercase, one uppercase and
 *   one digit. (Hint: three separate tests is clearer than one regex —
 *   but try the lookahead version too after file 09.)
 * isTime('23:59') -> true, isTime('24:00') -> false
 *   hours 00-23, minutes 00-59                                   */
function isUsername(str) {
  // your code here
}
function isStrongPassword(str) {
  // your code here
}
function isTime(str) {
  // your code here
}
check('username', isUsername('ab_12'), true);
check('username too short', isUsername('ab'), false);
check('username uppercase', isUsername('Abc'), false);
check('username too long', isUsername('a'.repeat(17)), false);
check('password ok', isStrongPassword('abcD1234'), true);
check('password no upper', isStrongPassword('abcd1234'), false);
check('password too short', isStrongPassword('aB1'), false);
check('time ok', isTime('23:59'), true);
check('time midnight', isTime('00:00'), true);
check('hour too big', isTime('24:00'), false);
check('minute too big', isTime('12:60'), false);

section('PREDICTIONS');

// P1: does * allow zero?
let p1 = null;
check('P1  /^a*$/.test("")', p1, /^a*$/.test(''));

// P2: and +?
let p2 = null;
check('P2  /^a+$/.test("")', p2, /^a+$/.test(''));

// P3: greedy matching
let p3 = null;
check('P3  "<a><b>".match(/<.*>/)[0]', p3, '<a><b>'.match(/<.*>/)[0]);

// P4: lazy matching
let p4 = null;
check('P4  "<a><b>".match(/<.*?>/)[0]', p4, '<a><b>'.match(/<.*?>/)[0]);

// P5: does . match a newline by default?
let p5 = null;
check('P5  /a.b/.test("a\\nb")', p5, /a.b/.test('a\nb'));

// P6: with the s flag
let p6 = null;
check('P6  /a.b/s.test("a\\nb")', p6, /a.b/s.test('a\nb'));

// P7: ^ without the m flag on multi-line text
let p7 = null;
check('P7  "a\\nb".match(/^./g)', p7, 'a\nb'.match(/^./g));

// P8: with the m flag
let p8 = null;
check('P8  "a\\nb".match(/^./gm)', p8, 'a\nb'.match(/^./gm));

// P9: \d inside a character class
let p9 = null;
check('P9  /[\\d-]+/.test("1-2")', p9, /[\d-]+/.test('1-2'));

report();
