'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 12 — CHALLENGES, LEVEL 1
 *
 * No new syntax. Everything from files 01-11, combined.
 * ==========================================================================*/

section('1 — invertSafely');
/* Swap keys and values. When two keys share a value, keep them ALL in an
 * array under that value.
 * invertSafely({ a: 1, b: 2, c: 1 }) -> { 1: ['a','c'], 2: ['b'] }  */
function invertSafely(obj) {
  // your code here
}
check('invertSafely', invertSafely({ a: 1, b: 2, c: 1 }), { 1: ['a', 'c'], 2: ['b'] });

section('2 — deepGet');
/* Read a dotted path, with a fallback.
 * deepGet({ a: { b: { c: 1 } } }, 'a.b.c') -> 1
 * deepGet({}, 'a.b', 'nope') -> 'nope'                           */
function deepGet(obj, path, fallback) {
  // your code here
}
check('found', deepGet({ a: { b: { c: 1 } } }, 'a.b.c'), 1);
check('missing', deepGet({}, 'a.b', 'nope'), 'nope');
check('falsy is kept', deepGet({ a: { b: 0 } }, 'a.b', 'nope'), 0);

section('3 — countWords');
/* Word frequencies, lowercased, split on spaces.
 * countWords('the cat the dog') -> { the: 2, cat: 1, dog: 1 }
 * countWords('') -> {}                                           */
function countWords(sentence) {
  // your code here
}
check('countWords', countWords('the cat The dog'), { the: 2, cat: 1, dog: 1 });
check('empty', countWords(''), {});

section('4 — objectSize');
/* Total number of keys at EVERY level, plus the number of leaf values.
 * objectSize({ a: 1, b: { c: 2 } }) -> { keys: 3, leaves: 2 }
 * (keys: a, b, c — leaves: the values 1 and 2)                   */
function objectSize(obj) {
  // your code here
}
check('nested', objectSize({ a: 1, b: { c: 2 } }), { keys: 3, leaves: 2 });
check('flat', objectSize({ a: 1 }), { keys: 1, leaves: 1 });
check('empty', objectSize({}), { keys: 0, leaves: 0 });

section('5 — mergeCounts');
/* Add up two tally objects.
 * mergeCounts({a:1, b:2}, {b:3, c:1}) -> { a: 1, b: 5, c: 1 }    */
function mergeCounts(a, b) {
  // your code here
}
check('mergeCounts', mergeCounts({ a: 1, b: 2 }, { b: 3, c: 1 }), { a: 1, b: 5, c: 1 });

section('6 — validate');
/* Check an object against a shape of required types. Return an array of
 * problem strings, sorted by field name, or [] when everything is fine.
 *   missing:  "name is required"
 *   wrong type: "age should be number"
 * validate({ name: 'a', age: 'x' }, { name: 'string', age: 'number' })
 *   -> ['age should be number']                                  */
function validate(obj, shape) {
  // your code here
}
check('valid', validate({ name: 'a', age: 1 }, { name: 'string', age: 'number' }), []);
check('wrong type', validate({ name: 'a', age: 'x' }, { name: 'string', age: 'number' }),
  ['age should be number']);
check('missing', validate({ age: 1 }, { name: 'string', age: 'number' }), ['name is required']);
check('both problems', validate({ age: 'x' }, { name: 'string', age: 'number' }),
  ['age should be number', 'name is required']);

section('7 — groupIntoRanges');
/* Bucket scores into grades.
 *   90+ -> 'A', 80-89 -> 'B', 70-79 -> 'C', below 70 -> 'F'
 * grade({ asha: 91, ben: 75, cara: 85, dev: 40 })
 *   -> { A: ['asha'], B: ['cara'], C: ['ben'], F: ['dev'] }
 * Only include grades that actually have someone.                */
function grade(scores) {
  // your code here
}
check('grade', grade({ asha: 91, ben: 75, cara: 85, dev: 40 }),
  { A: ['asha'], B: ['cara'], C: ['ben'], F: ['dev'] });
check('only used grades', grade({ x: 95 }), { A: ['x'] });

section('8 — parseQueryString');
/* 'q=js&page=2&q=node' -> { q: ['js', 'node'], page: '2' }
 * A key seen once holds a string; a repeated key holds an array.
 * '' -> {}                                                       */
function parseQueryString(qs) {
  // your code here
}
check('repeat key', parseQueryString('q=js&page=2&q=node'), { q: ['js', 'node'], page: '2' });
check('single', parseQueryString('a=1'), { a: '1' });
check('empty', parseQueryString(''), {});

section('9 — invertNested');
/* Turn { asha: { js: 5 }, ben: { js: 3, go: 1 } } inside out:
 *   -> { js: { asha: 5, ben: 3 }, go: { ben: 1 } }               */
function invertNested(obj) {
  // your code here
}
check('invertNested', invertNested({ asha: { js: 5 }, ben: { js: 3, go: 1 } }),
  { js: { asha: 5, ben: 3 }, go: { ben: 1 } });

section('10 — removeEmpty');
/* Drop every key whose value is null, undefined, '' or an empty object.
 * Keep 0 and false — they are real values. Recurse into nested objects.
 * removeEmpty({ a: 0, b: null, c: '', d: { e: undefined, f: 1 } })
 *   -> { a: 0, d: { f: 1 } }                                     */
function removeEmpty(obj) {
  // your code here
}
check('removeEmpty', removeEmpty({ a: 0, b: null, c: '', d: { e: undefined, f: 1 } }),
  { a: 0, d: { f: 1 } });
check('keeps false', removeEmpty({ a: false }), { a: false });
check('drops an emptied branch', removeEmpty({ a: { b: null } }), {});

section('11 — toCamelKeys');
/* Rename every key from snake_case to camelCase, at every level.
 * toCamelKeys({ user_name: 'a', deep_one: { in_here: 1 } })
 *   -> { userName: 'a', deepOne: { inHere: 1 } }                 */
function toCamelKeys(obj) {
  // your code here
}
check('toCamelKeys', toCamelKeys({ user_name: 'a', deep_one: { in_here: 1 } }),
  { userName: 'a', deepOne: { inHere: 1 } });
check('leaves camel alone', toCamelKeys({ alreadyFine: 1 }), { alreadyFine: 1 });

section('12 — historyStack');
/* Return { push(state), undo(), current() } with NO shared state between
 * two separate stacks. current() starts as null.
 *   const h = historyStack();
 *   h.push({a:1}); h.push({a:2}); h.undo(); h.current() -> {a:1}
 * undo() on an empty history leaves current() as null.           */
function historyStack() {
  // your code here
}
check('push and read', () => { const h = historyStack(); h.push({ a: 1 }); return h.current(); }, { a: 1 });
check('undo', () => {
  const h = historyStack();
  h.push({ a: 1 }); h.push({ a: 2 }); h.undo();
  return h.current();
}, { a: 1 });
check('starts empty', () => historyStack().current(), null);
check('undo past the start', () => { const h = historyStack(); h.undo(); return h.current(); }, null);
check('independent stacks', () => {
  const a = historyStack(); const b = historyStack();
  a.push({ n: 1 });
  return b.current();
}, null);

report();
