# Napoli Primavera vs Portici

```text
matches/2026-08-08_amichevole-u19-vs-portici/
├── match.json
├── video/      ← FULL MATCH → video/match.mp4
├── clips/      ← tactical clips (Clips tab)
└── analysis/   ← session plans (Training Design) + analyst reports (Video Analysis)
```

1. Copy full match → `video/match.mp4`
2. Add clips → `clips/` (or root drop + `npm run sync-clips`)
3. Session plan PDF → `analysis/` + `match.json` → `trainingDesign`
4. Add analyst reports → `analysis/` + `match.json` → `analysisVideos`
5. Ask Cursor to fill / register `match.json`
6. Set `status` to `"published"` when ready
