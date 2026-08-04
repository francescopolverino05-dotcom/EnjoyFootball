# FPFootPortal — Analisi Partite

Piattaforma web per report tecnici partita U19/U18: statistiche, formazioni, video completo e clip di analisi — tutto in un unico posto per lo staff.

## Avvio rapido

```bash
npm install
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173)

## Struttura repository

```
FPFootPortal/  (local folder may still be SSCN-Primavera)
├── matches/                          ← una cartella per ogni partita (visibile su GitHub)
│   └── YYYY-MM-DD_tipo-squadre/
│       ├── match.json                ← dati e statistiche
│       ├── video/match.mp4           ← video completo (locale, non in git)
│       ├── clips/                    ← clip di analisi
│       └── analysis/                 ← video analisi dell'analista
├── src/                              ← app React
├── scripts/new-match.mjs             ← crea nuova cartella partita
└── WORKFLOW.md                       ← processo settimanale
```

## Nuova partita

```bash
npm run new-match -- --date 2026-08-08 --type campionato --teams u19-vs-roma --title "Napoli U19 vs Roma"
```

Poi:

1. Metti il file MP4 in `matches/<slug>/video/match.mp4`
2. Apri Cursor e chiedi all'agente di analizzare quella cartella
3. L'agente compila `match.json` con statistiche, formazioni, timeline
4. Aggiungi clip in `clips/` e registrale in `match.json`
5. Imposta `"status": "published"` quando pronto

## Video e Git

I file `.mp4` sono **esclusi da git** (troppo grandi). Su GitHub vedrai la struttura delle cartelle e i metadata JSON.

Per condividere i video con lo staff:

| Metodo | Quando usarlo |
|--------|---------------|
| **Locale / rete club** | Dev server o deploy interno con i file MP4 nella cartella |
| **Git LFS** | Se vuoi versionare i video su GitHub |
| **Deploy** | Hosta l'app + cartella matches sul server del club |

### Git LFS (opzionale)

```bash
git lfs install
git lfs track "matches/**/video/*.mp4"
git lfs track "matches/**/clips/*.mp4"
git add .gitattributes
```

## Hosting videos on the website

MP4s stay on your Mac. Publish them with one saved token (set up once):

```bash
npm run setup-token -- ghp_YOUR_TOKEN   # once only
npm run publish-clips -- --slug <match-folder>   # every match
```

Details: [docs/HOSTING-VIDEOS.md](docs/HOSTING-VIDEOS.md)

