#!/usr/bin/env node
/**
 * Weekly one-command publish:
 *   1) sync drop folder → matches/<slug>/clips
 *   2) rebuild match.json clip list
 *   3) upload new MP4s to GitHub Release (uses saved token)
 *   4) commit + push match.json so the website updates
 *
 * One-time token setup (not every match):
 *   npm run setup-token -- ghp_...
 *
 * Then every week:
 *   npm run publish-clips -- --slug 2026-08-01_amichevole-u19-vs-u18
 */

import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { resolveGitHubToken } from './load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) args[key] = true;
      else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

function run(cmd, cmdArgs, opts = {}) {
  console.log(`\n→ ${cmd} ${cmdArgs.join(' ')}`);
  const res = spawnSync(cmd, cmdArgs, {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
    ...opts,
  });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

const args = parseArgs(process.argv.slice(2));
const slug = args.slug;
if (!slug) {
  console.error(`
Usage:
  npm run publish-clips -- --slug <match-folder>

Example:
  npm run publish-clips -- --slug 2026-08-01_amichevole-u19-vs-u18
`);
  process.exit(1);
}

if (!resolveGitHubToken() && !args['dry-run']) {
  console.error(`
No saved GitHub token.

Do this ONCE (not every match):
  1. https://github.com/settings/tokens  → classic token, "repo" scope
  2. npm run setup-token -- ghp_PASTE_TOKEN_HERE
  3. npm run publish-clips -- --slug ${slug}
`);
  process.exit(1);
}

const syncArgs = ['scripts/sync-clips.mjs', '--slug', slug];
if (args.from) syncArgs.push('--from', args.from);
run('node', syncArgs);

const uploadArgs = ['scripts/upload-clips-to-release.mjs', '--slug', slug];
if (args.tag) uploadArgs.push('--tag', args.tag);
if (args['dry-run']) uploadArgs.push('--dry-run');
run('node', uploadArgs);

if (args['dry-run'] || args['no-push']) {
  console.log('\nDone (no git push).');
  process.exit(0);
}

run('git', ['add', `matches/${slug}/match.json`]);
const status = spawnSync('git', ['status', '--porcelain', `matches/${slug}/match.json`], {
  cwd: root,
  encoding: 'utf8',
});
if (!status.stdout.trim()) {
  console.log('\nNo match.json changes to commit (already up to date).');
  process.exit(0);
}

run('git', [
  'commit',
  '-m',
  `Publish clip URLs for ${slug}`,
]);
run('git', ['push', 'origin', 'HEAD']);

console.log(`
✓ Clips published.

Website will pick up match.json on the next GitHub Pages deploy.
Videos play from the GitHub Release for this match.
`);
