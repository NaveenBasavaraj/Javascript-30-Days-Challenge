'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 07 — REGULAR EXPRESSIONS, PART 1: THE BASICS
 *
 * A regex is a pattern for describing text. Two ways to write one:
 *   /pattern/flags                    literal — use this
 *   new RegExp('pattern', 'flags')    when the pattern is built at runtime
 *                                     (and then backslashes need doubling)
 *
 * THE FLAGS
 *   g  global      find ALL matches, not just the first
 *   i  ignore case
 *   m  multiline   ^ and $ match at each line break, not just the ends
 *   s  dotAll      . also matches newlines
 *   u  unicode     needed for \u{...} and proper code-point handling
 *   y  sticky      match only at lastIndex
 *
 * THE METHODS (part 4 of this topic covers them properly)
 *   re.test(str)      -> true / false          <- start here
 *   str.match(re)     -> match info, or null
 *   str.replace(re, to)
 *   str.split(re)
 *
 * SPECIAL CHARACTERS — these mean something, so escape them with \ when
 * you want them literally:    . * + ? ^ $ { } ( ) [ ] | \ /
 *   .   any single character except a newline
 *   \.  a literal dot
 * ==========================================================================*/

section('Exercise 1 — test');
/* hasDigit('abc1') -> true   using /[0-9]/ and .test()
 * isAllDigits('123') -> true, isAllDigits('12a') -> false
 *   (anchor it with ^ at the start and $ at the end)             */
function hasDigit(str) {
  // your code here
}
function isAllDigits(str) {
  // your code here
}
check('has a digit', hasDigit('abc1'), true);
check('no digit', hasDigit('abc'), false);
check('all digits', isAllDigits('123'), true);
check('not all digits', isAllDigits('12a'), false);
check('empty is not all digits', isAllDigits(''), false);

section('Exercise 2 — the dot');
/* threeChars('abc') -> true ; threeChars('ab') -> false
 * Match EXACTLY three of any character, using . and anchors.     */
function threeChars(str) {
  // your code here
}
check('three', threeChars('abc'), true);
check('two', threeChars('ab'), false);
check('four', threeChars('abcd'), false);
check('any characters', threeChars('a1!'), true);

section('Exercise 3 — escaping');
/* endsWithDotJs('app.js') -> true
 * endsWithDotJs('appxjs') -> false      <- an unescaped dot would say true */
function endsWithDotJs(name) {
  // your code here
}
check('real extension', endsWithDotJs('app.js'), true);
check('no dot', endsWithDotJs('appxjs'), false);
check('wrong extension', endsWithDotJs('app.ts'), false);

section('Exercise 4 — case insensitive');
/* mentionsJs('I love JavaScript') -> true, matching 'javascript' in any
 * case.                                                          */
function mentionsJs(text) {
  // your code here
}
check('upper', mentionsJs('I love JavaScript'), true);
check('lower', mentionsJs('i love javascript'), true);
check('absent', mentionsJs('I love Python'), false);

section('Exercise 5 — alternation');
/* isWeekend('sat') -> true, for 'sat' or 'sun' only.
 * Use (a|b) and anchors.                                         */
function isWeekend(day) {
  // your code here
}
check('sat', isWeekend('sat'), true);
check('sun', isWeekend('sun'), true);
check('mon', isWeekend('mon'), false);
check('not a substring match', isWeekend('satisfied'), false);

section('Exercise 6 — building a regex at runtime');
/* makeMatcher(word) returns a function testing for that word, case
 * insensitively, as a whole string.
 * makeMatcher('cat')('CAT') -> true                              */
function makeMatcher(word) {
  // your code here
}
check('matches', () => makeMatcher('cat')('CAT'), true);
check('does not', () => makeMatcher('cat')('dog'), false);
check('whole string only', () => makeMatcher('cat')('cats'), false);

section('Exercise 7 — match');
/* firstMatch('a1b2', /[0-9]/) -> '1'
 * firstMatch('abc', /[0-9]/) -> null
 * match() with NO g flag returns an array-like whose [0] is the match. */
function firstMatch(str, re) {
  // your code here
}
check('found', firstMatch('a1b2', /[0-9]/), '1');
check('missing', firstMatch('abc', /[0-9]/), null);

section('Exercise 8 — all matches');
/* allMatches('a1b22c', /[0-9]+/g) -> ['1', '22']
 * With the g flag, match() returns a plain array of all the matches,
 * or null when there are none — return [] in that case.          */
function allMatches(str, re) {
  // your code here
}
check('several', allMatches('a1b22c', /[0-9]+/g), ['1', '22']);
check('none', allMatches('abc', /[0-9]+/g), []);

section('Exercise 9 — where did it match?');
/* matchPosition('hello world', /world/) -> 6
 * Returns -1 when there is no match. Use .search() or match().index.  */
function matchPosition(str, re) {
  // your code here
}
check('found', matchPosition('hello world', /world/), 6);
check('missing', matchPosition('hello', /world/), -1);

section('Exercise 10 — a validator set');
/* Write four small tests.
 * looksLikeEmail('a@b.co') -> true      (something @ something . something)
 * isHexColour('#a1f2b3') -> true        (# then exactly 6 hex digits)
 * isBlank('   ') -> true                (empty or whitespace only)
 * hasUpperCase('abC') -> true                                    */
function looksLikeEmail(str) {
  // your code here
}
function isHexColour(str) {
  // your code here
}
function isBlank(str) {
  // your code here
}
function hasUpperCase(str) {
  // your code here
}
check('email ok', looksLikeEmail('a@b.co'), true);
check('email no at', looksLikeEmail('ab.co'), false);
check('email no dot', looksLikeEmail('a@bco'), false);
check('hex ok', isHexColour('#a1f2b3'), true);
check('hex too short', isHexColour('#a1f'), false);
check('hex no hash', isHexColour('a1f2b3'), false);
check('blank spaces', isBlank('   '), true);
check('blank empty', isBlank(''), true);
check('not blank', isBlank(' x '), false);
check('has upper', hasUpperCase('abC'), true);
check('no upper', hasUpperCase('abc'), false);

section('PREDICTIONS');

// P1: does test() find a match anywhere, or only at the start?
let p1 = null;
check('P1  /b/.test("abc")', p1, /b/.test('abc'));

// P2: an unescaped dot
let p2 = null;
check('P2  /a.c/.test("abc")', p2, /a.c/.test('abc'));

// P3: and an escaped one
let p3 = null;
check('P3  /a\\.c/.test("abc")', p3, /a\.c/.test('abc'));

// P4: match with no g flag — what is at [0]?
let p4 = null;
check('P4  "a1b2".match(/[0-9]/)[0]', p4, 'a1b2'.match(/[0-9]/)[0]);

// P5: match with no matches at all
let p5 = null;
check('P5  String("abc".match(/[0-9]/))', p5, String('abc'.match(/[0-9]/)));

// P6: the .index property
let p6 = null;
check('P6  "hello".match(/llo/).index', p6, 'hello'.match(/llo/).index);

// P7: THE classic bug — a global regex is stateful
const re7 = /a/g;
const results = [re7.test('a'), re7.test('a'), re7.test('a')];
let p7 = null;
check('P7  the same /a/g tested three times on "a"', p7, results);
log('why P7 happens', 'a g-flagged regex remembers lastIndex between calls — never reuse one with .test()');

report();
