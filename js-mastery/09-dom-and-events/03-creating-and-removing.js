'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 03 — CREATING, INSERTING & REMOVING
 *
 * CREATING
 *   doc.createElement('li')     a detached element — it is nowhere yet
 *   el.textContent = 'x'        fill it
 *   parent.appendChild(el)      NOW it is in the page
 *
 * INSERTING
 *   parent.appendChild(el)         at the end
 *   parent.prepend(el)             at the start
 *   parent.insertBefore(el, ref)   before a specific child
 *   parent.replaceChild(new, old)
 *
 * MOVING, not copying: appending an element that already has a parent
 * REMOVES it from the old place. There is only ever one of it.
 *
 * REMOVING
 *   el.remove()                    modern, removes itself
 *   parent.removeChild(el)         older, needs the parent
 *
 * PERFORMANCE: each insertion into a live document can cost layout work.
 * Build the whole subtree detached, then insert it once. In a browser you
 * would use a DocumentFragment; the principle is "batch your writes".
 * ==========================================================================*/

function makePage() {
  const doc = createDocument();
  doc.body.appendChild(build(doc, {
    tag: 'ul',
    id: 'list',
    children: [
      { tag: 'li', class: 'item', text: 'one' },
      { tag: 'li', class: 'item', text: 'two' },
    ],
  }));
  return doc;
}

section('Exercise 1 — creating an element');
/* makeItem(doc, text) creates an <li> with class 'item' and that text,
 * WITHOUT adding it to the page. Return the element.             */
function makeItem(doc, text) {
  // your code here
}
check('tag', () => makeItem(makePage(), 'x').tagName, 'LI');
check('class and text', () => {
  const el = makeItem(makePage(), 'three');
  return [el.className, el.textContent];
}, ['item', 'three']);
check('not in the page yet', () => String(makeItem(makePage(), 'x').parentNode), 'null');

section('Exercise 2 — appending');
/* addItem(doc, text) creates the item AND appends it to '#list'.
 * Return the number of children afterwards.                      */
function addItem(doc, text) {
  // your code here
}
check('count grows', addItem(makePage(), 'three'), 3);
check('it is last', () => {
  const doc = makePage();
  addItem(doc, 'three');
  return doc.querySelector('#list').lastElementChild.textContent;
}, 'three', addItem);

section('Exercise 3 — prepending');
/* addFirst(doc, text) puts the new item at the START.            */
function addFirst(doc, text) {
  // your code here
}
check('it is first', () => {
  const doc = makePage();
  addFirst(doc, 'zero');
  return doc.querySelector('#list').firstElementChild.textContent;
}, 'zero', addFirst);
check('the others are still there', () => {
  const doc = makePage();
  addFirst(doc, 'zero');
  return doc.querySelectorAll('.item').length;
}, 3, addFirst);

section('Exercise 4 — inserting in the middle');
/* insertAfterFirst(doc, text) puts a new item between the existing two.
 * Use insertBefore with the SECOND child as the reference.       */
function insertAfterFirst(doc, text) {
  // your code here
}
check('order', () => {
  const doc = makePage();
  insertAfterFirst(doc, 'one-and-a-half');
  return [...doc.querySelectorAll('.item')].map((el) => el.textContent);
}, ['one', 'one-and-a-half', 'two'], insertAfterFirst);

section('Exercise 5 — appending MOVES an element');
/* moveFirstToEnd(doc) appends the FIRST item again, which moves it.
 * Return the resulting order — and note the count does not change.  */
function moveFirstToEnd(doc) {
  // your code here
}
check('moved, not copied', moveFirstToEnd(makePage()), ['two', 'one']);
check('count is unchanged', () => {
  const doc = makePage();
  moveFirstToEnd(doc);
  return doc.querySelectorAll('.item').length;
}, 2, moveFirstToEnd);

section('Exercise 6 — removing');
/* removeFirst(doc) removes the first item with el.remove().
 * removeByText(doc, text) removes the item whose text matches, and
 * returns whether it found one.                                  */
