#!/usr/bin/env python3
"""Rebuild src/data/perugiaGkStrikers.ts from StatMan's shot-map CSV.

Re-run this whenever the CSV is updated:

  python3 scripts/buildPerugiaGkStrikers.py
  python3 scripts/buildPerugiaGkStrikers.py /path/to/statman_shots.csv

Default CSV: /workspace/gk_shots/statman_shots.csv
Writes:     src/data/perugiaGkStrikers.ts

Dropped rows:
  s11        — duplicate of s05 (same clip, re-encoded)
  s09 shot 1 — Pescara (opponent) shot in the same clip as Ciani's s09 shot 2

Shirt numbers come from the official Perugia Primavera squad /
scouted XIs in opposition.ts, not from the CSV:
  Merico 7, Ciani 11. Agnissan has no fixed squad number
  (official #9 is Sheji; Agnissan wore 9 when starting vs Pescara
  and Palermo, and Iachini also wears 9 when he starts), so it
  is left null.

Values are copied from the CSV only. Blank foot / footZone / body
/ minute stay omitted — nothing is invented.
"""

from __future__ import annotations

import csv
import sys
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CSV = Path('/workspace/gk_shots/statman_shots.csv')
OUT = ROOT / 'src/data/perugiaGkStrikers.ts'

# Display order and official shirts. None = varies / unknown.
PLAYERS: list[tuple[str, int | None]] = [
    ('Merico', 7),
    ('Agnissan', None),
    ('Ciani', 11),
]

TYPE_EN = {
    'inside-box': 'Inside the box',
    'outside-box': 'Outside the box',
    'free-kick': 'Free kick',
    'penalty': 'Penalty',
}
TYPE_IT = {
    'inside-box': 'In area',
    'outside-box': 'Fuori area',
    'free-kick': 'Punizione',
    'penalty': 'Rigore',
}
FOOT_EN = {'left': 'left', 'right': 'right'}
FOOT_IT = {'left': 'sinistro', 'right': 'destro'}
ZONE_EN = {'inside': 'inside', 'toe': 'toe', 'outside': 'outside', 'laces': 'laces'}
ZONE_IT = {'inside': 'interno', 'toe': 'punta', 'esterno': 'esterno', 'outside': 'esterno', 'laces': 'collo'}

ALLOWED_TYPES = set(TYPE_EN)
ALLOWED_FEET = set(FOOT_EN)
ALLOWED_ZONES = set(ZONE_EN)
ALLOWED_OUTCOMES = {'goal', 'saved', 'off-target', 'woodwork'}


def ts_str(s: str) -> str:
    """Single-quoted TS string; typographic apostrophes in the source text."""
    s = s.replace("'", "’")
    s = s.replace('\\', '\\\\')
    s = s.replace('\n', ' ')
    return "'" + s + "'"


def loc(en: str, it: str) -> str:
    return '{ en: %s, it: %s }' % (ts_str(en), ts_str(it))


def as_int(value: str) -> int | None:
    value = (value or '').strip()
    if value == '':
        return None
    try:
        return int(float(value))
    except ValueError:
        return None


def keep(row: dict[str, str]) -> bool:
    clip = (row.get('clip') or '').strip()
    shot_n = (row.get('shot_n') or '').strip()
    player = (row.get('player') or '').lower()
    if clip == 's11':
        return False
    if clip == 's09' and shot_n == '1':
        return False
    if 'opponent' in player or 'pescara' in player:
        return False
    return True


def shot_id(row: dict[str, str]) -> str:
    clip = (row.get('clip') or '').strip()
    shot_n = (row.get('shot_n') or '').strip() or '1'
    if shot_n != '1':
        return f'perugia-gk-{clip}-{shot_n}'
    return f'perugia-gk-{clip}'


def shot_title(row: dict[str, str]) -> tuple[str, str]:
    kind = (row.get('type') or '').strip()
    type_en = TYPE_EN.get(kind, kind)
    type_it = TYPE_IT.get(kind, kind)
    body = (row.get('body') or '').strip()
    foot = (row.get('foot') or '').strip()
    zone = (row.get('footZone') or '').strip()

    if body == 'head':
        en, it = f'{type_en}, header', f'{type_it}, di testa'
    elif foot in ALLOWED_FEET and zone in ALLOWED_ZONES:
        en = f'{type_en}, {FOOT_EN[foot]} {ZONE_EN[zone]}'
        it = f'{type_it}, {ZONE_IT[zone]} {FOOT_IT[foot]}'
    elif foot in ALLOWED_FEET:
        en = f'{type_en}, {FOOT_EN[foot]} foot'
        it = f'{type_it}, {FOOT_IT[foot]}'
    else:
        en, it = type_en, type_it

    minute = as_int(row.get('minute') or '')
    if minute is not None:
        en = f"{minute}' · {en}"
        it = f'{minute}′ · {it}'
    return en, it


