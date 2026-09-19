'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 09 — REGEX PART 3: GROUPS
 *
 * CAPTURE GROUP  ( ... )
 *   Remembers what it matched. match() returns them after [0]:
 *     '2024-01-15'.match(/(\d{4})-(\d{2})/)
 *       -> ['2024-01', '2024', '01']      [0] whole, [1] first group, ...
 *
 * NAMED GROUP  (?<name> ... )
 *   Reachable as match.groups.name. Far more readable than counting.
 *
 * NON-CAPTURING  (?: ... )
 *   Groups for structure without capturing. Use it when you only need the
 *   parentheses for alternation or a quantifier.
 *
 * BACKREFERENCE  \1  (or \k<name>)
 *   "the same text the first group matched"
 *     /(\w)\1/ matches a doubled character.
 *
 * LOOKAROUND — a condition that must hold, but is NOT part of the match
 *   (?=...)   lookahead:         followed by
 *   (?!...)   negative lookahead: NOT followed by
 *   (?<=...)  lookbehind:        preceded by
 *   (?<!...)  negative lookbehind
 *   'price: 30'.match(/(?<=: )\d+/)[0]  ->  '30'   (the ': ' is not in it)
 * ==========================================================================*/

section('Exercise 1 — capture groups');
/* splitDate('2024-01-15') -> { year: '2024', month: '01', day: '15' }
 * Use one regex with three groups and read match[1], [2], [3].
 * Return null when it does not match.                            */
function splitDate(str) {
  // your code here
}
check('valid', splitDate('2024-01-15'), { year: '2024', month: '01', day: '15' });
check('invalid', splitDate('not a date'), null);

section('Exercise 2 — named groups');
/* Same thing with (?<year>...) and match.groups.                 */
function splitDateNamed(str) {
  // your code here
}
check('named', splitDateNamed('2024-01-15'), { year: '2024', month: '01', day: '15' });
check('named invalid', splitDateNamed('nope'), null);

section('Exercise 3 — non-capturing groups');
/* isGreeting('hello there') -> true for 'hello' or 'hi' followed by
 * anything. Use (?:hello|hi) so the group does not capture, and confirm
 * the match has NO extra entries.
 * groupCount('hello there') -> 1   (just match[0], length 1)     */
function isGreeting(str) {
  // your code here
}
function groupCount(str) {
  // your code here: return the .length of the match array for your regex
}
check('hello', isGreeting('hello there'), true);
check('hi', isGreeting('hi there'), true);
check('neither', isGreeting('bye there'), false);
check('nothing captured', groupCount('hello there'), 1);

section('Exercise 4 — pulling out parts');
/* parseKeyValue('name = Asha') -> { key: 'name', value: 'Asha' }
 * Spaces around the = are optional and must not end up in the results. */
function parseKeyValue(line) {
  // your code here
}
check('with spaces', parseKeyValue('name = Asha'), { key: 'name', value: 'Asha' });
check('without spaces', parseKeyValue('name=Asha'), { key: 'name', value: 'Asha' });
check('not a pair', parseKeyValue('just text'), null);

section('Exercise 5 — backreferences');
/* hasDoubledWord('the the cat') -> true
 *   the SAME word twice in a row, separated by a space
 * hasDoubledWord('the cat cat sat') -> true
 * hasDoubledWord('the cat sat') -> false
 * Hint: /\b(\w+) \1\b/                                           */
function hasDoubledWord(text) {
  // your code here
}
check('doubled at the start', hasDoubledWord('the the cat'), true);
check('doubled later', hasDoubledWord('the cat cat sat'), true);
check('not doubled', hasDoubledWord('the cat sat'), false);

section('Exercise 6 — matching quotes');
/* quotedText(`he said "hello" loudly`) -> 'hello'
 * The same quote character must open and close it, so a backreference is
 * the neat way: /(['"])(.*?)\1/                                  */
function quotedText(str) {
  // your code here
}
check('double quotes', quotedText('he said "hello" loudly'), 'hello');
check('single quotes', quotedText("he said 'hi' quietly"), 'hi');
check('none', quotedText('no quotes here'), null);

