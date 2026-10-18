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

const folders = [];
for (let page = 1; page <= 5; page++) {
  const data = await vimeoGet(
    `/me/projects?per_page=50&page=${page}&sort=modified_time&direction=desc`
  );
  for (const p of data.data || []) {
    const id = (p.uri || '').split('/').pop();
    folders.push({
      id,
      name: p.name,
      modified: p.modified_time,
      created: p.created_time,
    });
  }
  if (!data.paging?.next) break;
}

console.log('Recent Vimeo folders (modified desc):');
for (const f of folders.slice(0, 60)) {
  console.log(`${f.modified?.slice(0, 10)}  #${f.id}  ${f.name}`);
}

console.log('\nRecent videos:');
const vids = await vimeoGet('/me/videos?per_page=50&sort=date&direction=desc');
for (const v of vids.data || []) {
  const id = (v.uri || '').split('/').pop();
  const parent = v.parent_folder?.name || '';
  console.log(
    `${(v.created_time || '').slice(0, 16)}  #${id}  [${parent}]  ${v.name}`
  );
}
