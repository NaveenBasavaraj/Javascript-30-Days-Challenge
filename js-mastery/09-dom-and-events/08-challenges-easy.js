'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build, MiniEvent } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 08 — CHALLENGES, LEVEL 1
 * ==========================================================================*/

function page(spec) {
  const doc = createDocument();
  doc.body.appendChild(build(doc, spec));
  return doc;
}
const LIST = {
  tag: 'ul',
  id: 'list',
  children: [
    { tag: 'li', class: 'item', text: 'apple', attrs: { 'data-id': '1' } },
    { tag: 'li', class: 'item selected', text: 'banana', attrs: { 'data-id': '2' } },
    { tag: 'li', class: 'item', text: 'cherry', attrs: { 'data-id': '3' } },
  ],
};

section('1 — texts of a selection');
/* textsOf(doc, selector) returns the text of every match.        */
function textsOf(doc, selector) {
  // your code here
}
check('all items', textsOf(page(LIST), '.item'), ['apple', 'banana', 'cherry']);
check('none', textsOf(page(LIST), '.nope'), []);

section('2 — select exactly one');
/* selectOnly(doc, id) puts the class 'selected' on the row with that
 * data-id and removes it from every other row. Return the selected text. */
function selectOnly(doc, id) {
  // your code here
}
check('moves the selection', () => {
  const doc = page(LIST);
  const text = selectOnly(doc, '3');
  return [text, doc.querySelectorAll('.selected').length];
}, ['cherry', 1], selectOnly);
check('unknown id clears the selection', () => {
  const doc = page(LIST);
  selectOnly(doc, '99');
  return doc.querySelectorAll('.selected').length;
}, 0, selectOnly);

section('3 — insert in sorted position');
/* insertSorted(doc, text) adds a new '.item' keeping the list
 * alphabetical. Return the resulting order.                      */
function insertSorted(doc, text) {
  // your code here
}
check('middle', insertSorted(page(LIST), 'blueberry'), ['apple', 'banana', 'blueberry', 'cherry']);
check('start', insertSorted(page(LIST), 'aardvark'), ['aardvark', 'apple', 'banana', 'cherry']);
check('end', insertSorted(page(LIST), 'zebra'), ['apple', 'banana', 'cherry', 'zebra']);

section('4 — a toggle button');
/* wireToggle(doc) attaches a click listener to '#toggle' that toggles
 * the 'hidden' class on '#panel', and returns a function reporting
 * whether the panel is hidden.                                   */
function wireToggle(doc) {
  // your code here
}
const PANEL = {
  tag: 'div',
  children: [
    { tag: 'button', id: 'toggle', text: 'Toggle' },
    { tag: 'div', id: 'panel', text: 'content' },
  ],
};
check('starts visible', () => wireToggle(page(PANEL))(), false, wireToggle);
check('one click hides', () => {
  const doc = page(PANEL);
  const isHidden = wireToggle(doc);
  doc.querySelector('#toggle').click();
  return isHidden();
}, true, wireToggle);
check('two clicks show again', () => {
  const doc = page(PANEL);
  const isHidden = wireToggle(doc);
  doc.querySelector('#toggle').click();
  doc.querySelector('#toggle').click();
  return isHidden();
}, false, wireToggle);

section('5 — a live counter');
/* wireCounter(doc) wires '#inc' and '#dec' to change the number shown in
 * '#count', never going below zero. Return a function giving the number. */
function wireCounter(doc) {
  // your code here
}
const COUNTER = {
  tag: 'div',
  children: [
    { tag: 'button', id: 'dec', text: '-' },
    { tag: 'span', id: 'count', text: '0' },
    { tag: 'button', id: 'inc', text: '+' },
  ],
};
check('increments', () => {
  const doc = page(COUNTER);
  const value = wireCounter(doc);
  doc.querySelector('#inc').click();
  doc.querySelector('#inc').click();
  return [value(), doc.querySelector('#count').textContent];
}, [2, '2'], wireCounter);
check('never goes below zero', () => {
  const doc = page(COUNTER);
  const value = wireCounter(doc);
  doc.querySelector('#dec').click();
  return value();
}, 0, wireCounter);

section('6 — filtering a list');
/* filterList(doc, query) hides non-matching '.item' rows by adding the
 * class 'hidden' (case-insensitive substring). Return the visible texts. */
function filterList(doc, query) {
  // your code here
}
check('matches', filterList(page(LIST), 'an'), ['banana']);
check('case-insensitive', filterList(page(LIST), 'APP'), ['apple']);
check('empty query shows everything', filterList(page(LIST), ''), ['apple', 'banana', 'cherry']);
check('no matches', filterList(page(LIST), 'zzz'), []);

section('7 — delegated deletion');
/* wireDelete(doc) attaches ONE listener to '#list'. Clicking a row
 * removes it. Return a function giving the remaining texts.      */
function wireDelete(doc) {
  // your code here
}
check('removes the clicked row', () => {
  const doc = page(LIST);
  const remaining = wireDelete(doc);
  doc.querySelectorAll('.item')[1].click();
  return remaining();
}, ['apple', 'cherry'], wireDelete);
check('works for rows added later', () => {
  const doc = page(LIST);
  const remaining = wireDelete(doc);
  const li = doc.createElement('li');
  li.className = 'item';
  li.textContent = 'damson';
  doc.querySelector('#list').appendChild(li);
  li.click();
  return remaining();
}, ['apple', 'banana', 'cherry'], wireDelete);

section('8 — reading a table');
/* tableToObjects(doc) turns a table with a header row into an array of
 * objects keyed by the header cells.                             */
const TABLE = {
  tag: 'table',
  id: 'data',
  children: [
    { tag: 'tr', class: 'head', children: [{ tag: 'th', text: 'name' }, { tag: 'th', text: 'age' }] },
    { tag: 'tr', children: [{ tag: 'td', text: 'Asha' }, { tag: 'td', text: '30' }] },
    { tag: 'tr', children: [{ tag: 'td', text: 'Ben' }, { tag: 'td', text: '25' }] },
  ],
};
function tableToObjects(doc) {
  // your code here
}
check('rows', tableToObjects(page(TABLE)), [{ name: 'Asha', age: '30' }, { name: 'Ben', age: '25' }]);

section('9 — building a table');
/* objectsToTable(doc, rows) builds a <table> with a header row from the
 * keys of the first object. Return its toHtml() string.          */
function objectsToTable(doc, rows) {
  // your code here
}
check('built', objectsToTable(page({ tag: 'div' }), [{ a: '1', b: '2' }]),
  '<table><tr><th>a</th><th>b</th></tr><tr><td>1</td><td>2</td></tr></table>');
check('no rows', objectsToTable(page({ tag: 'div' }), []), '<table></table>');

section('10 — a breadcrumb from the tree');
/* pathTo(element) returns the tag names from the BODY down to the
 * element, joined by ' > '.                                      */
function pathTo(element) {
  // your code here
}
check('path', () => {
  const doc = page(LIST);
  return pathTo(doc.querySelector('.item'));
}, 'BODY > UL > LI', pathTo);

report();
