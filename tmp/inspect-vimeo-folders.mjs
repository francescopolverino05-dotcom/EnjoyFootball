import { resolveVimeoToken } from '../scripts/load-env.mjs';

const token = resolveVimeoToken();

async function vimeoGet(path) {
  const res = await fetch(`https://api.vimeo.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${path} ${await res.text()}`);
  return res.json();
}

async function listItems(folderId, depth = 0, label = '') {
  const pad = '  '.repeat(depth);
  const folder = await vimeoGet(`/me/projects/${folderId}`);
  console.log(`${pad}#${folderId} ${folder.name}${label}`);
  let page = 1;
  const videos = [];
  const subfolders = [];
  for (;;) {
    const data = await vimeoGet(
      `/me/projects/${folderId}/items?per_page=100&page=${page}`
    );
    for (const item of data.data || []) {
      if (item.type === 'folder' || item.type === 'project') {
        const id = (item.folder?.uri || item.uri || '').split('/').pop();
        if (id) subfolders.push({ id, name: item.folder?.name || item.name });
      } else if (item.type === 'video') {
        const v = item.video || item;
        videos.push({
          id: (v.uri || '').split('/').pop(),
          name: v.name,
          duration: v.duration,
        });
      }
    }
    if (!data.paging?.next) break;
    page++;
  }
  if (videos.length) {
    console.log(`${pad}  videos (${videos.length}):`);
    for (const v of videos) console.log(`${pad}    - ${v.name}`);
  }
  for (const sf of subfolders) {
    await listItems(sf.id, depth + 1);
  }
}

const roots = [
  ['30308045', '24/08/2026 week'],
  ['30308127', '31/08 Prep Avellino'],
  ['30240824', 'Amichevole Virtus Stabia'],
  ['30240832', 'Amichevole v U17'],
];

for (const [id, label] of roots) {
  console.log(`\n==== ${label} ====`);
  try {
    await listItems(id);
  } catch (e) {
    console.error(e.message);
  }
}
