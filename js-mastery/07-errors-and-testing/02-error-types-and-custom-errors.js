'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 02 — ERROR TYPES & YOUR OWN
 *
 * Topic 05 file 11 covered the CLASS mechanics of custom errors. This file
 * is about USING them: designing a set of errors that make your code easy
 * to handle correctly.
 *
 * THE DESIGN RULES
 *   1. Throw a TYPE, not a string. `instanceof NotFoundError` beats
 *      `e.message.includes('not found')` — messages change, types do not.
 *   2. Put the DATA on the error: which field, which id, which status.
 *      The catch block should not have to parse the message.
 *   3. One base class per application, so a single catch can distinguish
 *      "an error I designed" from "something is genuinely broken".
 *   4. Wrap low-level errors with `cause` instead of swallowing them.
 *
 * OPERATIONAL vs PROGRAMMER ERRORS — the distinction that decides what to
 * do:
 *   OPERATIONAL   expected at runtime: bad input, 404, timeout, no disk
 *                 space. HANDLE these.
 *   PROGRAMMER    a bug: undefined is not a function, wrong argument
 *                 count. Let these crash loudly — hiding them hides bugs.
 * ==========================================================================*/

section('Exercise 1 — an error hierarchy');
/* AppError extends Error, sets `name` from the constructor name and
 * accepts an options object merged onto the instance.
 *   new AppError('boom', { status: 500 }).status -> 500
 * ValidationError extends AppError with status 400 and a `field`.
 * NotFoundError extends AppError with status 404 and a `resource`.  */
class AppError extends Error {
  // your code here
}
class ValidationError extends AppError {
  // your code here
}
class NotFoundError extends AppError {
  // your code here
}
check('base name', () => new AppError('x').name, 'AppError', AppError);
check('extra data', () => new AppError('x', { status: 500 }).status, 500, AppError);
check('validation', () => {
  const e = new ValidationError('too short', 'name');
  return [e.name, e.status, e.field, e.message];
}, ['ValidationError', 400, 'name', 'too short'], ValidationError);
check('not found', () => {
  const e = new NotFoundError('no such user', 'user');
  return [e.name, e.status, e.resource];
}, ['NotFoundError', 404, 'user'], NotFoundError);
check('all share an ancestor', () => {
  const e = new NotFoundError('x', 'user');
  return [e instanceof NotFoundError, e instanceof AppError, e instanceof Error];
}, [true, true, true], NotFoundError);

section('Exercise 2 — handling by type');
/* handle(error) returns:
 *   `invalid ${field}`  for a ValidationError
 *   `missing ${resource}` for a NotFoundError
 *   'server error'      for any other AppError
 *   'unexpected'        for anything that is not an AppError       */
function handle(error) {
  // your code here
}
check('validation', handle(new ValidationError('x', 'email')), 'invalid email');
check('not found', handle(new NotFoundError('x', 'team')), 'missing team');
check('other app error', handle(new AppError('x')), 'server error');
check('a plain error', handle(new TypeError('x')), 'unexpected');
check('not even an error', handle('a string'), 'unexpected');

section('Exercise 3 — operational vs programmer');
/* isOperational(error) -> true only for AppError instances.
 * Anything else is a bug and should be allowed to crash.         */
function isOperational(error) {
  // your code here
}
check('app error', isOperational(new ValidationError('x', 'f')), true);
check('type error', isOperational(new TypeError('x')), false);
check('null', isOperational(null), false);

section('Exercise 4 — the data lives on the error');
/* Build the HTTP response from the error itself — no message parsing.
 * toResponse(error) -> { status, body: { error: name, message } }
 * A non-AppError becomes 500 with the message 'internal error' so you
 * never leak internals to a user.                                */
function toResponse(error) {
  // your code here
}
check('validation', toResponse(new ValidationError('too short', 'name')),
  { status: 400, body: { error: 'ValidationError', message: 'too short' } });
check('unexpected is masked', toResponse(new TypeError('cannot read x of undefined')),
  { status: 500, body: { error: 'Error', message: 'internal error' } });

section('Exercise 5 — wrapping with cause');
/* parseConfig(text) parses JSON and, on failure, throws
 * new AppError('invalid config', { cause: theSyntaxError }).     */
