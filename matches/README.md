# Cartelle Partite

Ogni partita ha una cartella con questo formato:

```
YYYY-MM-DD_<tipo>-<squadre>/
├── match.json       ← dati partita, statistiche, clip metadata
├── README.md        ← note locali (opzionale)
├── video/
│   └── match.mp4    ← video completo (non tracciato in git, troppo grande)
└── clips/
    ├── gol-esposito-32.mp4
    ├── pressione-alta-15.mp4
    └── ...
```

## Convenzione nomi cartella

| Esempio | Significato |
|---------|-------------|
| `2026-08-01_amichevole-u19-vs-u18` | Amichevole del 1 agosto |
| `2026-08-08_campionato-u19-vs-roma` | Campionato U19 vs Roma |

## Video

I file `.mp4` sono ignorati da git (`.gitignore`). Per condividerli con lo staff:

1. **Locale / rete club** — metti i file nella cartella `video/` e `clips/`
2. **Git LFS** — se vuoi versionare i video su GitHub, abilita LFS (vedi README principale)
3. **Deploy** — al deploy, i video nella cartella matches vengono serviti dall'app
