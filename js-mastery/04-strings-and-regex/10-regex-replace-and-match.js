'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 10 — REGEX PART 4: THE METHODS
 *
 * str.replace(re, replacement)
 *   Without /g, the FIRST match only. With /g, all of them.
 *   In the replacement STRING:
 *     $&   the whole match        $1 $2  capture groups
 *     $<name>  a named group      $$     a literal dollar sign
 *   As a FUNCTION: (match, ...groups, offset, whole) => newText
 *   The function form is the powerful one — you can compute the replacement.
 *
 * str.replaceAll(re, to)   the regex MUST have /g, or it throws
 * str.match(re)            no /g -> one match with groups; /g -> all matches
 *                          as plain strings, or null
 * str.matchAll(re)         REQUIRES /g; an iterator of full match objects
 * str.split(re)            splitting on a pattern; captured groups are KEPT
 *                          in the output
 * re.exec(str)             one match at a time; with /g it advances
 *                          re.lastIndex on each call
 * ==========================================================================*/

section('Exercise 1 — replace vs replaceAll');
/* dashToSpaceFirst('a-b-c') -> 'a b-c'
 * dashToSpaceAll('a-b-c') -> 'a b c'                             */
function dashToSpaceFirst(str) {
  // your code here
}
function dashToSpaceAll(str) {
  // your code here
}
check('first', dashToSpaceFirst('a-b-c'), 'a b-c');
check('all', dashToSpaceAll('a-b-c'), 'a b c');

section('Exercise 2 — $& and $1');
/* bracketNumbers('a1b22') -> 'a[1]b[22]'      using $&
 * swapPairs('a-b c-d') -> 'b-a d-c'           using $1 and $2    */
function bracketNumbers(str) {
  // your code here
}
function swapPairs(str) {
  // your code here
}
check('brackets', bracketNumbers('a1b22'), 'a[1]b[22]');
check('swap', swapPairs('a-b c-d'), 'b-a d-c');

section('Exercise 3 — a replacement function');
/* doubleNumbers('a1b20') -> 'a2b40'
 * The callback receives the matched text as a string — convert, double,
 * return a string.                                               */
function doubleNumbers(str) {
  // your code here
}
check('doubles', doubleNumbers('a1b20'), 'a2b40');
check('no numbers', doubleNumbers('abc'), 'abc');

section('Exercise 4 — a function with groups');
/* reformatDates('on 2024-01-15 and 2023-12-25')
 *   -> 'on 15/01/2024 and 25/12/2023'
 * The callback gets (match, year, month, day).                   */
function reformatDates(text) {
  // your code here
}
check('reformat', reformatDates('on 2024-01-15 and 2023-12-25'),
  'on 15/01/2024 and 25/12/2023');

section('Exercise 5 — using the offset');
/* markPositions('aba') -> 'a0b1a2'
 * The callback's LAST-but-one argument is the offset of the match.  */
function markPositions(str) {
  // your code here
}
check('offsets', markPositions('aba'), 'a0b1a2');

section('Exercise 6 — a template renderer, properly this time');
/* render('Hi {name}, you are {age}', { name: 'Asha', age: 30 })
 *   -> 'Hi Asha, you are 30'
 * A missing key becomes ''. One replace with a function does the lot. */
function render(template, values) {
  // your code here
}
check('render', render('Hi {name}, you are {age}', { name: 'Asha', age: 30 }),
  'Hi Asha, you are 30');
check('missing key', render('Hi {nope}!', {}), 'Hi !');
check('repeated', render('{a}{a}', { a: 'x' }), 'xx');

section('Exercise 7 — collapse and clean with regex');
/* collapse('  a   b  ') -> 'a b'
 * stripPunctuation('Hi, there! Ok?') -> 'Hi there Ok'
 * slug('  Hello There, World!  ') -> 'hello-there-world'
 * All three with regex this time — compare with your file 04 versions. */
function collapse(str) {
  // your code here
}
function stripPunctuation(str) {
  // your code here
}
function slug(title) {
  // your code here
}
check('collapse', collapse('  a   b  '), 'a b');
check('punctuation', stripPunctuation('Hi, there! Ok?'), 'Hi there Ok');
check('slug', slug('  Hello There, World!  '), 'hello-there-world');

