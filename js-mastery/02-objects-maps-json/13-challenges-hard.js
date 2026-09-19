'use strict';
const { check, section, log, report } = require('../_helpers/check');

/* ============================================================================
 * OBJECTS 13 — REAL-WORLD SHAPES (final boss)
 *
 * One API-shaped payload, thirteen questions. This is the work: reshape
 * data someone else designed into the shape your screen needs.
 * Read the whole payload once before you start.
 * ==========================================================================*/

const API = {
  meta: { page: 1, perPage: 50, total: 4 },
  users: [
    { id: 'u1', profile: { first: 'Asha', last: 'Rao' }, email: 'asha@x.com', active: true,  teamId: 't1' },
    { id: 'u2', profile: { first: 'Ben', last: 'Cole' }, email: null,         active: false, teamId: 't2' },
    { id: 'u3', profile: { first: 'Cara', last: 'Diaz' }, email: 'cara@x.com', active: true,  teamId: 't1' },
    { id: 'u4', profile: { first: 'Dev', last: 'Eze' },  email: 'dev@x.com',  active: true,  teamId: 't3' },
  ],
  teams: [
    { id: 't1', name: 'Engineering' },
    { id: 't2', name: 'Sales' },
  ],
  events: [
    { userId: 'u1', type: 'login', at: '2024-03-01T09:00:00.000Z' },
    { userId: 'u1', type: 'purchase', at: '2024-03-01T10:00:00.000Z', amount: 40 },
    { userId: 'u3', type: 'login', at: '2024-03-02T08:00:00.000Z' },
    { userId: 'u1', type: 'purchase', at: '2024-03-03T11:00:00.000Z', amount: 60 },
    { userId: 'u9', type: 'login', at: '2024-03-03T12:00:00.000Z' },
    { userId: 'u3', type: 'purchase', at: '2024-03-04T07:00:00.000Z', amount: 25 },
  ],
};

section('1 — displayName');
/* 'Asha Rao' from a user record.                                 */
function displayName(user) {
  // your code here
}
check('displayName', displayName(API.users[0]), 'Asha Rao');

section('2 — activeEmails');
/* Emails of active users only, skipping anyone whose email is null.
 * -> ['asha@x.com', 'cara@x.com', 'dev@x.com']                   */
function activeEmails(api) {
  // your code here
}
check('activeEmails', activeEmails(API), ['asha@x.com', 'cara@x.com', 'dev@x.com']);

section('3 — usersById');
/* id -> user record lookup.                                      */
function usersById(api) {
  // your code here
}
check('lookup works', () => usersById(API).u3.profile.first, 'Cara');
check('all four', () => Object.keys(usersById(API)), ['u1', 'u2', 'u3', 'u4']);

section('4 — withTeamName');
/* Each user gets a `team` field with the team NAME. A user whose teamId
 * has no matching team gets 'Unassigned'. Return a new array of new
 * objects; do not mutate API.
 * -> Asha 'Engineering', Ben 'Sales', Cara 'Engineering', Dev 'Unassigned' */
function withTeamName(api) {
  // your code here
}
check('team names', () => withTeamName(API).map((u) => u.team),
  ['Engineering', 'Sales', 'Engineering', 'Unassigned']);
check('kept other fields', () => withTeamName(API)[0].email, 'asha@x.com');
check('source untouched', 'team' in API.users[0], false);

section('5 — teamRosters');
/* Team NAME -> array of display names, for teams that exist.
 * -> { Engineering: ['Asha Rao', 'Cara Diaz'], Sales: ['Ben Cole'] }
 * Dev is on an unknown team and is left out entirely.            */
function teamRosters(api) {
  // your code here
}
check('rosters', teamRosters(API),
  { Engineering: ['Asha Rao', 'Cara Diaz'], Sales: ['Ben Cole'] });

