'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * ARRAYS 15 — REAL-WORLD DATA WRANGLING (final boss)
 *
 * One dataset, twelve questions — this is what array work actually looks
 * like in a job: filter, group, aggregate, sort, format.
 * Solve each with method chains where you can. Read the whole dataset once
 * before you start.
 * ==========================================================================*/

const ORDERS = [
  { id: 'o1', customer: 'asha',  date: '2024-01-15', status: 'paid',      items: [{ sku: 'kbd', qty: 1, price: 80 }, { sku: 'mouse', qty: 2, price: 25 }] },
  { id: 'o2', customer: 'ben',   date: '2024-01-28', status: 'paid',      items: [{ sku: 'monitor', qty: 1, price: 300 }] },
  { id: 'o3', customer: 'asha',  date: '2024-02-03', status: 'cancelled', items: [{ sku: 'kbd', qty: 5, price: 80 }] },
  { id: 'o4', customer: 'cara',  date: '2024-02-14', status: 'paid',      items: [{ sku: 'mouse', qty: 1, price: 25 }, { sku: 'cable', qty: 4, price: 5 }] },
  { id: 'o5', customer: 'ben',   date: '2024-03-02', status: 'refunded',  items: [{ sku: 'cable', qty: 2, price: 5 }] },
  { id: 'o6', customer: 'asha',  date: '2024-03-19', status: 'paid',      items: [{ sku: 'monitor', qty: 2, price: 300 }] },
];

section('1 — orderTotal');
/* Total value of one order: sum of qty * price over its items.
 * orderTotal(ORDERS[0]) -> 80 + 50 = 130                         */
function orderTotal(order) {
  // your code here
}
check('o1', orderTotal(ORDERS[0]), 130);
check('o4', orderTotal(ORDERS[3]), 45);

section('2 — revenue (paid orders only)');
/* Sum of orderTotal for orders with status 'paid'.
 * 130 + 300 + 45 + 600 = 1075                                    */
function revenue(orders) {
  // your code here
}
check('revenue', revenue(ORDERS), 1075);

section('3 — customers (unique, sorted)');
/* ['asha', 'ben', 'cara']                                        */
function customers(orders) {
  // your code here
}
check('customers', customers(ORDERS), ['asha', 'ben', 'cara']);

section('4 — spendByCustomer');
/* Paid orders only. { asha: 730, ben: 300, cara: 45 }            */
function spendByCustomer(orders) {
  // your code here
}
check('spendByCustomer', spendByCustomer(ORDERS), { asha: 730, ben: 300, cara: 45 });

section('5 — topCustomers');
/* Highest paid spend first, as [name, total] pairs, limited to n.
 * topCustomers(ORDERS, 2) -> [['asha', 730], ['ben', 300]]       */
function topCustomers(orders, n) {
  // your code here
}
check('top 2', topCustomers(ORDERS, 2), [['asha', 730], ['ben', 300]]);
check('top 1', topCustomers(ORDERS, 1), [['asha', 730]]);

section('6 — monthlyRevenue');
/* Paid orders grouped by 'YYYY-MM' (the first 7 characters of date).
 * { '2024-01': 430, '2024-02': 45, '2024-03': 600 }              */
function monthlyRevenue(orders) {
  // your code here
}
check('monthly', monthlyRevenue(ORDERS), { '2024-01': 430, '2024-02': 45, '2024-03': 600 });

section('7 — unitsBySku');
/* Total quantity per sku across ALL orders, whatever the status.
 * kbd 1+5=6, mouse 2+1=3, monitor 1+2=3, cable 4+2=6            */
function unitsBySku(orders) {
  // your code here
}
check('unitsBySku', unitsBySku(ORDERS), { kbd: 6, mouse: 3, monitor: 3, cable: 6 });

section('8 — bestSellingSku');
/* The sku with the most units. On a tie, whichever appears first
 * when you scan the orders in order.  (kbd and cable both have 6;
 * kbd is seen first, so -> 'kbd')                                */
function bestSellingSku(orders) {
  // your code here
}
check('bestSellingSku', bestSellingSku(ORDERS), 'kbd');

section('9 — statusCounts');
/* { paid: 4, cancelled: 1, refunded: 1 }                         */
function statusCounts(orders) {
  // your code here
}
check('statusCounts', statusCounts(ORDERS), { paid: 4, cancelled: 1, refunded: 1 });

section('10 — receiptLines');
/* One display string per PAID order, newest first:
 *   "2024-03-19  ASHA  $600.00"
 * Two spaces between fields, customer uppercased, total with exactly
 * two decimals and a leading $.                                  */
function receiptLines(orders) {
  // your code here
}
check('receipts', receiptLines(ORDERS), [
  '2024-03-19  ASHA  $600.00',
  '2024-02-14  CARA  $45.00',
  '2024-01-28  BEN  $300.00',
  '2024-01-15  ASHA  $130.00',
]);

section('11 — summary (one object, one pass)');
/* Return, for PAID orders only:
 *   { count, total, average, biggest }
 * average rounded to 2 decimals, biggest is the order id.
 * -> { count: 4, total: 1075, average: 268.75, biggest: 'o6' }   */
function summary(orders) {
  // your code here
}
check('summary', summary(ORDERS), { count: 4, total: 1075, average: 268.75, biggest: 'o6' });

section('12 — buildIndex');
/* A lookup: sku -> array of order ids containing it, in order.
 * { kbd: ['o1','o3'], mouse: ['o1','o4'], monitor: ['o2','o6'],
 *   cable: ['o4','o5'] }                                         */
function buildIndex(orders) {
  // your code here
}
check('buildIndex', buildIndex(ORDERS), {
  kbd: ['o1', 'o3'],
  mouse: ['o1', 'o4'],
  monitor: ['o2', 'o6'],
  cable: ['o4', 'o5'],
});

section('13 — nothing was mutated');
/* If everything above is written without mutating, this passes for free. */
check('dataset intact', ORDERS.length, 6);
check('first order intact', ORDERS[0].items.length, 2);
check('no stray properties', Object.keys(ORDERS[0]), ['id', 'customer', 'date', 'status', 'items']);

log('done?', 'you have finished the arrays track — tell me and I will unlock the next topic');
report();