section('Exercise 8 — matchAll with named groups');
/* findMentions('hi @asha and @ben') -> ['asha', 'ben']           */
function findMentions(text) {
  // your code here
}
check('mentions', findMentions('hi @asha and @ben'), ['asha', 'ben']);
check('none', findMentions('nobody here'), []);

section('Exercise 9 — split on a pattern');
/* splitOnPunctuation('a, b; c') -> ['a', 'b', 'c']
 * keepSeparators('a1b2c') -> ['a', '1', 'b', '2', 'c']
 *   (a CAPTURED group in a split pattern is kept in the result)  */
function splitOnPunctuation(str) {
  // your code here
}
function keepSeparators(str) {
  // your code here
}
check('split', splitOnPunctuation('a, b; c'), ['a', 'b', 'c']);
check('keeps captured separators', keepSeparators('a1b2c'), ['a', '1', 'b', '2', 'c']);

section('Exercise 10 — exec in a loop');
/* Use re.exec in a while loop to collect every match WITH its index.
 * positionsOf('a-b-a', /a/g) -> [{ text: 'a', at: 0 }, { text: 'a', at: 4 }]
 * Remember the regex must have /g or the loop never ends.        */
function positionsOf(str, re) {
  // your code here
}
check('positions', positionsOf('a-b-a', /a/g),
  [{ text: 'a', at: 0 }, { text: 'a', at: 4 }]);
check('none', positionsOf('xyz', /a/g), []);

section('Exercise 11 — escaping user input');
/* A user types '3.50' and you build a regex from it — the dot would match
 * any character. Escape every special character first.
 * escapeRegex('a.b*c') -> 'a\\.b\\*c'
 * Then safeSearch('price 3x50', '3.50') must be FALSE.           */
function escapeRegex(str) {
  // your code here
}
function safeSearch(text, userInput) {
  // your code here
}
check('escapes', escapeRegex('a.b*c'), 'a\\.b\\*c');
check('does not match a dot as a wildcard', safeSearch('price 3x50', '3.50'), false);
check('matches the real thing', safeSearch('price 3.50', '3.50'), true);

section('Exercise 12 — a word counter');
/* wordFrequency('the cat the dog') -> { the: 2, cat: 1, dog: 1 }
 * Lowercase, split on any non-word characters, ignore empty pieces.  */
function wordFrequency(text) {
  // your code here
}
check('frequency', wordFrequency('The cat the dog!'), { the: 2, cat: 1, dog: 1 });
check('empty', wordFrequency(''), {});

section('PREDICTIONS');

// P1: replace with a string and no g flag
let p1 = null;
check('P1  "aaa".replace(/a/, "b")', p1, 'aaa'.replace(/a/, 'b'));

// P2: replaceAll with a non-global regex
let outcome2;
try { outcome2 = 'aaa'.replaceAll(/a/, 'b'); } catch (e) { outcome2 = e.constructor.name; }
let p2 = null;
check('P2  "aaa".replaceAll(/a/, "b")', p2, outcome2);

// P3: $& in a replacement string
let p3 = null;
check('P3  "abc".replace(/b/, "[$&]")', p3, 'abc'.replace(/b/, '[$&]'));

// P4: a dollar sign you meant literally
let p4 = null;
check('P4  "a".replace(/a/, "$$5")', p4, 'a'.replace(/a/, '$$5'));

// P5: match with g returns what, exactly?
let p5 = null;
check('P5  "a1b2".match(/(\\d)/g)', p5, 'a1b2'.match(/(\d)/g));
log('note P5', 'with /g you get the matches only — the GROUPS are thrown away, which is why matchAll exists');

// P6: split with a captured group
let p6 = null;
check('P6  "a1b".split(/(\\d)/)', p6, 'a1b'.split(/(\d)/));

// P7: and without capturing
let p7 = null;
check('P7  "a1b".split(/\\d/)', p7, 'a1b'.split(/\d/));

// P8: exec advancing lastIndex
const re8 = /a/g;
re8.exec('aa');
let p8 = null;
check('P8  re8.lastIndex after one exec on "aa"', p8, re8.lastIndex);

report();
