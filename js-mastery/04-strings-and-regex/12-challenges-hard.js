'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * STRINGS 12 — CHALLENGES, LEVEL 2 (final boss)
 *
 * Small parsers and formatters — the kind of thing you end up writing for
 * real, and the kind of thing regex is genuinely good at.
 * ==========================================================================*/

section('1 — parse an .env file');
/* Lines are KEY=value. Ignore blank lines and lines starting with #.
 * Trim whitespace around both sides. Strip surrounding quotes from the
 * value if present. Values may contain '='.                      */
const ENV = `
# database
HOST = localhost
PORT=5432

NAME="my app"
URL=postgres://a=b
`;
function parseEnv(text) {
  // your code here
}
check('parses', parseEnv(ENV), {
  HOST: 'localhost',
  PORT: '5432',
  NAME: 'my app',
  URL: 'postgres://a=b',
});
check('empty input', parseEnv(''), {});

section('2 — a CSV line with quoted fields');
/* Fields are comma-separated, but a quoted field may CONTAIN commas.
 * parseCsvLine('a,"b,c",d') -> ['a', 'b,c', 'd']
 * parseCsvLine('a,,b') -> ['a', '', 'b']
 * Character-by-character with a "inside quotes" flag is the clearest way. */
function parseCsvLine(line) {
  // your code here
}
check('quoted comma', parseCsvLine('a,"b,c",d'), ['a', 'b,c', 'd']);
check('empty field', parseCsvLine('a,,b'), ['a', '', 'b']);
check('no quotes', parseCsvLine('x,y'), ['x', 'y']);
check('all quoted', parseCsvLine('"a","b"'), ['a', 'b']);

section('3 — a tiny markdown renderer');
/* Convert **bold** to <b>bold</b> and *italic* to <i>italic</i>, and
 * `code` to <code>code</code>. Bold must win over italic.
 * md('a **b** and *c*') -> 'a <b>b</b> and <i>c</i>'             */
function md(text) {
  // your code here
}
check('bold', md('a **b**'), 'a <b>b</b>');
check('italic', md('a *b*'), 'a <i>b</i>');
check('code', md('use `npm i`'), 'use <code>npm i</code>');
check('bold wins', md('a **b** and *c*'), 'a <b>b</b> and <i>c</i>');
check('two bolds', md('**a** **b**'), '<b>a</b> <b>b</b>');

section('4 — a duration formatter');
/* formatDuration(0) -> '0s'
 * formatDuration(59) -> '59s'
 * formatDuration(60) -> '1m'
 * formatDuration(3661) -> '1h 1m 1s'
 * formatDuration(3600) -> '1h'
 * Only include the units that are non-zero, biggest first.       */
function formatDuration(seconds) {
  // your code here
}
check('zero', formatDuration(0), '0s');
check('seconds', formatDuration(59), '59s');
check('exact minute', formatDuration(60), '1m');
check('all three', formatDuration(3661), '1h 1m 1s');
check('exact hour', formatDuration(3600), '1h');
check('skips the middle', formatDuration(3601), '1h 1s');

section('5 — a relative time formatter');
/* Given a difference in seconds, describe it.
 *   under 60          -> 'just now'
 *   under an hour     -> 'N minutes ago'   (or '1 minute ago')
 *   under a day       -> 'N hours ago'
 *   otherwise         -> 'N days ago'
 * Always floor the number.                                       */
function timeAgo(secondsAgo) {
  // your code here
}
check('now', timeAgo(30), 'just now');
check('one minute', timeAgo(60), '1 minute ago');
check('minutes', timeAgo(300), '5 minutes ago');
check('hours', timeAgo(7200), '2 hours ago');
check('one hour', timeAgo(3600), '1 hour ago');
check('days', timeAgo(172800), '2 days ago');

section('6 — highlight search terms');
/* Wrap every occurrence of any term in <mark>, case-insensitively, keeping
 * the ORIGINAL casing inside the mark. Terms may contain regex characters,
 * so escape them.
 * highlight('The Cat sat', ['cat']) -> 'The <mark>Cat</mark> sat'  */
