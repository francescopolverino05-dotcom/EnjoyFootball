#!/usr/bin/env node
/**
 * One-time setup: save your GitHub token locally so you never pass it again.
 *
 *   npm run setup-token -- ghp_your_token_here
 *
 * Create a classic token with "repo" scope (no expiry, or long expiry):
 *   https://github.com/settings/tokens
 */

import { saveGitHubToken } from './load-env.mjs';

const token = process.argv[2];
if (!token || token.startsWith('-')) {
  console.error(`
One-time setup — save a GitHub token on this Mac.

1. Open https://github.com/settings/tokens
2. Generate a classic token with the "repo" scope
   (set expiry to "No expiration" or 1 year — you will NOT need a new one each match)
3. Run:

   npm run setup-token -- ghp_PASTE_TOKEN_HERE

After that, every week you only run:

   npm run publish-clips -- --slug <match-folder>
`);
  process.exit(1);
}

const { envPath, tokenPath } = saveGitHubToken(token);
console.log(`
✓ Token saved (once).

  ${envPath}
  ${tokenPath}

These files are gitignored. You will not need a new token for each match.

Weekly publish:

  npm run publish-clips -- --slug 2026-08-01_amichevole-u19-vs-u18
`);
