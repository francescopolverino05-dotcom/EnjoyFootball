#!/usr/bin/env node
/**
 * Sync a drop folder into matches/<slug>/clips/ and rebuild match.json clips.
 *
 * Usage:
 *   npm run sync-clips -- --slug 2026-08-01_amichevole-u19-vs-u18
 *   npm run sync-clips -- --slug 2026-08-01_amichevole-u19-vs-u18 --from "Amivhevole v U18_01.08.2026"
 */

import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
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

const args = parseArgs(process.argv.slice(2));
const slug = args.slug || '2026-08-01_amichevole-u19-vs-u18';
const from = args.from || 'Amivhevole v U18_01.08.2026';

const py = `
from pathlib import Path
import re, json, shutil

slug = ${JSON.stringify(slug)}
incoming_name = ${JSON.stringify(from)}
root = Path(${JSON.stringify(root)}) / 'matches' / slug
clips_root = root / 'clips'
incoming = Path(${JSON.stringify(root)}) / incoming_name
dest = clips_root / incoming_name
dest.mkdir(parents=True, exist_ok=True)

if incoming.exists():
    for src in incoming.rglob('*'):
        if src.is_file() and not src.name.startswith('.'):
            rel = src.relative_to(incoming)
            target = dest / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            if (not target.exists()) or src.stat().st_size != target.stat().st_size:
                shutil.copy2(src, target)
                print('copied', rel)

SECTION_MAP = {
    'Build_up': ('build-up', 'Build-up', 'Costruzione'),
    'Progress': ('progress', 'Progression', 'Progressione'),
    'Transition_to_attack': ('offensive-transition', 'Transition to attack', 'Transizione offensiva'),
    'Mid_Block': ('mid-block', 'Mid block', 'Blocco medio'),
    'High_Defence': ('high-defence', 'High defence', 'Difesa alta'),
    'Goal': ('goal', 'Goal', 'Gol'),
    'Final_third': ('final-third', 'Final third', 'Ultimo terzo'),
    'Own_Third': ('own-third', 'Own third', 'Proprio terzo'),
    'Transition_to_defence': ('defensive-transition', 'Transition to defence', 'Transizione difensiva'),
}

pat = re.compile(
    r'^(?P<mm>\\d+)_(?P<ss>\\d+)_(?:wd|nd)_(?P<section>.+?)__'
    r'(?:(?P<rating>good|bad)(?:_favorite)?_)?'
    r'(?P<em>\\d+)_(?P<es>\\d+)_(?P<phase>Attacking|Defending)_(?P<num>\\d+)'
    r'(?:_(?P<comment>.*))?$'
)

COMMENT_FIX = {
    'Distribuzione e decisione port': ('GK distribution and decision', 'Distribuzione e decisione portiere'),
    'rotazione centrocampo naturale': ('Natural midfield rotation', 'Rotazione centrocampo naturale'),
    'Esempio Ideale Di costruzione': ('Ideal build-up example', 'Esempio ideale di costruzione'),
    'Poca mobilitá dagli attaccanti': ('Little mobility from the attackers', 'Poca mobilità dagli attaccanti'),
    'Posizionaento generalmente buo': ('Generally good positioning', 'Posizionamento generalmente buono'),
    'Molto buona la marcatura uomo': ('Very good man-marking', 'Molto buona la marcatura a uomo'),
    'Prossimo step (piü verso la li': ('Next step — more toward the line', 'Prossimo step — più verso la linea'),
    'Trasizione offensiva buona': ('Good offensive transition', 'Transizione offensiva buona'),
    'gol concesso poco aggressivi': ('Goal conceded — not aggressive enough', 'Gol concesso — poco aggressivi'),
}

candidates = {}
for f in sorted(clips_root.rglob('*.mp4')):
    rel = f.relative_to(clips_root).as_posix()
    parts = Path(rel).parts
    folder = parts[1] if len(parts) > 2 else 'Other'
    section_id, en_label, it_label = SECTION_MAP.get(folder, ('other', folder, folder))
    stem = f.stem
    m = pat.match(stem)
    if not m:
        m2 = re.match(r'^(\\d+)_(\\d+)_', stem)
        minute = int(m2.group(1)) if m2 else 0
        second = int(m2.group(2)) if m2 else 0
        rating = 'bad' if '_bad_' in stem else ('good' if '_good_' in stem else None)
        num = 'x'
        phase = 'attacking' if 'Attacking' in stem else ('defending' if 'Defending' in stem else None)
        comment = ''
    else:
        minute = int(m.group('mm')); second = int(m.group('ss'))
        rating = m.group('rating'); num = m.group('num'); phase = m.group('phase').lower()
        comment = re.sub(r'\\s+', ' ', (m.group('comment') or '').replace('_', ' ').strip(' -_')).strip()

    prefer = 2 if '_nd_' in stem else 1
    key = (section_id, minute, second)
    title_en = title_it = comment or it_label
    for k, (en, it) in COMMENT_FIX.items():
        if comment.startswith(k) or k in comment:
            title_en, title_it = en, it
            break
    if not comment:
        title_en, title_it = en_label, it_label
    tags = []
    if rating: tags.append(rating)
    if phase: tags.append(phase)
    clip = {
        'id': f'{section_id}-{minute:02d}{second:02d}-{num}',
        'title': {'en': title_en[:90], 'it': title_it[:90]},
        'comments': {'en': title_en, 'it': title_it},
        'minute': minute, 'second': second,
        'videoFile': rel, 'localFile': rel, 'section': section_id, 'labels': [section_id], 'tags': tags,
    }
    prev = candidates.get(key)
    if prev is None or prefer > prev[0]:
        candidates[key] = (prefer, clip)

clips = [c for _, c in sorted(candidates.values(), key=lambda x: x[1]['minute']*60 + x[1]['second'])]
seen = {}
for c in clips:
    base = c['id']
    if base in seen:
        seen[base] += 1
        c['id'] = f'{base}-{seen[base]}'
    else:
        seen[base] = 1

match_path = root / 'match.json'
data = json.loads(match_path.read_text())
data['clips'] = clips
# Do not touch analysisVideos unless empty key missing
data.setdefault('analysisVideos', [])
match_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\\n')
print(f'Registered {len(clips)} clips into {match_path}')
`;

const result = spawnSync('python3', ['-c', py], { cwd: root, encoding: 'utf8' });
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
process.exit(result.status ?? 1);
