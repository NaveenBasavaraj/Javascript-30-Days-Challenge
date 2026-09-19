'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build, MiniEvent } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 05 — PROPAGATION & DELEGATION
 *
 * An event does not fire on one element. It travels through THREE phases:
 *
 *   1. CAPTURE   from the root DOWN to the target
 *                (only listeners registered with { capture: true })
 *   2. TARGET    on the element itself
 *   3. BUBBLE    from the target back UP to the root
 *                (the default — this is what you normally use)
 *
 * So clicking a <li> inside a <ul> inside a <div> runs, in order:
 *   div capture, ul capture, li, ul bubble, div bubble
 *
 * CONTROLLING IT
 *   event.stopPropagation()          stop travelling further
 *   event.stopImmediatePropagation() also skip other listeners on THIS
 *                                    element
 *
 * EVENT DELEGATION — the reason bubbling matters. Instead of 500
 * listeners on 500 rows, put ONE on the container and check
 * event.target:
 *
 *   list.addEventListener('click', (e) => {
 *     const item = e.target.closest('.item');
 *     if (!item) return;
 *     ...
 *   });
 *
 * It uses less memory AND works for elements added later — which plain
 * listeners do not.
 * ==========================================================================*/

function makePage() {
  const doc = createDocument();
  doc.body.appendChild(build(doc, {
    tag: 'div',
    id: 'app',
    children: [
      {
        tag: 'ul',
        id: 'list',
        children: [
          { tag: 'li', class: 'item', text: 'one', attrs: { 'data-id': '1' } },
          { tag: 'li', class: 'item', text: 'two', attrs: { 'data-id': '2' } },
        ],
      },
      { tag: 'p', class: 'note', text: 'outside the list' },
    ],
  }));
  return doc;
}

section('Exercise 1 — bubbling');
/* watchBubble(doc, log) attaches bubble listeners to '#app', '#list' and
 * the first '.item', logging 'app', 'list' and 'item'.
 * Clicking the item must log them in bubble order.               */
function watchBubble(doc, log) {
  // your code here
}
check('inner to outer', () => {
  const doc = makePage();
  const log = [];
  watchBubble(doc, log);
  doc.querySelector('.item').click();
  return log;
}, ['item', 'list', 'app'], watchBubble);

section('Exercise 2 — capture');
/* watchCapture(doc, log) attaches CAPTURE listeners to the same three,
 * logging 'app', 'list', 'item'.                                 */
function watchCapture(doc, log) {
  // your code here
}
check('outer to inner', () => {
  const doc = makePage();
  const log = [];
  watchCapture(doc, log);
  doc.querySelector('.item').click();
  return log;
}, ['app', 'list', 'item'], watchCapture);

section('Exercise 3 — both phases together');
/* watchBoth(doc, log) attaches a capture AND a bubble listener to both
 * '#app' and '#list', logging like 'app capture' and 'list bubble'.  */
function watchBoth(doc, log) {
  // your code here
}
check('the full journey', () => {
  const doc = makePage();
  const log = [];
  watchBoth(doc, log);
  doc.querySelector('.item').click();
  return log;
}, ['app capture', 'list capture', 'list bubble', 'app bubble'], watchBoth);

section('Exercise 4 — stopping propagation');
/* stopAtList(doc, log) logs on '#app' and '#list' (both bubble), but the
 * list handler calls stopPropagation, so 'app' never runs.       */
function stopAtList(doc, log) {
  // your code here
}
check('app never hears it', () => {
  const doc = makePage();
  const log = [];
  stopAtList(doc, log);
  doc.querySelector('.item').click();
  return log;
}, ['list'], stopAtList);

section('Exercise 5 — stopImmediatePropagation');
/* twoOnList(doc, log) attaches TWO listeners to '#list'; the first calls
 * stopImmediatePropagation, so the second never runs either.     */
function twoOnList(doc, log) {
  // your code here
}
check('even the sibling listener is skipped', () => {
  const doc = makePage();
  const log = [];
  twoOnList(doc, log);
  doc.querySelector('.item').click();
  return log;
}, ['first'], twoOnList);

section('Exercise 6 — delegation, the basic form');
/* delegate(doc, log) attaches ONE listener to '#list' that logs the
 * data-id of whichever '.item' was clicked.
 * A click that is not on an item must log nothing.               */
