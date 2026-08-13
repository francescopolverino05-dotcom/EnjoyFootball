#!/usr/bin/env node
/**
 * Sync videos from a Vimeo folder into match.json or training.json.
 *
 * Match:
 *   npm run sync-vimeo -- --slug 2026-08-01_amichevole-u19-vs-u18
 *   npm run sync-vimeo -- --slug ... --folder 30093272
 *
 * Training:
 *   npm run sync-vimeo -- --training 2026-08-03_lunedi
 *   npm run sync-vimeo-training -- --slug 2026-08-03_lunedi
 *   npm run sync-vimeo -- --training 2026-08-03_lunedi --folder 30099288
 *
 * Match classification (by video / parent-folder name):
 *   - "full match" / "partita intera" → video.fullMatch
 *   - GK player reviews (Spinelli / Merone / Magliano / …, short duration)
 *     → goalkeeperAnalysisVideos (Goalkeeper Analysis tab)
 *   - "post match" / "analysis" / "analisi" → analysisVideos
 *   - otherwise → clips (section from [Build_up] in title, tags, or subfolder name)
 *
 * Training classification (by video / parent-folder name):
 *   - GK unit titles ("GK …", "goalkeeper", "portiere", "GK distribution", GK parent folder)
 *     → goalkeepers.video.parts / goalkeepers.clips / goalkeepers.analysisVideos
 *     (team drills like "5v7+GK" stay on the team side)
 *   - "video analysis" / "analysis" / "analisi" / "Final Third Clips" (clip compilations)
 *     → analysisVideos (Video Analysis tab)
 *   - "clip" / "clips" / timestamp clip names → clips (Clips tab)
 *   - otherwise → video.parts (Full Session tab); largest / "full session" → also fullSession
 *   - empty Vimeo folder → save folderId only; never clear video.parts / fullSession
 *   - non-empty sync merges: update/add Vimeo entries, keep local (non-Vimeo) parts/clips/docs
 *   - non-Vimeo PDF/markdown in analysisVideos are preserved
 *   - trainingDesign (session-plan PDFs) is left untouched
 *   - optional training.json → vimeo.skipNameRegex skips matching video names
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
  free_kick: 'set-piece',
  'free-kick': 'set-piece',
  opponent_free_kick: 'set-piece',
  'opponent-free-kick': 'set-piece',
  set_piece: 'set-piece',
  'set-piece': 'set-piece',
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
  'set-piece': { en: 'Set piece', it: 'Palla inattiva' },
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
  // Human-titled clips (e.g. "Actions") — keep the Vimeo name, not the section slug.
  if (!isClipStyleName(name)) {
    const cleaned = String(name || '')
      .replace(/[_\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned) {
      const tags = ['vimeo'];
      if (section && section !== 'other') tags.push(section);
      else if (/actions?/i.test(cleaned)) tags.push('actions', 'other');
      return { title: { en: cleaned, it: cleaned }, tags };
    }
  }
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

function isGoalkeeperMatchAnalysis(name, duration = 0) {
  const n = String(name || '');
  // Short/medium keeper review reels — not the full match tape.
  if (Number(duration) >= 1800) return false;
  return /\b(spinelli|merone|magliano|maiano|lieto|napoletano)\b/i.test(n);
}

function classifyVideo(name, parentFolderName, duration = 0) {
  const n = (name || '').toLowerCase();
  if (/full\s*match|partita\s*intera|partita\s*completa/.test(n)) {
    return { kind: 'full' };
  }
  if (isGoalkeeperMatchAnalysis(name, duration)) {
    return { kind: 'gk-analysis' };
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
  const id = videoNumericId(video);
  const link = video.link || (id ? `https://vimeo.com/${id}` : '');
  // Prefer watch URL that already includes the unlisted privacy hash path segment.
  if (/vimeo\.com\/\d+\/[a-f0-9]+/i.test(link)) return link;
  const embedHash = String(video.player_embed_url || '').match(/[?&]h=([a-f0-9]+)/i)?.[1];
  const privacyHash = video.privacy?.unlisted_hash || embedHash;
  if (id && privacyHash) return `https://vimeo.com/${id}/${privacyHash}`;
  return link;
}

function videoNumericId(video) {
  return String(video.uri || '').split('/').pop();
}

function normalizeVideoUrl(url) {
  return String(url || '').split('?')[0].replace(/\/$/, '');
}

function humanizeTrainingTitle(name) {
  const cleaned = String(name || 'Untitled')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { en: cleaned, it: cleaned };
}

function isFullSessionName(name) {
  const n = (name || '').toLowerCase();
  return /full\s*session|sessione\s*(completa|intera)?|full\s*training|intera\s*sessione|session\s*highlight/.test(
    n
  );
}

/**
 * Thematic clip compilations / review reels for Video Analysis
 * (not numbered individual clips like "clip 1").
 */
