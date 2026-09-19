'use strict';
const { check, section, log, report } = require('../_helpers/check');
const { createDocument, build, MiniEvent } = require('../_helpers/mini-dom');

/* ============================================================================
 * DOM 06 — FORMS & INPUT
 *
 * Inputs are where the attribute/property split really bites:
 *   input.value              what is in the box RIGHT NOW
 *   input.getAttribute('value')   the original HTML, unchanged by typing
 *   checkbox.checked         boolean, a property
 *   select.value             the selected option's value
 *
 * THE EVENTS
 *   'input'    every keystroke — use this for live feedback
 *   'change'   when the value is committed (blur for text, immediately
 *              for checkboxes and selects)
 *   'submit'   on the FORM, not the button
 *   'focus' / 'blur'
 *
 * ALWAYS preventDefault on submit in a single-page app, or the browser
 * navigates away and your JavaScript never finishes.
 *
 * VALIDATE ON THE SERVER TOO. Client-side validation is a convenience for
 * honest users, not a security control.
 * ==========================================================================*/

function makeForm() {
  const doc = createDocument();
  doc.body.appendChild(build(doc, {
    tag: 'form',
    id: 'signup',
    children: [
      { tag: 'input', id: 'name', attrs: { type: 'text', name: 'name', value: 'initial' } },
      { tag: 'input', id: 'email', attrs: { type: 'email', name: 'email' } },
      { tag: 'input', id: 'terms', attrs: { type: 'checkbox', name: 'terms' } },
      { tag: 'span', id: 'error', class: 'error' },
      { tag: 'button', id: 'submit', attrs: { type: 'submit' }, text: 'Sign up' },
    ],
  }));
  const nameInput = doc.querySelector('#name');
  nameInput.value = 'initial';       // the property starts matching the attribute
  return doc;
}

section('Exercise 1 — value is a property');
/* typeInto(doc, text) sets the '#name' input's VALUE (as typing would)
 * and returns [property, attribute].
 * The attribute keeps the original — that is the whole lesson.   */
function typeInto(doc, text) {
  // your code here
}
check('property changes, attribute does not', typeInto(makeForm(), 'Asha'), ['Asha', 'initial']);

section('Exercise 2 — reading a form');
/* readForm(doc) returns { name, email, terms } from the live properties.
 * terms is the boolean `checked`.                                */
function readForm(doc) {
  // your code here
}
check('defaults', readForm(makeForm()), { name: 'initial', email: '', terms: false });
check('after input', () => {
  const doc = makeForm();
  doc.querySelector('#name').value = 'Asha';
  doc.querySelector('#email').value = 'a@x.com';
  doc.querySelector('#terms').checked = true;
  return readForm(doc);
}, { name: 'Asha', email: 'a@x.com', terms: true }, readForm);

section('Exercise 3 — the input event');
/* liveMirror(doc, log) listens for 'input' on '#name' and logs the
 * current value each time. Then it simulates two keystrokes.     */
function liveMirror(doc, log) {
  // your code here
}
check('logs each change', () => {
  const doc = makeForm();
  const log = [];
  liveMirror(doc, log);
  return log;
}, ['A', 'As'], liveMirror);

section('Exercise 4 — submitting');
/* onSubmit(doc, log) listens for 'submit' on the FORM, calls
 * preventDefault, and logs 'submitted'. Then dispatches a submit event
 * and returns whether the default was prevented.                 */
function onSubmit(doc, log) {
  // your code here
}
check('handled and prevented', () => {
  const doc = makeForm();
  const log = [];
  const prevented = onSubmit(doc, log);
  return [log, prevented];
}, [['submitted'], true], onSubmit);

section('Exercise 5 — validation');
/* validate(values) returns an object of field -> message for every
 * problem:
 *   name empty or blank   -> 'name is required'
 *   email without an '@'  -> 'email is invalid'   (empty is also invalid)
 *   terms not checked     -> 'you must accept the terms'
 * A valid form gives {}.                                         */
function validate(values) {
  // your code here
}
check('valid', validate({ name: 'Asha', email: 'a@x.com', terms: true }), {});
check('all wrong', validate({ name: '  ', email: 'nope', terms: false }), {
  name: 'name is required',
  email: 'email is invalid',
  terms: 'you must accept the terms',
});
check('empty email', () => validate({ name: 'a', email: '', terms: true }).email, 'email is invalid', validate);

