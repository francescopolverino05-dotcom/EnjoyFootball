# Video Analysis

Long analyst / coach reports (and matchday PDFs) for the **Video Analysis** tab.

```text
analysis/
├── Session_Plan_2026-08-08.pdf
└── (other reports)
```

Register in `../match.json` → `analysisVideos`:

```json
{
  "id": "session-plan-2026-08-08",
  "title": { "en": "Session / matchday plan — Sat 8 Aug", "it": "Piano seduta / matchday — Sab 8 ago" },
  "description": { "en": "…", "it": "…" },
  "videoFile": "Session_Plan_2026-08-08.pdf",
  "kind": "pdf",
  "tags": ["pdf", "session-plan", "matchday"]
}
```

Full match → `../video/` · Clips → `../clips/`
