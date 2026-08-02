# Cartelle Partite

Every match uses this layout:

```text
YYYY-MM-DD_<tipo>-<squadre>/
├── match.json
├── README.md
├── video/          ← FULL MATCH MP4 (usually match.mp4)
├── clips/          ← tactical clips → Clips tab
└── analysis/       ← analyst reports → Video Analysis tab
```

## Where to put files

| Media | Folder | App tab |
|-------|--------|---------|
| Full match recording | `video/match.mp4` | **Full Match** |
| Short tactical clips | `clips/` | **Clips** |
| Long analyst / coach videos | `analysis/` | **Video Analysis** |

## New match

```bash
npm run new-match -- --date 2026-08-08 --type campionato --teams u19-vs-roma --title "Napoli U19 vs Roma"
```

## Weekly clip drop → sync

1. Drop the export folder at the **repo root** (e.g. `Amivhevole v U18_01.08.2026/`)
2. Sync into the match:

```bash
npm run sync-clips -- --slug 2026-08-01_amichevole-u19-vs-u18
```

MP4s are gitignored. See `docs/HOSTING-VIDEOS.md` for publishing to the site.
