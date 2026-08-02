#!/usr/bin/env node
/**
 * Sync videos from a Vimeo folder into match.json.
 *
 *   npm run sync-vimeo -- --slug 2026-08-01_amichevole-u19-vs-u18
 *   npm run sync-vimeo -- --slug ... --folder 30093272
 *
 * Classification (by video / parent-folder name):
 *   - "full match" / "partita intera" → video.fullMatch
 *   - "post match" / "analysis" / "analisi" → analysisVideos
 *   - otherwise → clips (section from [Build_up] in title, tags, or subfolder name)
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { resolveVimeoToken } from './load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SECTION_ALIASES = {
  build_up: 'build-up',
  'build-up': 'build-up',
  buildup: 'build-up',
  progress: 'progress',
  progression: 'progress',
  transition_to_attack: 'offensive-transition',
  'transition-to-attack': 'offensive-transition',
  'offensive-transition': 'offensive-transition',
  mid_block: 'mid-block',
  'mid-block': 'mid-block',
  high_defence: 'high-defence',
  high_defense: 'high-defence',
  'high-defence': 'high-defence',
  final_third: 'final-third',
  'final-third': 'final-third',
  own_third: 'own-third',
  'own-third': 'own-third',
  transition_to_defence: 'defensive-transition',
  transition_to_defense: 'defensive-transition',
  'transition-to-defence': 'defensive-transition',
  'defensive-transition': 'defensive-transition',
  goal: 'goal',
  half_start: 'other',
  half_finish: 'other',
  other: 'other',
};

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

function normalizeSection(raw) {
  if (!raw) return null;
  const key = String(raw)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
  const dashed = key.replace(/_/g, '-');
  return SECTION_ALIASES[key] || SECTION_ALIASES[dashed] || null;
}

function classifyVideo(name, parentFolderName) {
  const n = (name || '').toLowerCase();
  if (/full\s*match|partita\s*intera|partita\s*completa/.test(n)) {
    return { kind: 'full' };
  }
  if (/post[\s_-]*match|analisi|analysis|video\s*analysis/.test(n)) {
    return { kind: 'analysis' };
  }

  if (/half[_\s-]*start|half[_\s-]*finish|\bgoal\b/i.test(name) && /_(nd|wd)_/i.test(name)) {
    if (/Half_Start|Half_Finish|_Goal__/i.test(name) || /_nd_Goal_|_wd_Goal_/i.test(name)) {
      return { kind: 'skip' };
    }
  }
  if (/Half_Start|Half_Finish/i.test(name) || /_nd_Goal__|_wd_Goal__/i.test(name)) {
    return { kind: 'skip' };
  }

  const bracket = name.match(/\[([^\]]+)\]/);
  let section =
    normalizeSection(bracket?.[1]) ||
    normalizeSection(parentFolderName) ||
    null;

  if (!section) {
    for (const alias of Object.keys(SECTION_ALIASES)) {
      const re = new RegExp(`\\b${alias.replace(/_/g, '[\\s_-]+')}\\b`, 'i');
      if (re.test(name)) {
        section = SECTION_ALIASES[alias];
        break;
      }
    }
  }

  if (section === 'goal' || section === 'other') {
    return { kind: 'skip' };
  }

  const time =
    name.match(/(\d{1,3})[:'′](\d{2})/) ||
    name.match(/\b(\d{1,3})_(\d{2})\b/);
  const minute = time ? Number(time[1]) : 0;
  const second = time ? Number(time[2]) : 0;

  return {
    kind: 'clip',
    section: section || 'other',
    minute,
    second,
  };
}

async function vimeoGet(token, path) {
  const res = await fetch(`https://api.vimeo.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`${path} → ${res.status}: ${json.error || json.message || JSON.stringify(json)}`);
  }
  return json;
}

async function listFolderVideos(token, folderId, parentName = '') {
  const out = [];
  let page = 1;
  for (;;) {
    const items = await vimeoGet(
      token,
      `/me/projects/${folderId}/items?per_page=100&page=${page}`
    );
    for (const item of items.data || []) {
      if (item.type === 'video' && item.video) {
        out.push({ video: item.video, parentFolderName: parentName });
      } else if (item.type === 'folder' && item.folder) {
        const subId = String(item.folder.uri).split('/').pop();
        const nested = await listFolderVideos(token, subId, item.folder.name);
        out.push(...nested);
      }
    }
    if (!items.paging?.next) break;
    page += 1;
  }

  // Fallback: some accounts only populate /videos
  if (out.length === 0) {
    let vpage = 1;
    for (;;) {
      const videos = await vimeoGet(
        token,
        `/me/projects/${folderId}/videos?per_page=100&page=${vpage}`
      );
      for (const video of videos.data || []) {
        out.push({ video, parentFolderName: parentName });
      }
      if (!videos.paging?.next) break;
      vpage += 1;
    }
  }

  return out;
}

function videoLink(video) {
  return video.link || `https://vimeo.com/${String(video.uri || '').split('/').pop()}`;
}

function videoNumericId(video) {
  return String(video.uri || '').split('/').pop();
}

const args = parseArgs(process.argv.slice(2));
const slug = args.slug;
if (!slug) {
  console.error(`Usage: npm run sync-vimeo -- --slug <match-folder> [--folder <id>]`);
  process.exit(1);
}

const token = resolveVimeoToken();
if (!token) {
  console.error(`No Vimeo token. Run: npm run setup-vimeo-token -- YOUR_TOKEN`);
  process.exit(1);
}

const matchPath = join(root, 'matches', slug, 'match.json');
if (!existsSync(matchPath)) {
  console.error('match.json not found:', matchPath);
  process.exit(1);
}

const match = JSON.parse(readFileSync(matchPath, 'utf8'));
const folderId = String(args.folder || match.vimeo?.folderId || '');
if (!folderId) {
  console.error('No folder id. Pass --folder <id> or set match.json → vimeo.folderId');
  process.exit(1);
}

match.vimeo = {
  ...(match.vimeo || {}),
  folderId,
  folderUrl:
    match.vimeo?.folderUrl ||
    `https://vimeo.com/user/170593333/folder/${folderId}`,
};

const folder = await vimeoGet(token, `/me/projects/${folderId}`);
console.log(`Folder: ${folder.name} (#${folderId})`);

const listed = await listFolderVideos(token, folderId);
console.log(`Videos found: ${listed.length}`);

if (listed.length === 0) {
  writeFileSync(matchPath, JSON.stringify(match, null, 2) + '\n');
  console.log(`
Folder is empty — match.json folder mapping saved.
Upload videos into the Vimeo folder, then re-run:

  npm run sync-vimeo -- --slug ${slug}
`);
  process.exit(0);
}

const clips = [];
const analysisVideos = [];
let fullMatchUrl = null;

for (const { video, parentFolderName } of listed) {
  const name = video.name || 'Untitled';
  const link = videoLink(video);
  const id = videoNumericId(video);
  const kind = classifyVideo(name, parentFolderName);

  if (kind.kind === 'full') {
    fullMatchUrl = link;
    console.log(`  full match ← ${name}`);
    continue;
  }
  if (kind.kind === 'analysis') {
    analysisVideos.push({
      id: `vimeo-${id}`,
      title: { en: name, it: name },
      description: {
        en: 'Synced from Vimeo folder.',
        it: 'Sincronizzato dalla cartella Vimeo.',
      },
      videoFile: link,
      tags: ['vimeo', 'analysis'],
    });
    console.log(`  analysis ← ${name}`);
    continue;
  }
  if (kind.kind === 'skip') {
    continue;
  }

  const section = kind.section;
  clips.push({
    id: `vimeo-${id}`,
    title: { en: name, it: name },
    comments: { en: name, it: name },
    minute: kind.minute,
    second: kind.second,
    videoFile: link,
    section,
    labels: [section],
    tags: ['vimeo'],
  });
  console.log(`  clip [${section}] ← ${name}`);
}

if (fullMatchUrl) {
  match.video = {
    ...(match.video || {}),
    fullMatch: fullMatchUrl,
    notes: {
      en: 'Full match hosted on Vimeo.',
      it: 'Partita intera su Vimeo.',
    },
  };
}

if (analysisVideos.length > 0) {
  match.analysisVideos = analysisVideos;
}

if (clips.length > 0) {
  match.clips = clips;
}

writeFileSync(matchPath, JSON.stringify(match, null, 2) + '\n');
console.log(`
Updated ${matchPath}
  fullMatch: ${fullMatchUrl ? 'yes' : '(unchanged)'}
  analysis:  ${analysisVideos.length}
  clips:     ${clips.length}
`);
