'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 05 — MAP & FILTER (the two workhorses)
 *
 * NOTES:
 *   arr.map(fn)     -> NEW array, SAME length, each item transformed
 *   arr.filter(fn)  -> NEW array, SAME items, only the ones that pass
 *
 *   Both take (item, index, wholeArray) and never touch the original.
 *   map's callback MUST return something — forget the return and you get
 *   an array full of undefined. Watch out for arrow-function braces:
 *       x => x * 2        returns
 *       x => { x * 2 }    returns undefined
 *       x => ({ v: x })   wrap an object literal in parentheses
 * ==========================================================================*/

const PRODUCTS = [
  { name: 'Laptop', price: 1200, inStock: true },
  { name: 'Mouse', price: 25, inStock: true },
  { name: 'Monitor', price: 300, inStock: false },
  { name: 'Cable', price: 8, inStock: true },
];

section('Exercise 1 — doubleAll');
/* doubleAll([1,2,3]) -> [2,4,6]                                  */
function doubleAll(nums) {
  // your code here
}
const t1 = [1, 2, 3];
check('doubleAll', doubleAll(t1), [2, 4, 6]);
check('original untouched', t1, [1, 2, 3]);

section('Exercise 2 — namesOf');
/* Pull one property out of each object.
 * namesOf(PRODUCTS) -> ['Laptop','Mouse','Monitor','Cable']      */
function namesOf(products) {
  // your code here
}
check('namesOf', namesOf(PRODUCTS), ['Laptop', 'Mouse', 'Monitor', 'Cable']);

section('Exercise 3 — toFahrenheit');
/* F = C * 9/5 + 32.  toFahrenheit([0, 100]) -> [32, 212]         */
function toFahrenheit(celsius) {
  // your code here
}
check('toFahrenheit', toFahrenheit([0, 100, 35, -40]), [32, 212, 95, -40]);

section('Exercise 4 — onlyEvens / onlyOdds');
function onlyEvens(nums) {
  // your code here
}
function onlyOdds(nums) {
  // your code here
}
check('onlyEvens', onlyEvens([1, 2, 3, 4, 5, 6]), [2, 4, 6]);
check('onlyOdds', onlyOdds([1, 2, 3]), [1, 3]);

section('Exercise 5 — affordable');
/* Keep products priced at or below `max`, in their original order.
 * affordable(PRODUCTS, 300) -> the Mouse, Monitor and Cable objects */
function affordable(products, max) {
  // your code here
}
check('affordable', affordable(PRODUCTS, 300), [PRODUCTS[1], PRODUCTS[2], PRODUCTS[3]]);
check('affordable none', affordable(PRODUCTS, 1), []);

section('Exercise 6 — buyableNames (chain filter + map)');
/* Names of products that are inStock AND cost less than 500.
 * buyableNames(PRODUCTS) -> ['Mouse', 'Cable']
 * Do it in ONE chained expression: products.filter(...).map(...)  */
function buyableNames(products) {
  // your code here
}
check('buyableNames', buyableNames(PRODUCTS), ['Mouse', 'Cable']);

section('Exercise 7 — withTax');
/* Return NEW objects with an extra `total` property = price * 1.1,
 * rounded to 2 decimals with Number(x.toFixed(2)).
 * The original objects must NOT gain a `total` property.
 * Hint: { ...product, total: ... }                               */
function withTax(products) {
  // your code here
}
const taxed = withTax([{ name: 'Pen', price: 10 }]);
check('withTax shape', taxed, [{ name: 'Pen', price: 10, total: 11 }]);
check('originals clean', 'total' in PRODUCTS[0], false);

section('Exercise 8 — rank (map with index)');
/* rank(['gold','silver']) -> ['1. gold', '2. silver']
 * Use map's second parameter.                                    */
function rank(items) {
  // your code here
}
check('rank', rank(['gold', 'silver']), ['1. gold', '2. silver']);

section('Exercise 9 — compact');
/* Remove all falsy values (0, '', null, undefined, NaN, false).
 * compact([0, 1, '', 'a', null, false, 2]) -> [1, 'a', 2]
 * Hint: filter(Boolean)                                          */
function compact(arr) {
  // your code here
}
check('compact', compact([0, 1, '', 'a', null, false, 2]), [1, 'a', 2]);

section('Exercise 10 — initials');
/* initials(['ada lovelace','alan turing']) -> ['AL','AT']
 * Split on spaces, take the first letter of each part, uppercase. */
function initials(fullNames) {
  // your code here
}
check('initials', initials(['ada lovelace', 'alan turing']), ['AL', 'AT']);
check('initials single name', initials(['plato']), ['P']);

section('Exercise 11 — removeItem (filter by index)');
/* Return a new array without the item at `index`. Do not mutate.
 * removeItem(['a','b','c'], 1) -> ['a','c']
 * Use filter with its index parameter.                           */
function removeItem(arr, index) {
  // your code here
}
check('removeItem', removeItem(['a', 'b', 'c'], 1), ['a', 'c']);

section('PREDICTIONS');

// P1: the classic. Why does this happen?
let p1 = null;
check('P1  ["1","2","3"].map(parseInt)', p1, ['1', '2', '3'].map(parseInt));
log('why', 'map passes (value, index) and parseInt(value, radix) uses that index as the radix');

// P2: forgetting to return
let p2 = null;
check('P2  [1,2].map(x => { x * 2 })', p2, [1, 2].map((x) => { x * 2; }));

// P3: does filter change the length?
let p3 = null;
check('P3  [1,2,3].filter(x => x > 1).length', p3, [1, 2, 3].filter((x) => x > 1).length);

// P4: filter keeps items whose callback is TRUTHY, not just === true
let p4 = null;
check('P4  [0,1,2].filter(x => x)', p4, [0, 1, 2].filter((x) => x));

report();
