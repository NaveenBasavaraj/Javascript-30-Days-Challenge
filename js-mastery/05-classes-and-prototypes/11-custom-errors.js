'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * CLASSES 11 — CUSTOM ERROR CLASSES
 *
 * Error is a normal class, so you can extend it — and you should. Throwing
 * `new Error('bad')` forces every caller to match on message strings.
 * Throwing `new ValidationError(...)` lets them use instanceof.
 *
 *   class ValidationError extends Error {
 *     constructor(message, field) {
 *       super(message);            // sets this.message
 *       this.name = 'ValidationError';
 *       this.field = field;
 *     }
 *   }
 *
 * WHY `this.name = ...` — the name is what appears in the stack trace and
 * in String(error). Without it you get 'Error: ...' even for a subclass.
 *
 * WHAT YOU GET FOR FREE from extending Error:
 *   error.message     the string you passed to super()
 *   error.stack       where it was thrown
 *   error instanceof YourError, and instanceof Error
 *
 * `cause` (ES2022) keeps the original error when you wrap one:
 *   throw new DatabaseError('query failed', { cause: originalError });
 *
 * This file is about MODELLING errors as classes. Topic 07 covers try /
 * catch / finally strategy properly.
 * ==========================================================================*/

section('Exercise 1 — a basic custom error');
/* ValidationError extends Error, sets name and a `field` property.  */
class ValidationError extends Error {
  // your code here
}
check('message', () => new ValidationError('too short', 'name').message, 'too short', ValidationError);
check('name', () => new ValidationError('x', 'y').name, 'ValidationError', ValidationError);
check('field', () => new ValidationError('x', 'email').field, 'email', ValidationError);
check('is a ValidationError', () => new ValidationError('x', 'y') instanceof ValidationError, true, ValidationError);
check('is also an Error', () => new ValidationError('x', 'y') instanceof Error, true, ValidationError);
check('has a stack', () => typeof new ValidationError('x', 'y').stack, 'string', ValidationError);

section('Exercise 2 — throwing and catching it');
/* validateName(name) throws a ValidationError('name is required', 'name')
 * for a blank name, otherwise returns the trimmed name.
 * Then tryValidate returns either the value or the error's field.  */
function validateName(name) {
  // your code here
}
function tryValidate(name) {
  // your code here: return the trimmed name, or on a ValidationError
  // return `failed: ${error.field}`
}
check('valid', validateName('  Asha '), 'Asha');
check('throws the right type', () => {
  try { validateName(''); return 'no throw'; } catch (e) { return e.constructor.name; }
}, 'ValidationError', validateName);
check('caught', tryValidate(''), 'failed: name');
check('passed through', tryValidate('Ben'), 'Ben');

section('Exercise 3 — a family of errors');
/* AppError extends Error and sets this.name from the constructor name
 * automatically (this.constructor.name), so subclasses need no boilerplate.
 * NotFoundError and PermissionError extend AppError and add a `status`
 * of 404 and 403.                                                */
class AppError extends Error {
  // your code here
}
class NotFoundError extends AppError {
  // your code here
}
class PermissionError extends AppError {
  // your code here
}
check('names itself', () => new NotFoundError('gone').name, 'NotFoundError', AppError);
check('permission names itself', () => new PermissionError('no').name, 'PermissionError', AppError);
check('statuses', () => [new NotFoundError('a').status, new PermissionError('b').status], [404, 403], NotFoundError);
check('shared ancestry', () => {
  const e = new NotFoundError('gone');
  return [e instanceof NotFoundError, e instanceof AppError, e instanceof Error];
}, [true, true, true], NotFoundError);

section('Exercise 4 — routing on the error type');
/* statusFor(error) returns:
 *   the error's status for any AppError
 *   400 for a ValidationError
 *   500 for anything else                                        */
function statusFor(error) {
  // your code here
}
check('not found', statusFor(new NotFoundError('x')), 404);
check('permission', statusFor(new PermissionError('x')), 403);
check('validation', statusFor(new ValidationError('x', 'f')), 400);
check('unknown', statusFor(new Error('boom')), 500);
check('not even an error', statusFor('a string'), 500);

section('Exercise 5 — collecting several failures');
/* validateUser({ name, age }) returns an array of ValidationErrors rather
 * than throwing on the first problem.
 *   missing name -> 'name is required' on field 'name'
 *   age below 0  -> 'age must be positive' on field 'age'
 * A valid user gives [].                                         */
