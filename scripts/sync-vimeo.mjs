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

const SECTION_LABELS = {
  'build-up': { en: 'Build-up', it: 'Costruzione' },
  progress: { en: 'Progression', it: 'Progressione' },
  'offensive-transition': { en: 'Transition to attack', it: 'Transizione offensiva' },
  'mid-block': { en: 'Mid block', it: 'Blocco medio' },
  'high-defence': { en: 'High defence', it: 'Difesa alta' },
  'final-third': { en: 'Final third', it: 'Ultimo terzo' },
  'own-third': { en: 'Own third', it: 'Proprio terzo' },
  'defensive-transition': { en: 'Transition to defence', it: 'Transizione difensiva' },
};

const COMMENT_FIX = [
  ['Distribuzione e decisione port', { en: 'GK distribution and decision', it: 'Distribuzione e decisione portiere' }],
  ['rotazione centrocampo naturale', { en: 'Natural midfield rotation', it: 'Rotazione centrocampo naturale' }],
  ['Esempio Ideale Di costruzione', { en: 'Ideal build-up example', it: 'Esempio ideale di costruzione' }],
  ['Poca mobilit', { en: 'Little mobility from the attackers', it: 'Poca mobilità dagli attaccanti' }],
  ['Posizionaento generalmente buo', { en: 'Generally good positioning', it: 'Posizionamento generalmente buono' }],
  ['Molto buona la marcatura', { en: 'Very good man-marking', it: 'Molto buona la marcatura a uomo' }],
  ['Prossimo step', { en: 'Next step — more toward the line', it: 'Prossimo step — più verso la linea' }],
  ['Trasizione offensiva buona', { en: 'Good offensive transition', it: 'Transizione offensiva buona' }],
  ['gol concesso', { en: 'Goal conceded — not aggressive enough', it: 'Gol concesso — poco aggressivi' }],
];

function titleFromClipName(name, section) {
  const labels = SECTION_LABELS[section] || { en: section || 'Clip', it: section || 'Clip' };
  const m = String(name || '').match(
    /^(\d{1,3})_(\d{2})_(?:wd|nd)_(.+?)__(?:(?:good|bad)(?:_favorite)?_)?(?:\d{1,3}_\d{2}_(?:Attacking|Defending)_\d+)?(?:_(.*))?$/i
  );
  let comment = '';
  let rating = null;
  let phase = null;
  if (m) {
    const rest = m[0];
    if (/_good(?:_favorite)?_/i.test(rest)) rating = 'good';
    else if (/_bad(?:_favorite)?_/i.test(rest)) rating = 'bad';
    if (/_Attacking_/i.test(rest)) phase = 'attacking';
    else if (/_Defending_/i.test(rest)) phase = 'defending';
    comment = String(m[4] || '')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[\s\-_]+|[\s\-_]+$/g, '')
      .trim();
  }
  let title = { ...labels };
  if (comment) {
    title = { en: comment, it: comment };
    for (const [key, fixed] of COMMENT_FIX) {
      if (comment.includes(key) || comment.startsWith(key)) {
        title = { ...fixed };
        break;
      }
    }
  }
  const tags = ['vimeo'];
  if (rating) tags.push(rating);
  if (phase) tags.push(phase);
  return { title, tags };
}


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

function isClipStyleName(name) {
  return /^\d{1,3}_\d{2}_(?:nd|wd)_/i.test(name || '');
}

function sectionFromClipName(name) {
  // e.g. 88_45_wd_Build_up__good... or 13_57_nd_Transition_to_defence__14_30...
  const m = (name || '').match(/^\d{1,3}_\d{2}_(?:nd|wd)_([A-Za-z0-9]+(?:_[A-Za-z0-9]+)*)__/i);
  return m ? normalizeSection(m[1]) : null;
}

function classifyVideo(name, parentFolderName, duration = 0) {
  const n = (name || '').toLowerCase();
  if (/full\s*match|partita\s*intera|partita\s*completa/.test(n)) {
    return { kind: 'full' };
  }
  // Full match uploads often keep the match title (no clip timestamp prefix).
  // Prefer long duration; also accept short/processing stubs with match-like titles.
  if (!isClipStyleName(name) && !/post[\s_-]*match|analisi|analysis|video\s*analysis/.test(n)) {
    if (duration >= 1800 || /amichevole|friendly|vs\.?\s*u18|vs\.?\s*u19|primavera/i.test(name || '')) {
      return { kind: 'full' };
    }
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
    sectionFromClipName(name) ||
    normalizeSection(bracket?.[1]) ||
    normalizeSection(parentFolderName) ||
    null;

  if (!section) {
    for (const alias of Object.keys(SECTION_ALIASES)) {
      const re = new RegExp(`(?:^|[_\\s-])${alias.replace(/_/g, '[_\\s-]+')}(?:$|[_\\s-])`, 'i');
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
    name.match(/^(\d{1,3})_(\d{2})_/);
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
let fullMatchDuration = 0;

for (const { video, parentFolderName } of listed) {
  const name = video.name || 'Untitled';
  const link = videoLink(video);
  const id = videoNumericId(video);
  const kind = classifyVideo(name, parentFolderName, Number(video.duration) || 0);

  if (kind.kind === 'full') {
    const dur = Number(video.duration) || 0;
    if (!fullMatchUrl || dur >= (fullMatchDuration || 0)) {
      fullMatchUrl = link;
      fullMatchDuration = dur;
      console.log(`  full match ← ${name} (${dur}s) ${link}`);
    } else {
      console.log(`  full match (skipped shorter/stub) ← ${name} (${dur}s)`);
    }
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
  const { title, tags } = titleFromClipName(name, section);
  clips.push({
    id: `vimeo-${id}`,
    title,
    comments: title,
    minute: kind.minute,
    second: kind.second,
    videoFile: link,
    section,
    labels: [section],
    tags,
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
  const preserved = (match.analysisVideos || []).filter(
    (a) =>
      a?.kind === 'pdf' ||
      a?.kind === 'markdown' ||
      (a?.videoFile && !String(a.videoFile).includes('vimeo.com'))
  );
  const byId = new Map();
  for (const a of [...analysisVideos, ...preserved]) byId.set(a.id, a);
  match.analysisVideos = [...byId.values()];
}

if (clips.length > 0) {
  const prevByUrl = new Map(
    (match.clips || [])
      .filter((c) => c?.videoFile)
      .map((c) => [String(c.videoFile).split('?')[0], c])
  );
  match.clips = clips.map((c) => {
    const prev = prevByUrl.get(String(c.videoFile).split('?')[0]);
    if (prev?.localFile) return { ...c, localFile: prev.localFile };
    return c;
  });
}

match.vimeo = {
  ...(match.vimeo || {}),
  lastSyncedAt: new Date().toISOString(),
};

writeFileSync(matchPath, JSON.stringify(match, null, 2) + '\n');
console.log(`
Updated ${matchPath}
  fullMatch: ${fullMatchUrl ? 'yes' : '(unchanged)'}
  analysis:  ${(match.analysisVideos || []).length}
  clips:     ${clips.length}
`);
