import type {
  OppositionSquadDepth,
  OppositionSquadPlayer,
} from '../types/opposition';
import {
  localizePosition,
  localizePreferredFoot,
} from '../i18n/positions';
import type { Locale } from '../i18n/translations';
import { withGoalkeeperInSystem } from './formationSystem';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface OppositionSquadPdfLabels {
  title: string;
  depthTitle: string;
  depthPitchTitle: string;
  depthNote?: string;
  colNumber: string;
  colPlayer: string;
  colRole: string;
  colHeight: string;
  colFoot: string;
  heightUnit: string;
  generatedLabel: string;
}

function playerDotColor(teamId: string): { fill: string; border: string; text: string } {
  if (teamId === 'villarreal') {
    return { fill: '#f6c400', border: '#1a1a1a', text: '#1a1a1a' };
  }
  return { fill: '#1e3a8a', border: '#0f172a', text: '#ffffff' };
}

function renderDepthSection(
  depth: OppositionSquadDepth,
  teamId: string,
  labels: OppositionSquadPdfLabels
): string {
  const colors = playerDotColor(teamId);
  const slots = depth.slots
    .map((slot) => {
      const isGk = slot.role === 'GK';
      const names = slot.players
        .map(
          (p, index) =>
            `<div class="depth-name ${index === 0 ? 'primary' : ''}">
              <span class="depth-label">${esc(p.name)}</span>
              <span class="depth-starts">${p.starts}</span>
            </div>`
        )
        .join('');
      return `<div class="depth-slot ${isGk ? 'is-gk' : ''}" style="top:${esc(slot.top)};left:${esc(slot.left)}">
        <div class="depth-dot" title="${esc(slot.role)}"></div>
        <div class="depth-stack">${names}</div>
      </div>`;
    })
    .join('\n');

  const note = labels.depthNote
    ? `<p class="depth-note">${esc(labels.depthNote)}</p>`
    : '';

  return `
  <section class="depth-section">
    <h2>${esc(labels.depthTitle)}</h2>
    ${note}
    <div class="pitch-card">
      <div class="pitch-header">${esc(labels.depthPitchTitle)} (${esc(withGoalkeeperInSystem(depth.system))})</div>
      <div class="pitch">
        <div class="pitch-center-line"></div>
        <div class="pitch-center-circle"></div>
        <div class="pitch-box top"></div>
        <div class="pitch-box bottom"></div>
        ${slots}
      </div>
    </div>
  </section>
  <style>
    .depth-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${colors.fill};
      border: 1.5px solid ${colors.border};
      color: ${colors.text};
      flex-shrink: 0;
    }
  </style>`;
}

