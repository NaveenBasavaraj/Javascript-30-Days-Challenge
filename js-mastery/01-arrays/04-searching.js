'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 04 — SEARCHING & TESTING
 *
 * NOTES — pick the right tool:
 *   includes(v)          -> true/false   "is this value in here?"
 *   indexOf(v)           -> index or -1  "where is this exact value?"
 *   lastIndexOf(v)       -> index or -1  searching from the end
 *   find(fn)             -> the ITEM or undefined
 *   findIndex(fn)        -> the INDEX or -1
 *   findLast(fn) / findLastIndex(fn)     same, from the end
 *   some(fn)             -> true if AT LEAST ONE passes
 *   every(fn)            -> true if ALL pass (true for an empty array!)
 *   filter(fn)           -> ALL matches as a new array
 *
 *   indexOf/includes compare with === , so they only work for primitives
 *   ({} !== {}). To search objects, use find/findIndex with a callback.
 * ==========================================================================*/

const USERS = [
  { id: 1, name: 'Asha', age: 17, active: true },
  { id: 2, name: 'Ben', age: 34, active: false },
  { id: 3, name: 'Cara', age: 28, active: true },
  { id: 4, name: 'Dev', age: 15, active: true },
];

section('Exercise 1 — hasValue / positionOf');
/* hasValue(['a','b'], 'b') -> true
 * positionOf(['a','b'], 'z') -> -1                               */
function hasValue(arr, value) {
  // your code here
}
function positionOf(arr, value) {
  // your code here
}
check('hasValue yes', hasValue(['a', 'b'], 'b'), true);
check('hasValue no', hasValue(['a', 'b'], 'z'), false);
check('positionOf found', positionOf(['a', 'b'], 'b'), 1);
check('positionOf missing', positionOf(['a', 'b'], 'z'), -1);

section('Exercise 2 — lastPositionOf');
/* lastPositionOf([1, 9, 3, 9], 9) -> 3                           */
function lastPositionOf(arr, value) {
  // your code here
}
check('lastPositionOf', lastPositionOf([1, 9, 3, 9], 9), 3);

section('Exercise 3 — findUserById');
/* Return the user OBJECT with that id, or null if not found.
 * findUserById(USERS, 3) -> { id: 3, name: 'Cara', ... }
 * Hint: find() returns undefined when nothing matches — convert to null. */
function findUserById(users, id) {
  // your code here
}
check('found user', findUserById(USERS, 3), { id: 3, name: 'Cara', age: 28, active: true });
check('missing user', findUserById(USERS, 99), null);

section('Exercise 4 — indexOfUserNamed');
/* Return the index of the first user with that name, or -1.
 * indexOfUserNamed(USERS, 'Ben') -> 1                            */
function indexOfUserNamed(users, name) {
  // your code here
}
check('index found', indexOfUserNamed(USERS, 'Ben'), 1);
check('index missing', indexOfUserNamed(USERS, 'Zoe'), -1);

section('Exercise 5 — some / every');
/* hasAnyMinor(users)  -> true if at least one user is under 18
 * allActive(users)    -> true if every user is active            */
function hasAnyMinor(users) {
  // your code here
}
function allActive(users) {
  // your code here
}
check('hasAnyMinor', hasAnyMinor(USERS), true);
check('hasAnyMinor false', hasAnyMinor([{ age: 20 }, { age: 40 }]), false);
check('allActive', allActive(USERS), false);
check('allActive true', allActive([{ active: true }]), true);

section('Exercise 6 — findLast');
/* Return the LAST even number, or undefined if there is none.
 * lastEven([1, 4, 5, 8, 9]) -> 8                                 */
function lastEven(nums) {
  // your code here
}
check('lastEven', lastEven([1, 4, 5, 8, 9]), 8);
check('lastEven none', () => String(lastEven([1, 3])), 'undefined');

section('Exercise 7 — countOccurrences');
/* How many times does `value` appear?
 * countOccurrences(['a','b','a'], 'a') -> 2                      */
function countOccurrences(arr, value) {
  // your code here
}
check('count 2', countOccurrences(['a', 'b', 'a'], 'a'), 2);
check('count 0', countOccurrences(['a'], 'z'), 0);

section('Exercise 8 — search (case-insensitive contains)');
/* Return all names that CONTAIN the query, ignoring letter case.
 * search(['Asha','Ben','Cara'], 'a') -> ['Asha','Cara']
 * (Ben has no "a"; Asha and Cara do.)                            */
function search(names, query) {
  // your code here
}
check('search a', search(['Asha', 'Ben', 'Cara'], 'a'), ['Asha', 'Cara']);
check('search upper', search(['Asha', 'Ben'], 'BEN'), ['Ben']);
check('search none', search(['Asha'], 'zz'), []);

section('Exercise 9 — isSubset');
/* true if EVERY item of `small` also appears in `big`.
 * isSubset([1,3], [1,2,3]) -> true
 * isSubset([1,9], [1,2,3]) -> false                              */
function isSubset(small, big) {
  // your code here
}
check('subset yes', isSubset([1, 3], [1, 2, 3]), true);
check('subset no', isSubset([1, 9], [1, 2, 3]), false);
check('empty is a subset', isSubset([], [1]), true);

section('PREDICTIONS');

// P1: NaN is famously not equal to itself.
let p1 = null;
check('P1  [NaN].indexOf(NaN)', p1, [NaN].indexOf(NaN));

// P2: ...but includes() uses a slightly different comparison.
let p2 = null;
check('P2  [NaN].includes(NaN)', p2, [NaN].includes(NaN));

// P3: every() on an empty array
let p3 = null;
check('P3  [].every(x => false)', p3, [].every(() => false));

// P4: some() on an empty array
let p4 = null;
check('P4  [].some(x => true)', p4, [].some(() => true));

// P5: searching for an object by value
let p5 = null;
check('P5  [{a:1}].includes({a:1})', p5, [{ a: 1 }].includes({ a: 1 }));

log('lesson', 'objects are compared by identity, not by contents');

report();
