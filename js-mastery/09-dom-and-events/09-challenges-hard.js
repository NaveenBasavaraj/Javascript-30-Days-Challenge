'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build, MiniEvent } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 09 — CHALLENGES, LEVEL 2 (final boss)
 *
 * Whole widgets, the kind you would actually ship. Each one combines
 * selection, events, delegation, state and rendering.
 * ==========================================================================*/

function page(spec) {
  const doc = createDocument();
  doc.body.appendChild(build(doc, spec));
  return doc;
}

section('1 — a sortable table');
/* makeSortable(doc) makes clicking a <th> sort the rows by that column.
 * • First click on a column sorts ascending, a second click descending.
 * • Sorting a different column starts ascending again.
 * • Numeric-looking columns sort numerically.
 * • The active <th> gets class 'sorted-asc' or 'sorted-desc', and no
 *   other th keeps a sort class.
 * Return a function giving the current first-column values in order.  */
const TABLE = {
  tag: 'table',
  id: 'data',
  children: [
    { tag: 'tr', id: 'head', children: [{ tag: 'th', text: 'name' }, { tag: 'th', text: 'age' }] },
    { tag: 'tr', class: 'row', children: [{ tag: 'td', text: 'Cara' }, { tag: 'td', text: '9' }] },
    { tag: 'tr', class: 'row', children: [{ tag: 'td', text: 'Asha' }, { tag: 'td', text: '30' }] },
    { tag: 'tr', class: 'row', children: [{ tag: 'td', text: 'Ben' }, { tag: 'td', text: '10' }] },
  ],
};
function makeSortable(doc) {
  // your code here
}
check('sorts by name ascending', () => {
  const doc = page(TABLE);
  const names = makeSortable(doc);
  doc.querySelectorAll('th')[0].click();
  return names();
}, ['Asha', 'Ben', 'Cara'], makeSortable);
check('a second click reverses it', () => {
  const doc = page(TABLE);
  const names = makeSortable(doc);
  doc.querySelectorAll('th')[0].click();
  doc.querySelectorAll('th')[0].click();
  return names();
}, ['Cara', 'Ben', 'Asha'], makeSortable);
check('numbers sort numerically', () => {
  const doc = page(TABLE);
  const names = makeSortable(doc);
  doc.querySelectorAll('th')[1].click();
  return names();
}, ['Cara', 'Ben', 'Asha'], makeSortable);
check('the header shows the direction', () => {
  const doc = page(TABLE);
  makeSortable(doc);
  doc.querySelectorAll('th')[0].click();
  return doc.querySelectorAll('th')[0].className;
}, 'sorted-asc', makeSortable);
check('only one header is marked', () => {
  const doc = page(TABLE);
  makeSortable(doc);
  doc.querySelectorAll('th')[0].click();
  doc.querySelectorAll('th')[1].click();
  return [doc.querySelectorAll('th')[0].className, doc.querySelectorAll('th')[1].className];
}, ['', 'sorted-asc'], makeSortable);

section('2 — a tab widget');
/* makeTabs(doc) wires a tab bar:
 * • clicking a [data-tab] button gives it class 'active' and removes it
 *   from the others
 * • the matching [data-panel] gets 'visible', all others lose it
 * • the first tab starts active
 * Return a function giving the id of the visible panel.          */
const TABS = {
  tag: 'div',
  id: 'tabs',
  children: [
    {
      tag: 'div',
      class: 'bar',
      children: [
        { tag: 'button', class: 'tab', text: 'One', attrs: { 'data-tab': 'a' } },
        { tag: 'button', class: 'tab', text: 'Two', attrs: { 'data-tab': 'b' } },
      ],
    },
    { tag: 'div', class: 'panel', attrs: { 'data-panel': 'a' }, text: 'first' },
    { tag: 'div', class: 'panel', attrs: { 'data-panel': 'b' }, text: 'second' },
  ],
};
function makeTabs(doc) {
  // your code here
}
check('first tab starts active', () => {
  const doc = page(TABS);
  const visible = makeTabs(doc);
  return [visible(), doc.querySelectorAll('.tab')[0].className];
}, ['a', 'tab active'], makeTabs);
check('clicking switches', () => {
  const doc = page(TABS);
  const visible = makeTabs(doc);
  doc.querySelectorAll('.tab')[1].click();
  return visible();
}, 'b', makeTabs);
check('only one tab is active', () => {
  const doc = page(TABS);
  makeTabs(doc);
  doc.querySelectorAll('.tab')[1].click();
  return doc.querySelectorAll('.active').length;
}, 1, makeTabs);
check('only one panel is visible', () => {
  const doc = page(TABS);
  makeTabs(doc);
  doc.querySelectorAll('.tab')[1].click();
  return doc.querySelectorAll('.visible').length;
}, 1, makeTabs);

section('3 — a todo app');
/* makeTodoApp(doc) builds a complete component with:
 *   add(text)        appends a row, ignoring blank text
 *   toggle(id)       flips 'done'
 *   remove(id)       deletes the row
 *   setFilter(f)     'all' | 'active' | 'done'
 *   getVisible()     the visible texts, in order
 *   getCount()       { total, active, done }
 * The DOM must reflect every change.                             */