function isTrainingAnalysisCompilation(name) {
  const n = String(name || '').toLowerCase();
  // e.g. "Final Third Clips" — reel of numbered clips 1–N
  return /final\s*third\s*clips?\b/.test(n);
}

/**
 * True for dedicated GK-unit recordings (not team drills that merely include a GK).
 * Matches titles like "GK distribution 1", "goalkeeper 2", "portiere …", or a GK parent folder.
 * Leaves "5v7+GK" / "5v4+GK Attacco" on the team side.
 */
function isGoalkeeperTrainingVideo(name, parentFolderName = '') {
  const n = String(name || '').trim();
  const p = String(parentFolderName || '').trim();
  if (/^(gk|gks|goalkeeper|goalkeepers|portiere|portieri)(\b|[_\s-]|$)/i.test(p)) {
    return true;
  }
  if (/^(gk|goalkeeper|goalkeepers|portiere|portieri)\b/i.test(n)) {
    return true;
  }
  if (/\bgoalkeepers?\b/i.test(n) || /\bportieri?\b/i.test(n)) {
    return true;
  }
  // e.g. "… GK distribution …" / "distribuzione portiere"
  if (/\bgk\b/i.test(n) && /\b(distribution|distribuzione|training|session|drill|work|action)\b/i.test(n)) {
    return true;
  }
  if (/\bdistribuzione\b/i.test(n) && /\b(portiere|portieri|gk|goalkeeper)\b/i.test(n)) {
    return true;
  }
  return false;
}

/** Classify a training Vimeo item into clips / analysis / full-session parts. */
function classifyTrainingVideo(name, parentFolderName = '') {
  const hay = `${name || ''} ${parentFolderName || ''}`.toLowerCase();
  // Analysis before clip: names like "Final Third Clips" contain "clips"
  if (
    isTrainingAnalysisCompilation(name) ||
    /video\s*analysis|\banalisi\b|\banalysis\b/.test(hay)
  ) {
    return 'analysis';
  }
  if (/\bclips?\b/.test(hay) || isClipStyleName(name)) {
    return 'clip';
  }
  return 'session';
}

function clipNumberFromName(name) {
  const m = String(name || '').match(/\bclip\s*(\d+)\b/i);
  return m ? Number(m[1]) : 0;
}

function defaultVimeoFolderUrl(folderId) {
  return `https://vimeo.com/user/170593333/folder/${folderId}`;
}

function preserveNonVimeoAnalysis(entries) {
  return (entries || []).filter(
    (a) =>
      a?.kind === 'pdf' ||
      a?.kind === 'markdown' ||
      (a?.videoFile && !String(a.videoFile).includes('vimeo.com'))
  );
}

function isVimeoVideoFile(url) {
  return /vimeo\.com/i.test(String(url || ''));
}

function partTitleKey(part) {
  const t = part?.title;
  const s = typeof t === 'string' ? t : t?.en || t?.it || '';
  return String(s).trim().toLowerCase();
}

