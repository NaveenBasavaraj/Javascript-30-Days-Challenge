'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 02 — SEARCHING
 *
 * NOTES:
 *   str.includes(sub)          true / false               <- use this most
 *   str.startsWith(sub)        true / false
 *   str.endsWith(sub)          true / false
 *   str.indexOf(sub)           first position, or -1
 *   str.lastIndexOf(sub)       last position, or -1
 *   str.indexOf(sub, from)     start searching from an index
 *
 *   All of them are CASE SENSITIVE. Lowercase both sides for a
 *   case-insensitive search.
 *
 *   -1 is truthy! `if (str.indexOf(x))` is a bug. Write
 *   `if (str.indexOf(x) !== -1)` or just use includes().
 * ==========================================================================*/

const TEXT = 'The quick brown fox jumps over the lazy dog';

section('Exercise 1 — the basics');
function has(str, sub) {
  // your code here
}
function beginsWith(str, sub) {
  // your code here
}
function finishesWith(str, sub) {
  // your code here
}
check('has', has(TEXT, 'brown'), true);
check('has missing', has(TEXT, 'cat'), false);
check('beginsWith', beginsWith(TEXT, 'The'), true);
check('finishesWith', finishesWith(TEXT, 'dog'), true);

section('Exercise 2 — positions');
/* positionOf(TEXT, 'fox') -> 16
 * positionOf(TEXT, 'cat') -> -1
 * lastPositionOf('a-b-a', 'a') -> 4                              */
function positionOf(str, sub) {
  // your code here
}
function lastPositionOf(str, sub) {
  // your code here
}
check('positionOf', positionOf(TEXT, 'fox'), 16);
check('positionOf missing', positionOf(TEXT, 'cat'), -1);
check('lastPositionOf', lastPositionOf('a-b-a', 'a'), 4);

section('Exercise 3 — case-insensitive search');
/* hasIgnoringCase('Hello World', 'WORLD') -> true                */
function hasIgnoringCase(str, sub) {
  // your code here
}
check('different case', hasIgnoringCase('Hello World', 'WORLD'), true);
check('still false when absent', hasIgnoringCase('Hello', 'xyz'), false);

section('Exercise 4 — count occurrences');
/* countOf('banana', 'an') -> 2      (overlapping matches do NOT count)
 * countOf('aaa', 'aa') -> 1
 * countOf('abc', 'z') -> 0
 * Hint: loop with indexOf(sub, fromIndex).                       */
function countOf(str, sub) {
  // your code here
}
check('two', countOf('banana', 'an'), 2);
check('non-overlapping', countOf('aaa', 'aa'), 1);
check('none', countOf('abc', 'z'), 0);
check('single characters', countOf('hello', 'l'), 2);

section('Exercise 5 — all positions');
/* allPositions('a-b-a', 'a') -> [0, 4]                           */
function allPositions(str, sub) {
  // your code here
}
check('allPositions', allPositions('a-b-a', 'a'), [0, 4]);
check('none', allPositions('xyz', 'a'), []);

section('Exercise 6 — the -1 trap');
/* Write the CORRECT check. Returns 'found' or 'not found'.
 * Try writing it the buggy way first (if (str.indexOf(sub))) and watch
 * what happens when the match is at position 0.                  */
function findReport(str, sub) {
  // your code here
}
check('match at the start', findReport('abc', 'a'), 'found');
check('match in the middle', findReport('abc', 'b'), 'found');
check('no match', findReport('abc', 'z'), 'not found');

section('Exercise 7 — search a list');
/* matching(['apple','banana','grape'], 'ap') -> ['apple','grape']
 * Case-insensitive.                                              */
function matching(words, query) {
  // your code here
}
check('matching', matching(['apple', 'banana', 'grape'], 'ap'), ['apple', 'grape']);
check('case-insensitive', matching(['Apple'], 'APP'), ['Apple']);
check('empty query matches everything', matching(['a', 'b'], ''), ['a', 'b']);

section('Exercise 8 — file extensions');
/* extensionOf('photo.jpeg') -> 'jpeg'
 * extensionOf('archive.tar.gz') -> 'gz'      (after the LAST dot)
 * extensionOf('README') -> ''                                    */
function extensionOf(filename) {
  // your code here
}
check('simple', extensionOf('photo.jpeg'), 'jpeg');
check('multiple dots', extensionOf('archive.tar.gz'), 'gz');
check('no dot', extensionOf('README'), '');

section('Exercise 9 — a simple highlighter');
/* Wrap every occurrence in [brackets], case-sensitively.
 * highlight('the cat sat', 'at') -> 'the c[at] s[at]'
 * Do it WITHOUT replaceAll — use indexOf and slice in a loop, so you
 * understand what replaceAll does for you.                       */
function highlight(str, sub) {
  // your code here
}
check('highlight', highlight('the cat sat', 'at'), 'the c[at] s[at]');
check('no match', highlight('abc', 'z'), 'abc');

section('Exercise 10 — starts with any');
/* startsWithAny('image.png', ['photo', 'image']) -> true         */
function startsWithAny(str, prefixes) {
  // your code here
}
check('one matches', startsWithAny('image.png', ['photo', 'image']), true);
check('none match', startsWithAny('doc.pdf', ['photo', 'image']), false);
check('empty list', startsWithAny('x', []), false);

section('PREDICTIONS');

// P1: indexOf of an empty string
let p1 = null;
check('P1  "abc".indexOf("")', p1, 'abc'.indexOf(''));

// P2: includes an empty string
let p2 = null;
check('P2  "abc".includes("")', p2, 'abc'.includes(''));

// P3: the -1 trap in action
let p3 = null;
check('P3  Boolean("abc".indexOf("a"))', p3, Boolean('abc'.indexOf('a')));

// P4: case sensitivity
let p4 = null;
check('P4  "Hello".includes("hello")', p4, 'Hello'.includes('hello'));

// P5: startsWith with an offset
let p5 = null;
check('P5  "hello".startsWith("llo", 2)', p5, 'hello'.startsWith('llo', 2));

// P6: searching for something longer than the string
let p6 = null;
check('P6  "ab".indexOf("abc")', p6, 'ab'.indexOf('abc'));

report();
