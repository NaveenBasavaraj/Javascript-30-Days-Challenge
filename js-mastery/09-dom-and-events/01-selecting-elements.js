'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 01 — FINDING ELEMENTS
 * Run with:  node 09-dom-and-events/01-selecting-elements.js
 *
 * ABOUT THIS TOPIC: Node has no browser, so these files use a small DOM
 * implementation in ../_helpers/mini-dom.js. The API is the real one —
 * createElement, querySelector, classList, addEventListener, bubbling —
 * so everything transfers. What it does NOT have is layout, CSS or
 * rendering. Open that file if you are curious; it is readable.
 *
 * In a browser `document` is a global. Here you make one:
 *   const doc = createDocument();
 *
 * THE SELECTOR METHODS
 *   doc.getElementById('x')            fastest, id only, no '#'
 *   doc.querySelector('.card')         the FIRST match, any CSS selector
 *   doc.querySelectorAll('.card')      ALL matches
 *   el.querySelector('.child')         search INSIDE one element
 *
 *   querySelector returns null when nothing matches — it does not throw.
 *   Reading a property of that null is the single most common DOM error.
 *
 * SELECTOR SYNTAX you will use every day:
 *   'div'            by tag
 *   '#main'          by id
 *   '.card'          by class
 *   '.card.active'   both classes
 *   '[data-id]'      has the attribute
 *   '[type="text"]'  attribute equals
 *   '.list .item'    a descendant, at any depth
 * ==========================================================================*/

/* Every exercise gets this page. Read it once. */
function makePage() {
  const doc = createDocument();
  doc.body.appendChild(build(doc, {
    tag: 'div',
    id: 'app',
    children: [
      { tag: 'h1', class: 'title', text: 'My List' },
      {
        tag: 'ul',
        id: 'items',
        class: 'list',
        children: [
          { tag: 'li', class: 'item done', text: 'Learn arrays', attrs: { 'data-id': '1' } },
          { tag: 'li', class: 'item', text: 'Learn objects', attrs: { 'data-id': '2' } },
          { tag: 'li', class: 'item', text: 'Learn the DOM', attrs: { 'data-id': '3' } },
        ],
      },
      { tag: 'button', id: 'add', class: 'btn primary', text: 'Add' },
      { tag: 'button', class: 'btn', text: 'Clear' },
    ],
  }));
  return doc;
}

section('Exercise 1 — by id');
/* findById(doc) returns the element with id 'items'.
 * Use getElementById — note there is no '#'.                     */
function findById(doc) {
  // your code here
}
check('found', () => findById(makePage()).tagName, 'UL');
check('it is the list', () => findById(makePage()).id, 'items');

section('Exercise 2 — the first match');
/* firstItem(doc) returns the first element matching '.item'.     */
function firstItem(doc) {
  // your code here
}
check('first', () => firstItem(makePage()).textContent, 'Learn arrays');

section('Exercise 3 — all matches');
/* allItems(doc) returns an ARRAY of the text of every '.item'.   */
function allItems(doc) {
  // your code here
}
check('all three', allItems(makePage()), ['Learn arrays', 'Learn objects', 'Learn the DOM']);

section('Exercise 4 — nothing matches');
/* missing(doc) returns what querySelector gives for a selector that
 * matches nothing. Report it as a string with String().          */
function missing(doc) {
  // your code here
}
check('null, not an error', missing(makePage()), 'null');

section('Exercise 5 — the null trap');
/* safeText(doc, selector) returns the element text, or 'not found'
 * when the selector matches nothing. Do not let it throw.        */
function safeText(doc, selector) {
  // your code here
}
check('present', safeText(makePage(), '.title'), 'My List');
check('absent', safeText(makePage(), '.nope'), 'not found');

section('Exercise 6 — two classes');
/* doneItems(doc) returns the text of every element that has BOTH the
 * 'item' and 'done' classes. One selector, no filtering.         */
function doneItems(doc) {
  // your code here
}
check('only the done one', doneItems(makePage()), ['Learn arrays']);

section('Exercise 7 — by attribute');
/* withDataId(doc) returns the count of elements that have a data-id.
 * byDataId(doc, id) returns the one whose data-id equals that value.  */
function withDataId(doc) {
  // your code here
}
function byDataId(doc, id) {
  // your code here
}
check('three have one', withDataId(makePage()), 3);
check('the right one', () => byDataId(makePage(), '2').textContent, 'Learn objects');

section('Exercise 8 — descendants');
/* itemsInList(doc) counts '.item' elements INSIDE '#items', using a
 * descendant selector rather than two calls.                     */
function itemsInList(doc) {
  // your code here
}
check('three', itemsInList(makePage()), 3);

section('Exercise 9 — searching inside an element');
/* Scope the search. textsInside(element, selector) returns the text of
 * every match found WITHIN that element.                         */
function textsInside(element, selector) {
  // your code here
}
check('scoped', () => {
  const doc = makePage();
  return textsInside(doc.querySelector('#items'), '.item');
}, ['Learn arrays', 'Learn objects', 'Learn the DOM']);
check('finds nothing outside its scope', () => {
  const doc = makePage();
  return textsInside(doc.querySelector('#items'), '.title');
}, []);

section('Exercise 10 — a list of buttons');
/* buttonLabels(doc) returns the text of every '.btn', and
 * primaryButton(doc) returns the one that is also '.primary'.    */
function buttonLabels(doc) {
  // your code here
}
function primaryButton(doc) {
  // your code here
}
check('both buttons', buttonLabels(makePage()), ['Add', 'Clear']);
check('the primary one', () => primaryButton(makePage()).id, 'add');

section('Exercise 11 — counting');
/* countMatching(doc, selector) returns how many elements match.  */
function countMatching(doc, selector) {
  // your code here
}
check('items', countMatching(makePage(), '.item'), 3);
check('buttons', countMatching(makePage(), '.btn'), 2);
check('none', countMatching(makePage(), '.nothing'), 0);

section('Exercise 12 — does it match?');
/* isDone(element) returns whether the element matches '.done'.
 * Use element.matches(...) — it is the right tool for "is this the kind
 * of element I care about?", especially in event handlers.       */
function isDone(element) {
  // your code here
}
check('done item', () => isDone(makePage().querySelector('.item')), true);
check('not done', () => isDone(makePage().querySelectorAll('.item')[1]), false);

section('PREDICTIONS — guess before you run');

// P1: what does querySelector return when nothing matches?
const doc1 = makePage();
let p1 = null;
check('P1  String(doc.querySelector(".nope"))', p1, String(doc1.querySelector('.nope')));

// P2: and querySelectorAll?
let p2 = null;
check('P2  doc.querySelectorAll(".nope").length', p2, doc1.querySelectorAll('.nope').length);

// P3: does getElementById take a hash?
let p3 = null;
check('P3  String(doc.getElementById("#app"))', p3, String(doc1.getElementById('#app')));

// P4: how many does querySelector return when three match?
let p4 = null;
check('P4  number of elements querySelector(".item") returns', p4, 1);

// P5: is a querySelectorAll result a real array in a browser?
let p5 = null;
check('P5  in a real browser, querySelectorAll returns a', p5, 'NodeList');
log('note P5', 'a NodeList has forEach but not map or filter — spread it: [...doc.querySelectorAll(x)]');

report();
