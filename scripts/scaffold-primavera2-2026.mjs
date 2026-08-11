#!/usr/bin/env node
/**
 * Scaffold SSC Napoli Primavera 2 2026/27 Girone B fixtures (C.U. LNPB n. 10).
 * Run once: node scripts/scaffold-primavera2-2026.mjs
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const NAPOLI = {
  id: 'u19',
  name: { en: 'Napoli Primavera', it: 'Napoli Primavera' },
  shortName: 'Napoli',
  colorClass: 'u19',
  logo: 'napoli-logo.png',
};

/** @type {Record<string, { id: string; name: string; shortName: string; initials: string }>} */
const OPPONENTS = {
  avellino: { id: 'avellino', name: 'Avellino', shortName: 'Avellino', initials: 'AV' },
  catanzaro: { id: 'catanzaro', name: 'Catanzaro', shortName: 'Catanzaro', initials: 'CT' },
  ascoli: { id: 'ascoli', name: 'Ascoli', shortName: 'Ascoli', initials: 'AS' },
  pisa: { id: 'pisa', name: 'Pisa', shortName: 'Pisa', initials: 'PI' },
  bari: { id: 'bari', name: 'Bari', shortName: 'Bari', initials: 'BA' },
  spezia: { id: 'spezia', name: 'Spezia', shortName: 'Spezia', initials: 'SP' },
  monopoli: { id: 'monopoli', name: 'Monopoli', shortName: 'Monopoli', initials: 'MO' },
  frosinone: { id: 'frosinone', name: 'Frosinone', shortName: 'Frosinone', initials: 'FR' },
  perugia: { id: 'perugia', name: 'Perugia', shortName: 'Perugia', initials: 'PG' },
  benevento: { id: 'benevento', name: 'Benevento', shortName: 'Benevento', initials: 'BN' },
  pescara: { id: 'pescara', name: 'Pescara', shortName: 'Pescara', initials: 'PE' },
  palermo: { id: 'palermo', name: 'Palermo', shortName: 'Palermo', initials: 'PA' },
  latina: { id: 'latina', name: 'Latina', shortName: 'Latina', initials: 'LT' },
  cosenza: { id: 'cosenza', name: 'Cosenza', shortName: 'Cosenza', initials: 'CS' },
  salernitana: {
    id: 'salernitana',
    name: 'Salernitana',
    shortName: 'Salernitana',
    initials: 'SA',
  },
};

/** Home – Away fixtures with giornata dates (no KO times in CU). */
const FIXTURES = [
  { date: '2026-09-05', giornata: 1, home: 'avellino', away: 'napoli' },
  { date: '2026-09-12', giornata: 2, home: 'napoli', away: 'catanzaro' },
  { date: '2026-09-19', giornata: 3, home: 'ascoli', away: 'napoli' },
  { date: '2026-10-10', giornata: 4, home: 'napoli', away: 'pisa' },
  { date: '2026-10-17', giornata: 5, home: 'bari', away: 'napoli' },
  { date: '2026-10-24', giornata: 6, home: 'napoli', away: 'spezia' },
  { date: '2026-10-31', giornata: 7, home: 'monopoli', away: 'napoli' },
  { date: '2026-11-07', giornata: 8, home: 'napoli', away: 'frosinone' },
  { date: '2026-11-21', giornata: 9, home: 'napoli', away: 'perugia' },
  { date: '2026-11-28', giornata: 10, home: 'benevento', away: 'napoli' },
  { date: '2026-12-05', giornata: 11, home: 'napoli', away: 'pescara' },
  { date: '2026-12-12', giornata: 12, home: 'napoli', away: 'palermo' },
  { date: '2026-12-19', giornata: 13, home: 'latina', away: 'napoli' },
  { date: '2027-01-09', giornata: 14, home: 'cosenza', away: 'napoli' },
  { date: '2027-01-16', giornata: 15, home: 'napoli', away: 'salernitana' },
  { date: '2027-01-23', giornata: 16, home: 'catanzaro', away: 'napoli' },
  { date: '2027-01-30', giornata: 17, home: 'napoli', away: 'ascoli' },
  { date: '2027-02-06', giornata: 18, home: 'napoli', away: 'bari' },
  { date: '2027-02-13', giornata: 19, home: 'palermo', away: 'napoli' },
  { date: '2027-02-20', giornata: 20, home: 'napoli', away: 'monopoli' },
  { date: '2027-02-27', giornata: 21, home: 'perugia', away: 'napoli' },
  { date: '2027-03-06', giornata: 22, home: 'napoli', away: 'avellino' },
  { date: '2027-03-13', giornata: 23, home: 'pescara', away: 'napoli' },
  { date: '2027-03-20', giornata: 24, home: 'spezia', away: 'napoli' },
  { date: '2027-04-03', giornata: 25, home: 'napoli', away: 'cosenza' },
  { date: '2027-04-10', giornata: 26, home: 'frosinone', away: 'napoli' },
  { date: '2027-04-17', giornata: 27, home: 'salernitana', away: 'napoli' },
  { date: '2027-04-24', giornata: 28, home: 'napoli', away: 'latina' },
  { date: '2027-05-01', giornata: 29, home: 'pisa', away: 'napoli' },
  { date: '2027-05-08', giornata: 30, home: 'napoli', away: 'benevento' },
];

