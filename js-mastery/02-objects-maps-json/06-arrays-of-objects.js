'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 06 — ARRAYS OF OBJECTS (the shape of all real data)
 *
 * Every API response, database query and CSV import lands in this shape.
 * Nothing new here syntactically: it is your array methods from topic 01
 * plus your object skills from files 01-05. This is where they combine.
 *
 * The four moves worth memorising:
 *   FIND     items.find(x => x.id === id)
 *   INDEX    Object.fromEntries(items.map(x => [x.id, x]))   id -> item lookup
 *   GROUP    reduce into { key: [items] }
 *   AGGREGATE reduce into a single number or summary object
 * ==========================================================================*/

const EMPLOYEES = [
  { id: 1, name: 'Asha', dept: 'eng', salary: 95, skills: ['js', 'go'] },
  { id: 2, name: 'Ben', dept: 'sales', salary: 60, skills: ['crm'] },
  { id: 3, name: 'Cara', dept: 'eng', salary: 120, skills: ['js', 'rust'] },
  { id: 4, name: 'Dev', dept: 'hr', salary: 55, skills: [] },
  { id: 5, name: 'Eve', dept: 'eng', salary: 80, skills: ['js'] },
];

section('Exercise 1 — byId');
/* Find one record by id, or null.
 * byId(EMPLOYEES, 3).name -> 'Cara'                              */
function byId(items, id) {
  // your code here
}
check('found', () => byId(EMPLOYEES, 3).name, 'Cara');
check('missing', byId(EMPLOYEES, 99), null);

section('Exercise 2 — indexById');
/* Build a lookup object: id -> the whole record.
 * indexById([{id:'a'}]) -> { a: { id: 'a' } }
 * Why? Because a lookup is instant, while .find() re-scans every time. */
function indexById(items) {
  // your code here
}
check('indexById', indexById([{ id: 'a', n: 1 }, { id: 'b', n: 2 }]),
  { a: { id: 'a', n: 1 }, b: { id: 'b', n: 2 } });

section('Exercise 3 — names / totalSalary');
function names(items) {
  // your code here
}
function totalSalary(items) {
  // your code here
}
check('names', names(EMPLOYEES), ['Asha', 'Ben', 'Cara', 'Dev', 'Eve']);
check('totalSalary', totalSalary(EMPLOYEES), 410);

section('Exercise 4 — groupBy');
/* Group records under the value of one key.
 * groupBy(EMPLOYEES, 'dept').hr -> [the Dev record]
 * The result for 'eng' holds Asha, Cara and Eve, in original order. */
function groupBy(items, key) {
  // your code here
}
check('eng group', () => groupBy(EMPLOYEES, 'dept').eng.map((e) => e.name), ['Asha', 'Cara', 'Eve']);
check('all groups', () => Object.keys(groupBy(EMPLOYEES, 'dept')), ['eng', 'sales', 'hr']);

section('Exercise 5 — countBy');
/* countBy(EMPLOYEES, 'dept') -> { eng: 3, sales: 1, hr: 1 }      */
function countBy(items, key) {
  // your code here
}
check('countBy', countBy(EMPLOYEES, 'dept'), { eng: 3, sales: 1, hr: 1 });

section('Exercise 6 — sumBy');
/* Total salary per department.
 * sumBy(EMPLOYEES, 'dept', 'salary') -> { eng: 295, sales: 60, hr: 55 } */
function sumBy(items, groupKey, valueKey) {
  // your code here
}
check('sumBy', sumBy(EMPLOYEES, 'dept', 'salary'), { eng: 295, sales: 60, hr: 55 });

section('Exercise 7 — highestPaid');
/* The whole record with the biggest salary, or null if empty.    */
function highestPaid(items) {
  // your code here
}
check('highestPaid', () => highestPaid(EMPLOYEES).name, 'Cara');
check('empty', highestPaid([]), null);

section('Exercise 8 — allSkills');
/* Every skill across everyone, deduped, alphabetical.
 * -> ['crm', 'go', 'js', 'rust']                                 */
function allSkills(items) {
  // your code here
}
check('allSkills', allSkills(EMPLOYEES), ['crm', 'go', 'js', 'rust']);

section('Exercise 9 — withRaise');
/* Give everyone in `dept` a raise of `amount`. Return a NEW array; only
 * the affected records are new objects, the others are reused as-is.
 * withRaise(EMPLOYEES, 'hr', 10) -> Dev is now 65                */
function withRaise(items, dept, amount) {
  // your code here
}
check('raised', () => withRaise(EMPLOYEES, 'hr', 10).find((e) => e.name === 'Dev').salary, 65);
check('others untouched', () => withRaise(EMPLOYEES, 'hr', 10)[0] === EMPLOYEES[0], true, withRaise);
check('source data unchanged', EMPLOYEES[3].salary, 55);

section('Exercise 10 — toSummary');
/* One summary object for the whole array:
 * { count: 5, totalSalary: 410, averageSalary: 82, departments: 3 }
 * averageSalary rounded to the nearest whole number.             */
function toSummary(items) {
  // your code here
}
check('toSummary', toSummary(EMPLOYEES),
  { count: 5, totalSalary: 410, averageSalary: 82, departments: 3 });

section('Exercise 11 — normalize');
/* Split an array into the shape state libraries actually store:
 *   { ids: [1, 2], entities: { 1: {...}, 2: {...} } }
 * normalize([{id:1,n:'a'}]) -> { ids: [1], entities: { 1: {id:1,n:'a'} } } */
function normalize(items) {
  // your code here
}
check('normalize', normalize([{ id: 1, n: 'a' }, { id: 2, n: 'b' }]), {
  ids: [1, 2],
  entities: { 1: { id: 1, n: 'a' }, 2: { id: 2, n: 'b' } },
});

section('Exercise 12 — sortByThenBy');
/* Sort by dept A-Z, then by salary HIGH to LOW inside each dept.
 * -> Asha? no: eng sorted by salary desc is Cara(120), Asha(95), Eve(80),
 *    then hr Dev, then sales Ben.                                */
function sortByDeptThenSalary(items) {
  // your code here
}
check('two-level sort', () => sortByDeptThenSalary(EMPLOYEES).map((e) => e.name),
  ['Cara', 'Asha', 'Eve', 'Dev', 'Ben']);
check('did not mutate', EMPLOYEES[0].name, 'Asha');

report();
