'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 05 — TEMPLATE LITERALS & BUILDING TEXT
 *
 * NOTES:
 *   `text ${expression} more`
 *     Any expression goes inside ${}: maths, calls, ternaries, even another
 *     template literal. Statements (if, for) do NOT — use a ternary or call
 *     a function.
 *
 *   Real newlines and indentation inside backticks are KEPT exactly. That is
 *   a blessing for output and a curse for indented source code.
 *
 *   BUILDING A LIST — the three habits, in order of preference:
 *     arr.map(fn).join('\n')            declarative, no separator bugs
 *     arr.reduce((acc, x) => acc + x, '')
 *     let s = ''; for (...) s += x;     fine in JS, engines optimise it
 *
 *   TAGGED TEMPLATE — a function called with the literal's pieces:
 *     tag`a ${1} b`   ->   tag(['a ', ' b'], 1)
 *     The first argument is the array of string chunks; the rest are the
 *     interpolated values. There is always one more chunk than value.
 *     This is how styled-components, graphql`` and html`` work.
 * ==========================================================================*/

section('Exercise 1 — interpolation with expressions');
/* receipt('Pen', 3, 1.5) -> 'Pen: 3 x $1.50 = $4.50'             */
function receipt(item, qty, price) {
  // your code here
}
check('receipt', receipt('Pen', 3, 1.5), 'Pen: 3 x $1.50 = $4.50');

section('Exercise 2 — a ternary inside a template');
/* itemCount(0) -> 'no items'
 * itemCount(1) -> '1 item'
 * itemCount(5) -> '5 items'
 * All three from ONE template literal with ternaries inside it.  */
function itemCount(n) {
  // your code here
}
check('zero', itemCount(0), 'no items');
check('one', itemCount(1), '1 item');
check('many', itemCount(5), '5 items');

section('Exercise 3 — join a list');
/* bullets(['a','b']) ->
 *   '- a\n- b'                                                   */
function bullets(items) {
  // your code here
}
check('bullets', bullets(['a', 'b']), '- a\n- b');
check('one', bullets(['a']), '- a');
check('none', bullets([]), '');

section('Exercise 4 — a numbered list');
/* numbered(['first','second']) -> '1. first\n2. second'          */
function numbered(items) {
  // your code here
}
check('numbered', numbered(['first', 'second']), '1. first\n2. second');

section('Exercise 5 — an English list');
/* andList(['a']) -> 'a'
 * andList(['a','b']) -> 'a and b'
 * andList(['a','b','c']) -> 'a, b and c'
 * andList([]) -> ''                                              */
function andList(items) {
  // your code here
}
check('none', andList([]), '');
check('one', andList(['a']), 'a');
check('two', andList(['a', 'b']), 'a and b');
check('three', andList(['a', 'b', 'c']), 'a, b and c');

section('Exercise 6 — a table row');
/* Each cell padded to a fixed width and joined with ' | '.
 * tableRow(['a','bb','ccc'], 4) -> 'a    | bb   | ccc '          */
function tableRow(cells, width) {
  // your code here
}
check('tableRow', tableRow(['a', 'bb', 'ccc'], 4), 'a    | bb   | ccc ');

section('Exercise 7 — a multi-line block');
/* card({ name: 'Asha', role: 'dev' }) ->
 *   'Name: Asha\nRole: dev'
 * Write it as a single template literal spanning two lines. Careful:
 * indentation inside the backticks becomes part of the string.   */
function card(person) {
  // your code here
}
check('card', card({ name: 'Asha', role: 'dev' }), 'Name: Asha\nRole: dev');
check('no stray spaces', () => card({ name: 'a', role: 'b' }).split('\n')[1], 'Role: b');

section('Exercise 8 — building with reduce');
/* Same as bullets, but built with reduce instead of map + join.
 * bulletsReduce(['a','b']) -> '- a\n- b'                         */
function bulletsReduce(items) {
  // your code here
}
check('bulletsReduce', bulletsReduce(['a', 'b']), '- a\n- b');
check('no leading newline', bulletsReduce(['only']), '- only');

section('Exercise 9 — your first tagged template');
/* Write `raw` so that:  raw`a ${1} b ${2} c`  -> 'a |1| b |2| c'
 * (the literal chunks keep their spaces; only the values get pipes)
 * The tag gets (chunks, ...values). Interleave them with '|'.
 * Remember: chunks.length is always values.length + 1.           */
function raw(chunks, ...values) {
  // your code here
}
check('tagged', raw`a ${1} b ${2} c`, 'a |1| b |2| c');
check('no values', raw`plain`, 'plain');

section('Exercise 10 — a useful tag: safe');
/* `safe` uppercases every INTERPOLATED value but leaves the literal text
 * alone.
 * safe`hello ${'world'}!` -> 'hello WORLD!'                      */
function safe(chunks, ...values) {
  // your code here
}
check('safe', safe`hello ${'world'}!`, 'hello WORLD!');
check('several', safe`${'a'}-${'b'}`, 'A-B');

section('Exercise 11 — a tag that strips indentation');
/* `dedent` removes the common leading spaces from every line and trims
 * the blank first and last lines. Given:
 *     dedent`
 *       line one
 *       line two
 *     `
 * it returns 'line one\nline two'.
 * Steps: join the pieces, split on '\n', drop the first and last lines if
 * they are blank, find the smallest indentation, slice it off each line. */
function dedent(chunks, ...values) {
  // your code here
}
check('dedent', dedent`
      line one
      line two
    `, 'line one\nline two');
check('with a value', dedent`
      name: ${'asha'}
    `, 'name: asha');

section('Exercise 12 — a template renderer');
/* render('Hi {name}, you are {age}', { name: 'Asha', age: 30 })
 *   -> 'Hi Asha, you are 30'
 * A missing key becomes an empty string. Do it with split/join or a
 * loop over the keys — no regex yet.                             */
function render(template, values) {
  // your code here
}
check('render', render('Hi {name}, you are {age}', { name: 'Asha', age: 30 }),
  'Hi Asha, you are 30');
check('missing key', render('Hi {nope}!', {}), 'Hi !');
check('repeated key', render('{a}{a}', { a: 'x' }), 'xx');

section('PREDICTIONS');

// P1: how many chunks for two values?
function countChunks(chunks, ...values) { return [chunks.length, values.length]; }
let p1 = null;
check('P1  countChunks`a ${1} b ${2} c`', p1, countChunks`a ${1} b ${2} c`);

// P2: a template with a value at the very start
function showChunks(chunks) { return chunks; }
let p2 = null;
check('P2  showChunks`${1}x`', p2, showChunks`${1}x`);

// P3: what does an object become inside a template?
let p3 = null;
check('P3  `${{ a: 1 }}`', p3, `${{ a: 1 }}`);

// P4: and an array?
let p4 = null;
check('P4  `${[1, 2]}`', p4, `${[1, 2]}`);

// P5: and null?
let p5 = null;
check('P5  `${null}`', p5, `${null}`);

// P6: nested templates
const inner = 'in';
let p6 = null;
check('P6  `a${`-${inner}-`}b`', p6, `a${`-${inner}-`}b`);

log('the P3 gotcha', 'objects in templates become [object Object] — stringify them yourself');

report();
