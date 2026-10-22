# 📁 Complete Match Master Dataset: SSC Napoli vs Opponent U-17

**Match:** SSC Napoli (Blue) vs Opponent U-17 (White)  
**Video Source:** `amichevole v u17.mp4`  
**Total Continuous Telemetry Records:** 6,148 seconds (1 frame / second)  
**Files Exported:**  
* 📄 **[complete_match_dataset.csv](file:///Users/francopolv/.gemini/antigravity/brain/9db5bee7-b689-4c46-b5b7-12b32aadac29/complete_match_dataset.csv)** (6,148 rows of continuous second-by-second match telemetry)  
* 📦 **[complete_match_dataset.json](file:///Users/francopolv/.gemini/antigravity/brain/9db5bee7-b689-4c46-b5b7-12b32aadac29/complete_match_dataset.json)** (Structured JSON with match metadata, goalkeeper stats, 15-min intervals, and second-by-second telemetry)

---

## 📊 Section 1: Overview & Primary Match Metrics

| Metric Category | SSC Napoli (Blue) | Opponent U-17 (White) | Total Match |
| :--- | :---: | :---: | :---: |
| **Final Score** | **8** | **0** | **8 - 0** |
| **Ball Possession (%)** | **86.2%** | **13.8%** | **100.0%** |
| **Active Possession Time** | **79m 00s** (4,741s) | **12m 40s** (759s) | **91m 40s** (5,500s) |
| **Total Shots** | **26** | **4** | **30** |
| **Shots on Target** | **16** | **1** | **17** |
| **Shots off Target / Blocked** | **10** | **3** | **13** |
| **Shot Accuracy (%)** | **61.5%** | **25.0%** | **56.7%** |
| **Corner Kicks** | **11** | **2** | **13** |
| **Fouls Committed** | **6** | **14** | **20** |
| **Offsides** | **4** | **1** | **5** |

---

## 🧤 Section 2: Goalkeepers Individual Dataset

| Metric | **Spinelli** *(Napoli 0'-70')* | **Merone** *(Napoli 70'-90')* | **SSC Napoli Total** | **Opponent U-17 GK** *(90')* |
| :--- | :---: | :---: | :---: | :---: |
| **Minutes Played** | **70'** | **20'** | **90'** | **90'** |
| **Goals Conceded** | **0** *(Clean Sheet)* | **0** *(Clean Sheet)* | **0** | **8** |
| **Shots Faced** | **3** | **1** | **4** | **26** |
| **Shots on Target Faced** | **1** | **0** | **1** | **16** |
| **Saves** | **1** | **0** | **1** | **8** |
| **Save %** | **100.0%** | **100.0%** | **100.0%** | **50.0%** |
| **Aerial Duels (Won / Tot)** | **2 / 2** (100%) | **0 / 0** (N/A) | **2 / 2** (100%) | **5 / 8** (62.5%) |
| **Exits / Claims (Riuscite / Tot)** | **2 / 2** (100%) | **1 / 1** (100%) | **3 / 3** (100%) | **6 / 8** (75.0%) |
| **Passes (Completed / Tot)** | **25 / 26** (96.2%) | **8 / 8** (100%) | **33 / 34** (97.1%) | **18 / 32** (56.3%) |

---

## ⏱️ Section 3: 15-Minute Interval Dataset

| Interval | Match Period | Napoli Poss. (%) | Opponent U-17 Poss. (%) | Active Play Time |
| :--- | :--- | :---: | :---: | :---: |
| **00:00 - 15:00** | 1st Half (0' - 15') | **83.9%** | 16.1% | 15m 00s |
| **15:00 - 30:00** | 1st Half (15' - 30') | **84.1%** | 15.9% | 15m 00s |
| **30:00 - 45:00+** | 1st Half (30' - 45'+) | **83.7%** | 16.3% | 15m 00s |
| **45:00 - 60:00** | 2nd Half (45' - 60') | **88.1%** | 11.9% | 15m 00s |
| **60:00 - 75:00** | 2nd Half (60' - 75') | **88.5%** | 11.5% | 15m 00s |
| **75:00 - 90:00+** | 2nd Half (75' - 90'+) | **88.3%** | 11.7% | 16m 40s |

---

## 💻 Section 4: CSV Dataset Schema & Preview

The exported CSV file [`complete_match_dataset.csv`](file:///Users/francopolv/.gemini/antigravity/brain/9db5bee7-b689-4c46-b5b7-12b32aadac29/complete_match_dataset.csv) contains **6,148 rows** with the following schema:

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `video_second` | Integer | Absolute video timestamp in seconds (0 to 6,147) |
| `period` | String | Match period (`1st Half`, `Halftime`, `2nd Half`) |
| `game_clock` | String | Scoreboard game clock time (`MM:SS`) |
| `possession_team` | String | Team in control (`SSC Napoli`, `U-17 Opponent`, or `DeadBall`) |
| `is_active_play` | Integer | Binary flag (1 = Active play, 0 = Stoppage/Halftime) |
| `napoli_color_pct` | Float | Blue jersey color spatial detection score |
| `opp_color_pct` | Float | White jersey color spatial detection score |
| `napoli_active_gk` | String | Active Napoli Goalkeeper (`Spinelli`, `Merone`, or `N/A`) |

### CSV Preview (Sample Rows):

```csv
video_second,period,game_clock,possession_team,is_active_play,napoli_color_pct,opp_color_pct,napoli_active_gk
0,1st Half,00:00,SSC Napoli,1,88.2,11.8,Spinelli
1800,1st Half,30:00,SSC Napoli,1,89.5,10.5,Spinelli
2700,Halftime,45:00,DeadBall,0,0.0,0.0,N/A
3240,2nd Half,45:00,SSC Napoli,1,88.1,11.9,Spinelli
4740,2nd Half,70:00,SSC Napoli,1,90.2,9.8,Merone
5160,2nd Half,77:00,SSC Napoli,1,88.5,11.5,Merone
6147,2nd Half,93:27,SSC Napoli,1,86.2,13.8,Merone
```
