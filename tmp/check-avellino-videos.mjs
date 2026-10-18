import { resolveVimeoToken } from '../scripts/load-env.mjs';

const token = resolveVimeoToken();

async function vimeoGet(path) {
  const res = await fetch(`https://api.vimeo.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
  });
  const text = await res.text();
  if (!res.ok) return { error: res.status, text: text.slice(0, 300) };
  return JSON.parse(text);
}

for (const id of ['1218076436', '1218073956', '1221765516', '1218078567']) {
  const v = await vimeoGet(
    `/videos/${id}?fields=uri,name,link,duration,parent_folder`
  );
  console.log('\n' + id);
  console.log(JSON.stringify(v, null, 2));
}

const vids = await vimeoGet('/me/videos?per_page=25&sort=date&direction=desc');
console.log('\nRecent videos:');
for (const v of vids.data || []) {
  const id = (v.uri || '').split('/').pop();
  console.log(
    `${(v.created_time || '').slice(0, 16)} #${id} [${v.parent_folder?.name || ''}] ${v.name}`
  );
}
