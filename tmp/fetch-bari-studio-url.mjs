#!/usr/bin/env node
import { resolveVimeoToken } from '../scripts/load-env.mjs';

const token = resolveVimeoToken();
if (!token) {
  console.error('No Vimeo token');
  process.exit(1);
}

const id = '1235892445';
const res = await fetch(
  `https://api.vimeo.com/videos/${id}?fields=name,link,player_embed_url,privacy`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
  }
);
if (!res.ok) {
  console.error(res.status, await res.text());
  process.exit(1);
}
const data = await res.json();
const embed = data.player_embed_url || '';
const embedHash = (embed.match(/h=([a-f0-9]+)/i) || [])[1];
const privacyHash = data.privacy?.unlisted_hash || embedHash;
const url = privacyHash
  ? `https://vimeo.com/${id}/${privacyHash}`
  : data.link;
console.log(url);
console.log(JSON.stringify({ name: data.name, link: data.link, privacyHash }, null, 2));
