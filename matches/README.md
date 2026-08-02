# Cartelle Partite

Ogni partita ha una cartella con questo formato:

```
YYYY-MM-DD_<tipo>-<squadre>/
├── match.json       ← dati partita, statistiche, clip + analysis metadata
├── README.md        ← note locali (opzionale)
├── video/
│   └── match.mp4    ← video completo (locale, non in git)
├── clips/           ← clip tattiche (Build-up, Progress, …) → tab Clips
│   └── …
└── analysis/        ← report video analista → tab Video Analysis
    ├── README.md
    └── your-report.mp4
```

## Convenzione nomi cartella

| Esempio | Significato |
|---------|-------------|
| `2026-08-01_amichevole-u19-vs-u18` | Amichevole del 1 agosto |
| `2026-08-08_campionato-u19-vs-roma` | Campionato U19 vs Roma |

## Clips vs Video Analysis

| Folder | App tab | Use for |
|--------|---------|---------|
| `clips/` | **Clips** | Short tagged moments (Build-up, Mid block, …) |
| `analysis/` | **Video Analysis** | Longer analyst reports / presentations |
| `video/` | **Full Match** | Full match recording |

## Video files

I file `.mp4` sono ignorati da git. Vedi `docs/HOSTING-VIDEOS.md` per pubblicarli sul sito.
