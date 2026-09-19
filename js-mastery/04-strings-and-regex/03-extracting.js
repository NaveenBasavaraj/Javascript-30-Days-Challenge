'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 03 — EXTRACTING PIECES
 *
 * NOTES:
 *   str.slice(start, end)      end is EXCLUSIVE. Negatives count from the
 *                              end. This is the one to use.
 *   str.substring(start, end)  like slice, but negatives become 0 and it
 *                              SWAPS the arguments if start > end. Avoid.
 *   str.split(sep)             -> array
 *   str.split(sep, limit)      stop after `limit` pieces
 *   str.split('')              every character (careful with emoji — file 07)
 *
 *   slice(n)        from n to the end
 *   slice(0, n)     the first n characters
 *   slice(-n)       the last n characters
 *   slice(1, -1)    everything except the first and last
 * ==========================================================================*/

section('Exercise 1 — slice basics');
/* firstN('javascript', 4) -> 'java'
 * lastN('javascript', 6) -> 'script'
 * middle('javascript') -> 'avascrip'      (drop the first and last)  */
function firstN(str, n) {
  // your code here
}
function lastN(str, n) {
  // your code here
}
function middle(str) {
  // your code here
}
check('firstN', firstN('javascript', 4), 'java');
check('lastN', lastN('javascript', 6), 'script');
check('middle', middle('javascript'), 'avascrip');

section('Exercise 2 — between two indexes');
/* between('hello world', 6, 11) -> 'world'                       */
function between(str, start, end) {
  // your code here
}
check('between', between('hello world', 6, 11), 'world');

section('Exercise 3 — truncate');
/* Cut to at most `max` characters. If it was cut, end with '...'
 * and the TOTAL length must still be max.
 * truncate('hello world', 8) -> 'hello...'      (8 characters)
 * truncate('hi', 8) -> 'hi'                                      */
function truncate(str, max) {
  // your code here
}
check('cut', truncate('hello world', 8), 'hello...');
check('exact length', () => truncate('hello world', 8).length, 8);
check('short enough', truncate('hi', 8), 'hi');
check('exactly max', truncate('12345678', 8), '12345678');

section('Exercise 4 — split');
/* words('the quick fox') -> ['the','quick','fox']
 * chars('abc') -> ['a','b','c']
 * lines('a\nb') -> ['a','b']                                     */
function words(sentence) {
  // your code here
}
function chars(str) {
  // your code here
}
function lines(text) {
  // your code here
}
check('words', words('the quick fox'), ['the', 'quick', 'fox']);
check('chars', chars('abc'), ['a', 'b', 'c']);
check('lines', lines('a\nb'), ['a', 'b']);

section('Exercise 5 — split with a limit');
/* firstTwoWords('a b c d') -> ['a', 'b']                         */
function firstTwoWords(sentence) {
  // your code here
}
check('limit', firstTwoWords('a b c d'), ['a', 'b']);

section('Exercise 6 — split once, keep the rest');
/* A limit THROWS AWAY the rest, which is usually not what you want.
 * splitOnce('key=value=more', '=') -> ['key', 'value=more']
 * splitOnce('nodelimiter', '=') -> ['nodelimiter', '']           */
function splitOnce(str, sep) {
  // your code here
}
check('keeps the rest', splitOnce('key=value=more', '='), ['key', 'value=more']);
check('no separator', splitOnce('nodelimiter', '='), ['nodelimiter', '']);

section('Exercise 7 — parse a full name');
/* parseName('Asha Rao') -> { first: 'Asha', last: 'Rao' }
 * parseName('Cher') -> { first: 'Cher', last: '' }
 * parseName('Jean Luc Picard') -> { first: 'Jean', last: 'Luc Picard' } */
function parseName(full) {
  // your code here
}
check('two parts', parseName('Asha Rao'), { first: 'Asha', last: 'Rao' });
check('one part', parseName('Cher'), { first: 'Cher', last: '' });
check('three parts', parseName('Jean Luc Picard'), { first: 'Jean', last: 'Luc Picard' });

section('Exercise 8 — initials');
/* initials('ada lovelace king') -> 'ALK'                         */
function initials(fullName) {
  // your code here
}
check('initials', initials('ada lovelace king'), 'ALK');
check('one name', initials('plato'), 'P');

section('Exercise 9 — a CSV row');
/* parseRow('a, b ,c') -> ['a','b','c']       (trim every cell)
 * parseRow('') -> []                                             */
function parseRow(line) {
  // your code here
}
check('trimmed', parseRow('a, b ,c'), ['a', 'b', 'c']);
check('empty line', parseRow(''), []);

section('Exercise 10 — everything after / before a marker');
/* after('user:asha', ':') -> 'asha'
 * before('user:asha', ':') -> 'user'
 * When the marker is missing, both return the whole string.      */
function after(str, marker) {
  // your code here
}
function before(str, marker) {
  // your code here
}
check('after', after('user:asha', ':'), 'asha');
check('before', before('user:asha', ':'), 'user');
check('after missing', after('plain', ':'), 'plain');
check('before missing', before('plain', ':'), 'plain');

section('Exercise 11 — a URL path');
/* pathParts('/api/users/42/') -> ['api','users','42']
 * Empty pieces from leading/trailing slashes are dropped.        */
function pathParts(path) {
  // your code here
}
check('pathParts', pathParts('/api/users/42/'), ['api', 'users', '42']);
check('root', pathParts('/'), []);

section('PREDICTIONS');

// P1: slice with a negative start
let p1 = null;
check('P1  "javascript".slice(-6)', p1, 'javascript'.slice(-6));

// P2: substring with a negative — the trap
let p2 = null;
check('P2  "javascript".substring(-6)', p2, 'javascript'.substring(-6));

// P3: substring swaps its arguments
let p3 = null;
check('P3  "abcdef".substring(4, 1)', p3, 'abcdef'.substring(4, 1));

// P4: and slice does not
let p4 = null;
check('P4  "abcdef".slice(4, 1)', p4, 'abcdef'.slice(4, 1));

// P5: splitting on an empty separator
let p5 = null;
check('P5  "abc".split("")', p5, 'abc'.split(''));

// P6: splitting a string with no separator present
let p6 = null;
check('P6  "abc".split(",")', p6, 'abc'.split(','));

// P7: splitting an empty string
let p7 = null;
check('P7  "".split(",")', p7, ''.split(','));

// P8: and with an empty separator
let p8 = null;
check('P8  "".split("")', p8, ''.split(''));

log('note P7 vs P8', 'that inconsistency bites everyone once');

report();
