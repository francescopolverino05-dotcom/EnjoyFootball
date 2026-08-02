#!/usr/bin/env node
/**
 * One-time setup: save your Vimeo API token locally.
 *
 *   npm run setup-vimeo-token -- YOUR_TOKEN
 *
 * Create a token at https://developer.vimeo.com/apps (scopes: private, public)
 */

import { saveVimeoToken } from './load-env.mjs';

const token = process.argv[2];
if (!token || token.startsWith('-')) {
  console.error(`
One-time setup — save a Vimeo API token on this Mac.

1. Open https://developer.vimeo.com/apps
2. Create/select your app → Generate an access token
   (include private + public; video_files if offered)
3. Run:

   npm run setup-vimeo-token -- PASTE_TOKEN_HERE
`);
  process.exit(1);
}

const { envPath, tokenPath } = saveVimeoToken(token);
console.log(`
✓ Vimeo token saved (once).

  ${envPath}
  ${tokenPath}

These files are gitignored. Do not paste the token in chat again.
`);
