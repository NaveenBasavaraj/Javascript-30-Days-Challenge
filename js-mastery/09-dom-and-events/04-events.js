'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build, MiniEvent } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 04 — EVENTS
 *
 *   el.addEventListener(type, handler, options)
 *   el.removeEventListener(type, handler, options)
 *
 * REMOVING NEEDS THE SAME FUNCTION REFERENCE. This does nothing:
 *   el.addEventListener('click', () => f());
 *   el.removeEventListener('click', () => f());   // a DIFFERENT function
 * Keep a named reference, or pass { once: true }.
 *
 * THE EVENT OBJECT
 *   event.type              'click'
 *   event.target            where it STARTED
 *   event.currentTarget     which element's handler is running NOW
 *   event.preventDefault()  stop the browser's default action
 *   event.stopPropagation() stop it travelling further
 *
 * OPTIONS
 *   { once: true }     auto-removes after one call
 *   { capture: true }  run during the capture phase (file 05)
 *
 * In this mini-DOM you dispatch events yourself:
 *   el.click()                             a convenience for a click
 *   el.dispatchEvent(new MiniEvent('x'))   any type
 * In a browser the user does that for you.
 * ==========================================================================*/

function makePage() {
  const doc = createDocument();
  doc.body.appendChild(build(doc, {
    tag: 'div',
    id: 'app',
    children: [
      { tag: 'button', id: 'save', class: 'btn', text: 'Save' },
      { tag: 'button', id: 'cancel', class: 'btn', text: 'Cancel' },
      { tag: 'input', id: 'field', attrs: { type: 'text' } },
    ],
  }));
  return doc;
}

section('Exercise 1 — your first listener');
/* onSave(doc, log) attaches a click listener to '#save' that pushes
 * 'saved' into the log. Return nothing.                          */
function onSave(doc, log) {
  // your code here
}
check('fires on click', () => {
  const doc = makePage();
  const log = [];
  onSave(doc, log);
  doc.querySelector('#save').click();
  return log;
}, ['saved'], onSave);
check('fires every time', () => {
  const doc = makePage();
  const log = [];
  onSave(doc, log);
  doc.querySelector('#save').click();
  doc.querySelector('#save').click();
  return log;
}, ['saved', 'saved'], onSave);
check('not for other buttons', () => {
  const doc = makePage();
  const log = [];
  onSave(doc, log);
  doc.querySelector('#cancel').click();
  return log;
}, [], onSave);

section('Exercise 2 — the event object');
/* describeClick(doc, log) logs `${type} on ${id}` for a click on '#save',
 * reading from the event rather than hardcoding.                 */
function describeClick(doc, log) {
  // your code here
}
check('reads the event', () => {
  const doc = makePage();
  const log = [];
  describeClick(doc, log);
  doc.querySelector('#save').click();
  return log;
}, ['click on save'], describeClick);

section('Exercise 3 — once');
/* onceOnly(doc, log) attaches a listener that runs at most one time,
 * using the { once: true } option.                               */
function onceOnly(doc, log) {
  // your code here
}
check('only once', () => {
  const doc = makePage();
  const log = [];
  onceOnly(doc, log);
  const btn = doc.querySelector('#save');
  btn.click(); btn.click(); btn.click();
  return log;
}, ['clicked'], onceOnly);

section('Exercise 4 — removing a listener');
/* attachRemovable(doc, log) returns a function that, when called,
 * removes the listener it attached. Keep the reference.          */
function attachRemovable(doc, log) {
  // your code here
}
check('works then stops', () => {
  const doc = makePage();
  const log = [];
  const off = attachRemovable(doc, log);
  const btn = doc.querySelector('#save');
  btn.click();
  off();
  btn.click();
  return log;
}, ['click'], attachRemovable);

section('Exercise 5 — the anonymous-function trap');
/* Write it the BROKEN way: attach an arrow, then try to remove a
 * different arrow. Return the log after clicking — the listener is still
 * attached, so it fires.                                         */
