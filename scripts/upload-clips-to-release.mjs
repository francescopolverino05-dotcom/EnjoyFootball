#!/usr/bin/env node
/**
 * Upload match clip MP4s to a GitHub Release and write public download URLs
 * into match.json so the website can play them.
 *
 * Token is loaded ONCE from .env (run: npm run setup-token -- ghp_...)
 * You do NOT need a new token for each match.
 *
 * Usage:
 *   npm run upload-clips -- --slug 2026-08-01_amichevole-u19-vs-u18
 *   npm run upload-clips -- --slug ... --dry-run
 */

import { existsSync, readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { resolveGitHubToken } from './load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const OWNER = 'francescopolverino05-dotcom';
const REPO = 'SSCN-Primavera';

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

function walkMp4s(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkMp4s(p));
    else if (name.toLowerCase().endsWith('.mp4')) out.push(p);
  }
  return out;
}

function safeAssetName(clipId, originalPath) {
  const ext = originalPath.toLowerCase().endsWith('.mp4') ? '.mp4' : '.mp4';
  return `${clipId.replace(/[^a-zA-Z0-9._-]/g, '_')}${ext}`;
}

function isHttp(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

async function gh(token, method, urlPath, { body, contentType } = {}) {
  const res = await fetch(`https://api.github.com${urlPath}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(contentType ? { 'Content-Type': contentType } : {}),
    },
    body,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = json?.message || text || res.statusText;
    throw new Error(`${method} ${urlPath} → ${res.status}: ${msg}`);
  }
  return json;
}

async function uploadAsset(token, releaseId, filePath, assetName) {
  const size = statSync(filePath).size;
  const url = `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${releaseId}/assets?name=${encodeURIComponent(assetName)}`;
  const buffer = readFileSync(filePath);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(size),
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: buffer,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Upload ${assetName} → ${res.status}: ${json.message || JSON.stringify(json)}`);
  }
  return json;
}

function resolveLocalPath(clip, byRel, files) {
  const candidates = [clip.localFile, clip.videoFile].filter(
    (p) => p && !isHttp(p)
  );
  for (const rel of candidates) {
    if (byRel.has(rel)) return { abs: byRel.get(rel), rel };
  }
  // Fallback: match by clip id fragment in filename
  const idPart = clip.id.replace(/[^a-zA-Z0-9]+/g, '_');
  const hit = files.find((abs) => abs.includes(clip.id) || abs.includes(idPart));
  if (hit) return { abs: hit, rel: relative(join(root, 'matches'), hit) };
  return null;
}

const args = parseArgs(process.argv.slice(2));
const slug = args.slug;
if (!slug) {
  console.error('Usage: npm run upload-clips -- --slug <match-folder-name>');
  process.exit(1);
}

const token = resolveGitHubToken();
if (!token && !args['dry-run']) {
  console.error(`
No GitHub token found on this Mac.

One-time setup (only once — not every match):
  1. Create a classic token with "repo" scope: https://github.com/settings/tokens
     Tip: set expiration to "No expiration" or 1 year
  2. Save it:
       npm run setup-token -- ghp_PASTE_TOKEN_HERE
  3. Then publish clips anytime:
       npm run publish-clips -- --slug ${slug}
`);
  process.exit(1);
}

const matchPath = join(root, 'matches', slug, 'match.json');
const clipsDir = join(root, 'matches', slug, 'clips');
if (!existsSync(matchPath)) {
  console.error('match.json not found:', matchPath);
  process.exit(1);
}

const match = JSON.parse(readFileSync(matchPath, 'utf8'));
const files = walkMp4s(clipsDir);
if (files.length === 0) {
  console.error('No MP4 files found in', clipsDir);
  process.exit(1);
}

const tag = args.tag || `clips-${match.date || slug.slice(0, 10)}`;
const releaseName = `Match clips — ${match.date || slug}`;

console.log(`Match: ${slug}`);
console.log(`Clips on disk: ${files.length}`);
console.log(`Release tag: ${tag}`);
console.log(`Clips in match.json: ${match.clips?.length ?? 0}`);

const byRel = new Map(
  files.map((abs) => [relative(clipsDir, abs).split('\\').join('/'), abs])
);

if (args['dry-run']) {
  for (const clip of match.clips || []) {
    const local = resolveLocalPath(clip, byRel, files);
    const asset = safeAssetName(clip.id, local?.rel || clip.localFile || clip.videoFile || '.mp4');
    console.log(`- ${clip.id}`);
    console.log(`  local: ${local ? 'OK ' + local.rel : 'MISSING'}`);
    console.log(`  asset: ${asset}`);
    console.log(`  url:   https://github.com/${OWNER}/${REPO}/releases/download/${tag}/${asset}`);
  }
  process.exit(0);
}

let release;
try {
  release = await gh(token, 'GET', `/repos/${OWNER}/${REPO}/releases/tags/${tag}`);
  console.log(`Using existing release #${release.id}`);
} catch {
  console.log('Creating release…');
  release = await gh(token, 'POST', `/repos/${OWNER}/${REPO}/releases`, {
    contentType: 'application/json',
    body: JSON.stringify({
      tag_name: tag,
      name: releaseName,
      body: `Clip assets for \`${slug}\`.\n\nServed to the website via release download URLs.`,
      draft: false,
      prerelease: false,
    }),
  });
  console.log(`Created release #${release.id}`);
}

const existingAssets = new Map((release.assets || []).map((a) => [a.name, a]));

for (const clip of match.clips || []) {
  const local = resolveLocalPath(clip, byRel, files);
  if (!local) {
    console.warn(`Skip ${clip.id}: local file missing`);
    continue;
  }

  // Keep local path for future re-syncs / re-uploads
  clip.localFile = local.rel;

  const assetName = safeAssetName(clip.id, local.rel);
  let asset = existingAssets.get(assetName);
  if (asset) {
    console.log(`Exists: ${assetName}`);
  } else {
    const mb = (statSync(local.abs).size / (1024 * 1024)).toFixed(1);
    console.log(`Uploading ${assetName} (${mb} MB)…`);
    asset = await uploadAsset(token, release.id, local.abs, assetName);
    existingAssets.set(assetName, asset);
    console.log(`  ✓ uploaded`);
  }
  clip.videoFile = `https://github.com/${OWNER}/${REPO}/releases/download/${tag}/${assetName}`;
}

writeFileSync(matchPath, JSON.stringify(match, null, 2) + '\n');
console.log(`\nUpdated ${matchPath}`);
