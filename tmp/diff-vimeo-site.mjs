import { resolveVimeoToken } from '../scripts/load-env.mjs';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const token = resolveVimeoToken();
async function vimeoGet(path) {
  const res = await fetch(`https://api.vimeo.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

const recentIds = new Map();
for (let page = 1; page <= 3; page++) {
  const vids = await vimeoGet(
    `/me/videos?per_page=100&page=${page}&sort=date&direction=desc`
  );
  for (const v of vids.data || []) {
    const id = (v.uri || '').split('/').pop();
    recentIds.set(id, {
      name: v.name,
      created: v.created_time,
      parent: v.parent_folder?.name,
    });
  }
  if (!vids.paging?.next) break;
}

function collectIds(obj, set = new Set()) {
  if (!obj || typeof obj !== 'object') return set;
  if (Array.isArray(obj)) {
    for (const x of obj) collectIds(x, set);
    return set;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'id' && typeof v === 'string' && v.startsWith('vimeo-')) {
      set.add(v.slice(6));
    }
    if (typeof v === 'string') {
      const m = v.match(/vimeo\.com\/(\d+)/);
      if (m) set.add(m[1]);
    } else if (v && typeof v === 'object') {
      collectIds(v, set);
    }
  }
  return set;
}

const siteIds = new Set();
for (const dir of ['matches', 'trainings']) {
  for (const slug of readdirSync(dir)) {
    for (const file of ['match.json', 'training.json']) {
      const p = join(dir, slug, file);
      if (existsSync(p)) {
        collectIds(JSON.parse(readFileSync(p, 'utf8')), siteIds);
      }
    }
  }
}

const missing = [...recentIds.entries()].filter(([id]) => !siteIds.has(id));
console.log(
  `Recent videos scanned: ${recentIds.size}; missing from site: ${missing.length}`
);
for (const [id, meta] of missing) {
  console.log(
    `${meta.created?.slice(0, 16)}  #${id}  [${meta.parent}]  ${meta.name}`
  );
}
