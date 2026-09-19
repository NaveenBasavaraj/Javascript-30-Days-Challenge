'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 09 — IMMUTABLE STATE UPDATES
 *
 * This is the file that makes React, Redux and every undo/history feature
 * make sense. The rule is one sentence:
 *
 *   To change something nested, you must make a new copy of EVERY level
 *   from the root down to the thing you are changing. Untouched branches
 *   are reused as-is.
 *
 *   state -> { ...state, user: { ...state.user, name } }
 *              ^ new       ^ new                   ^ changed
 *            state.settings is NOT copied — it is the same object, on purpose.
 *
 * Why bother? Because `oldState !== newState` then becomes a reliable,
 * instant "did anything change?" test. That is how React decides what to
 * re-render.
 * ==========================================================================*/

const STATE = Object.freeze({
  user: { id: 1, name: 'Asha', prefs: { theme: 'dark', lang: 'en' } },
  todos: [
    { id: 't1', text: 'learn objects', done: false },
    { id: 't2', text: 'learn maps', done: false },
  ],
  filter: 'all',
});

section('Exercise 1 — setFilter');
/* Change one top-level field.
 * setFilter(STATE, 'done').filter -> 'done'
 * Everything else must be the SAME object (===), not a copy.     */
function setFilter(state, filter) {
  // your code here
}
check('changed', () => setFilter(STATE, 'done').filter, 'done');
check('new root object', () => setFilter(STATE, 'done') !== STATE, true, setFilter);
check('todos branch reused', () => setFilter(STATE, 'done').todos === STATE.todos, true, setFilter);

section('Exercise 2 — renameUser (one level deep)');
/* renameUser(STATE, 'Asha R').user.name -> 'Asha R'
 * state.user must be a NEW object, but state.user.prefs must be reused. */
function renameUser(state, name) {
  // your code here
}
check('renamed', () => renameUser(STATE, 'Asha R').user.name, 'Asha R');
check('user is new', () => renameUser(STATE, 'Asha R').user !== STATE.user, true, renameUser);
check('prefs reused', () => renameUser(STATE, 'Asha R').user.prefs === STATE.user.prefs, true, renameUser);
check('id kept', () => renameUser(STATE, 'Asha R').user.id, 1);

section('Exercise 3 — setTheme (two levels deep)');
/* setTheme(STATE, 'light').user.prefs -> { theme: 'light', lang: 'en' }
 * Three spreads: root, user, prefs.                              */
function setTheme(state, theme) {
  // your code here
}
check('theme changed', () => setTheme(STATE, 'light').user.prefs, { theme: 'light', lang: 'en' });
check('name kept', () => setTheme(STATE, 'light').user.name, 'Asha');
check('todos reused', () => setTheme(STATE, 'light').todos === STATE.todos, true, setTheme);
check('source untouched', STATE.user.prefs.theme, 'dark');

section('Exercise 4 — addTodo');
/* Append a todo. The array must be new; the existing todo objects reused.
 * addTodo(STATE, { id:'t3', text:'x', done:false }).todos.length -> 3  */
function addTodo(state, todo) {
  // your code here
}
const NEW_TODO = { id: 't3', text: 'x', done: false };
check('appended', () => addTodo(STATE, NEW_TODO).todos.length, 3);
check('array is new', () => addTodo(STATE, NEW_TODO).todos !== STATE.todos, true, addTodo);
check('existing items reused', () => addTodo(STATE, NEW_TODO).todos[0] === STATE.todos[0], true, addTodo);
check('source untouched', STATE.todos.length, 2);

section('Exercise 5 — removeTodo');
/* removeTodo(STATE, 't1').todos -> just the t2 record             */
function removeTodo(state, id) {
  // your code here
}
check('removed', () => removeTodo(STATE, 't1').todos.map((t) => t.id), ['t2']);
check('missing id changes nothing', () => removeTodo(STATE, 'zz').todos.length, 2);

section('Exercise 6 — toggleTodo');
/* Flip `done` on ONE todo. Only that todo object is new.
 * toggleTodo(STATE, 't2').todos[1].done -> true                  */
