#!/usr/bin/env python3
"""Rebuild src/data/perugiaSetPieces.ts from StatMan's tags CSV.

Re-run this whenever the CSV is updated (StatMan may still revise
free-kick sides for p03–p23):

  python3 scripts/buildPerugiaSetPieces.py
  python3 scripts/buildPerugiaSetPieces.py /path/to/statman_tags.csv

Default CSV: /workspace/perugia_piazzati/statman_tags.csv
Writes:     src/data/perugiaSetPieces.ts
"""

from __future__ import annotations

import csv
import math
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CSV = Path('/workspace/perugia_piazzati/statman_tags.csv')
OUT = ROOT / 'src/data/perugiaSetPieces.ts'

# Not attacking final-third set pieces (kick-offs, a defensive own-half
# free kick, a throw-in, and a Pescara free kick tagged as other).
EXCLUDE = {0, 1, 2, 9, 14, 26, 29}

# Pitch recipe (320×190, goal at the top) — same as Man City / Monopoli.
LEFT_CORNER = (12, 8)
RIGHT_CORNER = (308, 8)
# 16.5 m box depth = 70 viewBox units → 3.879 units / yard.
YARDS_TO_Y = 3.879
FINAL_THIRD_Y = 174

# Extra bilingual notes that are not fully recoverable from a CSV cell
# (filename hints Francesco confirmed, tabellino conflicts, shared routines).
EXTRA = {
    15: {
        'en': 'Filename said Dottori (taker not confirmed on video). Official tabellino lists Dottori 37′ as a penalty, which does not match this clip.',
        'it': 'Il nome del file diceva Dottori (battitore non confermato in video). Il tabellino ufficiale dà Dottori 37′ su rigore, che non corrisponde a questa clip.',
    },
    20: {
        'en': 'Filename said Merico; the shooter is Perugia #10 (#7 is nearby in the wall).',
        'it': 'Il nome del file diceva Merico; a calciare è il #10 del Perugia (#7 è vicino, nella barriera).',
    },
    23: {
        'en': 'Filename tag: tiro - 7.',
        'it': 'Tag nel nome del file: tiro - 7.',
    },
    24: {
        'en': 'Same routine as p25 (one on the GK, four from a central cluster to the near post).',
        'it': 'Stessa routine di p25 (uno sul portiere, quattro da un raggruppamento centrale verso il primo palo).',
    },
    25: {
        'en': 'Same routine as p24; GK punches to the edge of the box.',
        'it': 'Stessa routine di p24; il portiere respinge di pugno verso il limite dell’area.',
    },
    36: {
        'en': 'Filename tag: Iachini (name not readable on video) — taker left unnamed.',
        'it': 'Tag nel nome del file: Iachini (nome non leggibile in video) — battitore lasciato senza nome.',
    },
}

# Recheck in the notes overrides the outcome *column* for these two
# (the column was not rewritten; the recheck lives in `notes`).
# Only when the recheck lives in `notes` and the outcome *column* was not
# rewritten. p06's column is now "cleared (defender header)" — use that.
RECHECK_OUTCOME = {
    13: ('cleared', 'defender heads clear at the near post (recheck; first pass was a GK punch)',
         'il difensore respinge di testa sul primo palo (ricontrollo; il primo passaggio era un pugno)'),
}


def ts_str(s: str) -> str:
    """Single-quoted TS string; use typographic apostrophes in Italian."""
    s = s.replace("'", "’")
    s = s.replace('\\', '\\\\')
    s = s.replace('\n', ' ')
    return "'" + s + "'"


def loc(en: str, it: str) -> str:
    return '{ en: %s, it: %s }' % (ts_str(en), ts_str(it))


def yards_to_y(yards: float) -> int:
    return min(FINAL_THIRD_Y, int(round(6 + yards * YARDS_TO_Y)))


def parse_start(pos: str) -> tuple[float | None, str]:
    """Return (yards or None, channel: wide-left/left/centre/right/wide-right/wing/edge)."""
    p = (pos or '').lower()
    channel = 'channel'
    if 'wide left' in p or 'left wing' in p:
        channel = 'wide-left'
    elif 'wide right' in p or 'right wing' in p:
        channel = 'wide-right'
    elif 'left channel' in p:
        channel = 'left'
    elif 'right channel' in p:
        channel = 'right'
    elif re.search(r'\bleft\b', p):
        channel = 'left'
    elif re.search(r'\bright\b', p):
        channel = 'right'
    yards = None
    if 'edge of box' in p or 'edge of the box' in p:
        yards = 20.0  # just outside the 18-yard box
    m = re.search(r'~?\s*(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*yards', p)
    if m:
        a = float(m.group(1))
        b = float(m.group(2)) if m.group(2) else a
        yards = (a + b) / 2.0
    return yards, channel


