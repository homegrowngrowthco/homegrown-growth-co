#!/usr/bin/env node
// Docs guardrail (node-only, no deps). Run via: npm run qa:docs
// FAIL (exit 1): CLAUDE.md over 400 lines, TODO.md contains a completed "- [x]" item,
// or CLAUDE.md's dated "current state" heading is >14 days behind the latest non-docs commit.
// WARN (exit 0): any open TODO item line over 400 chars; dated current-state heading missing.
// Convention: CLAUDE.md is a lean evergreen brief; history lives in docs/SESSION_LOG.md;
// TODO.md holds open tasks only.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = false;

const claudeText = readFileSync(join(root, 'CLAUDE.md'), 'utf8');
const claudeLines = claudeText.split(/\r?\n/).length;
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

// Stale current-state check: the dated "current state" heading in CLAUDE.md must not
// lag the newest non-docs commit by more than 14 days.
const stateMatch = claudeText
  .split(/\r?\n/)
  .filter((l) => /^#{1,6}\s/.test(l))
  .map((l) => l.match(/current.*state.*\((\d{4}-\d{2}-\d{2})\)/i))
  .find(Boolean);
const stateDate = stateMatch ? stateMatch[1] : null;
let codeDate = '';
try {
  codeDate = execFileSync(
    'git',
    ['log', '-1', '--format=%cs', '--', '.', ':(exclude)*.md', ':(exclude)docs/', ':(exclude)audits/'],
    { cwd: root, encoding: 'utf8' },
  ).trim();
} catch {
  // git unavailable or not a repo; skip the staleness comparison
}
if (!stateDate) {
  console.warn('warn: CLAUDE.md has no dated current-state heading (expected e.g. "## Live site / current state (YYYY-MM-DD)").');
} else if (codeDate) {
  const lagDays = (Date.parse(codeDate) - Date.parse(stateDate)) / 86400000;
  if (lagDays > 14) {
    console.error(`FAIL: CLAUDE.md current-state header (${stateDate}) is >14 days behind the latest code change (${codeDate}). Update the section and its date.`);
    failed = true;
  } else {
    console.log(`ok: CLAUDE.md current-state date ${stateDate} is within 14 days of the latest code change (${codeDate})`);
  }
}

process.exit(failed ? 1 : 0);