function toggleTodo(state, id) {
  // your code here
}
check('toggled', () => toggleTodo(STATE, 't2').todos[1].done, true);
check('other todo reused', () => toggleTodo(STATE, 't2').todos[0] === STATE.todos[0], true, toggleTodo);
check('the toggled one is new', () => toggleTodo(STATE, 't2').todos[1] !== STATE.todos[1], true, toggleTodo);
check('source untouched', STATE.todos[1].done, false);

section('Exercise 7 — updateTodoText');
/* Change the text of one todo by id, keeping its other fields.
 * updateTodoText(STATE, 't1', 'new text').todos[0]
 *   -> { id: 't1', text: 'new text', done: false }               */
function updateTodoText(state, id, text) {
  // your code here
}
check('updated', () => updateTodoText(STATE, 't1', 'new text').todos[0],
  { id: 't1', text: 'new text', done: false });

section('Exercise 8 — setIn (generic, by path)');
/* Set any nested value from a path array, copying each level.
 * setIn(STATE, ['user','prefs','lang'], 'hi').user.prefs.lang -> 'hi'
 * setIn({}, ['a','b'], 1) -> { a: { b: 1 } }
 * Recursion: copy this level, recurse into the rest of the path. */
function setIn(obj, path, value) {
  // your code here
}
check('deep set', () => setIn(STATE, ['user', 'prefs', 'lang'], 'hi').user.prefs.lang, 'hi');
check('sibling kept', () => setIn(STATE, ['user', 'prefs', 'lang'], 'hi').user.prefs.theme, 'dark');
check('creates missing levels', setIn({}, ['a', 'b'], 1), { a: { b: 1 } });
check('single key path', setIn({ a: 1 }, ['a'], 2), { a: 2 });
check('source untouched', STATE.user.prefs.lang, 'en');

section('Exercise 9 — getIn');
/* Read by path, with a fallback when any level is missing.
 * getIn(STATE, ['user','prefs','theme'], 'x') -> 'dark'
 * getIn(STATE, ['nope','deep'], 'x') -> 'x'                      */
function getIn(obj, path, fallback) {
  // your code here
}
check('found', getIn(STATE, ['user', 'prefs', 'theme'], 'x'), 'dark');
check('missing', getIn(STATE, ['nope', 'deep'], 'x'), 'x');
check('falsy value is kept', getIn({ a: { b: 0 } }, ['a', 'b'], 'x'), 0);

section('Exercise 10 — a tiny reducer');
/* Handle three action types; anything else returns the SAME state object.
 *   { type: 'setFilter', filter }
 *   { type: 'addTodo', todo }
 *   { type: 'toggleTodo', id }
 * Reuse the functions you already wrote.                         */
function reducer(state, action) {
  // your code here
}
check('setFilter', () => reducer(STATE, { type: 'setFilter', filter: 'done' }).filter, 'done');
check('addTodo', () => reducer(STATE, { type: 'addTodo', todo: NEW_TODO }).todos.length, 3);
check('toggleTodo', () => reducer(STATE, { type: 'toggleTodo', id: 't1' }).todos[0].done, true);
check('unknown action returns the same object',
  () => reducer(STATE, { type: 'nope' }) === STATE, true, reducer);

section('PREDICTIONS');

// P1: STATE is frozen. What happens to a mutation in strict mode?
let outcome1;
try { STATE.filter = 'x'; outcome1 = 'changed'; } catch (e) { outcome1 = e.constructor.name; }
let p1 = null;
check('P1  STATE.filter = "x" on a frozen object', p1, outcome1);

// P2: is freeze deep?
const f2 = Object.freeze({ inner: { n: 1 } });
f2.inner.n = 99;
let p2 = null;
check('P2  f2.inner.n after mutating through a frozen object', p2, f2.inner.n);

// P3: the whole point of immutable updates
const same = { ...STATE };
let p3 = null;
check('P3  same.todos === STATE.todos', p3, same.todos === STATE.todos);

log('lesson', 'a shallow copy shares every branch it did not rewrite — that is the feature');

report();
