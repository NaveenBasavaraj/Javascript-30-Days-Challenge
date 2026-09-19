'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 07 — RENDERING PATTERNS
 *
 * How the DOM work in a real app gets organised, without a framework.
 *
 * THE CORE IDEA: state -> render -> DOM. One function turns your data
 * into elements. When the data changes you call it again. You never
 * reach into the DOM to "update one bit" from twelve places.
 *
 *   function render(state) { ... }      the whole view from the whole state
 *
 * Re-rendering everything is simple and, for small lists, fast enough.
 * When it is not, you diff — which is exactly what React does for you.
 *
 * THE PATTERNS HERE
 *   • a component as a function returning an element
 *   • a render function driven by state
 *   • keyed updates, so you only touch what changed
 *   • a template element cloned per row
 *   • separating "build the element" from "put it in the page"
 * ==========================================================================*/

function makeApp() {
  const doc = createDocument();
  doc.body.appendChild(build(doc, { tag: 'div', id: 'root' }));
  return doc;
}

const TODOS = [
  { id: 1, text: 'Learn the DOM', done: true },
  { id: 2, text: 'Build something', done: false },
];

section('Exercise 1 — a component function');
/* TodoItem(doc, todo) returns an <li> with:
 *   class 'todo' plus 'done' when todo.done
 *   data-id set to the id
 *   the text as its content                                      */
function TodoItem(doc, todo) {
  // your code here
}
check('done item', () => {
  const el = TodoItem(makeApp(), TODOS[0]);
  return [el.tagName, el.className, el.getAttribute('data-id'), el.textContent];
}, ['LI', 'todo done', '1', 'Learn the DOM'], TodoItem);
check('undone item', () => TodoItem(makeApp(), TODOS[1]).className, 'todo', TodoItem);

section('Exercise 2 — a list component');
/* TodoList(doc, todos) returns a <ul class="todo-list"> containing one
 * TodoItem per todo.                                             */
function TodoList(doc, todos) {
  // your code here
}
check('structure', () => {
  const el = TodoList(makeApp(), TODOS);
  return [el.tagName, el.className, el.childElementCount];
}, ['UL', 'todo-list', 2], TodoList);
check('empty list', () => TodoList(makeApp(), []).childElementCount, 0, TodoList);

section('Exercise 3 — render into the page');
/* render(doc, todos) clears '#root' and puts a fresh TodoList inside.
 * Return the number of '.todo' elements in the document.         */
function render(doc, todos) {
  // your code here
}
check('renders', render(makeApp(), TODOS), 2);
check('re-rendering replaces rather than appends', () => {
  const doc = makeApp();
  render(doc, TODOS);
  render(doc, TODOS);
  return doc.querySelectorAll('.todo').length;
}, 2, render);
check('rendering fewer items', () => {
  const doc = makeApp();
  render(doc, TODOS);
  render(doc, [TODOS[0]]);
  return doc.querySelectorAll('.todo').length;
}, 1, render);

section('Exercise 4 — an empty state');
/* renderWithEmpty(doc, todos) renders the list, or a
 * <p class="empty">Nothing to do</p> when there are none.        */
function renderWithEmpty(doc, todos) {
  // your code here
}
check('with items', () => {
  const doc = makeApp();
  renderWithEmpty(doc, TODOS);
  return doc.querySelectorAll('.empty').length;
}, 0, renderWithEmpty);
check('without items', () => {
  const doc = makeApp();
  renderWithEmpty(doc, []);
  return doc.querySelector('.empty').textContent;
}, 'Nothing to do', renderWithEmpty);

section('Exercise 5 — state plus render');
/* makeApp2(doc) returns { getState, setState } where setState merges the
 * change and RE-RENDERS automatically.
 * State shape: { todos: [] }.                                    */
function makeStatefulApp(doc) {
  // your code here
}
check('initial render', () => {
  const doc = makeApp();
  makeStatefulApp(doc);
  return doc.querySelectorAll('.todo').length;
}, 0, makeStatefulApp);
check('setState re-renders', () => {
  const doc = makeApp();
  const app = makeStatefulApp(doc);
  app.setState({ todos: TODOS });
  return doc.querySelectorAll('.todo').length;
}, 2, makeStatefulApp);
check('state is readable', () => {
  const doc = makeApp();
  const app = makeStatefulApp(doc);
  app.setState({ todos: [TODOS[0]] });
  return app.getState().todos.length;
}, 1, makeStatefulApp);