/** Opens a print-ready squad sheet (browser “Save as PDF”). */
export function openOppositionSquadPdf(
  teamName: string,
  players: OppositionSquadPlayer[],
  labels: OppositionSquadPdfLabels,
  options?: {
    depth?: OppositionSquadDepth;
    teamId?: string;
    locale?: Locale;
  }
): void {
  const locale = options?.locale ?? 'en';
  const rows = players
    .map((p) => {
      const height =
        p.heightCm != null ? `${p.heightCm} ${labels.heightUnit}` : '—';
      return `<tr>
        <td class="num">${p.number != null ? esc(String(p.number)) : '—'}</td>
        <td class="name">${esc(p.name)}</td>
        <td>${esc(localizePosition(p.position, locale))}</td>
        <td class="meta">${esc(height)}</td>
        <td class="meta">${esc(localizePreferredFoot(p.preferredFoot, locale))}</td>
      </tr>`;
    })
    .join('\n');

  const dateLine = new Date().toLocaleDateString(
    locale === 'it' ? 'it-IT' : 'en-GB',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  const depthHtml =
    options?.depth && options.teamId
      ? renderDepthSection(options.depth, options.teamId, labels)
      : '';

  const html = `<!DOCTYPE html>
<html lang="${locale === 'it' ? 'it' : 'en'}">
<head>
  <meta charset="utf-8" />
  <title>${esc(teamName)} — ${esc(labels.title)}</title>
  <style>
    @page { margin: 12mm 12mm; size: A4; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      color: #0f172a;
      font-size: 11pt;
    }
    header { margin-bottom: 14px; }
    .eyebrow {
      font-size: 9pt;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #64748b;
      margin: 0 0 4px;
    }
    h1 {
      margin: 0;
      font-size: 18pt;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    h2 {
      margin: 0 0 6px;
      font-size: 13pt;
      font-weight: 700;
    }
    .meta-line {
      margin: 8px 0 0;
      font-size: 9pt;
      color: #64748b;
    }
    .page-1 { margin-bottom: 0; }
    .depth-section { margin-bottom: 0; }
    .depth-note {
      margin: 0 0 10px;
      font-size: 9pt;
      color: #475569;
      line-height: 1.35;
    }
    .pitch-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
    }
    .pitch-header {
      padding: 8px 12px;
      font-size: 10pt;
      font-weight: 700;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .pitch {
      position: relative;
      height: 520px;
      background: linear-gradient(180deg, #1f7a3a 0%, #176530 100%);
      overflow: hidden;
    }
    .pitch-center-line {
      position: absolute;
      left: 0; right: 0; top: 50%;
      height: 1px;
      background: rgba(255,255,255,0.45);
    }
    .pitch-center-circle {
      position: absolute;
      left: 50%; top: 50%;
      width: 72px; height: 72px;
      margin: -36px 0 0 -36px;
      border: 1px solid rgba(255,255,255,0.45);
      border-radius: 50%;
    }
    .pitch-box {
      position: absolute;
      left: 50%;
      width: 42%;
      height: 16%;
      margin-left: -21%;
      border: 1px solid rgba(255,255,255,0.4);
    }
    .pitch-box.top { top: 0; border-top: none; }
    .pitch-box.bottom { bottom: 0; border-bottom: none; }
    .depth-slot {
      position: absolute;
      transform: translate(-50%, -8px);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: max-content;
      max-width: 132px;
      z-index: 2;
    }
    .depth-slot.is-gk {
      z-index: 3;
      width: 14px;
      max-width: 14px;
    }
    .depth-slot.is-gk .depth-stack {
      position: absolute;
      right: calc(100% + 6px);
      top: 50%;
      transform: translateY(-50%);
      margin-top: 0;
      align-items: flex-end;
      text-align: right;
      width: max-content;
      max-width: 150px;
    }
    .depth-stack {
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-align: center;
      padding: 3px 5px 4px;
      border-radius: 3px;
      background: rgba(255,255,255,0.94);
      border: 1px solid rgba(0,0,0,0.08);
      font-size: 7pt;
      line-height: 1.2;
    }
    .depth-name {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 3px;
      color: #475569;
      width: 100%;
    }
    .depth-name.primary {
      font-weight: 700;
      color: #0f172a;
      font-size: 7.5pt;
    }
    .depth-label {
      max-width: 124px;
      white-space: normal;
      overflow-wrap: break-word;
      hyphens: manual;
    }
    .depth-starts {
      font-size: 7pt;
      font-weight: 700;
      color: #64748b;
    }
    .squad-section.page-break {
      page-break-before: always;
      break-before: page;
    }
    .squad-section header { margin-bottom: 12px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
    }
    th, td {
      padding: 6px 7px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }
    th {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #475569;
      border-bottom: 1.5px solid #94a3b8;
    }
    .num {
      width: 36px;
      font-variant-numeric: tabular-nums;
      font-weight: 700;
    }
    .name { font-weight: 600; }
    .meta {
      white-space: nowrap;
      color: #334155;
      font-variant-numeric: tabular-nums;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-1, .depth-section { break-inside: avoid; page-break-inside: avoid; }
      .squad-section.page-break {
        page-break-before: always;
        break-before: page;
      }
    }
  </style>
</head>
<body>
  ${
    depthHtml
      ? `<div class="page-1">
  <header>
    <p class="eyebrow">Enjoy Football</p>
    <h1>${esc(teamName)}</h1>
    <p class="meta-line">${esc(labels.generatedLabel)} ${esc(dateLine)}</p>
  </header>
  ${depthHtml}
</div>
  <section class="squad-section page-break">
    <header>
      <p class="eyebrow">Enjoy Football</p>
      <h1>${esc(teamName)} — ${esc(labels.title)}</h1>
      <p class="meta-line">${esc(labels.generatedLabel)} ${esc(dateLine)}</p>
    </header>
    <table>`
      : `<header>
    <p class="eyebrow">Enjoy Football</p>
    <h1>${esc(teamName)} — ${esc(labels.title)}</h1>
    <p class="meta-line">${esc(labels.generatedLabel)} ${esc(dateLine)}</p>
  </header>
  <section class="squad-section">
    <table>`
  }
      <thead>
        <tr>
          <th>${esc(labels.colNumber)}</th>
          <th>${esc(labels.colPlayer)}</th>
          <th>${esc(labels.colRole)}</th>
          <th>${esc(labels.colHeight)}</th>
          <th>${esc(labels.colFoot)}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </section>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 80);
    });
  </script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