function highlight(text, terms) {
  // your code here
}
check('one term', highlight('The Cat sat', ['cat']), 'The <mark>Cat</mark> sat');
check('two terms', highlight('a b c', ['a', 'c']), '<mark>a</mark> b <mark>c</mark>');
check('regex characters are safe', highlight('cost 3.50', ['3.50']), 'cost <mark>3.50</mark>');
check('no terms', highlight('plain', []), 'plain');

section('7 — a word-wrap that honours existing newlines');
/* Wrap to `width`, but a blank line in the input stays a paragraph break.
 * Each paragraph is wrapped independently and joined back with '\n\n'. */
function wrapParagraphs(text, width) {
  // your code here
}
check('two paragraphs', wrapParagraphs('aa bb cc\n\ndd ee', 5), 'aa bb\ncc\n\ndd ee');
check('one paragraph', wrapParagraphs('aa bb cc', 5), 'aa bb\ncc');

section('8 — a query-string builder and parser');
/* build({ q: 'a b', page: 2 }) -> 'q=a%20b&page=2'
 * parse('q=a%20b&page=2') -> { q: 'a b', page: '2' }
 * Use encodeURIComponent / decodeURIComponent. Skip null and undefined
 * values entirely.                                               */
function build(params) {
  // your code here
}
function parse(qs) {
  // your code here
}
check('build', build({ q: 'a b', page: 2 }), 'q=a%20b&page=2');
check('build skips empties', build({ a: 1, b: null, c: undefined }), 'a=1');
check('parse', parse('q=a%20b&page=2'), { q: 'a b', page: '2' });
check('round trip', () => parse(build({ x: 'a&b=c' })), { x: 'a&b=c' });

section('9 — a template engine with filters');
/* render('Hi {name|upper}, {n|pad}', { name: 'asha', n: 7 })
 *   -> 'Hi ASHA, 07'
 * Filters: upper, lower, pad (padStart to 2 with '0').
 * No filter means the raw value. A missing key gives ''.         */
function render(template, values) {
  // your code here
}
check('filters', render('Hi {name|upper}, {n|pad}', { name: 'asha', n: 7 }), 'Hi ASHA, 07');
check('no filter', render('{a}', { a: 'x' }), 'x');
check('lower', render('{a|lower}', { a: 'XY' }), 'xy');
check('missing key', render('{nope}', {}), '');

section('10 — tokenise an arithmetic expression');
/* tokenise('12 + 3*(4-1)')
 *   -> ['12', '+', '3', '*', '(', '4', '-', '1', ')']
 * Numbers may be multi-digit and may have a decimal point.
 * Whitespace is skipped entirely.                                */
function tokenise(expr) {
  // your code here
}
check('mixed', tokenise('12 + 3*(4-1)'), ['12', '+', '3', '*', '(', '4', '-', '1', ')']);
check('decimals', tokenise('1.5+2'), ['1.5', '+', '2']);
check('empty', tokenise('   '), []);

section('11 — diff two strings word by word');
/* wordDiff('the quick fox', 'the slow fox')
 *   -> [{ same: 'the' }, { from: 'quick', to: 'slow' }, { same: 'fox' }]
 * Both inputs have the same number of words — a positional compare is
 * enough.                                                        */
function wordDiff(a, b) {
  // your code here
}
check('one change', wordDiff('the quick fox', 'the slow fox'),
  [{ same: 'the' }, { from: 'quick', to: 'slow' }, { same: 'fox' }]);
check('no change', wordDiff('a b', 'a b'), [{ same: 'a' }, { same: 'b' }]);

section('12 — a pluralising formatter');
/* describe(0, 'file') -> 'no files'
 * describe(1, 'file') -> '1 file'
 * describe(3, 'file') -> '3 files'
 * describe(2, 'box') -> '2 boxes'      — words ending in s, x, z, ch, sh
 *                                        take 'es'
 * describe(2, 'city') -> '2 cities'    — consonant + y becomes ies   */
function describe(n, noun) {
  // your code here
}
check('zero', describe(0, 'file'), 'no files');
check('one', describe(1, 'file'), '1 file');
check('many', describe(3, 'file'), '3 files');
check('es plural', describe(2, 'box'), '2 boxes');
check('ch plural', describe(2, 'match'), '2 matches');
check('y plural', describe(2, 'city'), '2 cities');
check('vowel y stays', describe(2, 'day'), '2 days');

log('finished?', 'that is topic 04 — tell me and we move to `this`, classes and prototypes');
report();