def emit_shot(row: dict[str, str]) -> str:
    kind = (row.get('type') or '').strip()
    if kind not in ALLOWED_TYPES:
        raise SystemExit(f"Unknown shot type {kind!r} on {row.get('clip')}")
    en, it = shot_title(row)
    lines = [
        '        {',
        f"          id: {ts_str(shot_id(row))},",
        f'          title: {loc(en, it)},',
        f"          type: {ts_str(kind)},",
    ]
    for key in ('pitchX', 'pitchY', 'goalX', 'goalY'):
        value = as_int(row.get(key) or '')
        if value is not None:
            lines.append(f'          {key}: {value},')
    outcome = (row.get('outcome') or '').strip()
    if outcome in ALLOWED_OUTCOMES:
        lines.append(f'          outcome: {ts_str(outcome)},')
    body = (row.get('body') or '').strip()
    if body == 'head':
        lines.append("          body: 'head',")
    else:
        foot = (row.get('foot') or '').strip()
        zone = (row.get('footZone') or '').strip()
        if foot in ALLOWED_FEET:
            lines.append(f'          foot: {ts_str(foot)},')
        if zone in ALLOWED_ZONES:
            lines.append(f'          footZone: {ts_str(zone)},')
    lines.append('        }')
    return '\n'.join(lines)


def load_rows(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open(newline='', encoding='utf-8') as fh:
        return [row for row in csv.DictReader(fh) if keep(row)]


def build(csv_path: Path) -> str:
    rows = load_rows(csv_path)
    by_player: OrderedDict[str, list[dict[str, str]]] = OrderedDict(
        (name, []) for name, _ in PLAYERS
    )
    unknown: list[str] = []
    for row in rows:
        name = (row.get('player') or '').strip()
        if name in by_player:
            by_player[name].append(row)
        else:
            unknown.append(name or '(blank)')
    if unknown:
        raise SystemExit(f'Unexpected player name(s) in kept rows: {unknown}')

    counts = ', '.join(f'{name} {len(shots)}' for name, shots in by_player.items())
    total = sum(len(shots) for shots in by_player.values())

    parts: list[str] = [
        "import type { GkStrikerProfile } from '../types/opposition';",
        '',
        '/**',
        ' * Perugia (Primavera 2) goalkeeper-area shot maps.',
        ' *',
        ' * GENERATED from StatMan tags. Do not edit by hand — re-run',
        ' *   python3 scripts/buildPerugiaGkStrikers.py [path/to/statman_shots.csv]',
        ' * after the CSV changes. Default CSV: /workspace/gk_shots/statman_shots.csv',
        ' *',
        ' * Dropped: s11 (duplicate of s05); s09 shot 1 (Pescara opponent shot).',
        f' * Kept: {total} Perugia shots ({counts}).',
        ' *',
        ' * Shirt numbers: Merico 7 and Ciani 11 from the official squad.',
        ' * Agnissan’s number is left null — it is not fixed on the squad',
        ' * list (#9 is Sheji; Agnissan wore 9 when starting, and Iachini',
        ' * also wears 9 as the starting striker).',
        ' *',
        ' * Coordinates, foot, foot part, body and outcome are copied from',
        ' * the CSV only. Blank foot parts stay omitted (s03, s05, s09).',
        ' * Clips are not attached: opposition videos on this site are',
        ' * Vimeo URLs, and these files have not been uploaded.',
        ' */',
        '',
        'export const perugiaGkStrikers: GkStrikerProfile[] = [',
    ]

    for name, number in PLAYERS:
        shots = by_player[name]
        slug = name.lower()
        parts.append('  {')
        parts.append(f"    id: {ts_str(f'perugia-gk-{slug}')},")
        parts.append(f'    name: {ts_str(name)},')
        if number is None:
            parts.append('    number: null,')
        else:
            parts.append(f'    number: {number},')
        parts.append('    clips: [],')
        parts.append('    shots: [')
        for i, row in enumerate(shots):
            block = emit_shot(row)
            if i < len(shots) - 1:
                block += ','
            parts.append(block)
        parts.append('    ],')
        parts.append('  },')
    parts.append('];')
    parts.append('')
    return '\n'.join(parts)


def main() -> None:
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_CSV
    if not csv_path.is_file():
        raise SystemExit(f'CSV not found: {csv_path}')
    text = build(csv_path)
    OUT.write_text(text, encoding='utf-8')
    print(f'Wrote {OUT} from {csv_path}')


if __name__ == '__main__':
    main()
