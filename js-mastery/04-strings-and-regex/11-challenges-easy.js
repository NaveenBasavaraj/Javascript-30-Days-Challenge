'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 11 — CHALLENGES, LEVEL 1
 *
 * Files 01-10 combined. Regex where it helps, plain string methods where
 * they are clearer — knowing which is which is part of the exercise.
 * ==========================================================================*/

section('1 — countVowels');
/* Case-insensitive. countVowels('Education') -> 5                */
function countVowels(str) {
  // your code here
}
check('mixed case', countVowels('Education'), 5);
check('none', countVowels('rhythm'), 0);

section('2 — isPalindrome');
/* Ignore case, spaces and punctuation.
 * isPalindrome('A man, a plan, a canal: Panama') -> true         */
function isPalindrome(str) {
  // your code here
}
check('classic', isPalindrome('A man, a plan, a canal: Panama'), true);
check('not one', isPalindrome('hello'), false);
check('empty', isPalindrome(''), true);

section('3 — capitalise every sentence');
/* fixSentences('hello there. how are you? fine!')
 *   -> 'Hello there. How are you? Fine!'
 * A sentence starts at the beginning or after . ? ! plus a space.  */
function fixSentences(text) {
  // your code here
}
check('three sentences', fixSentences('hello there. how are you? fine!'),
  'Hello there. How are you? Fine!');
check('one', fixSentences('just this'), 'Just this');

section('4 — wordCount');
/* Number of words, where a word is a run of non-space characters.
 * wordCount('  the   quick fox  ') -> 3
 * wordCount('') -> 0                                             */
function wordCount(text) {
  // your code here
}
check('extra spaces', wordCount('  the   quick fox  '), 3);
check('empty', wordCount(''), 0);
check('spaces only', wordCount('   '), 0);

section('5 — longestWord');
/* Punctuation does not count as part of a word.
 * longestWord('the quick, brownish fox') -> 'brownish'           */
function longestWord(text) {
  // your code here
}
check('longest', longestWord('the quick, brownish fox'), 'brownish');
check('tie keeps the first', longestWord('abc xyz'), 'abc');

section('6 — formatNumber');
/* Group digits in threes from the right.
 * formatNumber(1234567) -> '1,234,567'
 * formatNumber(999) -> '999'
 * Do it yourself, not with toLocaleString.                       */
function formatNumber(n) {
  // your code here
}
check('millions', formatNumber(1234567), '1,234,567');
check('short', formatNumber(999), '999');
check('exactly four', formatNumber(1000), '1,000');

section('7 — validate a phone number');
/* Accept 10 digits, optionally in groups separated by spaces or dashes:
 *   '9876543210', '987-654-3210', '987 654 3210'
 * Reject anything else.                                          */
function isPhone(str) {
  // your code here
}
check('plain', isPhone('9876543210'), true);
check('dashes', isPhone('987-654-3210'), true);
check('spaces', isPhone('987 654 3210'), true);
check('too short', isPhone('98765'), false);
check('letters', isPhone('987-654-321a'), false);

section('8 — extract hashtags');
/* hashtags('Loving #js and #webdev today!') -> ['js', 'webdev']
 * The # is not part of the result.                               */
function hashtags(text) {
  // your code here
}
check('two', hashtags('Loving #js and #webdev today!'), ['js', 'webdev']);
check('none', hashtags('plain text'), []);

section('9 — maskEmail');
/* maskEmail('asha@example.com') -> 'a***@example.com'
 * Keep the first character of the local part, then exactly three stars. */
function maskEmail(email) {
  // your code here
}
check('mask', maskEmail('asha@example.com'), 'a***@example.com');
check('short local part', maskEmail('a@b.com'), 'a***@b.com');

section('10 — titleCase with small words');
/* Capitalise every word EXCEPT a, an, the, of, and, in — unless it is the
 * first word.
 * smartTitle('the lord of the rings') -> 'The Lord of the Rings'  */
function smartTitle(text) {
  // your code here
}
check('lotr', smartTitle('the lord of the rings'), 'The Lord of the Rings');
check('first word always capitalised', smartTitle('and then'), 'And Then');

section('11 — wrapText');
/* Break text into lines of at most `width` characters, never splitting a
 * word. Join the lines with '\n'.
 * wrap('the quick brown fox', 10) -> 'the quick\nbrown fox'      */
function wrap(text, width) {
  // your code here
}
check('wraps', wrap('the quick brown fox', 10), 'the quick\nbrown fox');
check('short enough', wrap('short', 10), 'short');
check('every line fits', () => wrap('aa bb cc dd ee', 5).split('\n').every((l) => l.length <= 5), true);

section('12 — parseQuery');
/* parseQuery('?q=js&page=2') -> { q: 'js', page: '2' }
 * parseQuery('') -> {}
 * A key with no '=' gets an empty string value.                  */
function parseQuery(qs) {
  // your code here
}
check('two params', parseQuery('?q=js&page=2'), { q: 'js', page: '2' });
check('empty', parseQuery(''), {});
check('valueless key', parseQuery('?flag'), { flag: '' });

section('13 — compareVersions');
/* compareVersions('1.2.10', '1.2.9') -> 1     (first is newer)
 * compareVersions('1.2.3', '1.10.0') -> -1
 * compareVersions('2.0.0', '2.0.0') -> 0
 * Compare each part as a NUMBER, not as text.                    */
function compareVersions(a, b) {
  // your code here
}
check('bigger patch', compareVersions('1.2.10', '1.2.9'), 1);
check('smaller minor', compareVersions('1.2.3', '1.10.0'), -1);
check('equal', compareVersions('2.0.0', '2.0.0'), 0);

report();