def start_xy(side: str, pos: str, delivery: str) -> tuple[int, int]:
    yards, channel = parse_start(pos)
    if yards is None:
        yards = 35.0
    y = yards_to_y(yards)
    # x by channel, falling back to the tagged side
    if channel == 'wide-left':
        x = 28
    elif channel == 'left':
        x = 56
    elif channel == 'wide-right':
        x = 292
    elif channel == 'right':
        x = 264
    else:
        x = 56 if side == 'left' else 264 if side == 'right' else 160
    return x, y


def land_xy(kind: str, side: str, zone: str, delivery: str) -> tuple[int, int]:
    z = (zone or '').lower()
    # Near / far post from the taker's side
    if 'near' in z:
        if side == 'left':
            return (134, 10)
        return (186, 10)
    if 'far' in z:
        if side == 'left':
            return (198, 16)
        return (122, 16)
    if '6-yard' in z or '6 yard' in z:
        return (160, 24)
    if 'penalty' in z or 'spot' in z:
        return (160, 54)
    if 'edge' in z:
        return (160, 76)
    if 'short' in z or delivery == 'short':
        # towards the box, a short distance
        if side == 'left':
            return (70, 76)
        return (250, 76)
    return (160, 54)


def map_outcome(raw: str) -> str | None:
    o = (raw or '').lower()
    if not o:
        return None
    if 'goal' in o:
        return 'goal'
    if 'save' in o or 'parried' in o or 'parry' in o:
        return 'save'
    if 'woodwork' in o or 'post' in o and 'off' in o:
        return 'woodwork'
    if 'wide' in o or 'missed target' in o or 'off target' in o or 'off-target' in o:
        return 'offTarget'
    if 'punch' in o or 'cleared' in o or 'clear' in o:
        return 'cleared'
    if o.strip() == 'shot':
        return None  # may be refined from notes by the caller
    return None


def expected_side(foot: str, delivery: str) -> str | None:
    if delivery not in ('inswinger', 'outswinger') or foot not in ('left', 'right'):
        return None
    if foot == 'right':
        return 'left' if delivery == 'inswinger' else 'right'
    return 'right' if delivery == 'inswinger' else 'left'


def swing_of(delivery: str) -> str | None:
    return {'inswinger': 'in', 'outswinger': 'out', 'short': 'short'}.get(delivery)


def taker_label(row: dict) -> str:
    t = (row.get('taker') or '').strip()
    if t:
        return f'#{t}' if not t.startswith('#') else t
    return 'Unidentified'


def header_won(row: dict) -> str | None:
    o = (row.get('outcome') or '').lower()
    n = (row.get('notes') or '').lower()
    if 'header won' in o or 'headed in' in n or 'flick-on header' in n or 'headed in centrally' in n:
        return 'confirmed'
    return None


def yd_m(yards: float) -> str:
    metres = yards * 0.9144
    return f'about {int(round(yards))} yd / {int(round(metres))} m'


def delivery_en(d: str) -> str:
    return {
        'inswinger': 'inswinger',
        'outswinger': 'outswinger',
        'driven': 'driven ball',
        'short': 'played short',
        'direct shot': 'direct shot',
    }.get(d, d or 'delivery')


def delivery_it(d: str) -> str:
    return {
        'inswinger': 'rientrante',
        'outswinger': 'uscente',
        'driven': 'battuta tesa',
        'short': 'giocata corta',
        'direct shot': 'tiro diretto',
    }.get(d, d or 'battuta')


def zone_en(z: str) -> str:
    z = z or ''
    table = {
        'near post': 'the near post',
        'far post': 'the far post',
        '6-yard': 'the 6-yard box',
        'penalty spot': 'the penalty spot',
        'edge of box': 'the edge of the box',
        'short to teammate': 'a teammate',
    }
    for k, v in table.items():
        if k in z.lower() or z.lower() == k:
            return v
    return z or 'the box'


def zone_it(z: str) -> str:
    z = z or ''
    table = {
        'near post': 'il primo palo',
        'far post': 'il secondo palo',
        '6-yard': 'i 6 metri',
        'penalty spot': 'il dischetto',
        'edge of box': 'il limite dell’area',
        'short to teammate': 'un compagno',
    }
    for k, v in table.items():
        if k in z.lower() or z.lower() == k:
            return v
    return z or 'l’area'