section('Exercise 6 — showing an error');
/* showError(doc, message) puts the message into '#error' and adds a
 * 'visible' class. clearError(doc) empties it and removes the class.  */
function showError(doc, message) {
  // your code here
}
function clearError(doc) {
  // your code here
}
check('shown', () => {
  const doc = makeForm();
  showError(doc, 'bad email');
  const el = doc.querySelector('#error');
  return [el.textContent, el.classList.contains('visible')];
}, ['bad email', true], showError);
check('cleared', () => {
  const doc = makeForm();
  showError(doc, 'bad email');
  clearError(doc);
  const el = doc.querySelector('#error');
  return [el.textContent, el.classList.contains('visible')];
}, ['', false], clearError);

section('Exercise 7 — wiring it together');
/* wireForm(doc) attaches a submit handler that validates the live form
 * and either shows the FIRST error or logs a success.
 * It returns a function giving the submissions array.            */
function wireForm(doc) {
  // your code here
}
check('blocks an invalid form', () => {
  const doc = makeForm();
  const submissions = wireForm(doc);
  doc.querySelector('#name').value = '';
  doc.querySelector('#signup').dispatchEvent(new MiniEvent('submit'));
  return [submissions(), doc.querySelector('#error').textContent];
}, [[], 'name is required'], wireForm);
check('accepts a valid one', () => {
  const doc = makeForm();
  const submissions = wireForm(doc);
  doc.querySelector('#name').value = 'Asha';
  doc.querySelector('#email').value = 'a@x.com';
  doc.querySelector('#terms').checked = true;
  doc.querySelector('#signup').dispatchEvent(new MiniEvent('submit'));
  return submissions();
}, [{ name: 'Asha', email: 'a@x.com', terms: true }], wireForm);
check('clears a previous error on success', () => {
  const doc = makeForm();
  const submissions = wireForm(doc);
  doc.querySelector('#name').value = '';
  doc.querySelector('#signup').dispatchEvent(new MiniEvent('submit'));
  doc.querySelector('#name').value = 'Asha';
  doc.querySelector('#email').value = 'a@x.com';
  doc.querySelector('#terms').checked = true;
  doc.querySelector('#signup').dispatchEvent(new MiniEvent('submit'));
  return doc.querySelector('#error').textContent;
}, '', wireForm);

section('Exercise 8 — disabling while submitting');
/* setBusy(doc, busy) sets the submit button's `disabled` attribute and
 * its text ('Sending...' when busy, 'Sign up' when not).         */
function setBusy(doc, busy) {
  // your code here
}
check('busy', () => {
  const doc = makeForm();
  setBusy(doc, true);
  const btn = doc.querySelector('#submit');
  return [btn.hasAttribute('disabled'), btn.textContent];
}, [true, 'Sending...'], setBusy);
check('idle again', () => {
  const doc = makeForm();
  setBusy(doc, true);
  setBusy(doc, false);
  const btn = doc.querySelector('#submit');
  return [btn.hasAttribute('disabled'), btn.textContent];
}, [false, 'Sign up'], setBusy);

section('Exercise 9 — serialising a form');
/* serialise(doc) returns a query string of the text inputs with a
 * non-empty value, in document order: 'name=Asha&email=a%40x.com'
 * Use encodeURIComponent.                                        */
function serialise(doc) {
  // your code here
}
check('encoded', () => {
  const doc = makeForm();
  doc.querySelector('#name').value = 'Asha';
  doc.querySelector('#email').value = 'a@x.com';
  return serialise(doc);
}, 'name=Asha&email=a%40x.com', serialise);
check('skips empty fields', () => {
  const doc = makeForm();
  doc.querySelector('#name').value = 'Asha';
  return serialise(doc);
}, 'name=Asha', serialise);

section('PREDICTIONS');

// P1: which changes when a user types?
let p1 = null;
check('P1  typing changes the', p1, 'property');

// P2: which event fires on every keystroke?
let p2 = null;
check('P2  the per-keystroke event is', p2, 'input');

// P3: where does the submit event fire?
let p3 = null;
check('P3  submit fires on the', p3, 'form');

// P4: what happens without preventDefault on submit?
let p4 = null;
check('P4  without preventDefault, the browser', p4, 'navigates away');

// P5: is client-side validation enough?
let p5 = null;
check('P5  is client-side validation a security control?', p5, false);

report();
