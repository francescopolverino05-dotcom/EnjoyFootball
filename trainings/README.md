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
# optional: seed Vimeo folder id
npm run new-training -- --date 2026-08-05 --title "Monday" --vimeo-folder 30099288
```

Sessions appear on the home page under **Training sessions**, labelled by date.

## Sync training videos from Vimeo

1. Upload session videos into a Vimeo folder.
2. Put the folder id in `training.json` → `vimeo.folderId` (or pass `--folder`), e.g. via `--vimeo-folder` when scaffolding.
3. Sync into the portal metadata:

```bash
npm run sync-vimeo -- --training 2026-08-03_lunedi
# same thing:
npm run sync-vimeo-training -- --slug 2026-08-03_lunedi
# override folder:
npm run sync-vimeo -- --training 2026-08-03_lunedi --folder 30099288
```

4. Commit `training.json` and push — the portal reads Vimeo https URLs from there.

The sync maps all folder videos to `video.parts` (Full Session tab). The largest / “full session” / “sessione” video is also set as `video.fullSession`. PDF/markdown docs stay in `analysisVideos` (Video Analysis tab). `status` is not changed.

## vs Matches

| | Matches | Trainings |
|--|---------|-----------|
| Folder | `matches/` | `trainings/` |
| Metadata | `match.json` | `training.json` |
| Site route | `/match/:slug` | `/training/:slug` |
| Full video | `video/match.mp4` | `video/session.mp4` |
| Vimeo sync | `npm run sync-vimeo -- --slug …` | `npm run sync-vimeo -- --training …` |
