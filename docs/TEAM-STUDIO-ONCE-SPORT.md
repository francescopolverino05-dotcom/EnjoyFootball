# Team Studio report — Once Sport Analyser setup

How to rebuild the LiveTag.pro **Team Studio** format inside **Once Sport Analyser**. Same four-block structure as `TEAM-STUDIO-REPORT-STRUCTURE.md`; this doc is the Once Sport workflow.

Target length: **8–10 minutes** exported as one MP4.

---

## Overview

| Team Studio piece | Once Sport tool |
| --- | --- |
| Title + section cards + formation board | Static slides (Canva / Keynote / Coach Board) **or** short imported graphic clips |
| Match clips | Tag actions on full match → export from timeline / playlist |
| Top-left label (`Costruzione`, `N di M`) | **Overlay** text in Drawing mode (optional) |
| Wide tactical cam | Your Veo / wide-angle source file |
| Final presentation | **Export selected actions → one joined video** |

Once Sport does **not** auto-generate the graphic slides. Make 6 static images once per opponent (or reuse a master template), then sandwich them between exported clips in the final join — or present live from Once without merging.

---

## Step 1 — Create the tagging template

**Actions and Players → New tab → name it `Team Studio`**

Once Sport groups buttons into **Attacking**, **Defending**, and **Other**. Mirror the Team Studio blocks:

### Attacking (Fase offensiva)

| Action button | Use for |
| --- | --- |
| `Costruzione` | Build-up shape and patterns |
| `Costruzione lunga` | Long build-up (optional extra) |
| `Sviluppo` | Progression through midfield |
| `Attacco diretto` | Direct play + second ball |
| `Attacco alla linea` | Final-third combinations |
| `Transizione off` | With-ball transition (veloce, consolidamento, ripartenza) |

### Defending (Fase difensiva)

| Action button | Use for |
| --- | --- |
| `Pressione` | High press / first pressure |
| `Blocco medio` | Mid-block shape |
| `Difesa metà campo` | Aggression at halfway line |
| `Linea difensiva` | Back-line behaviour (optional) |
| `Riaggressione` | Counter-press after loss |

### Other (Set pieces)

| Action button | Use for |
| --- | --- |
| `Calcio inizio OFF` | Attacking kick-off |
| `Calcio inizio DEF` | Defending kick-off |
| `Puniz laterale OFF` | Attacking throw-in |
| `Puniz laterale DEF` | Defending throw-in |
| `Puniz centrale OFF` | Attacking free kick (central) |
| `Corner OFF` | Attacking corner |
| `Corner DEF` | Defending corner |

Use **Recording buttons** (space → start/stop) for phases whose length varies. Use **Coded buttons** only if every clip is a fixed length.

---

## Step 2 — Action Labels (second line + index)

**Actions and Players → Action Labels**

Create labels for shapes and sub-themes. Apply via the message-cloud icon while tagging or from the timeline.

**Shape / detail labels (pick per opponent):**

- `4-1/2-1-2`, `4-1/2-3`, `3-1/4-1-1`
- `Interni in ampiezza`, `Palla in movimento`, `Play sotto linea`
- `Veloce e verticale`, `Consolidamento`, `Ripartenza`
- `A uomo`, `5-3-2`, `Aggressione in avanti`
- `Giocata a 3` (corner variant)

**Index labels:**

- `1 di 2`, `2 di 2`, `1 di 3`, `2 di 3`, `3 di 3`, `1 di 4` … `4 di 4`

**Notes field** — free text for anything that does not need a button (e.g. `Combinazioni trequarti e attaccanti`, `Giugliano tra le linee`).

Naming convention on the timeline:

```text
[Action]  +  [Label: shape]  +  [Label: N di M]  +  [Note: coaching point]
```

Example: `Costruzione` · `4-1/2-1-2` · `2 di 3`

---

## Step 3 — Start the project

1. **New analysis → Local** → import opponent full match (mp4 from Veo).
2. **Template:** `Team Studio`.
3. **Project name:** `Team Studio — [Opponent] — [date]`.
4. Watch wide-angle footage; tag every example you want in the final report.

Tip: tag **more** than you need, then curate in the playlist. Faster than rewinding the whole match twice.

---

## Step 4 — Tag in Team Studio order

Work through the match in this order (same as the Arcieri Marco samples):

### Block A — Offensive

1. `Costruzione` — 2–4 clips (vary shape labels)
2. `Sviluppo` — 1–2 clips
3. `Attacco diretto` — 0–2 clips (optional)
4. `Attacco alla linea` — 1–2 clips
5. `Transizione off` — 1–2 clips

### Block B — Defensive

6. `Pressione` — 2–4 clips
7. `Blocco medio` / `Difesa metà campo` — 1–2 clips
8. `Linea difensiva` — 0–2 clips (optional)
9. `Riaggressione` — 1 clip

### Block C — Set pieces OFF

10. `Calcio inizio OFF` → `Puniz laterale OFF` → `Puniz centrale OFF` → `Corner OFF`

### Block D — Set pieces DEF

11. `Calcio inizio DEF` → `Puniz laterale DEF` → `Corner DEF`

Mark favourites (★) on the clips you want in the final cut.

---

## Step 5 — Optional on-screen overlay (LiveTag-style)

If you want the coloured top-left text on export:

