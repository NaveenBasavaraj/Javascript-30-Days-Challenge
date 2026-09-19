#!/usr/bin/env node
'use strict';
/* Overview of every exercise file. Run:  node js-mastery/progress.js
 * Optionally filter to one topic:        node js-mastery/progress.js arrays  */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const filter = process.argv[2];
const C = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', d: '\x1b[2m', b: '\x1b[1m', o: '\x1b[0m' };

const topics = fs.readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d\d-/.test(d.name))
  .filter((d) => !filter || d.name.includes(filter))
  .map((d) => d.name)
  .sort();

let gPassed = 0, gTotal = 0;

for (const topic of topics) {
  console.log(`\n${C.b}${topic}${C.o}`);
  const files = fs.readdirSync(path.join(root, topic)).filter((f) => f.endsWith('.js')).sort();
  for (const file of files) {
    let out = '';
    try {
      out = execFileSync(process.execPath, [path.join(root, topic, file)], {
        encoding: 'utf8', env: { ...process.env, JSM_SUMMARY: '1' },
      });
    } catch (err) {
      console.log(`  ${C.r}!${C.o} ${file} ${C.d}(the file crashed — run it directly to see why)${C.o}`);
      continue;
    }
    const m = out.match(/##SUMMARY (.+)/);
    if (!m) continue;
    const { passed, failed, skipped, total } = JSON.parse(m[1]);
    gPassed += passed; gTotal += total;
    const width = 24;
    const done = total ? Math.round((passed / total) * width) : 0;
    const bar = `${C.g}${'█'.repeat(done)}${C.d}${'░'.repeat(width - done)}${C.o}`;
    const pct = total ? Math.round((passed / total) * 100) : 0;
    const state = failed ? `${C.r}${failed} failed${C.o}` : skipped ? `${C.y}${skipped} todo${C.o}` : `${C.g}complete${C.o}`;
    console.log(`  ${bar} ${String(pct).padStart(3)}%  ${file.padEnd(34)} ${state}`);
  }
}

const pct = gTotal ? Math.round((gPassed / gTotal) * 100) : 0;
console.log(`\n${C.b}Overall: ${gPassed}/${gTotal} checks passing (${pct}%)${C.o}\n`);