function delegate(doc, log) {
  // your code here
}
check('reports the clicked item', () => {
  const doc = makePage();
  const log = [];
  delegate(doc, log);
  doc.querySelectorAll('.item')[1].click();
  return log;
}, ['2'], delegate);
check('ignores clicks elsewhere', () => {
  const doc = makePage();
  const log = [];
  delegate(doc, log);
  doc.querySelector('.note').click();
  return log;
}, [], delegate);

section('Exercise 7 — delegation survives new elements');
/* The whole point. delegateThenAdd(doc, log) attaches the delegated
 * listener FIRST, then adds a brand-new item, then clicks it.
 * A direct listener could not have covered the new element.      */
function delegateThenAdd(doc, log) {
  // your code here
}
check('the new item works too', () => {
  const doc = makePage();
  const log = [];
  delegateThenAdd(doc, log);
  return log;
}, ['3'], delegateThenAdd);

section('Exercise 8 — closest, for clicks on inner elements');
/* Real rows contain spans and icons, so event.target is often a CHILD of
 * the row. delegateWithClosest(doc, log) uses target.closest('.item') so
 * a click on the inner <span> still finds its row.               */
function delegateWithClosest(doc, log) {
  // your code here
}
check('a click on a child still resolves the row', () => {
  const doc = makePage();
  const row = doc.querySelector('.item');
  const span = doc.createElement('span');
  span.textContent = 'label';
  row.textContent = '';
  row.appendChild(span);
  const log = [];
  delegateWithClosest(doc, log);
  span.click();
  return log;
}, ['1'], delegateWithClosest);

section('Exercise 9 — a delegated router');
/* One listener on '#app' routes by action attribute:
 *   <button data-action="delete"> -> calls handlers.delete(element)
 * route(doc, handlers) attaches it. An unknown or missing action does
 * nothing.                                                       */
function route(doc, handlers) {
  // your code here
}
check('routes to the handler', () => {
  const doc = makePage();
  const btn = doc.createElement('button');
  btn.setAttribute('data-action', 'delete');
  btn.setAttribute('data-id', '9');
  doc.querySelector('#app').appendChild(btn);
  const log = [];
  route(doc, { delete: (el) => log.push(`delete ${el.getAttribute('data-id')}`) });
  btn.click();
  return log;
}, ['delete 9'], route);
check('unknown action is ignored', () => {
  const doc = makePage();
  const btn = doc.createElement('button');
  btn.setAttribute('data-action', 'explode');
  doc.querySelector('#app').appendChild(btn);
  const log = [];
  route(doc, { delete: () => log.push('nope') });
  btn.click();
  return log;
}, [], route);

section('Exercise 10 — counting listeners saved');
/* Compare the two approaches on 100 rows.
 * listenerCounts(doc) returns [directCount, delegatedCount] where
 * directCount is how many listeners you WOULD attach one-per-row, and
 * delegatedCount is how many delegation needs.                   */
function listenerCounts(doc) {
  // your code here
}
check('one hundred versus one', () => {
  const doc = makePage();
  const list = doc.querySelector('#list');
  for (let i = 0; i < 98; i++) {
    const li = doc.createElement('li');
    li.className = 'item';
    list.appendChild(li);
  }
  return listenerCounts(doc);
}, [100, 1], listenerCounts);

section('PREDICTIONS');

// P1: which phase is the default?
let p1 = null;
check('P1  addEventListener with no options listens during', p1, 'the bubble phase');

// P2: does a click on a child fire the parent's listener?
const doc2 = makePage();
let fired2 = false;
doc2.querySelector('#list').addEventListener('click', () => { fired2 = true; });
doc2.querySelector('.item').click();
let p2 = null;
check('P2  did the list handler fire for a click on the item?', p2, fired2);

// P3: what is event.target in that parent handler?
const doc3 = makePage();
let target3;
doc3.querySelector('#list').addEventListener('click', (e) => { target3 = e.target.textContent; });
doc3.querySelector('.item').click();
let p3 = null;
check('P3  event.target.textContent', p3, target3);

// P4: does stopPropagation cancel the default action too?
let p4 = null;
check('P4  does stopPropagation also preventDefault?', p4, false);

// P5: will a direct listener fire for an element added afterwards?
let p5 = null;
check('P5  a listener attached to existing rows covers rows added later', p5, false);

log('the habit', 'one listener on the container beats one per row, every time');

report();
