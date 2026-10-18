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
        console.log(`${pad}  - ${v.name}`);
      }
    }
    if (!data.paging?.next) break;
    page++;
  }
  for (const id of subfolders) await listItems(id, depth + 1);
}

for (const id of ['30308090', '30308098', '30308097', '30308091', '30308092']) {
  console.log('\n====', id, '====');
  await listItems(id);
}
