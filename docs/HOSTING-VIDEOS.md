# Hosting match videos on the website

GitHub **Pages cannot play large MP4s from the git repo**. Git LFS also does **not** work on Pages (visitors would get a tiny pointer file instead of video).

## Recommended: GitHub Releases

1. Keep MP4s on your laptop under `matches/<slug>/clips/` (as you already do).
2. Upload them once to a GitHub Release (public download URLs).
3. Point `match.json` at those URLs — the website plays them.

### One-time setup

Create a GitHub classic token with **`repo`** scope:  
https://github.com/settings/tokens

### Upload clips for a match

```bash
cd ~/SSCN-Primavera
export GITHUB_TOKEN=ghp_your_token_here
npm run upload-clips -- --slug 2026-08-01_amichevole-u19-vs-u18
```

Dry run (no upload):

```bash
npm run upload-clips -- --slug 2026-08-01_amichevole-u19-vs-u18 --dry-run
```

Then push the updated `match.json`:

```bash
git add matches/<slug>/match.json
git commit -m "Point clips to GitHub Release"
git push
```

### After that

- **Local:** clips still play from disk (or from the release URLs).
- **Website:** plays from  
  `https://github.com/.../releases/download/clips-YYYY-MM-DD/<clip-id>.mp4`

## Alternatives

| Option | When to use |
|--------|-------------|
| **Cloudflare R2 / S3** | Bigger libraries, private control, CDN |
| **Vimeo / YouTube unlisted** | Easy sharing, less “in-app” control |
| **Git LFS** | Backup in git only — **not** for GitHub Pages playback |

## Optional: shrink files first

If uploads are slow, re-encode with HandBrake or ffmpeg (e.g. 720p) before `upload-clips`. Smaller files = faster upload and cheaper bandwidth.
