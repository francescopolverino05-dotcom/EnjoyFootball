#!/usr/bin/env node
/**
 * Scaffold a new match analysis folder.
 *
 * Usage:
 *   npm run new-match -- --date 2026-08-08 --type amichevole --teams u19-vs-roma --title "Napoli U19 vs Roma"
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

.mkdirSync(join(matchDir, 'video'), { recursive: true });
mkdirSync(join(matchDir, 'clips'), { recursive: true });
mkdirSync(join(matchDir, 'analysis'), { recursive: true });

const title = args.title || slug.replace(/-/g, ' ');
const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

const template = {
  id: slug,
  slug,
  title: { en: title, it: title },
  subtitle: { en: typeLabel, it: typeLabel },
  date: args.date,
  competition: { en: typeLabel, it: typeLabel },
  status: 'draft',
  homeTeam: {
    id: 'u19',
    name: {
      en: 'Napoli Primavera (Azzurri)',
      it: 'Napoli Primavera (Azzurri)',
    },
    shortName: 'U19',
    colorClass: 'u19',
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
  analysisVideos: [],
};

writeFileSync(join(matchDir, 'match.json'), JSON.stringify(template, null, 2) + '\n');
writeFileSync(join(matchDir, 'video', '.gitkeep'), '');
writeFileSync(join(matchDir, 'clips', '.gitkeep'), '');
writeFileSync(join(matchDir, 'analysis', '.gitkeep'), '');

writeFileSync(
  join(matchDir, 'README.md'),
  `# ${title}

## Cartella partita: \`${slug}\`

### Prossimi passi

1. Copia il video completo in \`video/match.mp4\`
2. Aggiungi eventuali clip in \`clips/\` e registrale in \`match.json\` → \`clips\`
3. Chiedi all'agente Cursor di analizzare il video e compilare le statistiche
4. Quando pronto, imposta \`status\` su \`"published"\` in match.json

### Clip metadata (example)

\`\`\`json
{
  "id": "goal-esposito-32",
  "title": { "en": "Esposito goal", "it": "Gol Esposito" },
  "comments": {
    "en": "Build-up through the right half-space, late run into the box.",
    "it": "Costruzione dal half-space destro, inserimento in area."
  },
  "minute": 32,
  "second": 14,
  "videoFile": "goal-esposito-32.mp4",
  "labels": ["goal", "build-up"],
  "tags": ["right half-space", "late run"]
}
\`\`\`

### Analysis video metadata (example)

\`\`\`json
{
  "id": "pressing-review",
  "title": { "en": "Pressing review", "it": "Review pressing" },
  "description": {
    "en": "Full pressing structure analysis from the first half.",
    "it": "Analisi completa della struttura di pressing nel primo tempo."
  },
  "videoFile": "pressing-review.mp4",
  "tags": ["pressing", "1H"]
}
\`\`\`
`
);

console.log(`
✓ Created match folder: matches/${slug}/

Next steps:
  1. Drop your MP4 into matches/${slug}/video/match.mp4
  2. Open Cursor and ask the agent to analyze the match folder
  3. Run: npm run dev
`);
