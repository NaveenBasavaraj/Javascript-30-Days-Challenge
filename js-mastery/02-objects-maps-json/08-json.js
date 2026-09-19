'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 08 — JSON
 *
 * NOTES:
 *   JSON.stringify(value)              object -> string
 *   JSON.stringify(value, null, 2)     ...pretty-printed with 2-space indent
 *   JSON.stringify(value, ['a','b'])   ...only these keys
 *   JSON.stringify(value, fn)          ...replacer: transform every value
 *   JSON.parse(text)                   string -> object (THROWS on bad input)
 *   JSON.parse(text, fn)               reviver: transform every value on the way in
 *
 *   What JSON cannot carry — know these cold:
 *     undefined and functions   dropped from objects, become null in arrays
 *     Date                      becomes an ISO string, never a Date again
 *     Map / Set                 become {} — their contents are LOST
 *     NaN / Infinity            become null
 *     a circular reference      throws TypeError
 *     BigInt                    throws TypeError
 *
 *   JSON.parse(JSON.stringify(x)) is the old deep-copy trick. It works only
 *   when your data is plain. Prefer structuredClone.
 * ==========================================================================*/

section('Exercise 1 — round trip');
/* toJson({a:1}) -> '{"a":1}'
 * fromJson('{"a":1}') -> { a: 1 }                                */
function toJson(value) {
  // your code here
}
function fromJson(text) {
  // your code here
}
check('toJson', toJson({ a: 1 }), '{"a":1}');
check('fromJson', fromJson('{"a":1}'), { a: 1 });
check('round trip', fromJson(toJson({ a: [1, 2], b: 'x' })), { a: [1, 2], b: 'x' });

section('Exercise 2 — pretty');
/* Indent with 2 spaces.
 * pretty({ a: 1 }) -> '{\n  "a": 1\n}'                           */
function pretty(value) {
  // your code here
}
check('pretty', pretty({ a: 1 }), '{\n  "a": 1\n}');

section('Exercise 3 — safeParse');
/* Bad JSON throws. Return the parsed value, or `fallback` on failure.
 * safeParse('{"a":1}', null) -> { a: 1 }
 * safeParse('not json', null) -> null                            */
function safeParse(text, fallback) {
  // your code here
}
check('good', safeParse('{"a":1}', null), { a: 1 });
check('bad', safeParse('not json', null), null);
check('bad with fallback', safeParse('{oops', {}), {});

section('Exercise 4 — pickToJson (the replacer as a key list)');
/* Only serialise the named keys.
 * pickToJson({ a: 1, b: 2, c: 3 }, ['a','c']) -> '{"a":1,"c":3}'
 * Hint: JSON.stringify accepts an ARRAY of keys as its 2nd argument. */
function pickToJson(obj, keys) {
  // your code here
}
check('pickToJson', pickToJson({ a: 1, b: 2, c: 3 }, ['a', 'c']), '{"a":1,"c":3}');

section('Exercise 5 — redact (the replacer as a function)');
/* Replace the value of any key called 'password' with '***'.
 * redact({ user: 'a', password: 'hunter2' })
 *   -> '{"user":"a","password":"***"}'
 * The replacer is (key, value) => value; return the new value.   */
function redact(obj) {
  // your code here
}
check('redact', redact({ user: 'a', password: 'hunter2' }), '{"user":"a","password":"***"}');
check('redact nested', redact({ a: { password: 'x' } }), '{"a":{"password":"***"}}');

section('Exercise 6 — reviveDates');
/* Parse JSON, turning any string that looks like an ISO date into a
 * real Date object. Use the reviver (2nd argument of JSON.parse).
 * Test: /^\d{4}-\d{2}-\d{2}T/                                    */
function reviveDates(text) {
  // your code here
}
check('is a Date', () => reviveDates('{"at":"2024-01-15T00:00:00.000Z"}').at instanceof Date, true);
check('right time', () => reviveDates('{"at":"2024-01-15T00:00:00.000Z"}').at.getTime(),
  Date.UTC(2024, 0, 15));
