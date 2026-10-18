#!/usr/bin/env node
/**
 * Ensure Avversari/{competition}/{opponent}/{Studio Report|Partite di Riferimento}
 * matches the Avellino template, with optional club folder colors.
 *
 * Dry-run:  node tmp/setup-avversari-folders.mjs
 * Apply:    node tmp/setup-avversari-folders.mjs --apply
 */
import { resolveVimeoToken } from '../scripts/load-env.mjs';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APPLY = process.argv.includes('--apply');
const token = resolveVimeoToken();
if (!token) {
  console.error('No Vimeo token');
  process.exit(1);
}

const USER_ID = '170593333';
const AVVERSARI_ID = '30211870';

const COMPETITIONS = {
  primavera2: {
    name: 'Primavera 2',
    folderId: '30426895',
    opponents: [
      { id: 'ascoli', name: 'Ascoli', color: '#1a1a1a' },
      { id: 'avellino', name: 'Avellino', color: '#028c00', folderId: '30211881' },
      { id: 'bari', name: 'Bari', color: '#c8102e' },
      { id: 'benevento', name: 'Benevento', color: '#ffcc00' },
      { id: 'catanzaro', name: 'Catanzaro', color: '#eeff00', folderId: '30211887' },
      { id: 'cosenza', name: 'Cosenza', color: '#e30613' },
      { id: 'frosinone', name: 'Frosinone', color: '#ffcc00' },
      { id: 'latina', name: 'Latina', color: '#0033a0' },
      { id: 'monopoli', name: 'Monopoli', color: '#006633' },
      { id: 'palermo', name: 'Palermo', color: '#e6007e' },
      { id: 'perugia', name: 'Perugia', color: '#ed1c24' },
      { id: 'pescara', name: 'Pescara', color: '#0099cc' },
      { id: 'pisa', name: 'Pisa', color: '#003399' },
      { id: 'salernitana', name: 'Salernitana', color: '#6d071a' },
      { id: 'spezia', name: 'Spezia', color: '#111111' },
    ],
  },
  uefaYouthLeague: {
    name: 'Youth League',
    folderId: '30426904',
    opponents: [
      { id: 'arsenal', name: 'Arsenal', color: '#ff0000', folderId: '30426908' },
      { id: 'villarreal', name: 'Villarreal', color: '#ffe014' },
      { id: 'bodo-glimt', name: 'Bodø/Glimt', color: '#ffed00' },
      { id: 'porto', name: 'Porto', color: '#003893' },
      { id: 'man-city', name: 'Manchester City', color: '#6cabdd' },
      { id: 'club-brugge', name: 'Club Brugge', color: '#0054a3' },
    ],
  },
  coppaItalia: {
    name: 'Coppa Italia',
    folderId: '30426905',
    opponents: [
      { id: 'spezia', name: 'Spezia', color: '#111111' },
    ],
  },
};

const SUBFOLDERS = ['Studio Report', 'Partite di Riferimento'];

async function vimeo(method, path, body, attempt = 1) {
  const res = await fetch(`https://api.vimeo.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (res.status === 429 && attempt <= 8) {
    const wait = Math.min(90_000, 5000 * attempt);
    console.warn(`  rate-limited; waiting ${Math.round(wait / 1000)}s (attempt ${attempt})…`);
    await new Promise((r) => setTimeout(r, wait));
    return vimeo(method, path, body, attempt + 1);
  }
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  // Small pacing to avoid bursts
  await new Promise((r) => setTimeout(r, 120));
  return data;
}

async function listChildren(folderId) {
  const folders = [];
  const videos = [];
  let page = 1;
  for (;;) {
    const data = await vimeo(
      'GET',
      `/me/projects/${folderId}/items?per_page=100&page=${page}&fields=type,folder.uri,folder.name,folder.settings,video.uri,video.name,video.link,video.duration`
    );
    for (const item of data.data || []) {
      if (item.type === 'folder' || item.type === 'project') {
        const id = (item.folder?.uri || item.uri || '').split('/').pop();
        folders.push({
          id,
          name: item.folder?.name || '',
          color: item.folder?.settings?.color || '',
          uri: item.folder?.uri || `/users/${USER_ID}/projects/${id}`,
        });
      } else if (item.type === 'video') {
        const v = item.video || item;
        const id = (v.uri || '').split('/').pop();
        videos.push({
          id,
          name: v.name || '',
          link: v.link || '',
          duration: v.duration ?? null,
        });
      }
    }
    if (!data.paging?.next) break;
    page++;
  }
  return { folders, videos };
}

function findByName(folders, name) {
  const needle = name.trim().toLowerCase();
  return folders.find((f) => f.name.trim().toLowerCase() === needle);
}

async function ensureFolder({ name, parentId, color }) {
  const parentUri = `/users/${USER_ID}/projects/${parentId}`;
  const { folders } = await listChildren(parentId);
  let existing = findByName(folders, name);
  if (existing) {
    if (color && existing.color?.toLowerCase() !== color.toLowerCase()) {
      if (APPLY) {
        await vimeo('PATCH', `/me/projects/${existing.id}`, {
          settings: { color },
        });
        console.log(`  color ${existing.name} → ${color}`);
        existing = { ...existing, color };
      } else {
        console.log(`  [dry] color ${existing.name} → ${color}`);
      }
    }
    return existing;
  }

  if (!APPLY) {
    console.log(`  [dry] create "${name}" under #${parentId}${color ? ` color=${color}` : ''}`);
    return {
      id: `dry-${parentId}-${name}`,
      name,
      color: color || '',
      uri: `${parentUri}/(new)`,
      dry: true,
    };
  }

  const created = await vimeo('POST', `/me/projects`, {
    name,
    parent_folder_uri: parentUri,
    ...(color ? { settings: { color } } : {}),
  });
  const id = (created.uri || '').split('/').pop();
  console.log(`  created #${id} ${name}${color ? ` (${color})` : ''}`);
  // Some creates ignore settings — patch color if needed
  if (color && created.settings?.color?.toLowerCase() !== color.toLowerCase()) {
    try {
      await vimeo('PATCH', `/me/projects/${id}`, { settings: { color } });
    } catch (e) {
      console.warn(`  warn: could not set color on ${name}: ${e.message}`);
    }
  }
  return {
    id,
    name: created.name || name,
    color: color || created.settings?.color || '',
    uri: created.uri,
  };
}