1. Open action → **Drawing mode**.
2. **Overlay** → add three text lines:
   - Line 1 — phase name (`Costruzione`, green if your theme allows)
   - Line 2 — shape / detail
   - Line 3 — `N di M`
3. Pin top-left; keep visible for the full clip duration.
4. Export **with drawings**.

Skip overlays if you only need the clips for your app — labels on the timeline are enough for sorting.

Minimal telestration on the samples; do not feel you must draw on every clip.

---

## Step 6 — Build the presentation playlist

**Drawing mode → Playlists → New playlist: `Team Studio export`**

Drag actions in **presentation order**:

| # | Item | Source |
| --- | --- | --- |
| 1 | Title card | Static slide / graphic clip |
| 2 | Formation board | Static slide (module + names + coach) |
| 3 | Section card | `FASE OFFENSIVA` + bullet agenda |
| 4–n | Offensive clips | Tagged actions, sorted by theme then `N di M` |
| n+1 | Section card | `FASE DIFENSIVA` + bullets |
| … | Defensive clips | As tagged |
| … | Section card | `PALLE INATTIVE OFFENSIVE` |
| … | Set-piece OFF clips | Kick-off → lateral → central → corner |
| … | Section card | `PALLE INATTIVE DIFENSIVE` |
| … | Set-piece DEF clips | Kick-off → lateral → corner |

Sort within each theme: `1 di M` before `2 di M` before `3 di M`.

---

## Step 7 — Export

**Export → Selected actions (playlist)**

| Setting | Value |
| --- | --- |
| Drawings | With overlay **if** you added labels; otherwise without |
| Layout | **One joined video file** |
| Order | Playlist order (manual sort before export) |
| Alternative | Separate folders per action name → merge in DaVinci / iMovie with slides |

Also export **XML** if you want to reuse the same tags on the next opponent or share with another Once Sport user.

Drop the final MP4 into `matches/<slug>/analysis/` for the app **Video Analysis** tab.

---

## Static slides checklist (6 per opponent)

Make once, reuse layout, swap crest / colours / text:

1. **Title** — crest + `TEAM STUDIO` + analyst line  
2. **Formation board** — pitch graphic, modules, stacked names, `Allenatore …`  
3. **FASE OFFENSIVA** — 4–5 bullet agenda (opponent-specific)  
4. **FASE DIFENSIVA** — 3–4 bullet agenda  
5. **PALLE INATTIVE OFFENSIVE**  
6. **PALLE INATTIVE DIFENSIVE**  

Export each slide as a **3–5 s mp4** (or hold as PNG and insert in the video editor when joining).

---

## Hotkeys (suggested)

Assign in **Actions and Players → Hotkeys** after the template exists:

| Key | Action |
| --- | --- |
| `1` | Costruzione |
| `2` | Sviluppo |
| `3` | Attacco alla linea |
| `4` | Transizione off |
| `Q` | Pressione |
| `W` | Blocco medio |
| `E` | Riaggressione |
| `A` | Corner OFF |
| `S` | Corner DEF |
| `Space` | Start/stop recording (phases) |

Adjust to taste; goal is zero mouse travel while watching.

---

## Quick reference — Avellino vs Benevento agendas

Copy onto section cards; clip buttons stay the same.

**Avellino — Fase offensiva**

- Costruzione 4-1/2-1-2  
- Rotazione terzino-interno  
- Attacco diretto  
- Combinazione trequarti e attaccanti  
- Transizione veloce e verticale  

**Avellino — Fase difensiva**

- Prima pressione alta  
- Aggressione in avanti a metà campo  
- Transizione con riaggressione  

**Benevento — Fase offensiva**

- Costruzione 3-1/4-1-1  
- Interni in ampiezza o inserimento  
- Quinti di spinta  
- Giugliano tra le linee  
- Transizione consolidamento o ripartenza  

**Benevento — Fase difensiva**

- Prima pressione a uomo  
- Blocco medio 5-3-2  
- Linea difensiva poco attenta alle marcature  
- Transizione con riaggressione  

---

## Mapping to the SSCN app

If you also publish clips in the repo, align Once tags with opposition sections:

| Once action | App `section` (opposition clips) |
| --- | --- |
| Costruzione, Costruzione lunga | `build-up` |
| Sviluppo | `middle-third` |
| Attacco alla linea, Attacco diretto | `last-30m` |
| Pressione | `high-defence` |
| Blocco medio, Difesa metà campo | `mid-block` |
| Linea difensiva | `low-block` |
| Transizione off | `attacking-transition` |
| Riaggressione | `defensive-transition` |
| Corner OFF / corner routines | `attacking-corners` |
| Corner DEF | `defending-corners` |
| Puniz centrale OFF | `attacking-free-kicks` |
| Calcio inizio OFF / DEF | `kickoffs` |
| Puniz laterale OFF / DEF | `attacking-throw-ins` / `defending-throw-ins` |

Full joined report → `analysis/` folder. Individual exported clips → `clips/` + `match.json` / opposition pack.

---

## Workflow summary

```text
1. Build Once template + labels (once)
2. Import full match → tag in 4 blocks
3. Favourite best clips → sort playlist in Team Studio order
4. Optional overlay text per clip
5. Insert 6 static slides → export one MP4 (~8–10 min)
6. analysis/team-studio-[opponent].mp4 → app
```

See also: [TEAM-STUDIO-REPORT-STRUCTURE.md](./TEAM-STUDIO-REPORT-STRUCTURE.md) for the decoded LiveTag timeline.
