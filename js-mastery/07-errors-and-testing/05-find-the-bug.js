'use strict';
const { check, checkAsync, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ERRORS 05 — FIND THE BUG
 *
 * Different from every other file: the code is ALREADY WRITTEN, and every
 * function has exactly one bug. Your job is to read the failure, find it
 * and fix it in place.
 *
 * Work the method from file 04:
 *   read the expected vs actual, form a theory, test the theory.
 * Do not rewrite a function from scratch — find the ONE wrong character
 * or line. That is the skill.
 *
 * Every bug here is one I have seen in real code, including my own.
 * ==========================================================================*/

section('Bug 1 — off by one');
/* Should return the last item.                                   */
function lastItem(arr) {
  return arr[arr.length];
}
check('last of three', () => lastItem(['a', 'b', 'c']), 'c', lastItem);
check('single item', () => lastItem(['only']), 'only', lastItem);

section('Bug 2 — the assignment that should be a comparison');
/* Should return true when the user is an admin.                  */
function isAdmin(user) {
  if (user.role = 'admin') {
    return true;
  }
  return false;
}
check('an admin', () => isAdmin({ role: 'admin' }), true, isAdmin);
check('not an admin', () => isAdmin({ role: 'guest' }), false, isAdmin);
check('and it must not modify the user', () => {
  const u = { role: 'guest' };
  isAdmin(u);
  return u.role;
}, 'guest', isAdmin);

section('Bug 3 — the missing return');
/* Should double every number.                                    */
function doubleAll(nums) {
  return nums.map((n) => { n * 2; });
}
check('doubles', () => doubleAll([1, 2, 3]), [2, 4, 6], doubleAll);

section('Bug 4 — sorting numbers as strings');
/* Should sort ascending.                                         */
function sortNumbers(nums) {
  return [...nums].sort();
}
check('ascending', () => sortNumbers([10, 9, 100, 1]), [1, 9, 10, 100], sortNumbers);

section('Bug 5 — the shared default');
/* Each call should start with an empty list.                     */
const sharedList = [];
function addItem(item, list = sharedList) {
  list.push(item);
  return list;
}
check('first call', () => addItem('a'), ['a'], addItem);
check('second call is NOT polluted', () => addItem('b'), ['b'], addItem);

section('Bug 6 — mutating while iterating');
/* Should remove every even number.                               */
function removeEvens(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
      nums.splice(i, 1);
    }
  }
  return nums;
}
check('consecutive evens', () => removeEvens([1, 2, 4, 6, 7]), [1, 7], removeEvens);
check('all even', () => removeEvens([2, 4]), [], removeEvens);

section('Bug 7 — the falsy check that is too broad');
/* Should use the given quantity, defaulting to 1 only when it is
 * MISSING. An explicit 0 must stay 0.                            */
function orderTotal(price, quantity) {
  const qty = quantity || 1;
  return price * qty;
}
check('normal', () => orderTotal(10, 3), 30, orderTotal);
check('missing quantity', () => orderTotal(10), 10, orderTotal);
check('an explicit zero', () => orderTotal(10, 0), 0, orderTotal);

section('Bug 8 — comparing objects with ===');
/* Should find the matching item by contents.                     */
function includesPoint(points, target) {
  return points.includes(target);
}
check('finds an equal point', () => includesPoint([{ x: 1 }, { x: 2 }], { x: 2 }), true, includesPoint);
check('missing', () => includesPoint([{ x: 1 }], { x: 9 }), false, includesPoint);

section('Bug 9 — the async function nobody awaited');
/* Should return the sum of the resolved values.                  */
async function sumAsync(promises) {
  let total = 0;
  promises.forEach(async (p) => {
    total += await p;
  });
  return total;
}
checkAsync('sums', async () => sumAsync([Promise.resolve(1), Promise.resolve(2)]), 3, sumAsync);

section('Bug 10 — the accidental global-ish shared state');
/* Each counter should be independent.                            */
let sharedCount = 0;
function makeCounter() {
  return {
    increment() {
      sharedCount += 1;
      return sharedCount;
    },
  };
}
check('first counter', () => makeCounter().increment(), 1, makeCounter);
check('second counter starts fresh', () => {
  const a = makeCounter();
  a.increment(); a.increment();
  const b = makeCounter();
  return b.increment();
}, 1, makeCounter);

section('Bug 11 — the reduce with no initial value');
/* Should total the prices. It breaks on an empty list.           */
function totalPrice(items) {
  return items.reduce((sum, item) => sum + item.price);
}
check('normal', () => totalPrice([{ price: 10 }, { price: 5 }]), 15, totalPrice);
check('single item', () => totalPrice([{ price: 10 }]), 10, totalPrice);
check('empty list', () => totalPrice([]), 0, totalPrice);

section('Bug 12 — the regex that matches too much');
/* Should extract the FIRST quoted string.                        */
function firstQuoted(text) {
  const match = text.match(/"(.*)"/);
  return match ? match[1] : null;
}
check('one quote pair', () => firstQuoted('say "hello" now'), 'hello', firstQuoted);
check('two quote pairs', () => firstQuoted('"first" and "second"'), 'first', firstQuoted);
check('none', () => firstQuoted('nothing here'), null, firstQuoted);

section('Bug 13 — the shallow copy that was meant to be deep');
/* Should leave the original untouched.                           */
function withUpdatedCity(user, city) {
  const copy = { ...user };
  copy.address.city = city;
  return copy;
}
check('updates the copy', () => withUpdatedCity({ name: 'a', address: { city: 'Pune' } }, 'Goa').address.city, 'Goa', withUpdatedCity);
check('and leaves the original alone', () => {
  const original = { name: 'a', address: { city: 'Pune' } };
  withUpdatedCity(original, 'Goa');
  return original.address.city;
}, 'Pune', withUpdatedCity);

section('Bug 14 — the loop variable captured by var');
/* Each function should report its own index.                     */
function makeReporters(n) {
  const fns = [];
  for (var i = 0; i < n; i++) {      // eslint-disable-line no-var
    fns.push(() => i);
  }
  return fns;
}
check('each keeps its own index', () => makeReporters(3).map((f) => f()), [0, 1, 2], makeReporters);

section('Bug 15 — the truthiness of an empty array');
/* Should report whether there are any items.                     */
function hasItems(list) {
  if (list) {
    return true;
  }
  return false;
}
check('with items', () => hasItems([1]), true, hasItems);
check('empty array', () => hasItems([]), false, hasItems);
check('null', () => hasItems(null), false, hasItems);

log('when all fifteen pass', 'you have debugged more real bugs than most tutorials ever show you');
report();
