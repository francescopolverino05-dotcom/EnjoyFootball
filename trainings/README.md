# Training sessions

Separate from matches. Every session uses:

```text
trainings/
└── YYYY-MM-DD_<short-name>/
    ├── training.json
    ├── README.md
    ├── video/          ← FULL SESSION (session.mp4)
    ├── clips/          ← short clips
    └── analysis/       ← longer analyst videos
```

## New session

```bash
npm run new-training -- --date 2026-08-05 --title "Rondo + Finishing" --focus "Build-up"
```

Sessions appear on the home page under **Training sessions**, labelled by date.

## vs Matches

| | Matches | Trainings |
|--|---------|-----------|
| Folder | `matches/` | `trainings/` |
| Metadata | `match.json` | `training.json` |
| Site route | `/match/:slug` | `/training/:slug` |
| Full video | `video/match.mp4` | `video/session.mp4` |
