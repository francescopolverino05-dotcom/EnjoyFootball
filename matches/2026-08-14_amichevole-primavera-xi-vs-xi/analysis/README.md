# Video Analysis

Long analyst / coach reports for the **Video Analysis** tab.

```text
analysis/
└── your-report.mp4
```

Register in `../match.json` → `analysisVideos`:

```json
{
  "id": "match-report",
  "title": { "en": "Match video report", "it": "Report video partita" },
  "description": { "en": "Full analyst breakdown.", "it": "Analisi completa." },
  "videoFile": "match-report.mp4",
  "tags": []
}
```

Full match → `../video/` · Clips → `../clips/`
