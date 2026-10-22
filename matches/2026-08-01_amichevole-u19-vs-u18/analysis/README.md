# Video Analysis

Long **analyst / coach reports** for the Video Analysis tab go here.

```text
analysis/
├── README.md
└── your-report.mp4
```

| Not here | Put there instead |
|----------|-------------------|
| Full match | `../video/match.mp4` |
| Short tactical clips | `../clips/` |

## How to add a report

1. Drop the MP4 in this folder, e.g. `analysis/pressing-review.mp4`
2. In Cursor, say something like:

> Register `pressing-review.mp4` on the Video Analysis tab for this match.

3. Or add an entry in `../match.json` → `analysisVideos`:

```json
{
  "id": "pressing-review",
  "title": { "en": "Pressing review", "it": "Review pressing" },
  "description": {
    "en": "First-half pressing structure.",
    "it": "Struttura pressing primo tempo."
  },
  "videoFile": "pressing-review.mp4",
  "tags": ["pressing"]
}
```

4. Publish to the website when ready (same flow as clips if the file is large):

```bash
npm run publish-clips -- --slug <this-match-folder>
```

(MP4s are gitignored; the site uses Release/CDN URLs after publish.)
