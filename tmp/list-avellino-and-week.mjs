import { resolveVimeoToken } from '../scripts/load-env.mjs';

const token = resolveVimeoToken();
if (!token) {
  console.error('No Vimeo token');
  process.exit(1);
}

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

async function listItems(folderId, depth = 0) {
  const pad = '  '.repeat(depth);
  const folder = await vimeoGet(`/me/projects/${folderId}`);
  console.log(`${pad}#${folderId} ${folder.name}`);
  let page = 1;
  const subfolders = [];
  for (;;) {
    const data = await vimeoGet(
      `/me/projects/${folderId}/items?per_page=100&page=${page}`
    );
    for (const item of data.data || []) {
      if (item.type === 'folder' || item.type === 'project') {
        const id = (item.folder?.uri || item.uri || '').split('/').pop();
        if (id) subfolders.push(id);
      } else if (item.type === 'video') {
        const v = item.video || item;
        const id = (v.uri || '').split('/').pop();
        const full = await vimeoGet(`/videos/${id}?fields=uri,name,link,duration`);
        console.log(
          `${pad}  #${id}  ${full.name}  dur=${full.duration}s  ${full.link}`
        );
      }
    }
    if (!data.paging?.next) break;
    page++;
  }
  for (const id of subfolders) await listItems(id, depth + 1);
}

console.log('==== Avversari ====');
await listItems('30211870');
console.log('\n==== Week 24/08 Mer/Gio/Ven ====');
for (const id of [
  '30308090',
  '30308091',
  '30308092',
  '30308098',
  '30308099',
]) {
  try {
    await listItems(id);
  } catch (e) {
    console.log('#', id, e.message);
  }
}