function parseConfig(text) {
  // your code here
}
check('valid', parseConfig('{"a":1}'), { a: 1 });
check('wrapped message', () => {
  try { parseConfig('{oops'); return 'no error'; } catch (e) { return e.message; }
}, 'invalid config', parseConfig);
check('the cause is kept', () => {
  try { parseConfig('{oops'); return 'no error'; } catch (e) { return e.cause instanceof SyntaxError; }
}, true, parseConfig);

section('Exercise 6 — a chain of causes');
/* causeChain(error) returns every message from the error down through
 * its causes.                                                    */
function causeChain(error) {
  // your code here
}
const deep = new Error('top', { cause: new Error('middle', { cause: new Error('root') }) });
check('three deep', causeChain(deep), ['top', 'middle', 'root']);
check('no cause', causeChain(new Error('alone')), ['alone']);

section('Exercise 7 — collecting many validation errors');
/* validate(user) returns an array of ValidationErrors — one per problem,
 * never throwing. Rules:
 *   name missing or blank -> 'name is required' on field 'name'
 *   age not a number      -> 'age must be a number' on field 'age'
 *   age negative          -> 'age must be positive' on field 'age'
 * A missing age is fine.                                         */
function validate(user = {}) {
  // your code here
}
check('all good', validate({ name: 'a', age: 1 }), []);
check('no age is fine', validate({ name: 'a' }), []);
check('fields', () => validate({ age: -1 }).map((e) => e.field), ['name', 'age']);
check('messages', () => validate({ name: '  ', age: 'x' }).map((e) => e.message),
  ['name is required', 'age must be a number']);
check('real errors', () => validate({}).every((e) => e instanceof ValidationError), true, validate);

section('Exercise 8 — assert');
/* assert(condition, message) throws new AppError(message) when the
 * condition is falsy, and returns nothing otherwise. A tiny helper that
 * removes a lot of if-throw noise.                               */
function assert(condition, message) {
  // your code here
}
check('passes silently', () => String(assert(true, 'x')), 'undefined', assert);
check('throws', () => {
  try { assert(false, 'must be true'); return 'no throw'; } catch (e) { return e.message; }
}, 'must be true', assert);
check('the right type', () => {
  try { assert(0, 'x'); return 'no throw'; } catch (e) { return e instanceof AppError; }
}, true, assert);

section('Exercise 9 — an error with a code');
/* Machine-readable codes survive translation and refactoring better than
 * messages.
 * CodedError(code, message) with a `code` property, and
 * byCode(error) returning a friendly string:
 *   'E_AUTH'    -> 'please sign in'
 *   'E_LIMIT'   -> 'too many requests'
 *   anything else -> 'something went wrong'                      */
class CodedError extends AppError {
  // your code here
}
function byCode(error) {
  // your code here
}
check('code stored', () => new CodedError('E_AUTH', 'no token').code, 'E_AUTH', CodedError);
check('auth', byCode(new CodedError('E_AUTH', 'x')), 'please sign in');
check('limit', byCode(new CodedError('E_LIMIT', 'x')), 'too many requests');
check('unknown code', byCode(new CodedError('E_WHAT', 'x')), 'something went wrong');
check('not a coded error', byCode(new Error('x')), 'something went wrong');

section('PREDICTIONS');

// P1: the name of a subclass that does not set it
class P1e extends Error {}
let p1 = null;
check('P1  new P1e("x").name', p1, new P1e('x').name);

// P2: does instanceof work through two levels?
class P2a extends Error {}
class P2b extends P2a {}
let p2 = null;
check('P2  new P2b() instanceof Error', p2, new P2b() instanceof Error);

// P3: comparing by message vs by type
const e3 = new TypeError('Cannot read properties of undefined');
let p3 = null;
check('P3  is e3 instanceof Error?', p3, e3 instanceof Error);

// P4: what is JSON.stringify(error)?
let p4 = null;
check('P4  JSON.stringify(new Error("boom"))', p4, JSON.stringify(new Error('boom')));

// P5: does `cause` show up in the message?
let p5 = null;
check('P5  new Error("outer", { cause: new Error("inner") }).message', p5,
  new Error('outer', { cause: new Error('inner') }).message);

log('the habit', 'design your errors like you design your data — typed, with fields');

report();