async function syncMatch(token, slug, folderOverride) {
  const matchPath = join(root, 'matches', slug, 'match.json');
  if (!existsSync(matchPath)) {
    console.error('match.json not found:', matchPath);
    process.exit(1);
  }

  const match = JSON.parse(readFileSync(matchPath, 'utf8'));
  const folderId = String(folderOverride || match.vimeo?.folderId || '');
  if (!folderId) {
    console.error('No folder id. Pass --folder <id> or set match.json → vimeo.folderId');
    process.exit(1);
  }

  match.vimeo = {
    ...(match.vimeo || {}),
    folderId,
    folderUrl: match.vimeo?.folderUrl || defaultVimeoFolderUrl(folderId),
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
    return;
  }

  const clips = [];
  const analysisVideos = [];
  const gkAnalysisVideos = [];
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
    if (kind.kind === 'gk-analysis') {
      gkAnalysisVideos.push({
        id: `vimeo-${id}`,
        title: { en: name, it: name },
        description: {
          en: 'Goalkeeper analysis synced from Vimeo.',
          it: 'Analisi portiere sincronizzata da Vimeo.',
        },
        videoFile: link,
        kind: 'video',
        tags: ['vimeo', 'analysis', 'goalkeeper'],
      });
      console.log(`  gk analysis ← ${name}`);
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
      // Preserve custom notes (e.g. stats caveats); only set a default when missing.
      notes: match.video?.notes || {
        en: 'Full match hosted on Vimeo.',
        it: 'Partita intera su Vimeo.',
      },
    };
  }

  if (analysisVideos.length > 0) {
    const preserved = preserveNonVimeoAnalysis(match.analysisVideos);
    const prevById = new Map(
      (match.analysisVideos || [])
        .filter((a) => a?.id)
        .map((a) => [a.id, a])
    );
    const byId = new Map();
    for (const a of [...analysisVideos, ...preserved]) {
      const prev = prevById.get(a.id);
      if (!prev || !isVimeoVideoFile(a.videoFile)) {
        byId.set(a.id, a);
        continue;
      }
      // Keep curated analysis copy (title/description/kind/tags) across re-syncs.
      byId.set(a.id, {
        ...a,
        title: prev.title || a.title,
        description: prev.description || a.description,
        kind: prev.kind || a.kind || 'video',
        tags:
          Array.isArray(prev.tags) && prev.tags.length ? prev.tags : a.tags,
      });
    }
    match.analysisVideos = [...byId.values()];
  }

  if (gkAnalysisVideos.length > 0) {
    const prevById = new Map(
      (match.goalkeeperAnalysisVideos || [])
        .filter((a) => a?.id)
        .map((a) => [a.id, a])
    );
    const byId = new Map();
    for (const a of gkAnalysisVideos) {
      const prev = prevById.get(a.id);
      if (!prev) {
        byId.set(a.id, a);
        continue;
      }
      byId.set(a.id, {
        ...a,
        title: prev.title || a.title,
        description: prev.description || a.description,
        kind: prev.kind || a.kind || 'video',
        tags:
          Array.isArray(prev.tags) && prev.tags.length ? prev.tags : a.tags,
      });
    }
    match.goalkeeperAnalysisVideos = [...byId.values()];
  }

  if (clips.length > 0) {
    const prevByUrl = new Map(
      (match.clips || [])
        .filter((c) => c?.videoFile)
        .map((c) => [normalizeVideoUrl(c.videoFile), c])
    );
    match.clips = clips.map((c) => {
      const prev = prevByUrl.get(normalizeVideoUrl(c.videoFile));
      if (!prev) return c;
      const merged = { ...c };
      if (prev.localFile) merged.localFile = prev.localFile;
      // Keep hand-tuned titles / comments / tags (e.g. Actions / Azioni).
      if (prev.title) merged.title = prev.title;
      if (prev.comments) merged.comments = prev.comments;
      if (Array.isArray(prev.tags) && prev.tags.length) merged.tags = prev.tags;
      return merged;
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
}

async function syncTraining(token, slug, folderOverride) {
  const trainingPath = join(root, 'trainings', slug, 'training.json');
  if (!existsSync(trainingPath)) {
    console.error('training.json not found:', trainingPath);
    process.exit(1);
  }

  const training = JSON.parse(readFileSync(trainingPath, 'utf8'));
  const folderId = String(folderOverride || training.vimeo?.folderId || '');
  if (!folderId) {
    console.error('No folder id. Pass --folder <id> or set training.json → vimeo.folderId');
    process.exit(1);
  }

  training.vimeo = {
    ...(training.vimeo || {}),
    folderId,
    folderUrl: training.vimeo?.folderUrl || defaultVimeoFolderUrl(folderId),
  };

  const folder = await vimeoGet(token, `/me/projects/${folderId}`);
  console.log(`Folder: ${folder.name} (#${folderId})`);

  const listed = await listFolderVideos(token, folderId);
  console.log(`Videos found: ${listed.length}`);

  if (listed.length === 0) {
    // Preserve existing video.parts / fullSession — empty folders must not wipe local media.
    writeFileSync(trainingPath, JSON.stringify(training, null, 2) + '\n');
    console.log(`
Folder is empty — folder mapping saved; video.parts / fullSession left unchanged
  (${(training.video?.parts || []).length} existing parts preserved).
Upload videos into the Vimeo folder, then re-run:

  npm run sync-vimeo -- --training ${slug}
`);
    return;
  }

  const skipNameRegex = training.vimeo?.skipNameRegex
    ? new RegExp(String(training.vimeo.skipNameRegex), 'i')
    : null;

  if (!training.goalkeepers || typeof training.goalkeepers !== 'object') {
    training.goalkeepers = {
      video: { parts: [] },
      clips: [],
      trainingDesign: null,
      analysisVideos: [],
    };
  }
  const gkBlock = training.goalkeepers;
  if (!gkBlock.video || typeof gkBlock.video !== 'object') gkBlock.video = { parts: [] };
  if (!Array.isArray(gkBlock.clips)) gkBlock.clips = [];
  if (!Array.isArray(gkBlock.analysisVideos)) gkBlock.analysisVideos = [];

  const prevParts = training.video?.parts || [];
  const prevClips = training.clips || [];
  const prevAnalysis = training.analysisVideos || [];
  const prevGkParts = gkBlock.video?.parts || [];
  const prevGkClips = gkBlock.clips || [];
  const prevGkAnalysis = gkBlock.analysisVideos || [];
  const prevByUrl = new Map(
    [...prevParts, ...prevClips, ...prevAnalysis, ...prevGkParts, ...prevGkClips, ...prevGkAnalysis]
      .filter((a) => a?.videoFile)
      .map((a) => [normalizeVideoUrl(a.videoFile), a])
  );

  const sessionParts = [];
  const clipEntries = [];
  const analysisEntries = [];
  const gkSessionParts = [];
  const gkClipEntries = [];
  const gkAnalysisEntries = [];
  let fullSessionUrl = null;
  let fullSessionDuration = -1;
  let fullSessionName = '';
  let namedFullSession = false;
  let gkFullSessionUrl = null;
  let gkFullSessionDuration = -1;
  let gkFullSessionName = '';
  let gkNamedFullSession = false;

  for (const { video, parentFolderName } of listed) {
    const name = video.name || 'Untitled';
    const isGk = isGoalkeeperTrainingVideo(name, parentFolderName);
    // skipNameRegex is for true omissions; GK-titled videos are routed to goalkeepers instead.
    if (!isGk && skipNameRegex && skipNameRegex.test(name)) {
      console.log(`  skip (skipNameRegex) ← ${name}`);
      continue;
    }
    const link = videoLink(video);
    const id = videoNumericId(video);
    const dur = Number(video.duration) || 0;
    const title = humanizeTrainingTitle(name);
    const prev = prevByUrl.get(normalizeVideoUrl(link));
    const bucket = classifyTrainingVideo(name, parentFolderName);
    const destLabel = isGk ? 'gk' : 'team';

    if (bucket === 'clip') {
      const n = clipNumberFromName(name);
      const section = prev?.section || (isGk ? 'gk-action' : 'other');
      const entry = {
        id: prev?.id || `vimeo-${id}`,
        title: prev?.title || title,
        comments: prev?.comments || title,
        minute: prev?.minute ?? n,
        second: prev?.second ?? 0,
        videoFile: link,
        section,
        labels: prev?.labels || [section],
        tags: prev?.tags || ['vimeo', 'training', 'clip'],
        ...(prev?.localFile ? { localFile: prev.localFile } : {}),
      };
      if (isGk) gkClipEntries.push(entry);
      else clipEntries.push(entry);
      console.log(`  ${destLabel} clip ← ${name} (${dur}s)`);
      continue;
    }

    if (bucket === 'analysis') {
      const entry = {
        id: prev?.id || `vimeo-${id}`,
        title: prev?.title || title,
        description: prev?.description || {
          en: 'Synced from Vimeo folder.',
          it: 'Sincronizzato dalla cartella Vimeo.',
        },
        videoFile: link,
        tags: prev?.tags || ['vimeo', 'analysis'],
      };
      if (isGk) gkAnalysisEntries.push(entry);
      else analysisEntries.push(entry);
      console.log(`  ${destLabel} analysis ← ${name} (${dur}s)`);
      continue;
    }

    const entry = {
      id: prev?.id || `vimeo-${id}`,
      title: prev?.title || title,
      description: prev?.description || {
        en: 'Training session recording.',
        it: 'Registrazione della sessione di allenamento.',
      },
      videoFile: link,
      tags: prev?.tags || ['vimeo', 'training', 'session'],
    };

    if (isGk) {
      gkSessionParts.push(entry);
      const named = isFullSessionName(name);
      if (named) {
        if (!gkNamedFullSession || dur >= gkFullSessionDuration) {
          gkFullSessionUrl = link;
          gkFullSessionDuration = dur;
          gkFullSessionName = name;
          gkNamedFullSession = true;
        }
      } else if (!gkNamedFullSession && dur > gkFullSessionDuration) {
        gkFullSessionUrl = link;
        gkFullSessionDuration = dur;
        gkFullSessionName = name;
      }
      console.log(`  gk session ← ${name} (${dur}s)`);
      continue;
    }

    sessionParts.push(entry);

    const named = isFullSessionName(name);
    if (named) {
      if (!namedFullSession || dur >= fullSessionDuration) {
        fullSessionUrl = link;
        fullSessionDuration = dur;
        fullSessionName = name;
        namedFullSession = true;
      }
      console.log(`  session ← ${name} (${dur}s) ${link}`);
    } else {
      if (!namedFullSession && dur > fullSessionDuration) {
        fullSessionUrl = link;
        fullSessionDuration = dur;
        fullSessionName = name;
      }
      console.log(`  session ← ${name} (${dur}s)`);
    }
  }

  function mergeVimeoWithLocal(prevList, vimeoList, { preferTitleMatch = false } = {}) {
    const vimeoTitleKeys = new Set(vimeoList.map(partTitleKey).filter(Boolean));
    const ordered = [];
    const seenUrls = new Set();
    for (const prev of prevList) {
      const url = normalizeVideoUrl(prev.videoFile);
      const next = vimeoList.find((a) => normalizeVideoUrl(a.videoFile) === url);
      if (next) {
        ordered.push(next);
        seenUrls.add(normalizeVideoUrl(next.videoFile));
      }
    }
    for (const a of vimeoList) {
      const url = normalizeVideoUrl(a.videoFile);
      if (!seenUrls.has(url)) {
        ordered.push(a);
        seenUrls.add(url);
      }
    }
    let keptLocal = 0;
    for (const prev of prevList) {
      if (isVimeoVideoFile(prev.videoFile)) continue;
      const url = normalizeVideoUrl(prev.videoFile);
      if (seenUrls.has(url)) continue;
      if (preferTitleMatch) {
        const titleKey = partTitleKey(prev);
        if (titleKey && vimeoTitleKeys.has(titleKey)) {
          console.log(`  local replaced by Vimeo title match ← ${titleKey} (${prev.videoFile})`);
          continue;
        }
      }
      ordered.push(prev);
      seenUrls.add(url);
      keptLocal += 1;
      console.log(`  keep local ← ${prev.videoFile}`);
    }
    return { ordered, keptLocal };
  }

  function entryLooksGk(entry) {
    const t = partTitleKey(entry);
    const local = String(entry?.localFile || entry?.videoFile || '');
    return (
      isGoalkeeperTrainingVideo(t) ||
      isGoalkeeperTrainingVideo(local) ||
      /(?:^|\/)gk(?:\/|$)/i.test(local)
    );
  }

  // Keep GK-titled leftovers off the team side (and vice versa) across re-syncs.
  const teamPrevParts = prevParts.filter((e) => !entryLooksGk(e));
  const teamPrevClips = prevClips.filter((e) => !entryLooksGk(e));
  const teamPrevAnalysis = prevAnalysis.filter((e) => !entryLooksGk(e));
  const gkPrevParts = [
    ...prevGkParts,
    ...prevParts.filter((e) => entryLooksGk(e) && !isVimeoVideoFile(e.videoFile)),
  ];
  const gkPrevClips = [
    ...prevGkClips,
    ...prevClips.filter((e) => entryLooksGk(e) && !isVimeoVideoFile(e.videoFile)),
  ];
  const gkPrevAnalysis = [
    ...prevGkAnalysis,
    ...prevAnalysis.filter((e) => entryLooksGk(e) && !isVimeoVideoFile(e.videoFile)),
  ];

  const { ordered, keptLocal } = mergeVimeoWithLocal(teamPrevParts, sessionParts, {
    preferTitleMatch: true,
  });

  // Drop stale Vimeo clips that moved into analysis/session; keep local (non-Vimeo) clips.
  const sessionAndAnalysisUrls = new Set(
    [...sessionParts, ...analysisEntries].map((a) => normalizeVideoUrl(a.videoFile))
  );
  const prevClipsForMerge = teamPrevClips.filter((c) => {
    if (!isVimeoVideoFile(c.videoFile)) return true;
    const url = normalizeVideoUrl(c.videoFile);
    if (sessionAndAnalysisUrls.has(url)) return false;
    return true;
  });
  const { ordered: mergedClips, keptLocal: keptLocalClips } = mergeVimeoWithLocal(
    prevClipsForMerge,
    clipEntries
  );
  mergedClips.sort((a, b) => {
    const an = a.minute * 60 + (a.second || 0);
    const bn = b.minute * 60 + (b.second || 0);
    if (an !== bn) return an - bn;
    return String(a.title?.en || a.title || '').localeCompare(String(b.title?.en || b.title || ''));
  });

  // Keep PDF/markdown (and any other non-Vimeo docs) on Video Analysis.
  // Session-plan PDFs live on trainingDesign (Training Design tab) — leave untouched.
  const preservedDocs = preserveNonVimeoAnalysis(teamPrevAnalysis);
  const analysisById = new Map();
  for (const a of [...analysisEntries, ...preservedDocs]) analysisById.set(a.id, a);
  training.analysisVideos = [...analysisById.values()];
  if (!Array.isArray(training.trainingDesign)) {
    training.trainingDesign = [];
  }

  training.clips = mergedClips;
  const gkVimeoUrls = new Set(
    [...gkSessionParts, ...gkClipEntries, ...gkAnalysisEntries].map((a) =>
      normalizeVideoUrl(a.videoFile)
    )
  );
  let resolvedFullSession =
    fullSessionUrl || training.video?.fullSession || ordered[0]?.videoFile;
  if (resolvedFullSession && gkVimeoUrls.has(normalizeVideoUrl(resolvedFullSession))) {
    resolvedFullSession = fullSessionUrl || ordered[0]?.videoFile;
  }
  training.video = {
    ...(training.video || {}),
    parts: ordered,
    fullSession: resolvedFullSession,
    notes: {
      en:
        training.video?.notes?.en ||
        (fullSessionName
          ? `Session recordings on Vimeo (${sessionParts.length} videos).`
          : 'Session recordings on Vimeo.'),
      it:
        training.video?.notes?.it ||
        (fullSessionName
          ? `Registrazioni sessione su Vimeo (${sessionParts.length} video).`
          : 'Registrazioni sessione su Vimeo.'),
    },
  };
  if (fullSessionUrl && !namedFullSession) {
    console.log(`  fullSession highlight (largest) ← ${fullSessionName} (${fullSessionDuration}s)`);
  }

  const { ordered: gkOrderedParts, keptLocal: keptLocalGkParts } = mergeVimeoWithLocal(
    gkPrevParts,
    gkSessionParts,
    { preferTitleMatch: true }
  );
  const gkSessionAnalysisUrls = new Set(
    [...gkSessionParts, ...gkAnalysisEntries].map((a) => normalizeVideoUrl(a.videoFile))
  );
  const gkPrevClipsForMerge = gkPrevClips.filter((c) => {
    if (!isVimeoVideoFile(c.videoFile)) return true;
    return !gkSessionAnalysisUrls.has(normalizeVideoUrl(c.videoFile));
  });
  const { ordered: gkMergedClips, keptLocal: keptLocalGkClips } = mergeVimeoWithLocal(
    gkPrevClipsForMerge,
    gkClipEntries
  );
  gkMergedClips.sort((a, b) => {
    const an = a.minute * 60 + (a.second || 0);
    const bn = b.minute * 60 + (b.second || 0);
    if (an !== bn) return an - bn;
    return String(a.title?.en || a.title || '').localeCompare(String(b.title?.en || b.title || ''));
  });
  const gkPreservedDocs = preserveNonVimeoAnalysis(gkPrevAnalysis);
  const gkAnalysisById = new Map();
  for (const a of [...gkAnalysisEntries, ...gkPreservedDocs]) gkAnalysisById.set(a.id, a);

  training.goalkeepers = {
    ...gkBlock,
    video: {
      ...(gkBlock.video || {}),
      parts: gkOrderedParts,
      fullSession:
        gkFullSessionUrl ||
        gkBlock.video?.fullSession ||
        gkOrderedParts[0]?.videoFile ||
        undefined,
    },
    clips: gkMergedClips,
    analysisVideos: [...gkAnalysisById.values()],
  };
  if (gkFullSessionUrl && !gkNamedFullSession && gkFullSessionName) {
    console.log(
      `  gk fullSession highlight (largest) ← ${gkFullSessionName} (${gkFullSessionDuration}s)`
    );
  }

  training.vimeo = {
    ...(training.vimeo || {}),
    lastSyncedAt: new Date().toISOString(),
  };

  // Keep status as-is (do not force draft)
  writeFileSync(trainingPath, JSON.stringify(training, null, 2) + '\n');
  console.log(`
Updated ${trainingPath}
  status:      ${training.status || '(unset)'}
  fullSession: ${training.video?.fullSession ? 'yes' : '(none)'}
  parts:       ${ordered.length} (${sessionParts.length} Vimeo + ${keptLocal} local)
  clips:       ${mergedClips.length} (${clipEntries.length} Vimeo + ${keptLocalClips} local)
  analysis:    ${training.analysisVideos.length} (${analysisEntries.length} Vimeo + ${preservedDocs.length} docs)
  design:      ${(training.trainingDesign || []).length} (session plans, untouched)
  gk parts:    ${gkOrderedParts.length} (${gkSessionParts.length} Vimeo + ${keptLocalGkParts} local)
  gk clips:    ${gkMergedClips.length} (${gkClipEntries.length} Vimeo + ${keptLocalGkClips} local)
  gk analysis: ${training.goalkeepers.analysisVideos.length} (${gkAnalysisEntries.length} Vimeo)
`);
}

const args = parseArgs(process.argv.slice(2));
const trainingFlag = args.training;
const isTraining =
  trainingFlag === true ||
  (typeof trainingFlag === 'string' && trainingFlag.length > 0);
const slug =
  (typeof trainingFlag === 'string' && trainingFlag !== 'true' ? trainingFlag : null) ||
  args.slug ||
  null;

if (!slug) {
  console.error(`Usage:
  Match:    npm run sync-vimeo -- --slug <match-folder> [--folder <id>]
  Training: npm run sync-vimeo -- --training <training-slug> [--folder <id>]
            npm run sync-vimeo-training -- --slug <training-slug> [--folder <id>]`);
  process.exit(1);
}

const token = resolveVimeoToken();
if (!token) {
  console.error(`No Vimeo token. Run: npm run setup-vimeo-token -- YOUR_TOKEN`);
  process.exit(1);
}

if (isTraining) {
  await syncTraining(token, slug, args.folder);
} else {
  await syncMatch(token, slug, args.folder);
}
