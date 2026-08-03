#!/usr/bin/env node
/**
 * Scaffold a new training session folder.
 *
 * Usage:
 *   npm run new-training -- --date 2026-08-05 --title "Rondo + Finishing" --focus "Build-up"
 *   npm run new-training -- --date 2026-08-05 --title "..." --vimeo-folder 30099288
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
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) args[key] = true;
      else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

function slugify(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

const args = parseArgs(process.argv.slice(2));

if (!args.date) {
  console.error(`
Usage: npm run new-training -- --date YYYY-MM-DD [--title "..."] [--focus "..."] [--slug optional-name] [--vimeo-folder <id>]

Example:
  npm run new-training -- --date 2026-08-05 --title "Rondo + Finishing" --focus "Build-up under pressure"
  npm run new-training -- --date 2026-08-05 --title "Monday" --vimeo-folder 30099288
`);
  process.exit(1);
}

const title = args.title || `Training ${args.date}`;
const focus = args.focus || '';
const namePart = args.slug || slugify(title) || 'session';
const slug = `${args.date}_${namePart}`;
const trainingDir = join(root, 'trainings', slug);

if (existsSync(trainingDir)) {
  console.error(`Folder already exists: trainings/${slug}`);
  process.exit(1);
}

mkdirSync(join(trainingDir, 'video'), { recursive: true });
mkdirSync(join(trainingDir, 'clips'), { recursive: true });
mkdirSync(join(trainingDir, 'analysis'), { recursive: true });

const template = {
  id: slug,
  slug,
  date: args.date,
  title: { en: title, it: title },
  focus: focus
    ? { en: focus, it: focus }
    : { en: 'General session', it: 'Sessione generale' },
  status: 'draft',
  notes: {
    en: 'Add session notes here.',
    it: 'Aggiungere note della sessione.',
  },
  video: {
    fullSession: 'video/session.mp4',
    notes: {
      en: `Add session.mp4 to trainings/${slug}/video/`,
      it: `Aggiungere session.mp4 in trainings/${slug}/video/`,
    },
  },
  clips: [],
  analysisVideos: [],
};

const vimeoFolder = args['vimeo-folder'] || args.vimeoFolder;
if (vimeoFolder) {
  const folderId = String(vimeoFolder);
  template.vimeo = {
    folderId,
    folderUrl: `https://vimeo.com/user/170593333/folder/${folderId}`,
  };
  template.notes = {
    en: 'Videos hosted on Vimeo — run npm run sync-vimeo -- --training ' + slug,
    it: 'Video su Vimeo — esegui npm run sync-vimeo -- --training ' + slug,
  };
  template.video = {
    fullSession: '',
    notes: {
      en: 'Synced from Vimeo after upload.',
      it: 'Sincronizzato da Vimeo dopo il caricamento.',
    },
  };
}

writeFileSync(
  join(trainingDir, 'training.json'),
  JSON.stringify(template, null, 2) + '\n'
);
writeFileSync(join(trainingDir, 'video', '.gitkeep'), '');
writeFileSync(join(trainingDir, 'clips', '.gitkeep'), '');
writeFileSync(join(trainingDir, 'analysis', '.gitkeep'), '');

writeFileSync(
  join(trainingDir, 'video', 'README.md'),
  `# Full session video

\`\`\`text
video/session.mp4
\`\`\`

\`training.json\` → \`video.fullSession\`
`
);

writeFileSync(
  join(trainingDir, 'clips', 'README.md'),
  `# Training clips

Short moments for the **Clips** tab. Register in \`../training.json\` → \`clips\`.
`
);

writeFileSync(
  join(trainingDir, 'analysis', 'README.md'),
  `# Training video analysis

Longer analyst reports for the **Video Analysis** tab. Register in \`../training.json\` → \`analysisVideos\`.
`
);

writeFileSync(
  join(trainingDir, 'README.md'),
  `# ${title} — ${args.date}

\`\`\`text
trainings/${slug}/
├── training.json
├── video/      ← FULL SESSION → video/session.mp4
├── clips/      ← tactical clips
└── analysis/   ← analyst reports
\`\`\`

1. Put full session video in \`video/session.mp4\`
2. Add clips under \`clips/\`
3. Add analysis under \`analysis/\`
4. Update \`training.json\` and set \`status\` to \`"published"\`
`
);

console.log(`
✓ Created trainings/${slug}

Next:
${
  vimeoFolder
    ? `  1. Upload videos to Vimeo folder ${vimeoFolder}
  2. npm run sync-vimeo -- --training ${slug}
  3. Edit training.json (title, focus) and set status to "published"
  4. git add / commit / push`
    : `  1. Add video/session.mp4 (or set vimeo.folderId and sync)
  2. Add clips / analysis as needed
  3. Edit training.json (title, focus, status)
  4. Or: npm run sync-vimeo -- --training ${slug} --folder <id>`
}
`);
