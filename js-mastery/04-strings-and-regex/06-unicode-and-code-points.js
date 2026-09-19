'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 06 — UNICODE, CODE POINTS & THE LENGTH LIE
 *
 * This file explains why '👍'.length is 2 and why your character counter
 * breaks on emoji and on many non-English languages.
 *
 * NOTES:
 *   A JavaScript string is a sequence of UTF-16 CODE UNITS, each 16 bits.
 *   Characters up to U+FFFF fit in one unit. Everything above — emoji,
 *   many scripts, musical symbols — needs TWO units, called a
 *   SURROGATE PAIR. .length counts units, not characters.
 *
 *   str.charCodeAt(i)     the 16-bit unit at i        (0-65535)
 *   str.codePointAt(i)    the full code point at i    (can exceed 65535)
 *   String.fromCharCode(n)      build from units
 *   String.fromCodePoint(n)     build from code points
 *
 *   ITERATION is the fix: strings are iterable BY CODE POINT, so
 *     [...str]  and  for (const ch of str)  handle surrogate pairs,
 *   while str.split('') and str[i] do NOT.
 *
 *   Even code points are not the last word. An emoji with a skin tone, or
 *   a flag, is several code points joined — a GRAPHEME. Intl.Segmenter is
 *   the real answer there; it is used in the last exercise.
 *
 *   NORMALISATION: 'é' can be one code point or 'e' + a combining accent.
 *   They look identical and are NOT equal. str.normalize() fixes that.
 * ==========================================================================*/

section('Exercise 1 — length is not character count');
/* unitLength('👍') -> 2      (what .length reports)
 * pointLength('👍') -> 1     (what a human would say)
 * Use [...str].length for the second.                            */
function unitLength(str) {
  // your code here
}
function pointLength(str) {
  // your code here
}
check('ascii units', unitLength('abc'), 3);
check('emoji units', unitLength('👍'), 2);
check('ascii points', pointLength('abc'), 3);
check('emoji points', pointLength('👍'), 1);
check('mixed', pointLength('a👍b'), 3);

section('Exercise 2 — splitting safely');
/* unsafeChars('a👍') -> the broken 3-element split
 * safeChars('a👍') -> ['a', '👍']
 * For unsafeChars use split(''); for safeChars use the spread.   */
function unsafeChars(str) {
  // your code here
}
function safeChars(str) {
  // your code here
}
check('safe', safeChars('a👍b'), ['a', '👍', 'b']);
check('unsafe has more pieces', () => unsafeChars('a👍b').length, 4);
check('ascii is the same either way', () => [unsafeChars('ab'), safeChars('ab')], [['a', 'b'], ['a', 'b']], safeChars);

section('Exercise 3 — reversing safely');
/* reverseBroken('a👍') mangles the emoji; reverseSafe does not.
 * reverseSafe('a👍b') -> 'b👍a'                                   */
function reverseSafe(str) {
  // your code here
}
check('reverseSafe', reverseSafe('a👍b'), 'b👍a');
check('plain text', reverseSafe('hello'), 'olleh');

section('Exercise 4 — code points');
/* firstCodePoint('A') -> 65
 * firstCodePoint('👍') -> 128077
 * fromPoint(65) -> 'A'
 * fromPoint(128077) -> '👍'                                      */
function firstCodePoint(str) {
  // your code here
}
function fromPoint(n) {
  // your code here
}
check('A', firstCodePoint('A'), 65);
check('emoji', firstCodePoint('👍'), 128077);
check('back to A', fromPoint(65), 'A');
check('back to emoji', fromPoint(128077), '👍');

section('Exercise 5 — an alphabet');
/* alphabet() -> ['a','b',...,'z'] using code points 97 to 122.   */
function alphabet() {
  // your code here
}
check('26 letters', () => alphabet().length, 26);
check('ends', () => [alphabet()[0], alphabet().at(-1)], ['a', 'z']);