check('leaves other strings alone', () => reviveDates('{"n":"hello"}').n, 'hello');

section('Exercise 7 — jsonDeepCopy vs structuredClone');
/* Both make a deep copy. Write each one, then read the checks: they
 * behave differently on a Date.                                  */
function jsonDeepCopy(obj) {
  // your code here
}
function realDeepCopy(obj) {
  // your code here
}
check('json copy is deep', () => {
  const src = { a: { b: 1 } };
  const c = jsonDeepCopy(src);
  c.a.b = 99;
  return src.a.b;
}, 1);
check('json copy turns a Date into a string',
  () => typeof jsonDeepCopy({ d: new Date() }).d, 'string');
check('structuredClone keeps the Date',
  () => realDeepCopy({ d: new Date() }).d instanceof Date, true);

section('Exercise 8 — storable');
/* A Map cannot be JSON.stringified. Convert to something that can be,
 * and back again.
 * mapToJson(new Map([['a',1]])) -> '[["a",1]]'
 * jsonToMap('[["a",1]]') -> Map { 'a' => 1 }                     */
function mapToJson(map) {
  // your code here
}
function jsonToMap(text) {
  // your code here
}
check('mapToJson', mapToJson(new Map([['a', 1]])), '[["a",1]]');
check('jsonToMap', jsonToMap('[["a",1]]'), new Map([['a', 1]]));
check('round trip', () => jsonToMap(mapToJson(new Map([['x', 9]]))), new Map([['x', 9]]));

section('Exercise 9 — isValidJson');
/* True if the string parses, false otherwise.
 * isValidJson('[]') -> true ; isValidJson('{') -> false          */
function isValidJson(text) {
  // your code here
}
check('valid', isValidJson('[]'), true);
check('invalid', isValidJson('{'), false);
check('a bare number is valid JSON', isValidJson('42'), true);

section('Exercise 10 — flattenForCsv');
/* Turn a nested object into a flat one with dotted keys.
 * flattenForCsv({ a: 1, b: { c: 2, d: { e: 3 } } })
 *   -> { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
 * Arrays count as leaf values — do not walk into them.           */
function flattenForCsv(obj) {
  // your code here
}
check('flatten', flattenForCsv({ a: 1, b: { c: 2, d: { e: 3 } } }), { a: 1, 'b.c': 2, 'b.d.e': 3 });
check('array is a leaf', flattenForCsv({ a: [1, 2] }), { a: [1, 2] });

section('PREDICTIONS');

// P1: undefined inside an object
let p1 = null;
check('P1  JSON.stringify({ a: undefined, b: 1 })', p1, JSON.stringify({ a: undefined, b: 1 }));

// P2: undefined inside an array
let p2 = null;
check('P2  JSON.stringify([1, undefined, 2])', p2, JSON.stringify([1, undefined, 2]));

// P3: NaN
let p3 = null;
check('P3  JSON.stringify({ n: NaN })', p3, JSON.stringify({ n: NaN }));

// P4: a function value
let p4 = null;
check('P4  JSON.stringify({ fn: () => 1, a: 1 })', p4, JSON.stringify({ fn: () => 1, a: 1 }));

// P5: circular reference
const circ = { name: 'x' };
circ.self = circ;
let outcome5;
try { outcome5 = JSON.stringify(circ); } catch (e) { outcome5 = e.constructor.name; }
let p5 = null;
check('P5  JSON.stringify(circular)', p5, outcome5);

// P6: what does stringify do to a Set?
let p6 = null;
check('P6  JSON.stringify({ s: new Set([1,2]) })', p6, JSON.stringify({ s: new Set([1, 2]) }));

// P7: parsing an empty string
let outcome7;
try { outcome7 = JSON.parse(''); } catch (e) { outcome7 = e.constructor.name; }
let p7 = null;
check('P7  JSON.parse("")', p7, outcome7);

log('remember', 'JSON carries data, never behaviour or types');

report();