function removeFirst(doc) {
  // your code here
}
function removeByText(doc, text) {
  // your code here
}
check('one left', () => {
  const doc = makePage();
  removeFirst(doc);
  return [...doc.querySelectorAll('.item')].map((el) => el.textContent);
}, ['two'], removeFirst);
check('found and removed', removeByText(makePage(), 'two'), true);
check('not found', removeByText(makePage(), 'nope'), false);

section('Exercise 7 — emptying a container');
/* clearList(doc) removes every child of '#list' and returns the count.
 * Two ways: a loop with removeChild, or textContent = ''.        */
function clearList(doc) {
  // your code here
}
check('empty', clearList(makePage()), 0);

section('Exercise 8 — replacing');
/* replaceFirst(doc, text) swaps the first item for a new one with that
 * text, keeping the position.                                    */
function replaceFirst(doc, text) {
  // your code here
}
check('replaced in place', () => {
  const doc = makePage();
  replaceFirst(doc, 'new one');
  return [...doc.querySelectorAll('.item')].map((el) => el.textContent);
}, ['new one', 'two'], replaceFirst);

section('Exercise 9 — building a list from data');
/* renderList(doc, items) clears '#list' then adds one <li class="item">
 * per string. Return the resulting texts.                        */
function renderList(doc, items) {
  // your code here
}
check('renders', renderList(makePage(), ['a', 'b', 'c']), ['a', 'b', 'c']);
check('replaces what was there', () => {
  const doc = makePage();
  renderList(doc, ['only']);
  return doc.querySelectorAll('.item').length;
}, 1, renderList);
check('empty data', renderList(makePage(), []), []);

section('Exercise 10 — build detached, insert once');
/* buildThenInsert(doc, items) creates a NEW <ul>, fills it completely
 * while it is still detached, and appends it to the body only at the
 * very end. Return the number of children it ended up with.
 * (In a browser this is the difference between one layout and fifty.)  */
function buildThenInsert(doc, items) {
  // your code here
}
check('all present', buildThenInsert(makePage(), ['a', 'b', 'c']), 3);
check('it reached the page', () => {
  const doc = makePage();
  buildThenInsert(doc, ['a']);
  return doc.querySelectorAll('ul').length;
}, 2, buildThenInsert);

section('Exercise 11 — an element factory');
/* el(doc, tag, props, children) builds an element in one call:
 *   props may contain className, text, and any data-* or other attributes
 *   children is an array of elements
 * el(doc, 'li', { className: 'item', text: 'x', 'data-id': '1' }) */
function el(doc, tag, props = {}, children = []) {
  // your code here
}
check('simple', () => {
  const doc = makePage();
  const node = el(doc, 'li', { className: 'item', text: 'x' });
  return [node.tagName, node.className, node.textContent];
}, ['LI', 'item', 'x'], el);
check('attributes', () => {
  const doc = makePage();
  return el(doc, 'li', { 'data-id': '7' }).getAttribute('data-id');
}, '7', el);
check('children', () => {
  const doc = makePage();
  const node = el(doc, 'ul', {}, [el(doc, 'li', { text: 'a' }), el(doc, 'li', { text: 'b' })]);
  return node.childElementCount;
}, 2, el);
check('nested text', () => {
  const doc = makePage();
  const node = el(doc, 'ul', {}, [el(doc, 'li', { text: 'a' })]);
  return node.textContent;
}, 'a', el);

section('PREDICTIONS');

// P1: where is a freshly created element?
const doc1 = makePage();
const fresh = doc1.createElement('li');
let p1 = null;
check('P1  String(createElement("li").parentNode)', p1, String(fresh.parentNode));

// P2: appending an element that already has a parent
const doc2 = makePage();
const first = doc2.querySelector('.item');
doc2.body.appendChild(first);
let p2 = null;
check('P2  items left inside #list afterwards', p2, doc2.querySelector('#list').childElementCount);

// P3: does removing an element destroy it?
const doc3 = makePage();
const removed = doc3.querySelector('.item');
removed.remove();
let p3 = null;
check('P3  removed.textContent after remove()', p3, removed.textContent);
log('note P3', 'the element still exists in memory — you can re-insert it');

// P4: setting textContent on a parent with children
const doc4 = makePage();
doc4.querySelector('#list').textContent = 'wiped';
let p4 = null;
check('P4  items remaining', p4, doc4.querySelectorAll('.item').length);

report();
