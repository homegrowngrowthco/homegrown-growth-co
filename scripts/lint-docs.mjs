#!/usr/bin/env node
// Docs guardrail (node-only, no deps). Run via: npm run qa:docs
// FAIL (exit 1): CLAUDE.md over 400 lines, or TODO.md contains a completed "- [x]" item.
// WARN (exit 0): any open TODO item line over 400 chars.
// Convention: CLAUDE.md is a lean evergreen brief; history lives in docs/SESSION_LOG.md;
// TODO.md holds open tasks only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = false;

const claudeLines = readFileSync(join(root, 'CLAUDE.md'), 'utf8').split(/\r?\n/).length;
if (claudeLines > 400) {
  console.error(`FAIL: CLAUDE.md is ${claudeLines} lines (max 400). Move dated history to docs/SESSION_LOG.md.`);
  failed = true;
} else {
  console.log(`ok: CLAUDE.md is ${claudeLines} lines (max 400)`);
}

const todoLines = readFileSync(join(root, 'TODO.md'), 'utf8').split(/\r?\n/);
const done = todoLines.filter((l) => /^\s*-\s*\[x\]/i.test(l));
if (done.length > 0) {
  console.error(`FAIL: TODO.md contains ${done.length} completed "- [x]" item(s). Delete them (rescue live follow-ups first); history lives in docs/SESSION_LOG.md.`);
  failed = true;
} else {
  console.log('ok: TODO.md has no completed items');
}

let longCount = 0;
for (const line of todoLines) {
  if (/^\s*-\s*\[ \]/.test(line) && line.length > 400) {
    longCount += 1;
    console.warn(`warn: open TODO item is ${line.length} chars (soft max 400). Trim it; detail belongs in SITE_STATUS.md or the session log: ${line.slice(0, 72)}...`);
  }
}
if (longCount === 0) console.log('ok: no open TODO item exceeds 400 chars');

process.exit(failed ? 1 : 0);