section('Exercise 6 — updating just one row');
/* Re-rendering everything loses focus and scroll position. Sometimes you
 * update in place.
 * toggleRow(doc, id) flips the 'done' class on the row with that data-id
 * and returns its className.                                     */
function toggleRow(doc, id) {
  // your code here
}
check('toggles on', () => {
  const doc = makeApp();
  render(doc, TODOS);
  return toggleRow(doc, 2);
}, 'todo done', toggleRow);
check('toggles off', () => {
  const doc = makeApp();
  render(doc, TODOS);
  return toggleRow(doc, 1);
}, 'todo', toggleRow);
check('unknown id', () => {
  const doc = makeApp();
  render(doc, TODOS);
  return toggleRow(doc, 99);
}, null, toggleRow);

section('Exercise 7 — a keyed update');
/* reconcile(doc, todos) updates the existing list to match the data
 * WITHOUT rebuilding rows that already exist:
 *   • rows whose id is gone are removed
 *   • new ids are appended
 *   • surviving rows keep their identity (the SAME element object)
 * Return the resulting data-ids in order.                        */
function reconcile(doc, todos) {
  // your code here
}
check('adds and removes', () => {
  const doc = makeApp();
  render(doc, TODOS);
  return reconcile(doc, [
    { id: 2, text: 'Build something', done: false },
    { id: 3, text: 'Ship it', done: false },
  ]);
}, ['2', '3'], reconcile);
check('surviving rows are the same elements', () => {
  const doc = makeApp();
  render(doc, TODOS);
  const before = doc.querySelector('[data-id="2"]');
  reconcile(doc, [{ id: 2, text: 'Build something', done: false }]);
  const after = doc.querySelector('[data-id="2"]');
  return before === after;
}, true, reconcile);
check('starting from empty', () => {
  const doc = makeApp();
  render(doc, []);
  return reconcile(doc, TODOS);
}, ['1', '2'], reconcile);

section('Exercise 8 — a template function');
/* renderTemplate(template, data) replaces {{key}} placeholders.
 * A missing key becomes an empty string.                         */
function renderTemplate(template, data) {
  // your code here
}
check('fills in', renderTemplate('<li>{{text}} ({{id}})</li>', { text: 'a', id: 1 }), '<li>a (1)</li>');
check('missing key', renderTemplate('{{nope}}!', {}), '!');
check('repeated key', renderTemplate('{{a}}{{a}}', { a: 'x' }), 'xx');

section('Exercise 9 — a filtered view');
/* renderFiltered(doc, todos, filter) renders only the matching todos:
 *   'all' | 'done' | 'active'                                    */
function renderFiltered(doc, todos, filter) {
  // your code here
}
check('all', renderFiltered(makeApp(), TODOS, 'all'), 2);
check('done only', renderFiltered(makeApp(), TODOS, 'done'), 1);
check('active only', renderFiltered(makeApp(), TODOS, 'active'), 1);

section('Exercise 10 — counting DOM writes');
/* Measure the cost. countWrites(todos) returns how many appendChild
 * calls each strategy makes for a 3-item list:
 *   [fullRebuild, keyedUpdateWithNoChanges]
 * A full rebuild appends every row again; a keyed update appends none.  */
function countWrites(todos) {
  // your code here
}
check('rebuild versus keyed', countWrites(TODOS.concat({ id: 3, text: 'c', done: false })), [3, 0]);

section('PREDICTIONS');

// P1: what does re-rendering a whole list cost the user?
let p1 = null;
check('P1  a full re-render loses', p1, 'focus and scroll position');

// P2: why do frameworks ask for a key?
let p2 = null;
check('P2  keys let the framework', p2, 'match old elements to new data');

// P3: is innerHTML safe for rendering user text?
let p3 = null;
check('P3  is innerHTML safe for user-supplied text?', p3, false);

// P4: how many times should a render function read the DOM?
let p4 = null;
check('P4  a render function should treat the DOM as', p4, 'an output, not a source of truth');

log('the takeaway', 'keep state in JavaScript and derive the DOM from it — never the reverse');

report();
