# Enjoy Football — Team Stats Template (Portici schema)

Use this exact structure for **Napoli Blu (home)** vs **Napoli Verde (away)**.  
Fill every `HOME` / `AWAY` cell. If a metric cannot be coded from video, write `n/c` (do not invent).

**Confirmed result:** Blu **3–1** Verde  
**Confirmed goals (do not change):**
| Minute | Scorer | Team | Score after |
| :---: | :--- | :---: | :---: |
| 9' (1H) | Saviano | Blu | 1–0 |
| 30' (1H) | Saviano | Blu | 2–0 |
| 1' (2H) | Anic | Verde | 2–1 |
| ~13–15' (2H) | Mané | Blu | 3–1 |

Assist for Mané’s goal: **unknown** (`n/c` unless clearly visible).

---

## 1) General / Generale

| Metric (EN) | Metric (IT) | Blu (HOME) | Verde (AWAY) |
| :--- | :--- | :---: | :---: |
| Goals | Gol | 3 | 1 |
| Half-time score | Risultato 1° Tempo | 2 | 0 |
| Expected Goals (xG) | Expected Goals (xG) | | |
| Shots | Tiri | | |
| Shots on Target | Tiri in Porta | | |
| Shots on Post | Pali / Traverse | | |
| Shots Blocked | Tiri Respinti | | |
| Shots Wide | Tiri Fuori | | |
| From Penalty Area / on target | Da Dentro l'Area / in Porta | _e.g. 9 / 5 (56%)_ | |
| Outside Penalty Area / on target | Da Fuori Area / in Porta | _e.g. 5 / 2 (40%)_ | |
| Corners | Calci d'Angolo | | |
| Free Kicks (all) | Calci di Punizione (totali) | | |
| Offsides | Fuorigioco | | |
| Fouls / Suffered | Falli Commessi / Subiti | _e.g. 7 / 9_ | |
| Yellow / Red Cards | Cartellini Gialli / Rossi | | |

**Consistency check:** Shots = SoT + Blocked + Wide + Post (±1 ok). Goals ≤ SoT.

---

## 2) Attacks / Attacchi

| Metric (EN) | Metric (IT) | Blu | Verde |
| :--- | :--- | :---: | :---: |
| Total attacks / with shots | Attacchi Totali / con Tiri | _e.g. 48 / 14 (29%)_ | |
| Counterattacks / with shots | Contropiedi / con Tiri | | |
| Free-kick attacks / with shots | Punizioni Offensive / con Tiri | | |
| Corner attacks / with shots | Angoli Offensivi / con Tiri | | |
| Left flank attacks (xG) | Attacchi Fascia Sinistra (xG) | _e.g. 14 (0.42)_ | |
| Central attacks (xG) | Attacchi Centrali (xG) | | |
| Right flank attacks (xG) | Attacchi Fascia Destra (xG) | | |

---

## 3) Defence / Difesa

| Metric (EN) | Metric (IT) | Blu | Verde |
| :--- | :--- | :---: | :---: |
| Sliding tackles | Scivolate | | |
| Interceptions | Intercettazioni | | |
| Clearances | Spazzate | | |
| PPDA | PPDA | | |

---

## 4) Transitions / Transizioni

| Metric (EN) | Metric (IT) | Blu | Verde |
| :--- | :--- | :---: | :---: |
| Losses (total) | Palle Perse Totali | | |
| Losses low / mid / high | Palle Perse Basso / Medio / Alto | _e.g. 12 / 28 / 28_ | |
| Losses leading to shot against | Palle Perse con Tiro Subito | | |

---

## 5) Duels / Duelli