section('6 — eventCounts');
/* How many events of each type. -> { login: 3, purchase: 3 }     */
function eventCounts(api) {
  // your code here
}
check('eventCounts', eventCounts(API), { login: 3, purchase: 3 });

section('7 — spendByUser');
/* Total purchase amount per userId. Only purchases count.
 * -> { u1: 100, u3: 25 }                                         */
function spendByUser(api) {
  // your code here
}
check('spendByUser', spendByUser(API), { u1: 100, u3: 25 });

section('8 — orphanEvents');
/* Events whose userId matches no user, as an array of their userIds.
 * -> ['u9']                                                      */
function orphanEvents(api) {
  // your code here
}
check('orphanEvents', orphanEvents(API), ['u9']);

section('9 — leaderboard');
/* [{ name, spent }] sorted by spend, highest first. Users who spent
 * nothing are left out. Orphan events are ignored.
 * -> [{ name: 'Asha Rao', spent: 100 }, { name: 'Cara Diaz', spent: 25 }] */
function leaderboard(api) {
  // your code here
}
check('leaderboard', leaderboard(API),
  [{ name: 'Asha Rao', spent: 100 }, { name: 'Cara Diaz', spent: 25 }]);

section('10 — eventsByDay');
/* Group events by the DATE part of `at` (the first 10 characters),
 * counting them.
 * -> { '2024-03-01': 2, '2024-03-02': 1, '2024-03-03': 2, '2024-03-04': 1 } */
function eventsByDay(api) {
  // your code here
}
check('eventsByDay', eventsByDay(API),
  { '2024-03-01': 2, '2024-03-02': 1, '2024-03-03': 2, '2024-03-04': 1 });

section('11 — lastSeen');
/* userId -> the LATEST `at` string for that user.
 * -> { u1: '2024-03-03T11:00:00.000Z', u3: '2024-03-04T07:00:00.000Z',
 *      u9: '2024-03-03T12:00:00.000Z' }
 * ISO strings compare correctly with > — that is the whole point of the
 * format.                                                        */
function lastSeen(api) {
  // your code here
}
check('lastSeen', lastSeen(API), {
  u1: '2024-03-03T11:00:00.000Z',
  u3: '2024-03-04T07:00:00.000Z',
  u9: '2024-03-03T12:00:00.000Z',
});

section('12 — toViewModel');
/* The single object a dashboard would actually render:
 * {
 *   totalUsers: 4,
 *   activeUsers: 3,
 *   revenue: 125,
 *   teams: ['Engineering', 'Sales'],
 *   topSpender: 'Asha Rao',
 * }                                                              */
function toViewModel(api) {
  // your code here
}
check('toViewModel', toViewModel(API), {
  totalUsers: 4,
  activeUsers: 3,
  revenue: 125,
  teams: ['Engineering', 'Sales'],
  topSpender: 'Asha Rao',
});

section('13 — flattenUsers (for a CSV export)');
/* One flat object per user, nested profile pulled up, dotted keys gone:
 * -> [{ id: 'u1', first: 'Asha', last: 'Rao', email: 'asha@x.com',
 *       active: true, teamId: 't1' }, ...]
 * A null email becomes an empty string.                          */
function flattenUsers(api) {
  // your code here
}
check('first row', () => flattenUsers(API)[0],
  { id: 'u1', first: 'Asha', last: 'Rao', email: 'asha@x.com', active: true, teamId: 't1' });
check('null email becomes ""', () => flattenUsers(API)[1].email, '');
check('no nested profile left', () => 'profile' in flattenUsers(API)[0], false);
check('all four rows', () => flattenUsers(API).length, 4);

section('14 — nothing was mutated');
check('users intact', API.users.length, 4);
check('first user keys', Object.keys(API.users[0]), ['id', 'profile', 'email', 'active', 'teamId']);
check('events intact', API.events.length, 6);

log('done?', 'that is topic 02 finished — tell me and I will build the next one');
report();
