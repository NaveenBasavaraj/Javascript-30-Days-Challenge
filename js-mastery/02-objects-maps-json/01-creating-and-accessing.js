'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 01 — CREATING & ACCESSING
 * Run with:  node 02-objects-maps-json/01-creating-and-accessing.js
 *
 * NOTES:
 *   An object is a bag of key -> value pairs. Keys are strings (or Symbols);
 *   anything else you use as a key gets converted to a string.
 *
 *     obj.name        DOT     — when you know the key while writing the code
 *     obj['name']     BRACKET — when the key is in a variable, or has spaces
 *     obj[key]        that is the whole reason bracket notation exists
 *
 *   { [expression]: value }   COMPUTED key — the key is worked out at runtime
 *   { name }                  SHORTHAND for { name: name }
 *
 *   A missing key gives you undefined, not an error.
 *   But reading THROUGH a missing key does throw:  ({}).a.b  ->  TypeError
 *
 *   'key' in obj      true even when the value is undefined
 *   Object.keys(obj)  own keys, as an array
 * ==========================================================================*/

const USER = {
  id: 7,
  name: { first: 'Asha', last: 'Rao' },
  email: 'asha@example.com',
  'favourite colour': 'teal',
  tags: ['admin', 'beta'],
};

section('Exercise 1 — makePerson (shorthand)');
/* Build { name, age } from the two parameters. Use the shorthand form:
 * write { name, age }, not { name: name, age: age }.
 * makePerson('Ben', 30) -> { name: 'Ben', age: 30 }              */
function makePerson(name, age) {
  // your code here
}
check('makePerson', makePerson('Ben', 30), { name: 'Ben', age: 30 });

section('Exercise 2 — getValue (bracket notation)');
/* Read a key that is only known at runtime.
 * getValue(USER, 'email') -> 'asha@example.com'
 * getValue(USER, 'favourite colour') -> 'teal'   (dot notation cannot do this)
 * getValue(USER, 'nope') -> undefined                            */
function getValue(obj, key) {
  // your code here
}
check('getValue email', getValue(USER, 'email'), 'asha@example.com');
check('getValue spaced key', getValue(USER, 'favourite colour'), 'teal');
check('getValue missing', () => String(getValue(USER, 'nope')), 'undefined', getValue);

section('Exercise 3 — fullName (nested access)');
/* fullName(USER) -> 'Asha Rao'                                   */
function fullName(user) {
  // your code here
}
check('fullName', fullName(USER), 'Asha Rao');

section('Exercise 4 — hasKey');
/* True if the key EXISTS, even when its value is undefined.
 * hasKey({ a: undefined }, 'a') -> true    <- obj.a === undefined would lie
 * hasKey({ a: 1 }, 'b') -> false                                 */
function hasKey(obj, key) {
  // your code here
}
check('hasKey present', hasKey({ a: 1 }, 'a'), true);
check('hasKey undefined value', hasKey({ a: undefined }, 'a'), true);
check('hasKey missing', hasKey({ a: 1 }, 'b'), false);

section('Exercise 5 — countKeys / isEmpty');
/* countKeys({a:1, b:2}) -> 2
 * isEmpty({}) -> true                                            */
function countKeys(obj) {
  // your code here
}
function isEmpty(obj) {
  // your code here
}
check('countKeys', countKeys({ a: 1, b: 2 }), 2);
check('countKeys empty', countKeys({}), 0);
check('isEmpty yes', isEmpty({}), true);
check('isEmpty no', isEmpty({ a: 1 }), false);

section('Exercise 6 — makeEntry (computed key)');
/* Build an object whose KEY comes from a variable.
 * makeEntry('colour', 'red') -> { colour: 'red' }
 * Hint: { [key]: value }                                         */
function makeEntry(key, value) {
  // your code here
}
check('makeEntry', makeEntry('colour', 'red'), { colour: 'red' });
check('makeEntry numeric key', makeEntry(2, 'two'), { 2: 'two' });

section('Exercise 7 — valueOr');
/* Return obj[key], or `fallback` when the key is MISSING.
 * A key that exists with the value 0, '' or null keeps its value.
 * valueOr({ n: 0 }, 'n', 99) -> 0        <- not 99!
 * valueOr({}, 'n', 99) -> 99                                     */
function valueOr(obj, key, fallback) {
  // your code here
}
check('existing zero', valueOr({ n: 0 }, 'n', 99), 0);
check('existing null', valueOr({ n: null }, 'n', 99), null);
check('missing', valueOr({}, 'n', 99), 99);

section('Exercise 8 — describe');
/* describe({ name: 'Ben', age: 30 }) -> 'Ben is 30'              */
function describe(person) {
  // your code here
}
check('describe', describe({ name: 'Ben', age: 30 }), 'Ben is 30');

section('Exercise 9 — nested build');
/* Build this exact shape from the arguments:
 * makeConfig('dark', true)
 *   -> { theme: { name: 'dark', dark: true }, version: 1 }       */
function makeConfig(themeName, isDark) {
  // your code here
}
check('makeConfig', makeConfig('dark', true), { theme: { name: 'dark', dark: true }, version: 1 });

section('Exercise 10 — swapKeysAndValues');
/* invert({ a: 1, b: 2 }) -> { 1: 'a', 2: 'b' }
 * Values become keys. (Remember: object keys are strings, so the
 * checker sees { '1': 'a' } and { 1: 'a' } as the same thing.)   */
function invert(obj) {
  // your code here
}
check('invert', invert({ a: 1, b: 2 }), { 1: 'a', 2: 'b' });

section('PREDICTIONS — guess before you run');

// P1: what is typeof {} ?
let p1 = null;
check('P1  typeof {}', p1, typeof {});

// P2: two objects that look identical
let p2 = null;
check('P2  {a:1} === {a:1}', p2, { a: 1 } === { a: 1 });

// P3: numeric keys
const n3 = { 1: 'one' };
let p3 = null;
check('P3  n3[1] === n3["1"]', p3, n3[1] === n3['1']);

// P4: key ORDER. Integer-like keys sort first, ascending; the rest stay
//     in insertion order. What comes out?
let p4 = null;
check('P4  Object.keys({ b: 1, 2: 2, a: 3, 1: 4 })', p4, Object.keys({ b: 1, 2: 2, a: 3, 1: 4 }));

// P5: reading through a missing key
let outcome5;
try { outcome5 = ({}).a.b; } catch { outcome5 = 'TypeError'; }
let p5 = null;
check('P5  ({}).a.b', p5, outcome5);

// P6: a missing key itself
let p6 = null;
check('P6  String(({}).a)', p6, String(({}).a));

log('remember', 'dot for known keys, brackets for keys in variables');

report();