function validateUser(user = {}) {
  // your code here
}
check('valid', validateUser({ name: 'a', age: 1 }), []);
check('both problems', () => validateUser({ age: -1 }).map((e) => e.field), ['name', 'age']);
check('messages', () => validateUser({ age: -1 }).map((e) => e.message),
  ['name is required', 'age must be positive']);
check('real errors', () => validateUser({}).every((e) => e instanceof ValidationError), true, validateUser);

section('Exercise 6 — an aggregate error');
/* MultiError extends Error, takes an array of errors, and exposes:
 *   .errors   the array
 *   .message  'N problems'                                       */
class MultiError extends Error {
  // your code here
}
check('message', () => new MultiError([new Error('a'), new Error('b')]).message, '2 problems', MultiError);
check('errors kept', () => new MultiError([new Error('a')]).errors.length, 1, MultiError);
check('one problem', () => new MultiError([new Error('a')]).message, '1 problems', MultiError);
check('is an Error', () => new MultiError([]) instanceof Error, true, MultiError);

section('Exercise 7 — wrapping with cause');
/* loadConfig() calls a parser that throws, catches it, and rethrows a
 * ConfigError('could not load config', { cause: original }).
 * Return the message of the CAUSE.                               */
class ConfigError extends Error {
  // your code here
}
function failingParse() {
  throw new SyntaxError('unexpected token');
}
function loadConfig() {
  // your code here
}
check('wraps', () => {
  try { loadConfig(); return 'no throw'; } catch (e) { return e.message; }
}, 'could not load config', loadConfig);
check('keeps the cause', () => {
  try { loadConfig(); return 'no throw'; } catch (e) { return e.cause.message; }
}, 'unexpected token', loadConfig);
check('the cause keeps its type', () => {
  try { loadConfig(); return 'no throw'; } catch (e) { return e.cause instanceof SyntaxError; }
}, true, loadConfig);

section('Exercise 8 — a Result type instead of throwing');
/* Sometimes not throwing is better. Result has two static factories:
 *   Result.ok(value)    -> { ok: true, value }   with an unwrap() giving value
 *   Result.fail(error)  -> { ok: false, error }  with an unwrap() that THROWS
 * Both are real Result instances.                                */
class Result {
  // your code here
}
check('ok', () => { const r = Result.ok(5); return [r.ok, r.value, r.unwrap()]; }, [true, 5, 5]);
check('fail', () => { const r = Result.fail(new Error('bad')); return [r.ok, r.error.message]; }, [false, 'bad']);
check('unwrapping a failure throws', () => {
  try { Result.fail(new Error('bad')).unwrap(); return 'no throw'; } catch (e) { return e.message; }
}, 'bad', Result);
check('both are Results', () => [Result.ok(1) instanceof Result, Result.fail(new Error()) instanceof Result],
  [true, true], Result);

section('PREDICTIONS');

// P1: the name of a subclass error WITHOUT setting this.name
class P1e extends Error {}
let p1 = null;
check('P1  new P1e("x").name', p1, new P1e('x').name);

// P2: and what String() gives for it
let p2 = null;
check('P2  String(new P1e("boom"))', p2, String(new P1e('boom')));

// P3: with the name set
class P3e extends Error { constructor(m) { super(m); this.name = 'P3e'; } }
let p3 = null;
check('P3  String(new P3e("boom"))', p3, String(new P3e('boom')));

// P4: is message an own enumerable property?
let p4 = null;
check('P4  Object.keys(new Error("x"))', p4, Object.keys(new Error('x')));

// P5: so what does JSON.stringify give?
let p5 = null;
check('P5  JSON.stringify(new Error("x"))', p5, JSON.stringify(new Error('x')));

// P6: does instanceof survive two levels?
class P6a extends Error {}
class P6b extends P6a {}
let p6 = null;
check('P6  new P6b() instanceof Error', p6, new P6b() instanceof Error);

// P7: throwing something that is not an Error
let outcome7;
try { throw 'just a string'; } catch (e) { outcome7 = [typeof e, e instanceof Error]; }
let p7 = null;
check('P7  throw "just a string"', p7, outcome7);
log('why P7 matters', 'you can throw anything, so a catch block must not assume it caught an Error');

report();
