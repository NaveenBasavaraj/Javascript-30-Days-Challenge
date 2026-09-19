'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 02 — READING & CHANGING ELEMENTS
 *
 * TEXT
 *   el.textContent      all the text inside, including descendants.
 *                       Setting it REPLACES everything inside.
 *   el.innerHTML        the markup. Setting it parses HTML — which is how
 *                       cross-site scripting happens. Never put user input
 *                       through innerHTML; use textContent.
 *
 * ATTRIBUTES vs PROPERTIES — the distinction that confuses everyone:
 *   el.getAttribute('value')   what the HTML SAYS
 *   el.value                   what the element currently IS
 *   Type something into an input and the attribute still shows the
 *   original; the property shows what the user typed.
 *
 * CLASSES — never touch className with string surgery.
 *   el.classList.add('a', 'b')
 *   el.classList.remove('a')
 *   el.classList.toggle('a')          returns whether it is now present
 *   el.classList.toggle('a', force)   add when force is true
 *   el.classList.contains('a')
 *
 * DATA ATTRIBUTES
 *   <li data-user-id="7">  ->  el.dataset.userId === '7'
 *   Always strings. Convert what you read.
 * ==========================================================================*/

function makePage() {
  const doc = createDocument();
  doc.body.appendChild(build(doc, {
    tag: 'div',
    id: 'card',
    class: 'card featured',
    attrs: { 'data-user-id': '7', 'data-role': 'admin' },
    children: [
      { tag: 'h2', class: 'name', text: 'Asha Rao' },
      { tag: 'p', class: 'bio', text: 'Engineer' },
      { tag: 'span', class: 'badge', text: '3' },
    ],
  }));
  return doc;
}

section('Exercise 1 — reading text');
/* nameOf(doc) returns the text of '.name'.
 * allText(doc) returns the text of the whole '#card', which concatenates
 * every descendant's text.                                       */
function nameOf(doc) {
  // your code here
}
function allText(doc) {
  // your code here
}
check('one element', nameOf(makePage()), 'Asha Rao');
check('everything inside', allText(makePage()), 'Asha RaoEngineer3');

section('Exercise 2 — changing text');
/* rename(doc, newName) sets the '.name' text and returns the element's
 * new textContent.                                               */
function rename(doc, newName) {
  // your code here
}
check('changed', rename(makePage(), 'Ben Cole'), 'Ben Cole');
check('and it really is in the tree', () => {
  const doc = makePage();
  rename(doc, 'Ben Cole');
  return doc.querySelector('.name').textContent;
}, 'Ben Cole', rename);

section('Exercise 3 — setting text wipes the children');
/* Prove it. wipeChildren(doc) sets '#card' textContent to 'gone' and
 * returns [childCount, text].                                    */
function wipeChildren(doc) {
  // your code here
}
check('children are replaced', wipeChildren(makePage()), [0, 'gone']);
log('the lesson', 'textContent = replaces the entire contents, not just the text');

section('Exercise 4 — attributes');
/* readRole(doc) returns the data-role attribute of '#card'.
 * setRole(doc, role) sets it and returns the new value.
 * hasRole(doc) returns whether the attribute exists.
 * dropRole(doc) removes it and returns whether it still exists.  */
function readRole(doc) {
  // your code here
}
function setRole(doc, role) {
  // your code here
}
function hasRole(doc) {
  // your code here
}
function dropRole(doc) {
  // your code here
}
check('read', readRole(makePage()), 'admin');
check('write', setRole(makePage(), 'editor'), 'editor');
check('has', hasRole(makePage()), true);
check('removed', dropRole(makePage()), false);
check('a missing attribute reads as null', () => String(makePage().querySelector('#card').getAttribute('nope')), 'null', readRole);

section('Exercise 5 — the dataset');
/* userId(doc) returns the data-user-id as a NUMBER.
 * datasetKeys(doc) returns the sorted dataset keys of '#card'.
 * Note the camelCase conversion: data-user-id -> userId.         */