def outcome_phrase(seq: int, row: dict, mapped: str | None) -> tuple[str, str]:
    if seq in RECHECK_OUTCOME:
        _, en, it = RECHECK_OUTCOME[seq]
        return en, it
    raw = (row.get('outcome') or '').strip()
    o = raw.lower()
    if mapped == 'goal' or 'goal' in o:
        return 'GOAL', 'GOL'
    if mapped == 'save' or 'save' in o:
        return 'saved by the GK', 'parato dal portiere'
    if mapped == 'woodwork' or 'crossbar' in o or 'woodwork' in o:
        if 'clear' in o or 'cleared' in o:
            return 'header hits the crossbar, then cleared', 'colpo di testa sulla traversa, poi respinto'
        return 'hits the woodwork', 'sulla traversa'
    if 'punch' in o:
        return 'GK punches clear', 'il portiere respinge di pugno'
    if 'missed target' in o or 'shot wide' in o or mapped == 'offTarget':
        if 'header' in o:
            return 'attacker wins the header but glances it wide', 'l’attaccante vince il colpo di testa ma lo devia largo'
        if 'wide' in o:
            return 'shot wide', 'tiro largo'
        return 'off target', 'fuori'
    if 'cleared' in o or mapped == 'cleared':
        if 'defender' in o or 'first contact' in o:
            return 'defender wins first contact / heads clear', 'il difensore vince il primo contatto / respinge di testa'
        return 'cleared', 'respinto'
    if o == 'shot' or raw == 'shot':
        return 'followed by a shot (on/off target not in the outcome field)', 'seguito da un tiro (dentro/fuori non indicato nell’esito)'
    return raw, raw


def clip_note(row: dict, mapped: str | None) -> tuple[str, str]:
    seq = int(row['seq'])
    time = (row.get('video_time') or '').strip() or '—'
    taker = taker_label(row)
    taker_it = 'Non identificato' if taker == 'Unidentified' else taker
    kind = row['type']
    side = row['side']
    delivery = row.get('delivery') or ''
    zone = row.get('target_zone') or ''
    foot = row.get('taker_foot') or ''
    pos = row.get('start_position') or ''
    yards, channel = parse_start(pos)
    out_en, out_it = outcome_phrase(seq, row, mapped)

    bits_en = []
    bits_it = []
    if kind == 'free kick' and yards:
        bits_en.append(yd_m(yards))
        bits_it.append('da circa %d m' % int(round(yards * 0.9144)))
        ch_en = {
            'wide-left': 'wide left', 'left': 'left channel',
            'wide-right': 'wide right', 'right': 'right channel',
        }.get(channel)
        ch_it = {
            'wide-left': 'fascia sinistra', 'left': 'canale sinistro',
            'wide-right': 'fascia destra', 'right': 'canale destro',
        }.get(channel)
        if ch_en:
            bits_en.append(ch_en)
            bits_it.append(ch_it)
    if foot == 'left' and delivery != 'direct shot':
        bits_en.append('left foot')
        bits_it.append('di sinistro')
    bits_en.append(delivery_en(delivery))
    bits_it.append(delivery_it(delivery))
    if delivery != 'short' and delivery != 'direct shot':
        bits_en.append('to ' + zone_en(zone))
        bits_it.append('verso ' + zone_it(zone))
    elif delivery == 'direct shot':
        bits_en.append('to ' + zone_en(zone))
        bits_it.append('verso ' + zone_it(zone))
    bits_en.append(out_en)
    bits_it.append(out_it)

    en = f"{time} — p{seq:02d} {taker} — " + ', '.join(bits_en)
    it = f"{time} — p{seq:02d} {taker_it} — " + ', '.join(bits_it)

    # Useful second-phase / context from the CSV notes (trimmed).
    notes = (row.get('notes') or '').strip()
    extra_en = []
    extra_it = []
    if seq in EXTRA:
        extra_en.append(EXTRA[seq]['en'])
        extra_it.append(EXTRA[seq]['it'])
    # Pull a short second-phase mention if present and not already covered.
    low = notes.lower()
    if 'rebound shot' in low and 'saved' in low and seq not in RECHECK_OUTCOME and 'defender header' not in (row.get('outcome') or '').lower():
        extra_en.append('Rebound shot from outside the box is saved.')
        extra_it.append('La ribattuta da fuori area viene parata.')
    if 'second man crosses' in low or ('played short' in low and 'blocked shot' in low):
        extra_en.append('The second man crosses; defender heads clear, then two blocked shots.')
        extra_it.append('Il secondo calcia in mezzo; un difensore respinge di testa, poi due tiri bloccati.')
    if 'second-phase cross' in low or 'second-phase cross from the left' in low:
        extra_en.append('A second-phase cross from the left is caught by the GK.')
        extra_it.append('Un cross di seconda palla da sinistra viene afferrato dal portiere.')
    if 'rebound volley blocked' in low:
        extra_en.append('Rebound volley blocked.')
        extra_it.append('La volée di ribattuta viene bloccata.')
    if 'shot wide of near post' in low:
        extra_en.append('Second ball is shot wide of the near post from the right side of the box.')
        extra_it.append('La seconda palla è tirata larga sul primo palo dal lato destro dell’area.')
    if 'scrambled in' in low:
        extra_en.append('Scrambled in by a Perugia attacker.')
        extra_it.append('Ribadita dentro da un attaccante del Perugia.')
    if 'flick-on' in low:
        extra_en.append('Near-post flick-on header at the front of the 6-yard box into the far corner, vs Frosinone (scoreboard then 4–0).')
        extra_it.append('Deviazione di testa sul primo palo, dal fronte dei 6 metri, nell’angolo lontano, vs Frosinone (poi 4–0 sul tabellone).')
    if 'low driven shot under the wall' in low:
        extra_en.append('Low driven shot under the wall into the near corner, vs Pescara (3–2).')
        extra_it.append('Tiro rasoterra sotto la barriera nell’angolo vicino, vs Pescara (3–2).')
    conf = (row.get('confidence') or '').lower()
    if conf in ('low', 'medium'):
        extra_en.append(f'StatMan confidence: {conf}.')
        extra_it.append(f'Fiducia StatMan: {"bassa" if conf == "low" else "media"}.')
    if extra_en:
        en += '. ' + ' '.join(extra_en)
        it += '. ' + ' '.join(extra_it)
    else:
        en += '.'
        it += '.'
    return en, it