function opponentTeam(key) {
  const o = OPPONENTS[key];
  return {
    id: o.id,
    name: { en: o.name, it: o.name },
    shortName: o.shortName,
    colorClass: 'opponent',
    // Placeholder crest until official club logos are added under public/logos/
    logo: `logos/${o.id}.svg`,
  };
}

function crestSvg(initials) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${initials}">
  <circle cx="50" cy="50" r="46" fill="#2c2c2c" stroke="#8a8a8a" stroke-width="3"/>
  <text x="50" y="58" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#f5f5f5">${initials}</text>
</svg>
`;
}

function writeFolderScaffold(matchDir, slug, title) {
  mkdirSync(join(matchDir, 'video'), { recursive: true });
  mkdirSync(join(matchDir, 'clips'), { recursive: true });
  mkdirSync(join(matchDir, 'analysis'), { recursive: true });
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
    `# Video Analysis

Long analyst / coach reports for the **Video Analysis** tab.

\`\`\`text
analysis/
└── your-report.mp4
\`\`\`

Register in \`../match.json\` → \`analysisVideos\`.

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
└── analysis/   ← analyst reports (Video Analysis tab)
\`\`\`

Scheduled Primavera 2 fixture (Girone B). Fill analysis after the match; set kickoff when known.
`
  );
}

// Placeholder crests for opponents (no official logos in repo yet)
const logosDir = join(root, 'public', 'logos');
mkdirSync(logosDir, { recursive: true });
for (const o of Object.values(OPPONENTS)) {
  const path = join(logosDir, `${o.id}.svg`);
  if (!existsSync(path)) {
    writeFileSync(path, crestSvg(o.initials));
  }
}

const created = [];
const skipped = [];

for (const fx of FIXTURES) {
  const napoliHome = fx.home === 'napoli';
  const oppKey = napoliHome ? fx.away : fx.home;
  const opp = OPPONENTS[oppKey];
  const teamsSlug = napoliHome ? `u19-vs-${opp.id}` : `${opp.id}-vs-u19`;
  const slug = `${fx.date}_campionato-${teamsSlug}`;
  const matchDir = join(root, 'matches', slug);

  if (existsSync(matchDir)) {
    skipped.push(slug);
    continue;
  }

  const homeTeam = napoliHome ? { ...NAPOLI } : opponentTeam(oppKey);
  const awayTeam = napoliHome ? opponentTeam(oppKey) : { ...NAPOLI };
  const homeLabel = homeTeam.shortName;
  const awayLabel = awayTeam.shortName;
  const title = {
    en: `${homeLabel} vs ${awayLabel}`,
    it: `${homeLabel} vs ${awayLabel}`,
  };
  const subtitle = {
    en: `Primavera 2 · Matchday ${fx.giornata}`,
    it: `Primavera 2 · Giornata ${fx.giornata}`,
  };

  const match = {
    id: slug,
    slug,
    title,
    subtitle,
    date: fx.date,
    competitionId: 'primavera2',
    competition: {
      en: 'Primavera 2',
      it: 'Primavera 2',
    },
    status: 'published',
    homeTeam,
    awayTeam,
    score: { home: 0, away: 0 },
    goals: [],
    timeline: [],
    formations: [],
    dynamics: [],
    teamStats: [],
    goalkeepers: [],
    clips: [],
    analysisVideos: [],
  };

  mkdirSync(matchDir, { recursive: true });
  writeFileSync(join(matchDir, 'match.json'), JSON.stringify(match, null, 2) + '\n');
  writeFolderScaffold(matchDir, slug, `${homeLabel} vs ${awayLabel}`);
  created.push(slug);
}

console.log(`Created ${created.length} matches`);
if (skipped.length) console.log(`Skipped (exists): ${skipped.length}`);
console.log(created.join('\n'));