function brokenRemoval(doc, log) {
  // your code here
}
check('removal silently fails', () => {
  const doc = makePage();
  const log = [];
  brokenRemoval(doc, log);
  doc.querySelector('#save').click();
  return log;
}, ['still here'], brokenRemoval);
log('the lesson', 'removeEventListener compares by reference, not by what the function does');

section('Exercise 6 — several listeners on one element');
/* twoListeners(doc, log) attaches TWO click listeners to '#save',
 * pushing 'first' and 'second'. Both run, in the order attached.  */
function twoListeners(doc, log) {
  // your code here
}
check('both, in order', () => {
  const doc = makePage();
  const log = [];
  twoListeners(doc, log);
  doc.querySelector('#save').click();
  return log;
}, ['first', 'second'], twoListeners);

section('Exercise 7 — one handler for many elements');
/* labelAll(doc, log) attaches the SAME handler function to every '.btn'
 * so that clicking logs the id of the button clicked. Use
 * event.currentTarget.                                           */
function labelAll(doc, log) {
  // your code here
}
check('each button reports itself', () => {
  const doc = makePage();
  const log = [];
  labelAll(doc, log);
  doc.querySelector('#cancel').click();
  doc.querySelector('#save').click();
  return log;
}, ['cancel', 'save'], labelAll);

section('Exercise 8 — preventDefault');
/* blockDefault(doc) attaches a listener to '#save' that calls
 * preventDefault, then dispatches a click and returns
 * [dispatchResult, event.defaultPrevented].
 * dispatchEvent returns FALSE when the default was prevented.    */
function blockDefault(doc) {
  // your code here
}
check('prevented', blockDefault(makePage()), [false, true]);

section('Exercise 9 — custom events');
/* emitCustom(doc, log) listens for 'user:saved' on '#app' and logs
 * event.detail.name, then dispatches
 *   new MiniEvent('user:saved', { detail: { name: 'Asha' } })
 * (In a browser this is CustomEvent — same idea.)                */
function emitCustom(doc, log) {
  // your code here
}
check('custom event with data', () => {
  const doc = makePage();
  const log = [];
  emitCustom(doc, log);
  return log;
}, ['Asha'], emitCustom);

section('Exercise 10 — a counter');
/* wireCounter(doc) attaches a click listener to '#save' that increments
 * a private count, and returns a function giving the current count.  */
function wireCounter(doc) {
  // your code here
}
check('counts clicks', () => {
  const doc = makePage();
  const count = wireCounter(doc);
  const btn = doc.querySelector('#save');
  btn.click(); btn.click(); btn.click();
  return count();
}, 3, wireCounter);
check('starts at zero', () => wireCounter(makePage())(), 0, wireCounter);

section('Exercise 11 — target vs currentTarget');
/* Attach ONE listener to '#app' and click the button inside it.
 * compareTargets(doc) returns [event.target.id, event.currentTarget.id]. */
function compareTargets(doc) {
  // your code here
}
check('they are different', compareTargets(makePage()), ['save', 'app']);

section('PREDICTIONS');

// P1: do two identical arrows count as the same listener?
let p1 = null;
check('P1  does removeEventListener("click", () => {}) remove an arrow added the same way?', p1, false);

// P2: what is event.target when the handler is on a parent?
let p2 = null;
check('P2  event.target is', p2, 'the element the event started on');

// P3: and event.currentTarget?
let p3 = null;
check('P3  event.currentTarget is', p3, 'the element whose listener is running');

// P4: does addEventListener with the same function twice fire twice?
const doc4 = makePage();
let count4 = 0;
const fn4 = () => { count4++; };
doc4.querySelector('#save').addEventListener('click', fn4);
doc4.querySelector('#save').addEventListener('click', fn4);
doc4.querySelector('#save').click();
let p4 = null;
check('P4  handler calls after adding the same function twice', p4, count4);

// P5: does dispatchEvent run listeners synchronously?
const doc5 = makePage();
const order5 = [];
doc5.querySelector('#save').addEventListener('click', () => order5.push('handler'));
order5.push('before');
doc5.querySelector('#save').click();
order5.push('after');
let p5 = null;
check('P5  the order', p5, order5);

report();
