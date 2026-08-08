#!/usr/bin/env node
/**
 * Scaffold a new match analysis folder.
 *
 * Usage:
 *   npm run new-match -- --date 2026-08-08 --type amichevole --teams u19-vs-roma --title "Napoli U19 vs Roma"
 *
 * --type maps to competition tabs:
 *   amichevole|friendly → friendlies
 *   campionato|primavera2 → primavera2
 *   uyl|uefa → uefaYouthLeague
 *   coppa → coppaItalia
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

if (!args.date || !args.teams) {
  console.error(`
Usage: npm run new-match -- --date YYYY-MM-DD --teams slug [--type amichevole] [--title "Match Title"]

Example:
  npm run new-match -- --date 2026-08-08 --type campionato --teams u19-vs-roma --title "Napoli U19 vs Roma"
`);
  process.exit(1);
}

const type = args.type || 'partita';
const slug = `${args.date}_${type}-${args.teams}`;
const matchDir = join(root, 'matches', slug);

if (existsSync(matchDir)) {
  console.error(`Folder already exists: matches/${slug}`);
  process.exit(1);
}

mkdirSync(join(matchDir, 'video'), { recursive: true });
mkdirSync(join(matchDir, 'clips'), { recursive: true });
mkdirSync(join(matchDir, 'analysis'), { recursive: true });

const title = args.title || slug.replace(/-/g, ' ');

const COMPETITION_BY_TYPE = {
  amichevole: 'friendlies',
  friendly: 'friendlies',
  friendlies: 'friendlies',
  campionato: 'primavera2',
  primavera2: 'primavera2',
  league: 'primavera2',
  uyl: 'uefaYouthLeague',
  uefa: 'uefaYouthLeague',
  'uefa-youth-league': 'uefaYouthLeague',
  coppa: 'coppaItalia',
  'coppa-italia': 'coppaItalia',
};

const COMPETITION_LABELS = {
  friendlies: { en: 'Friendlies', it: 'Amichevoli' },
  primavera2: { en: 'Primavera 2', it: 'Primavera 2' },
  uefaYouthLeague: { en: 'UEFA Youth League', it: 'UEFA Youth League' },
  coppaItalia: { en: 'Coppa Italia', it: 'Coppa Italia' },
};

const competitionId = COMPETITION_BY_TYPE[type.toLowerCase()] || 'friendlies';
const competition = COMPETITION_LABELS[competitionId];

const template = {
  id: slug,
  slug,
  title: { en: title, it: title },
  subtitle: { en: competition.en, it: competition.it },
  date: args.date,
  competitionId,
  competition,
  status: 'draft',
  homeTeam: {
    id: 'u19',
    name: {
      en: 'Napoli Primavera (Azzurri)',
      it: 'Napoli Primavera (Azzurri)',
    },
    shortName: 'U19',
    colorClass: 'u19',
    logo: 'napoli-logo.png',
  },
  awayTeam: {
    id: 'opponent',
    name: {
      en: 'Opponent',
      it: 'Avversario',
    },
    shortName: 'OPP',
    colorClass: 'opponent',
  },
  score: { home: 0, away: 0 },
  goals: [],
  timeline: [],
  formations: [],
  dynamics: [],
  teamStats: [],
  goalkeepers: [],
  video: {
    fullMatch: 'video/match.mp4',
    notes: {
      en: `Add match.mp4 to matches/${slug}/video/`,
      it: `Aggiungere match.mp4 in matches/${slug}/video/`,
    },
  },
  clips: [],
  trainingDesign: [],
  analysisVideos: [],
};

writeFileSync(join(matchDir, 'match.json'), JSON.stringify(template, null, 2) + '\n');
writeFileSync(join(matchDir, 'video', '.gitkeep'), '');
writeFileSync(join(matchDir, 'clips', '.gitkeep'), '');
writeFileSync(join(matchDir, 'analysis', '.gitkeep'), '');

writeFileSync(
  join(matchDir, 'video', 'README.md'),
  `# Full match video

Drop the complete match recording here as:

\`\`\`text
video/match.mp4
\`\`\`

\`match.json\` → \`video.fullMatch\` (Full Match tab). MP4s are gitignored.
`
);

writeFileSync(
  join(matchDir, 'clips', 'README.md'),
  `# Tactical clips

Short tagged moments for the **Clips** tab.

1. Drop Hudl/export folder at the **repo root**, or copy MP4s here directly
2. Sync if using a root drop: \`npm run sync-clips -- --slug ${slug}\`
3. Register clips in \`../match.json\` → \`clips\`

Full match → \`../video/match.mp4\`  
Analyst reports → \`../analysis/\`
`
);

writeFileSync(
  join(matchDir, 'analysis', 'README.md'),
  `# Analysis & Training Design

\`\`\`text
analysis/
├── Session_Plan_YYYY-MM-DD.pdf   ← Training Design tab
└── your-report.mp4               ← Video Analysis tab
\`\`\`

**Training Design** — session / matchday plan PDFs. Register in \`../match.json\` → \`trainingDesign\`:

\`\`\`json
{
  "id": "session-plan-YYYY-MM-DD",
  "title": { "en": "Session / matchday plan", "it": "Piano seduta / matchday" },
  "description": { "en": "…", "it": "…" },
  "videoFile": "Session_Plan_YYYY-MM-DD.pdf",
  "kind": "pdf",
  "tags": ["pdf", "session-plan", "matchday"]
}
\`\`\`

**Video Analysis** — long analyst / coach reports. Register in \`../match.json\` → \`analysisVideos\`:

\`\`\`json
{
  "id": "match-report",
  "title": { "en": "Match video report", "it": "Report video partita" },
  "description": { "en": "Full analyst breakdown.", "it": "Analisi completa." },
  "videoFile": "match-report.mp4",
  "tags": []
}
\`\`\`

Full match → \`../video/\` · Clips → \`../clips/\`
`
);

writeFileSync(
  join(matchDir, 'README.md'),
  `# ${title}

\`\`\`text
matches/${slug}/
├── match.json
├── video/      ← FULL MATCH → video/match.mp4
├── clips/      ← tactical clips (Clips tab)
└── analysis/   ← session plans (Training Design) + analyst reports (Video Analysis)
\`\`\`

1. Copy full match → \`video/match.mp4\`
2. Add clips → \`clips/\` (or root drop + \`npm run sync-clips\`)
3. Add session-plan PDF → \`analysis/\` + \`match.json\` → \`trainingDesign\`
4. Add analyst reports → \`analysis/\` + \`match.json\` → \`analysisVideos\`
5. Ask Cursor to fill / register \`match.json\`
6. Set \`status\` to \`"published"\` when ready
`
);

console.log(`
✓ Created match folder: matches/${slug}/

  video/     ← put full match as video/match.mp4
  clips/     ← tactical clips (or root drop + npm run sync-clips)
  analysis/  ← analyst reports

Next: npm run dev → open the match → Full Match / Training Design tabs
`);
