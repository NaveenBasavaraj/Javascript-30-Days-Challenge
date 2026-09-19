'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 10 — REFERENCES, COPIES & IMMUTABLE UPDATES
 *
 * This is the file that prevents the bugs that will confuse you most.
 *
 * NOTES:
 *   An array variable holds a REFERENCE, not the items. `b = a` makes two
 *   names for ONE array — changing b changes a.
 *
 *   SHALLOW copy (top level only): [...a] , a.slice() , Array.from(a)
 *   DEEP copy (all levels):        structuredClone(a)
 *
 *   Arrays are never === unless they are literally the same array.
 *
 *   In React/Redux and most modern code you avoid mutation: build a new
 *   array instead of changing the old one. That is what most of this file
 *   is about.
 * ==========================================================================*/

section('Exercise 1 — see the reference');
/* aliasBug(): declare `const a = [1,2]`, then `const b = a`,
 * push 3 onto b, and return a.  (Yes, a changes. Prove it to yourself.) */
function aliasBug() {
  // your code here
}
check('aliasBug', aliasBug(), [1, 2, 3]);

/* safeCopy(): same thing, but make b an actual copy so a stays [1, 2].
 * Return a.                                                     */
function safeCopy() {
  // your code here
}
check('safeCopy', safeCopy(), [1, 2]);

section('Exercise 2 — arraysEqual');
/* Compare two arrays by CONTENT (same length, same items in order).
 * arraysEqual([1,2], [1,2]) -> true                              */
function arraysEqual(a, b) {
  // your code here
}
check('equal', arraysEqual([1, 2], [1, 2]), true);
check('different order', arraysEqual([1, 2], [2, 1]), false);
check('different length', arraysEqual([1], [1, 2]), false);
check('both empty', arraysEqual([], []), true);

section('Exercise 3 — immutable add / remove');
/* All of these return a NEW array and leave `arr` untouched.
 * added([1,2], 3)        -> [1,2,3]
 * removedAt([1,2,3], 1)  -> [1,3]
 * removedValue([1,2,1], 1) -> [2]      (remove every match)      */
function added(arr, item) {
  // your code here
}
function removedAt(arr, index) {
  // your code here
}
function removedValue(arr, value) {
  // your code here
}
const t3 = [1, 2, 3];
check('added', added(t3, 4), [1, 2, 3, 4]);
check('removedAt', removedAt(t3, 1), [1, 3]);
check('removedValue', removedValue([1, 2, 1], 1), [2]);
check('t3 untouched', t3, [1, 2, 3]);

section('Exercise 4 — immutable update');
/* updatedAt([1,2,3], 1, 99) -> [1,99,3]
 * Do it with map + index. (Then try again with .with() — same result.) */
function updatedAt(arr, index, value) {
  // your code here
}
const t4 = [1, 2, 3];
check('updatedAt', updatedAt(t4, 1, 99), [1, 99, 3]);
check('t4 untouched', t4, [1, 2, 3]);

section('Exercise 5 — immutable update inside objects');
/* Return a new array where the user with `id` has a new `name`.
 * Every OTHER object must be the exact same object (===) — only the
 * matching one is replaced by a copy.
 * Hint: users.map(u => u.id === id ? { ...u, name } : u)         */
function renameUser(users, id, name) {
  // your code here
}
const USERS = [{ id: 1, name: 'Asha' }, { id: 2, name: 'Ben' }];
check('renamed', renameUser(USERS, 2, 'Benny'), [{ id: 1, name: 'Asha' }, { id: 2, name: 'Benny' }]);
check('original untouched', USERS[1].name, 'Ben');
check('untouched objects are reused', () => renameUser(USERS, 2, 'Benny')[0] === USERS[0], true);

section('Exercise 6 — deep copy');
/* Return a copy so deep that mutating any nested part of the copy
 * cannot affect the original. Use structuredClone.
 * deepCopy([{ tags: ['a'] }])                                    */
function deepCopy(arr) {
  // your code here
}
const nested = [{ tags: ['a'] }];
check('deep copy equal', deepCopy(nested), [{ tags: ['a'] }]);
check('nested arrays are new too', () => {
  const c = deepCopy(nested);
  c[0].tags.push('b');
  return nested[0].tags;
}, ['a']);

section('Exercise 7 — sortedCopy');
/* Sort ascending WITHOUT touching the input, using slice() + sort().
 * (This is the everyday fix for "why did my array reorder itself?") */
function sortedCopy(nums) {
  // your code here
}
const t7 = [3, 1, 2];
check('sortedCopy', sortedCopy(t7), [1, 2, 3]);
check('input untouched', t7, [3, 1, 2]);

section('Exercise 8 — freeze');
/* Return Object.freeze(arr). A frozen array silently ignores pushes in
 * sloppy mode and THROWS in strict mode (this file is strict).
 * Write the function, then read prediction P4.                   */
function freeze(arr) {
  // your code here
}
check('freeze returns the array', freeze([1]), [1]);
check('frozen', () => Object.isFrozen(freeze([1])), true);

section('PREDICTIONS');

// P1: identity vs contents
let p1 = null;
check('P1  [1,2] === [1,2]', p1, [1, 2] === [1, 2]);

// P2: what does a const array allow?
const c2 = [1];
c2.push(2);            // allowed? it ran, so yes
let p2 = null;
check('P2  c2 after push (const array)', p2, c2);
log('lesson', 'const locks the VARIABLE, not the contents');

// P3: shallow copy of nested data
const orig3 = [[1], [2]];
const shallow3 = [...orig3];
shallow3[0].push(99);
let p3 = null;
check('P3  orig3[0] after mutating the shallow copy', p3, orig3[0]);

// P4: pushing to a frozen array in strict mode
const f4 = Object.freeze([1]);
let outcome;
try { f4.push(2); outcome = 'pushed'; } catch { outcome = 'throws'; }
let p4 = null;
check('P4  frozen.push(2) in strict mode', p4, outcome);

// P5: does structuredClone handle functions?
let outcome5;
try { structuredClone([() => 1]); outcome5 = 'cloned'; } catch { outcome5 = 'throws'; }
let p5 = null;
check('P5  structuredClone([() => 1])', p5, outcome5);

report();