section('Exercise 7 — lookahead');
/* priceAfterLabel('total: 42 items: 9') -> '42'
 * Match the digits that FOLLOW 'total: ', without including the label.
 * Use a lookbehind (?<=total: ) or a capture group.              */
function priceAfterLabel(text) {
  // your code here
}
check('finds it', priceAfterLabel('total: 42 items: 9'), '42');
check('missing label', priceAfterLabel('items: 9'), null);

section('Exercise 8 — negative lookahead');
/* notFollowedByPercent('50% and 70 units') -> ['70']
 * Find numbers NOT followed immediately by a % sign.             */
function notFollowedByPercent(text) {
  // your code here
}
check('skips the percentage', notFollowedByPercent('50% and 70 units'), ['70']);
check('all plain numbers', notFollowedByPercent('1 and 2'), ['1', '2']);

section('Exercise 9 — password rules with lookahead');
/* One regex, using lookaheads, for: at least 8 characters, at least one
 * lowercase, one uppercase, one digit.
 * Shape: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/                 */
function isStrongPassword(str) {
  // your code here
}
check('good', isStrongPassword('abcD1234'), true);
check('no digit', isStrongPassword('abcDefgh'), false);
check('no upper', isStrongPassword('abcd1234'), false);
check('too short', isStrongPassword('aB1'), false);

section('Exercise 10 — a log parser');
/* parseLog('[2024-01-15 10:30] ERROR Disk full')
 *   -> { date: '2024-01-15', time: '10:30', level: 'ERROR',
 *        message: 'Disk full' }
 * Use named groups. Return null if the line does not fit.        */
function parseLog(line) {
  // your code here
}
check('parses', parseLog('[2024-01-15 10:30] ERROR Disk full'), {
  date: '2024-01-15', time: '10:30', level: 'ERROR', message: 'Disk full',
});
check('another level', () => parseLog('[2024-02-01 00:00] INFO ok').level, 'INFO');
check('rubbish', parseLog('nope'), null);

section('Exercise 11 — swapping with groups');
/* swapNames('Rao, Asha') -> 'Asha Rao'
 * Use replace with $1 and $2.                                    */
function swapNames(str) {
  // your code here
}
check('swap', swapNames('Rao, Asha'), 'Asha Rao');

section('Exercise 12 — all matches with their groups');
/* Find every key=value pair.
 * allPairs('a=1, b=2') -> [['a','1'], ['b','2']]
 * Use matchAll (which REQUIRES the g flag) and read m[1], m[2].  */
function allPairs(text) {
  // your code here
}
check('two pairs', allPairs('a=1, b=2'), [['a', '1'], ['b', '2']]);
check('none', allPairs('nothing'), []);

section('PREDICTIONS');

// P1: what is at index 0 of a match with groups?
let p1 = null;
check('P1  "2024-01".match(/(\\d{4})-(\\d{2})/)[0]', p1, '2024-01'.match(/(\d{4})-(\d{2})/)[0]);

// P2: and at index 1?
let p2 = null;
check('P2  ...[1]', p2, '2024-01'.match(/(\d{4})-(\d{2})/)[1]);

// P3: the length of that match array
let p3 = null;
check('P3  ...length', p3, '2024-01'.match(/(\d{4})-(\d{2})/).length);

// P4: a non-capturing group
let p4 = null;
check('P4  "ab".match(/(?:a)(b)/).length', p4, 'ab'.match(/(?:a)(b)/).length);

// P5: a group that matched nothing optional
let p5 = null;
check('P5  String("a".match(/a(b)?/)[1])', p5, String('a'.match(/a(b)?/)[1]));

// P6: does a lookahead consume characters?
let p6 = null;
check('P6  "abc".match(/a(?=b)/)[0]', p6, 'abc'.match(/a(?=b)/)[0]);

// P7: matchAll without the g flag
let outcome7;
try { outcome7 = [...'aa'.matchAll(/a/)]; } catch (e) { outcome7 = e.constructor.name; }
let p7 = null;
check('P7  [..."aa".matchAll(/a/)]', p7, outcome7);

log('habit', 'name your groups — (?<year>) beats counting brackets six months later');

report();