section('Exercise 6 — a Caesar cipher');
/* Shift every lowercase letter forward by n, wrapping z -> a.
 * Leave everything else alone.
 * caesar('abc', 1) -> 'bcd'
 * caesar('xyz', 3) -> 'abc'
 * caesar('a b!', 1) -> 'b c!'                                    */
function caesar(str, n) {
  // your code here
}
check('simple', caesar('abc', 1), 'bcd');
check('wraps', caesar('xyz', 3), 'abc');
check('leaves other characters', caesar('a b!', 1), 'b c!');
check('zero shift', caesar('abc', 0), 'abc');

section('Exercise 7 — character codes');
/* codesOf('AB') -> [65, 66]
 * fromCodes([72, 105]) -> 'Hi'                                   */
function codesOf(str) {
  // your code here
}
function fromCodes(codes) {
  // your code here
}
check('codesOf', codesOf('AB'), [65, 66]);
check('fromCodes', fromCodes([72, 105]), 'Hi');

section('Exercise 8 — normalisation');
/* These two strings LOOK identical but are built differently:
 *   composed  = 'é'          (one code point: é)
 *   decomposed = 'é'        (e + combining acute accent)
 * looksSame(a, b) -> true when they normalise to the same text.  */
const composed = 'é';
const decomposed = 'é';
function looksSame(a, b) {
  // your code here
}
check('normalised match', looksSame(composed, decomposed), true);
check('genuinely different', looksSame('a', 'b'), false);
log('and note', `plain === on those two says ${composed === decomposed}`);

section('Exercise 9 — a safe truncate');
/* Cut to n CHARACTERS (code points), never splitting an emoji in half.
 * safeTruncate('a👍b', 2) -> 'a👍'                                */
function safeTruncate(str, n) {
  // your code here
}
check('keeps the emoji whole', safeTruncate('a👍b', 2), 'a👍');
check('shorter than the limit', safeTruncate('ab', 5), 'ab');
check('length in code points', () => [...safeTruncate('a👍b👍', 3)].length, 3);

section('Exercise 10 — graphemes');
/* Some emoji are SEVERAL code points glued together. '👍🏽' is a thumb plus
 * a skin-tone modifier: 2 code points, 1 thing on screen.
 * Use Intl.Segmenter to count what a human sees.
 *   const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
 *   [...seg.segment(str)].length                                 */
function graphemeCount(str) {
  // your code here
}
check('plain', graphemeCount('abc'), 3);
check('simple emoji', graphemeCount('👍'), 1);
check('emoji with a skin tone', graphemeCount('👍🏽'), 1);
log('while its code points say', [...'👍🏽'].length);

section('PREDICTIONS');

// P1: the famous one
let p1 = null;
check('P1  "👍".length', p1, '👍'.length);

// P2: and with the spread
let p2 = null;
check('P2  [..."👍"].length', p2, [...'👍'].length);

// P3: indexing into an emoji
let p3 = null;
check('P3  "👍"[0] === "👍"', p3, '👍'[0] === '👍');

// P4: charCodeAt on an emoji
let p4 = null;
check('P4  "👍".charCodeAt(0) is above 65535?', p4, '👍'.charCodeAt(0) > 65535);

// P5: codePointAt on the same character
let p5 = null;
check('P5  "👍".codePointAt(0) is above 65535?', p5, '👍'.codePointAt(0) > 65535);

// P6: do the two é forms compare equal?
let p6 = null;
check('P6  "\\u00e9" === "e\\u0301"', p6, 'é' === 'é');

// P7: their lengths
let p7 = null;
check('P7  ["\\u00e9".length, "e\\u0301".length]', p7, ['é'.length, 'é'.length]);

// P8: uppercasing an emoji
let p8 = null;
check('P8  "👍".toUpperCase()', p8, '👍'.toUpperCase());

log('the rule', 'never use .length or [i] on text a user typed — spread it first');

report();