| Metric (EN) | Metric (IT) | Blu | Verde |
| :--- | :--- | :---: | :---: |
| Duels / won | Duelli Totali / Vinti | _e.g. 98 / 54 (55%)_ | |
| Offensive duels / won | Duelli Offensivi / Vinti | | |
| Defensive duels / won | Duelli Difensivi / Vinti | | |
| Loose-ball duels / won | Contrasti su Palla Persa / Vinti | | |
| Aerial duels / won | Duelli Aerei / Vinti | | |
| Dribbles / successful | Dribbling / Riusciti | | |

---

## 6) Possession / Possesso

| Metric (EN) | Metric (IT) | Blu | Verde |
| :--- | :--- | :---: | :---: |
| Possession % (total) | Possesso Palla % (Totale) | | |
| Possession % (1st half) | Possesso Palla % (1° Tempo) | | |
| Possession % (2nd half) | Possesso Palla % (2° Tempo) | | |

**Consistency check:** Blu % + Verde % = 100% (±1).

---

## 7) Passes / Passaggi

| Metric (EN) | Metric (IT) | Blu | Verde |
| :--- | :--- | :---: | :---: |
| Total passes / accurate | Passaggi Totali / Riusciti | _e.g. 359 / 298 (83%)_ | |
| Forward / accurate | Passaggi in Avanti / Riusciti | | |
| Back / accurate | Passaggi all'Indietro / Riusciti | | |
| Lateral / accurate | Passaggi Laterali / Riusciti | | |
| Progressive passes / accurate | Passaggi Progressivi / Riusciti | | |
| Long passes / accurate | Lanci Lunghi / Riusciti | | |
| To final third / accurate | Passaggi sulla Trequarti / Riusciti | | |
| To penalty area / accurate | Passaggi in Area di Rigore / Riusciti | | |
| Through passes / accurate | Passaggi Filtranti / Riusciti | | |
| Crosses / accurate (low/high/blocked) | Cross / Riusciti (basso/alto/bloccato) | _e.g. 14 / 5 (6/5/3)_ | |
| Inaccurate Pass % | Percentuale Passaggi Sbagliati % | | |

---

## 8) Soft scores / Indici soft (optional — only if clearly coded)

| Metric (EN) | Metric (IT) | Blu | Verde |
| :--- | :--- | :---: | :---: |
| Assists (goal) | Assist (gol) | | |
| Opportunity Score | Indice Opportunità | | |
| Offensive Triangles | Triangoli Offensivi | | |
| Defensive Triangles | Triangoli Difensivi | | |
| Compact Defense % | Difesa Compatta % | | |
| Stretched Defense % | Difesa Disunita % | | |
| Compact or Stretched | Stato di Compattezza | _short phrase_ | |
| Pressing Shape | Sistema di Pressing | _short phrase_ | |

Prefer `n/c` on soft scores rather than guessing.

---

## 9) Goalkeepers (one row per GK stint)

For each GK who played:

| Field | Example | Value |
| :--- | :--- | :--- |
| name | Spinelli | |
| minutes | 45 | |
| team | Napoli Blu / Napoli Verde | |
| period | 1st Half / 2nd Half / Full match | |
| jerseyColor | Blue / Green | |
| shotsFaced | 5 | |
| shotsOnTargetFaced | 2 | |
| saves | 1 | |
| reflexSaves | 1 | |
| goalsConceded | 1 | |
| savePercentage | 50.0% | |
| aerialDuels | 1 / 1 (100%) | |
| exits | 2 | |
| passes | 10 / 7 (70%) | |
| colorClass | `blue` or `green` | |

**Consistency:** goalsConceded for Blu GK should equal Verde goals (1). Verde GK goalsConceded = Blu goals (3), unless rotations mid-game — then split by stint.

---

## Output format required

Return **only**:
1. The filled tables above (same metric names), and  
2. A JSON array ready for `match.json` → `teamStats`, each item:

```json
{
  "category": { "en": "General", "it": "Generale" },
  "name": { "en": "Shots", "it": "Tiri" },
  "home": "14",
  "away": "9"
}
```

Plus `goalkeepers` array matching the Portici schema.