function userId(doc) {
  // your code here
}
function datasetKeys(doc) {
  // your code here
}
check('converted to a number', userId(makePage()), 7);
check('camelCased keys', datasetKeys(makePage()), ['role', 'userId']);

section('Exercise 6 — classList basics');
/* hasClass(el, name), addClass(el, name), removeClass(el, name) — each
 * returns the element's className afterwards (or the boolean for has).  */
function hasClass(el, name) {
  // your code here
}
function addClass(el, name) {
  // your code here
}
function removeClass(el, name) {
  // your code here
}
check('has', () => hasClass(makePage().querySelector('#card'), 'featured'), true);
check('does not have', () => hasClass(makePage().querySelector('#card'), 'nope'), false);
check('add', () => addClass(makePage().querySelector('#card'), 'wide'), 'card featured wide');
check('remove', () => removeClass(makePage().querySelector('#card'), 'featured'), 'card');

section('Exercise 7 — toggle');
/* toggleClass(el, name) flips it and returns whether it is now present.
 * forceClass(el, name, on) adds or removes based on the boolean.  */
function toggleClass(el, name) {
  // your code here
}
function forceClass(el, name, on) {
  // your code here
}
check('toggle on', () => toggleClass(makePage().querySelector('#card'), 'open'), true);
check('toggle off', () => toggleClass(makePage().querySelector('#card'), 'featured'), false);
check('force on', () => {
  const el = makePage().querySelector('#card');
  forceClass(el, 'x', true);
  return el.classList.contains('x');
}, true, forceClass);
check('force off', () => {
  const el = makePage().querySelector('#card');
  forceClass(el, 'featured', false);
  return el.classList.contains('featured');
}, false, forceClass);

section('Exercise 8 — a state class');
/* setState(el, state) removes every 'state-*' class and adds
 * `state-${state}`. This is the pattern for driving CSS from JavaScript. */
function setState(el, state) {
  // your code here
}
check('sets', () => {
  const el = makePage().querySelector('#card');
  setState(el, 'loading');
  return el.className;
}, 'card featured state-loading', setState);
check('replaces the previous state', () => {
  const el = makePage().querySelector('#card');
  setState(el, 'loading');
  setState(el, 'ready');
  return el.className;
}, 'card featured state-ready', setState);

section('Exercise 9 — a safe text renderer');
/* Setting innerHTML from user input is how XSS happens.
 * renderSafely(el, userInput) puts the input in as TEXT, so markup is
 * shown, not executed. Return the resulting textContent.         */
function renderSafely(el, userInput) {
  // your code here
}
check('markup stays text', () => renderSafely(makePage().querySelector('.bio'), '<img src=x onerror=alert(1)>'),
  '<img src=x onerror=alert(1)>');

section('Exercise 10 — reading a group');
/* summarise(doc) returns
 *   { name, bio, badge: <number>, classes: [sorted class names] }  */
function summarise(doc) {
  // your code here
}
check('summary', summarise(makePage()), {
  name: 'Asha Rao',
  bio: 'Engineer',
  badge: 3,
  classes: ['card', 'featured'],
});

section('PREDICTIONS');

// P1: what type is a dataset value?
const doc1 = makePage();
let p1 = null;
check('P1  typeof card.dataset.userId', p1, typeof doc1.querySelector('#card').dataset.userId);

// P2: reading an attribute that is not there
let p2 = null;
check('P2  String(el.getAttribute("missing"))', p2, String(doc1.querySelector('#card').getAttribute('missing')));

// P3: does classList.add twice add it twice?
const el3 = doc1.querySelector('.name');
el3.classList.add('x');
el3.classList.add('x');
let p3 = null;
check('P3  className after adding "x" twice', p3, el3.className);

// P4: what does toggle return?
const el4 = doc1.querySelector('.bio');
let p4 = null;
check('P4  el.classList.toggle("new")', p4, el4.classList.toggle('new'));

// P5: which should you use for untrusted text?
let p5 = null;
check('P5  the safe property for user input is', p5, 'textContent');

report();