def fan_group(items: list[dict], xy_key: str, axis: str = 'x', step: int = 16) -> None:
    """Spread items that share a landing/start so numbers do not stack."""
    groups: dict[tuple, list[dict]] = defaultdict(list)
    for it in items:
        x, y = it[xy_key]
        # bucket
        groups[(round(x / 8) * 8, round(y / 8) * 8)].append(it)
    for (_, _), grp in groups.items():
        if len(grp) < 2:
            continue
        n = len(grp)
        mid = (n - 1) / 2
        for i, it in enumerate(sorted(grp, key=lambda z: z['seq'])):
            x, y = it[xy_key]
            delta = int(round((i - mid) * step))
            if axis == 'x':
                it[xy_key] = (x + delta, y + (4 if i % 2 else -2))
            else:
                it[xy_key] = (x + (4 if i % 2 else -2), y + delta)


def load_rows(path: Path) -> list[dict]:
    with path.open(newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def build(rows: list[dict]) -> str:
    clips = []
    contradictions = []
    for row in rows:
        seq = int(row['seq'])
        if seq in EXCLUDE:
            continue
        kind = row['type'].strip()
        if kind not in ('corner', 'free kick'):
            continue
        side = (row['side'] or '').strip()
        if side not in ('left', 'right'):
            continue
        foot = (row.get('taker_foot') or '').strip()
        delivery = (row.get('delivery') or '').strip()
        exp = expected_side(foot, delivery)
        if exp and side and exp != side:
            contradictions.append(
                f"p{seq:02d}: tagged {side}, but {foot}-foot {delivery} should come from the {exp}"
            )
        mapped = map_outcome(row.get('outcome') or '')
        if seq in RECHECK_OUTCOME:
            mapped = RECHECK_OUTCOME[seq][0]
        notes_l = (row.get('notes') or '').lower()
        if mapped is None and (row.get('outcome') or '').strip().lower() == 'shot':
            if 'shot wide' in notes_l or 'wide of' in notes_l:
                mapped = 'offTarget'
        if 'onto the crossbar' in notes_l or 'onto the bar' in notes_l or 'hit the bar' in notes_l or 'hit the crossbar' in notes_l:
            mapped = 'woodwork'
        if kind == 'corner':
            x1, y1 = LEFT_CORNER if side == 'left' else RIGHT_CORNER
        else:
            x1, y1 = start_xy(side, row.get('start_position') or '', delivery)
        x2, y2 = land_xy(kind, side, row.get('target_zone') or '', delivery)
        if delivery == 'short':
            # short pass toward the box, not the full conventional short-to-box
            # default (keep it a short dashed pass).
            if side == 'right':
                x2, y2 = (x1 - 22, y1 - 24)
            else:
                x2, y2 = (x1 + 22, y1 - 24)
        n_at = 'start' if delivery in ('short', 'direct shot') else 'end'
        hw = header_won(row)
        note_en, note_it = clip_note(row, mapped)
        clips.append({
            'seq': seq,
            'kind': kind,
            'side': side,
            'foot': foot,
            'delivery': delivery,
            'zone': row.get('target_zone') or '',
            'outcome_raw': row.get('outcome') or '',
            'mapped': mapped,
            'taker': taker_label(row),
            'time': (row.get('video_time') or '').strip(),
            'start': (x1, y1),
            'end': (x2, y2),
            'n_at': n_at,
            'swing': swing_of(delivery),
            'header_won': hw,
            'note_en': note_en,
            'note_it': note_it,
            'row': row,
        })

    # Fan landings by (kind, side, zone)
    by_end: dict[tuple, list] = defaultdict(list)
    for c in clips:
        zone_key = 'short' if c['delivery'] == 'short' else (c['zone'] or 'misc')
        by_end[(c['kind'], c['side'], zone_key)].append(c)
    for grp in by_end.values():
        fan_group(grp, 'end', axis='x', step=14)

    # Fan FK starts that share a channel and similar distance
    by_start: dict[tuple, list] = defaultdict(list)
    for c in clips:
        if c['kind'] != 'free kick':
            continue
        x, y = c['start']
        by_start[(c['side'], int(y / 20) * 20, int(x / 30) * 30)].append(c)
    for grp in by_start.values():
        fan_group(grp, 'start', axis='y', step=10)

    def separate(items: list[dict], key: str, min_dist: int = 16) -> None:
        """Push endpoints apart so yellow numbers stay readable."""
        if len(items) < 2:
            return
        for _ in range(24):
            moved = False
            for i, a in enumerate(items):
                for b in items[i + 1:]:
                    x1, y1 = a[key]
                    x2, y2 = b[key]
                    dx, dy = x2 - x1, y2 - y1
                    d = math.hypot(dx, dy)
                    if d < 0.01:
                        a[key] = (x1 - min_dist / 2, y1)
                        b[key] = (x2 + min_dist / 2, y2)
                        moved = True
                        continue
                    if d < min_dist:
                        ux, uy = dx / d, dy / d
                        push = (min_dist - d) / 2
                        a[key] = (x1 - ux * push, y1 - uy * push)
                        b[key] = (x2 + ux * push, y2 + uy * push)
                        moved = True
            if not moved:
                break
        for it in items:
            x, y = it[key]
            it[key] = (int(round(max(12, min(308, x)))), int(round(max(6, min(176, y)))))

    separate(clips, 'end', 16)
    separate([c for c in clips if c['kind'] == 'free kick'], 'start', 14)

    def panel(kind: str, side: str) -> list[dict]:
        return sorted((c for c in clips if c['kind'] == kind and c['side'] == side), key=lambda c: c['seq'])

    corners_l, corners_r = panel('corner', 'left'), panel('corner', 'right')
    fk_l, fk_r = panel('free kick', 'left'), panel('free kick', 'right')

    def arrow_line(c: dict) -> str:
        x1, y1 = c['start']
        x2, y2 = c['end']
        parts = [
            f"x1: {x1}", f"y1: {y1}", f"x2: {x2}", f"y2: {y2}",
            f"n: {c['seq']}", f"nAt: '{c['n_at']}'",
        ]
        if c['swing']:
            parts.append(f"swing: '{c['swing']}'")
        if c['mapped']:
            parts.append(f"outcome: '{c['mapped']}'")
        if c['header_won']:
            parts.append(f"headerWon: '{c['header_won']}'")
        return '        { ' + ', '.join(parts) + ' },'

    def notes_block(items: list[dict]) -> str:
        if not items:
            return ''
        lines = ['      orderedNotesTitle: { en: \'In order (yellow numbers on the pitch):\', it: \'In ordine (numeri gialli sul campo):\' },',
                 '      orderedNotes: [']
        for c in items:
            lines.append('        ' + loc(c['note_en'], c['note_it']) + ',')
        lines.append('      ],')
        return '\n'.join(lines)

    def takers_of(items: list[dict]) -> list[tuple[str, str, int, int, int]]:
        # (player, foot, total, fromLeft, fromRight)
        bucket: dict[tuple[str, str], list[dict]] = defaultdict(list)
        for c in items:
            foot = c['foot'] or 'unknown'
            player = c['taker']
            if player == 'Unidentified':
                if foot == 'right':
                    player = 'Unidentified (right foot)'
                elif foot == 'left':
                    player = 'Unidentified (left foot)'
                else:
                    player = 'Unidentified'
            bucket[(player, foot)].append(c)
        out = []
        # identified shirts first, then unidentified
        def sort_key(k):
            p, f = k
            return (0 if p.startswith('#') else 1, p, f)
        for (player, foot) in sorted(bucket, key=sort_key):
            grp = bucket[(player, foot)]
            out.append((
                player, foot, len(grp),
                sum(1 for c in grp if c['side'] == 'left'),
                sum(1 for c in grp if c['side'] == 'right'),
            ))
        return out

    def taker_player_ts(name: str, foot: str) -> str:
        if name == 'Unidentified (right foot)':
            return 'UNID_RF'
        if name == 'Unidentified (left foot)':
            return 'UNID_LF'
        if name == 'Unidentified':
            return '{ en: \'Unidentified\', it: \'Non identificato\' }'
        return ts_str(name)

    def foot_ts(foot: str) -> str:
        if foot == 'left':
            return 'LEFT'
        if foot == 'right':
            return 'RIGHT'
        return '{ en: \'Unknown\', it: \'Sconosciuto\' }'

    def takers_block(items: list[dict]) -> str:
        rows_t = takers_of(items)
        if not rows_t:
            return '      takers: [],'
        lines = ['      takers: [']
        for player, foot, total, fl, fr in rows_t:
            lines.append(
                '        { player: %s, foot: %s, total: %d, fromLeft: %d, fromRight: %d },'
                % (taker_player_ts(player, foot), foot_ts(foot), total, fl, fr)
            )
        lines.append('      ],')
        return '\n'.join(lines)

    n_corners = len(corners_l) + len(corners_r)
    n_fks = len(fk_l) + len(fk_r)
    n_total = n_corners + n_fks

    goals = [c for c in clips if c['mapped'] == 'goal']
    shots = [c for c in clips if c['mapped'] in ('save', 'offTarget', 'woodwork') or (c['outcome_raw'] or '').strip().lower() == 'shot']
    # unique, in seq order
    shots = sorted({c['seq']: c for c in shots}.values(), key=lambda c: c['seq'])

    def goal_summary_en(c: dict) -> str:
        kind = 'corner' if c['kind'] == 'corner' else 'free kick'
        return f"p{c['seq']:02d} {c['side']} {kind} ({delivery_en(c['delivery'])}) — {c['taker']}"

    def goal_summary_it(c: dict) -> str:
        kind = 'angolo' if c['kind'] == 'corner' else 'punizione'
        lato = 'sinistra' if c['side'] == 'left' else 'destra'
        taker_it = 'Non identificato' if c['taker'] == 'Unidentified' else c['taker']
        return f"p{c['seq']:02d} {kind} da {lato} ({delivery_it(c['delivery'])}) — {taker_it}"

    # Key notes (computed from the CSV so a re-run stays in sync)
    excl_list = ', '.join(f'p{s:02d}' for s in sorted(EXCLUDE))
    goal_en = '; '.join(goal_summary_en(c) for c in goals) or 'none in this batch'
    goal_it = '; '.join(goal_summary_it(c) for c in goals) or 'nessuno in questo lotto'
    shot_bits_en = []
    shot_bits_it = []
    for c in shots:
        tag = c['mapped'] or 'shot'
        label = {'save': 'saved', 'offTarget': 'off target', 'shot': 'shot'}.get(tag, tag)
        label_it = {'save': 'parato', 'offTarget': 'fuori', 'shot': 'tiro'}.get(tag, tag)
        shot_bits_en.append(f"p{c['seq']:02d} ({label})")
        shot_bits_it.append(f"p{c['seq']:02d} ({label_it})")
    shot_en = ', '.join(shot_bits_en) or 'none listed'
    shot_it = ', '.join(shot_bits_it) or 'nessuno elencato'

    contradiction_en = (
        'No contradictions in this batch.' if not contradictions else
        'Flagged (drawn on the tagged side, swing kept as in the CSV, not moved to fit the rule): '
        + '; '.join(contradictions) + '.'
    )
    contradiction_it = (
        'Nessuna in questo lotto.' if not contradictions else
        'Segnalate (disegnate sul lato taggato, traiettoria come nel CSV, non spostate per adattarle alla regola): '
        + '; '.join(contradictions) + '.'
    )

    def foot_counts(items):
        rf = sum(1 for c in items if c['foot'] == 'right')
        lf = sum(1 for c in items if c['foot'] == 'left')
        unk = sum(1 for c in items if c['foot'] not in ('right', 'left'))
        return rf, lf, unk

    def foot_en(rf, lf, unk):
        bits = [f'{rf} right-foot', f'{lf} left-foot']
        if unk:
            bits.append(f'{unk} unknown foot')
        return ', '.join(bits)

    def foot_it(rf, lf, unk):
        bits = [f'{rf} di destro', f'{lf} di sinistro']
        if unk:
            bits.append(f'{unk} piede sconosciuto')
        return ', '.join(bits)

    cl_rf, cl_lf, cl_unk = foot_counts(corners_l)
    cr_rf, cr_lf, cr_unk = foot_counts(corners_r)

    def taker_note(items: list[dict], side: str) -> tuple[str, str]:
        if not items:
            return (
                f'No {side} deliveries in p00–p36 after exclusions.',
                f'Nessuna battuta da {"sinistra" if side=="left" else "destra"} in p00–p36 dopo le esclusioni.',
            )
        identified = [c for c in items if c['taker'] != 'Unidentified']
        bits_en, bits_it = [], []
        for c in identified:
            bits_en.append(f"{c['taker']} ({c['foot'] or 'foot unknown'}) p{c['seq']:02d}")
            foot_it = {'right': 'destro', 'left': 'sinistro'}.get(c['foot'], 'piede sconosciuto')
            bits_it.append(f"{c['taker']} ({foot_it}) p{c['seq']:02d}")
        n_unid = sum(1 for c in items if c['taker'] == 'Unidentified')
        if bits_en:
            en = '; '.join(bits_en) + (f'. The other {n_unid} unidentified.' if n_unid else '.')
            it = '; '.join(bits_it) + (f'. Gli altri {n_unid} non identificati.' if n_unid else '.')
        else:
            en = 'All unidentified in this batch.'
            it = 'Tutti non identificati in questo lotto.'
        return en, it

    cl_note_en, cl_note_it = taker_note(corners_l, 'left')
    cr_note_en, cr_note_it = taker_note(corners_r, 'right')
    fl_note_en, fl_note_it = taker_note(fk_l, 'left')
    fr_note_en, fr_note_it = taker_note(fk_r, 'right')

    lines = []
    a = lines.append
    a("import type { OppositionSetPieces } from './setPieces';")
    a('')
    a('/**')
    a(' * DRAFT — Perugia (Primavera 2) attacking set pieces.')
    a(' *')
    a(' * GENERATED from StatMan tags. Do not edit by hand — re-run')
    a(' *   python3 scripts/buildPerugiaSetPieces.py [path/to/statman_tags.csv]')
    a(' * after the CSV changes (StatMan may still revise free-kick sides')
    a(' * for p03–p23). Default CSV: /workspace/perugia_piazzati/statman_tags.csv')
    a(' *')
    a(' * Excluded: p00, p01, p02, p14 kick-offs; p09 defensive own-half free')
    a(' * kick; p26 throw-in; p29 Pescara (not Perugia) free kick (type other).')
    a(' *')
    a(' * Side rule: a right-footer’s inswinger comes from the LEFT and his')
    a(' * outswinger from the RIGHT; the reverse for a left-footer. Feet are')
    a(' * the kicking foot in the CSV, not invented from the squad sheet.')
    a(' * Short / driven / direct shots do not use that swing-side rule.')
    a(' *')
    a(' * Takers: a name or shirt is used only when the CSV `taker` field is')
    a(' * filled (readable on video). Official squad numbers are not mapped,')
    a(' * because they are not the 1–11 match shirts. Filename hints that')
    a(' * were not confirmed on the video stay in the notes.')
    a(' *')
    a(' * Arrow recipe (320×190, goal at the top; black arrows; short =')
    a(' * dashed teal; outcomes coloured when mapped):')
    a(' *   left corner (12, 8)    right corner (308, 8)')
    a(' *   n = clip sequence, nAt end unless a start number is clearer.')
    a(' *   Landings are conventional zone spots, auto-fanned when several')
    a(' *   share a zone. FK starts use the tagged distance')
    a(' *   (y ≈ 6 + yards×3.879, clipped to the final-third edge) and channel.')
    a(' */')
    a('')
    a("const LEFT = { en: 'Left', it: 'Sinistro' } as const;")
    a("const RIGHT = { en: 'Right', it: 'Destro' } as const;")
    a("const UNID_RF = { en: 'Unidentified (right foot)', it: 'Non identificato (destro)' } as const;")
    a("const UNID_LF = { en: 'Unidentified (left foot)', it: 'Non identificato (sinistro)' } as const;")
    a('')
    a('export const perugiaSetPiecesDraft: OppositionSetPieces = {')
    a('  source: ' + loc(
        'StatMan tags for clips p00–p36 (Perugia attacking set pieces).',
        'Tag StatMan per le clip p00–p36 (palle inattive offensive del Perugia).',
    ) + ',')
    a('  keyNotesTitle: ' + loc(
        f'Key notes — DRAFT: {n_total} Perugia attacking set pieces in p00–p36 ({n_corners} corners, {n_fks} free kicks)',
        f'Note chiave — BOZZA: {n_total} palle inattive offensive del Perugia in p00–p36 ({n_corners} calci d’angolo, {n_fks} punizioni)',
    ) + ',')
    a('  keyNotes: [')
    a('    ' + loc(
        f'Coverage: this draft is built from the StatMan CSV for p00–p36. Excluded: {excl_list}. Re-run scripts/buildPerugiaSetPieces.py when the CSV is updated.',
        f'Copertura: questa bozza è costruita dal CSV StatMan per p00–p36. Esclusi: {excl_list}. Rilanciare scripts/buildPerugiaSetPieces.py quando il CSV viene aggiornato.',
    ) + ',')
    a('    ' + loc(
        'Side rule: a right-footer’s inswinger is taken from the LEFT and his outswinger from the RIGHT; the reverse for a left-footer. Short, driven and direct shots are placed from the tagged side. '
        + contradiction_en,
        'Regola del lato: la rientrante di un destro si batte da SINISTRA e l’uscente da DESTRA; il contrario per un sinistro. Le battute corte, tese e i tiri diretti sono piazzati dal lato taggato. '
        + contradiction_it,
    ) + ',')
    a('    ' + loc(
        f'Corners: {len(corners_l)} from the LEFT ({foot_en(cl_rf, cl_lf, cl_unk)}), {len(corners_r)} from the RIGHT ({foot_en(cr_rf, cr_lf, cr_unk)}). '
        'p24 and p25 are the same 6-yard routine used twice vs Pescara (16:24 and 22:44), counted as two. '
        'p06 (right, foot blank) is drawn as unknown foot; inswing is kept only if the CSV still lists it; outcome is the defender header clearance in the outcome column. '
        'p13 still uses the rechecked note (defender heads clear) rather than the older “GK punch” value in the outcome column.',
        f'Angoli: {len(corners_l)} da SINISTRA ({foot_it(cl_rf, cl_lf, cl_unk)}), {len(corners_r)} da DESTRA ({foot_it(cr_rf, cr_lf, cr_unk)}). '
        'p24 e p25 sono la stessa routine sui 6 metri usata due volte vs Pescara (16:24 e 22:44), contate come due. '
        'p06 (destra, piede vuoto) è disegnato con piede sconosciuto; la rientrante si tiene solo se è ancora nel CSV; l’esito è la deviazione di testa del difensore nella colonna esito. '
        'p13 usa ancora la nota ricontrollata (il difensore respinge di testa) e non il vecchio “pugno del portiere” nella colonna esito.',
    ) + ',')
    a('    ' + loc(
        'Takers: a shirt is used only when the CSV records one (p20 #10, p23 #7). Official squad numbers are not mapped onto match shirts. Everyone else, including p36 (filename Iachini, not readable on video) and p15 (filename Dottori, not confirmed), is Unidentified. Feet are the kicking foot in the CSV.',
        'Battitori: la maglia si usa solo se il CSV la registra (p20 #10, p23 #7). I numeri ufficiali in rosa non vengono mappati sulle maglie di gara. Tutti gli altri, compresi p36 (nome del file Iachini, non leggibile in video) e p15 (nome del file Dottori, non confermato), sono Non identificato. Il piede è quello di battuta nel CSV.',
    ) + ',')
    a('    ' + loc(
        'Goals: ' + goal_en + '.',
        'Gol: ' + goal_it + '.',
    ) + ',')
    a('    ' + loc(
        'Shots that were not goals: ' + shot_en + '. Second-phase efforts described in the clip notes (blocked shots after p05, rebound after p06 / p35) are not given their own arrow.',
        'Tiri che non sono gol: ' + shot_it + '. Le conclusioni di seconda palla descritte nelle note di clip (tiri bloccati dopo p05, ribattuta dopo p06 / p35) non hanno una freccia propria.',
    ) + ',')
    a('  ],')

    def emit_section(kind: str, left: list, right: list) -> None:
        field = 'corners' if kind == 'corner' else 'freeKicks'
        a(f'  {field}: {{')
        for side, items, title_en, title_it in (
            ('left', left, 'Takers (left):', 'Battitori (sinistra):'),
            ('right', right, 'Takers (right):', 'Battitori (destra):'),
        ):
            note_en, note_it = taker_note(items, side)
            a(f'    {side}: {{')
            a('      arrows: [')
            if items:
                for c in items:
                    a(arrow_line(c))
            a('      ],')
            a('      noteTitle: ' + loc(title_en, title_it) + ',')
            a('      note: ' + loc(note_en, note_it) + ',')
            nb = notes_block(items)
            if nb:
                a(nb)
            a('    },')
        a(takers_block(left + right))
        a('  },')

    emit_section('corner', corners_l, corners_r)
    emit_section('free kick', fk_l, fk_r)
    a('};')
    a('')

    text = '\n'.join(lines)
    # report to stdout for the operator
    print(f'clips: {n_total}  corners L{len(corners_l)}/R{len(corners_r)}  FKs L{len(fk_l)}/R{len(fk_r)}')
    print('goals:', ', '.join(f"p{c['seq']:02d}" for c in goals) or '—')
    print('shots:', ', '.join(f"p{c['seq']:02d}" for c in shots) or '—')
    if contradictions:
        print('SIDE-RULE FLAGS:')
        for c in contradictions:
            print(' ', c)
    else:
        print('side-rule flags: none')
    return text


def main() -> int:
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_CSV
    if not csv_path.is_file():
        print(f'CSV not found: {csv_path}', file=sys.stderr)
        return 1
    rows = load_rows(csv_path)
    text = build(rows)
    OUT.write_text(text)
    print(f'wrote {OUT} ({len(text)} bytes) from {csv_path}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