function makeTodoApp(doc) {
  // your code here
}
const ROOT = { tag: 'div', id: 'root' };
check('add and count', () => {
  const app = makeTodoApp(page(ROOT));
  app.add('one');
  app.add('two');
  return [app.getVisible(), app.getCount()];
}, [['one', 'two'], { total: 2, active: 2, done: 0 }], makeTodoApp);
check('blank text is ignored', () => {
  const app = makeTodoApp(page(ROOT));
  app.add('   ');
  return app.getCount().total;
}, 0, makeTodoApp);
check('toggle', () => {
  const app = makeTodoApp(page(ROOT));
  const id = app.add('one');
  app.toggle(id);
  return app.getCount();
}, { total: 1, active: 0, done: 1 }, makeTodoApp);
check('remove', () => {
  const app = makeTodoApp(page(ROOT));
  const id = app.add('one');
  app.add('two');
  app.remove(id);
  return app.getVisible();
}, ['two'], makeTodoApp);
check('filters', () => {
  const app = makeTodoApp(page(ROOT));
  const a = app.add('one');
  app.add('two');
  app.toggle(a);
  app.setFilter('active');
  const active = app.getVisible();
  app.setFilter('done');
  return [active, app.getVisible()];
}, [['two'], ['one']], makeTodoApp);
check('the DOM matches the filter', () => {
  const doc = page(ROOT);
  const app = makeTodoApp(doc);
  const a = app.add('one');
  app.add('two');
  app.toggle(a);
  app.setFilter('done');
  return doc.querySelectorAll('.todo').length;
}, 1, makeTodoApp);

section('4 — an accessible dropdown');
/* makeDropdown(doc) wires a button and a menu:
 * • clicking the button toggles class 'open' on the menu and sets
 *   aria-expanded on the button ('true' / 'false')
 * • clicking an option selects it: the button text becomes the option
 *   text and the menu closes
 * • a click anywhere else in the document closes the menu
 * Return { isOpen, selected }.                                   */
const DROPDOWN = {
  tag: 'div',
  id: 'page',
  children: [
    {
      tag: 'div',
      id: 'dropdown',
      children: [
        { tag: 'button', id: 'trigger', text: 'Choose', attrs: { 'aria-expanded': 'false' } },
        {
          tag: 'ul',
          id: 'menu',
          children: [
            { tag: 'li', class: 'option', text: 'Red', attrs: { 'data-value': 'red' } },
            { tag: 'li', class: 'option', text: 'Blue', attrs: { 'data-value': 'blue' } },
          ],
        },
      ],
    },
    { tag: 'p', id: 'elsewhere', text: 'other content' },
  ],
};
function makeDropdown(doc) {
  // your code here
}
check('starts closed', () => makeDropdown(page(DROPDOWN)).isOpen(), false, makeDropdown);
check('opens', () => {
  const doc = page(DROPDOWN);
  const d = makeDropdown(doc);
  doc.querySelector('#trigger').click();
  return [d.isOpen(), doc.querySelector('#trigger').getAttribute('aria-expanded')];
}, [true, 'true'], makeDropdown);
check('selecting closes and updates', () => {
  const doc = page(DROPDOWN);
  const d = makeDropdown(doc);
  doc.querySelector('#trigger').click();
  doc.querySelectorAll('.option')[1].click();
  return [d.isOpen(), d.selected(), doc.querySelector('#trigger').textContent];
}, [false, 'blue', 'Blue'], makeDropdown);
check('an outside click closes it', () => {
  const doc = page(DROPDOWN);
  const d = makeDropdown(doc);
  doc.querySelector('#trigger').click();
  doc.querySelector('#elsewhere').click();
  return d.isOpen();
}, false, makeDropdown);

section('5 — an undoable list');
/* makeUndoableList(doc) supports add, remove and undo, with the DOM
 * always reflecting the current state.
 *   add(text) / remove(text) / undo() / items()                  */
function makeUndoableList(doc) {
  // your code here
}
check('undo an add', () => {
  const app = makeUndoableList(page(ROOT));
  app.add('a');
  app.add('b');
  app.undo();
  return app.items();
}, ['a'], makeUndoableList);
check('undo a remove', () => {
  const app = makeUndoableList(page(ROOT));
  app.add('a');
  app.add('b');
  app.remove('a');
  app.undo();
  return app.items();
}, ['a', 'b'], makeUndoableList);
check('undo past the start is harmless', () => {
  const app = makeUndoableList(page(ROOT));
  app.undo();
  app.undo();
  return app.items();
}, [], makeUndoableList);
check('the DOM follows', () => {
  const doc = page(ROOT);
  const app = makeUndoableList(doc);
  app.add('a');
  app.add('b');
  app.undo();
  return doc.querySelectorAll('.item').length;
}, 1, makeUndoableList);

section('6 — a virtual list window');
/* Rendering 10,000 rows is slow. windowed(items, start, count) returns
 * only the visible slice, plus the spacer sizes that keep the scrollbar
 * honest.
 * -> { visible, above, below } where above/below are ROW COUNTS.  */
function windowed(items, start, count) {
  // your code here
}
const MANY = Array.from({ length: 100 }, (_, i) => `row ${i}`);
check('middle window', () => {
  const r = windowed(MANY, 10, 3);
  return [r.visible, r.above, r.below];
}, [['row 10', 'row 11', 'row 12'], 10, 87]);
check('at the start', () => {
  const r = windowed(MANY, 0, 2);
  return [r.above, r.below];
}, [0, 98]);
check('past the end clamps', () => {
  const r = windowed(MANY, 98, 5);
  return [r.visible.length, r.below];
}, [2, 0]);

log('finished?', 'that is the DOM — selection, events, delegation and rendering');
report();
