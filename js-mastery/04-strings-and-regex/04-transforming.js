'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 04 — TRANSFORMING
 *
 * NOTES — every one of these returns a NEW string:
 *   toUpperCase() toLowerCase()
 *   trim() trimStart() trimEnd()      whitespace only, both ends or one
 *   padStart(len, pad) padEnd(len, pad)   pads UP TO a total length;
 *                                         does nothing if already long enough
 *   repeat(n)
 *   concat(...) — or just use + and template literals
 *   replace(from, to)     replaces the FIRST match only (for a string `from`)
 *   replaceAll(from, to)  replaces every match
 *   at / slice / split    from files 01 and 03
 *
 *   There is no built-in capitalise or title-case. You write them, and you
 *   will write them again in every job you ever have.
 * ==========================================================================*/

section('Exercise 1 — case');
function shout(str) {
  // your code here
}
function whisper(str) {
  // your code here
}
check('shout', shout('hello'), 'HELLO');
check('whisper', whisper('HeLLo'), 'hello');

section('Exercise 2 — capitalise');
/* First letter up, the rest DOWN.
 * capitalise('hELLO') -> 'Hello'
 * capitalise('') -> ''                                           */
function capitalise(str) {
  // your code here
}
check('capitalise', capitalise('hELLO'), 'Hello');
check('already fine', capitalise('Hello'), 'Hello');
check('empty', capitalise(''), '');

section('Exercise 3 — title case');
/* Every word capitalised.
 * titleCase('the QUICK brown fox') -> 'The Quick Brown Fox'      */
function titleCase(sentence) {
  // your code here
}
check('titleCase', titleCase('the QUICK brown fox'), 'The Quick Brown Fox');
check('one word', titleCase('js'), 'Js');

section('Exercise 4 — trimming');
/* clean('   hi   ') -> 'hi'
 * cleanStart('   hi   ') -> 'hi   '
 * cleanEnd('   hi   ') -> '   hi'
 * Note trim only removes WHITESPACE, never punctuation.          */
function clean(str) {
  // your code here
}
function cleanStart(str) {
  // your code here
}
function cleanEnd(str) {
  // your code here
}
check('clean', clean('   hi   '), 'hi');
check('cleanStart', cleanStart('   hi   '), 'hi   ');
check('cleanEnd', cleanEnd('   hi   '), '   hi');

section('Exercise 5 — padding');
/* pad a number to 2 digits: clock(9) -> '09' ; clock(12) -> '12'
 * time(9, 5) -> '09:05'
 * money(42) -> '    42'       (padded to 6 with spaces, right-aligned) */
function clock(n) {
  // your code here
}
function time(h, m) {
  // your code here
}
function money(n) {
  // your code here
}
check('clock single', clock(9), '09');
check('clock double', clock(12), '12');
check('time', time(9, 5), '09:05');
check('money', money(42), '    42');

section('Exercise 6 — repeat');
/* line(5) -> '-----'
 * indent('hi', 2) -> '    hi'      (2 levels, 2 spaces each)     */
function line(n) {
  // your code here
}
function indent(text, levels) {
  // your code here
}
check('line', line(5), '-----');
check('indent', indent('hi', 2), '    hi');
check('no indent', indent('hi', 0), 'hi');

section('Exercise 7 — replace');
/* fixFirst('a-b-c', '-', '+') -> 'a+b-c'      (first only)
 * fixAll('a-b-c', '-', '+') -> 'a+b+c'                           */
function fixFirst(str, from, to) {
  // your code here
}
function fixAll(str, from, to) {
  // your code here
}
check('first only', fixFirst('a-b-c', '-', '+'), 'a+b-c');
check('all', fixAll('a-b-c', '-', '+'), 'a+b+c');

section('Exercise 8 — collapse whitespace');
/* Turn any run of spaces into a single space, and trim the ends.
 * collapse('  a   b  c ') -> 'a b c'
 * Do it with split and filter, not a regex — regex comes in file 08. */
function collapse(str) {
  // your code here
}
check('collapse', collapse('  a   b  c '), 'a b c');
check('already clean', collapse('a b'), 'a b');
check('only spaces', collapse('    '), '');

section('Exercise 9 — a slug');
/* slug('  Hello There, World!  ') -> 'hello-there-world'
 * Lowercase, trim, drop anything that is not a letter, number or space,
 * then join the words with dashes.
 * Hint: build it from the functions above plus a filter over the
 * characters.                                                    */
function slug(title) {
  // your code here
}
check('slug', slug('  Hello There, World!  '), 'hello-there-world');
check('already a slug', slug('simple'), 'simple');
check('digits survive', slug('Top 10 Tips'), 'top-10-tips');

section('Exercise 10 — mask');
/* Hide all but the last 4 characters.
 * mask('1234567890123456') -> '************3456'
 * mask('123') -> '123'         (too short to mask)               */
function mask(str) {
  // your code here
}
check('card', mask('1234567890123456'), '************3456');
check('short', mask('123'), '123');
check('exactly four', mask('1234'), '1234');

section('Exercise 11 — reverse');
/* reverse('hello') -> 'olleh'                                    */
function reverse(str) {
  // your code here
}
check('reverse', reverse('hello'), 'olleh');
check('empty', reverse(''), '');

section('Exercise 12 — camelCase and snake_case');
/* toCamel('user_first_name') -> 'userFirstName'
 * toSnake('userFirstName') -> 'user_first_name'                  */
function toCamel(snake) {
  // your code here
}
function toSnake(camel) {
  // your code here
}
check('toCamel', toCamel('user_first_name'), 'userFirstName');
check('toCamel single', toCamel('name'), 'name');
check('toSnake', toSnake('userFirstName'), 'user_first_name');
check('toSnake single', toSnake('name'), 'name');

section('PREDICTIONS');

// P1: does trim remove punctuation?
let p1 = null;
check('P1  "..hi..".trim()', p1, '..hi..'.trim());

// P2: padStart when the string is already long enough
let p2 = null;
check('P2  "hello".padStart(3, "0")', p2, 'hello'.padStart(3, '0'));

// P3: a multi-character pad
let p3 = null;
check('P3  "x".padStart(5, "ab")', p3, 'x'.padStart(5, 'ab'));

// P4: replace with a string only replaces once
let p4 = null;
check('P4  "aaa".replace("a", "b")', p4, 'aaa'.replace('a', 'b'));

// P5: does toUpperCase change the original?
const orig5 = 'hi';
orig5.toUpperCase();
let p5 = null;
check('P5  orig5 after calling orig5.toUpperCase()', p5, orig5);

// P6: repeat(0)
let p6 = null;
check('P6  "ab".repeat(0)', p6, 'ab'.repeat(0));

// P7: the special uppercase of the German ß
let p7 = null;
check('P7  "ß".toUpperCase()', p7, 'ß'.toUpperCase());
log('why P7 matters', 'uppercasing can change a string LENGTH — never assume it will not');

report();