async function moveVideosInto(folderId, videos) {
  for (const v of videos) {
    if (!APPLY) {
      console.log(`  [dry] move video "${v.name}" → #${folderId}`);
      continue;
    }
    try {
      await vimeo('PUT', `/me/projects/${folderId}/videos/${v.id}`);
      console.log(`  moved "${v.name}" → #${folderId}`);
    } catch (e) {
      console.warn(`  warn: move failed for ${v.name}: ${e.message}`);
    }
  }
}

const map = {
  competitions: {},
  opponents: {},
};

console.log(APPLY ? 'APPLY mode' : 'DRY-RUN (pass --apply to write)');
console.log(`Avversari root #${AVVERSARI_ID}\n`);

for (const [compId, comp] of Object.entries(COMPETITIONS)) {
  console.log(`== ${comp.name} (#${comp.folderId}) ==`);
  map.competitions[compId] = {
    name: comp.name,
    folderId: comp.folderId,
    folderUrl: `https://vimeo.com/user/${USER_ID}/folder/${comp.folderId}`,
  };

  for (const opp of comp.opponents) {
    console.log(`- ${opp.name}`);
    let oppFolder;
    if (opp.folderId) {
      // Ensure color + read existing children
      const meta = await vimeo(
        'GET',
        `/me/projects/${opp.folderId}?fields=uri,name,settings`
      );
      oppFolder = {
        id: opp.folderId,
        name: meta.name || opp.name,
        color: meta.settings?.color || '',
        uri: meta.uri,
      };
      if (opp.color && oppFolder.color?.toLowerCase() !== opp.color.toLowerCase()) {
        if (APPLY) {
          await vimeo('PATCH', `/me/projects/${opp.folderId}`, {
            settings: { color: opp.color },
          });
          console.log(`  color ${opp.name} → ${opp.color}`);
          oppFolder.color = opp.color;
        } else {
          console.log(`  [dry] color ${opp.name} → ${opp.color}`);
        }
      }
    } else {
      oppFolder = await ensureFolder({
        name: opp.name,
        parentId: comp.folderId,
        color: opp.color,
      });
    }

    const children = oppFolder.dry
      ? { folders: [], videos: [] }
      : await listChildren(oppFolder.id);

    let studioFinal;
    let refsFinal;
    if (oppFolder.dry) {
      console.log(`  [dry] create "Studio Report" under ${opp.name}`);
      console.log(`  [dry] create "Partite di Riferimento" under ${opp.name}`);
      studioFinal = { id: `dry-studio-${opp.id}`, dry: true };
      refsFinal = { id: `dry-refs-${opp.id}`, dry: true };
    } else {
      const studio = await ensureFolder({
        name: 'Studio Report',
        parentId: oppFolder.id,
      });
      const refs = await ensureFolder({
        name: 'Partite di Riferimento',
        parentId: oppFolder.id,
      });
      const after = await listChildren(oppFolder.id);
      studioFinal = findByName(after.folders, 'Studio Report') || studio;
      refsFinal = findByName(after.folders, 'Partite di Riferimento') || refs;

      // Move loose videos sitting on the opponent root into Partite di Riferimento
      if (after.videos.length && refsFinal && !String(refsFinal.id).startsWith('dry-')) {
        console.log(
          `  ${after.videos.length} loose video(s) on opponent root → Partite di Riferimento`
        );
        await moveVideosInto(refsFinal.id, after.videos);
      }
    }

    const key = `${compId}:${opp.id}`;
    map.opponents[key] = {
      competitionId: compId,
      opponentId: opp.id,
      name: opp.name,
      color: opp.color,
      folderId: String(oppFolder.id).startsWith('dry-') ? null : oppFolder.id,
      folderUrl: String(oppFolder.id).startsWith('dry-')
        ? null
        : `https://vimeo.com/user/${USER_ID}/folder/${oppFolder.id}`,
      studioReportFolderId:
        !studioFinal || String(studioFinal.id).startsWith('dry-')
          ? null
          : studioFinal.id,
      referenceMatchesFolderId:
        !refsFinal || String(refsFinal.id).startsWith('dry-')
          ? null
          : refsFinal.id,
    };
  }
  console.log('');
}

const out = join(__dirname, 'avversari-folder-map.json');
writeFileSync(out, JSON.stringify(map, null, 2) + '\n');
console.log(`Wrote ${out}`);
console.log(APPLY ? 'Done.' : 'Dry-run complete. Re-run with --apply to create folders.');
