# Getting clips onto the website (simple weekly flow)

GitHub Pages **cannot** host big MP4s from the git folder.  
So we upload clips to a **GitHub Release** once per match, and the site plays those URLs.

## One-time setup (do this once on this Mac)

1. Create a classic token with **`repo`** scope:  
   https://github.com/settings/tokens  
   Tip: set expiration to **No expiration** (or 1 year). You will **not** make a new token every match.

2. Save it locally:

```bash
cd ~/SSCN-Primavera
npm run setup-token -- ghp_PASTE_YOUR_TOKEN_HERE
```

That writes a private `.env` file (gitignored). Done forever (until the token expires).

## Every match / every week

1. Drop clip folders into:

```text
~/SSCN-Primavera/Amivhevole v U18_01.08.2026/
# or directly:
~/SSCN-Primavera/matches/<slug>/clips/
```

2. Publish:

```bash
npm run publish-clips -- --slug 2026-08-01_amichevole-u19-vs-u18
```

That command:
- syncs the drop folder into `matches/<slug>/clips`
- updates `match.json`
- uploads **new** MP4s to a GitHub Release (skips ones already uploaded)
- commits + pushes `match.json` so the website updates

Dry run (no upload / no push):

```bash
npm run publish-clips -- --slug 2026-08-01_amichevole-u19-vs-u18 --dry-run
```

## What you do NOT need

- A new token for every match  
- Committing MP4s into git  
- Manual GitHub Release clicking

## If the token expires later

Just run `npm run setup-token -- ghp_NEW_TOKEN` again once.
