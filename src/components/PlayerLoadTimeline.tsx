import { useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  formatRpe,
  formatSessionLoad,
  getPlayerRpeTimeline,
  getRpeDataset,
  type PlayerRpePoint,
} from '../data/rpeLoad';
import { useLanguage } from '../i18n/LanguageContext';

type Metric = 'load' | 'rpe';

const CHART = {
  width: 640,
  height: 260,
  padTop: 18,
  padRight: 16,
  padBottom: 40,
  padLeft: 48,
};

function metricValue(point: PlayerRpePoint, metric: Metric): number | null {
  if (metric === 'load') return point.sessionLoad;
  return point.rpe;
}

function teamValue(point: PlayerRpePoint, metric: Metric): number | null {
  if (metric === 'load') return point.teamAvgSessionLoad;
  return point.teamAvgRpe;
}

function formatMetric(value: number | null | undefined, metric: Metric): string {
  return metric === 'load' ? formatSessionLoad(value) : formatRpe(value);
}

function niceMax(raw: number): number {
  if (raw <= 0) return 1;
  const padded = raw * 1.08;
  const magnitude = 10 ** Math.floor(Math.log10(padded));
  const normalized = padded / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function buildPolyline(
  xs: number[],
  ys: Array<number | null>,
  yScale: (v: number) => number
): string {
  const parts: string[] = [];
  let drawing = false;
  for (let i = 0; i < xs.length; i++) {
    const y = ys[i];
    if (y == null) {
      drawing = false;
      continue;
    }
    const cmd = drawing ? 'L' : 'M';
    parts.push(`${cmd}${xs[i].toFixed(1)},${yScale(y).toFixed(1)}`);
    drawing = true;
  }
  return parts.join(' ');
}

function pointHref(p: PlayerRpePoint): string | null {
  if (p.trainingSlug) return `/training/${p.trainingSlug}`;
  if (p.matchSlug) return `/match/${p.matchSlug}`;
  return null;
}

export default function PlayerLoadTimeline({
  playerSlug,
}: {
  playerSlug: string;
}) {
  const { t, L, formatDate } = useLanguage();
  const navigate = useNavigate();
  const points = getPlayerRpeTimeline(playerSlug);
  const scaleNote = getRpeDataset().scaleNote;
  const [metric, setMetric] = useState<Metric>('load');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const gradId = useId().replace(/:/g, '');

  if (points.length === 0) {
    return (
      <div className="rpe-panel player-rpe">
        <div className="section-title">{t('playerPhysicalLoad')}</div>
        <p className="video-hint">{t('playerPhysicalLoadEmpty')}</p>
      </div>
    );
  }

  const playerVals = points.map((p) => metricValue(p, metric));
  const teamVals = points.map((p) => teamValue(p, metric));
  const allNums = [...playerVals, ...teamVals].filter(
    (v): v is number => v != null && !Number.isNaN(v)
  );
  const yMax = niceMax(Math.max(...allNums, 1));
  const yMin = 0;

  const plotW = CHART.width - CHART.padLeft - CHART.padRight;
  const plotH = CHART.height - CHART.padTop - CHART.padBottom;
  const n = points.length;
  const xs = points.map((_, i) =>
    n === 1
      ? CHART.padLeft + plotW / 2
      : CHART.padLeft + (i / (n - 1)) * plotW
  );
  const yScale = (v: number) =>
    CHART.padTop + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const playerPath = buildPolyline(xs, playerVals, yScale);
  const teamPath = buildPolyline(xs, teamVals, yScale);
  const canFill =
    n > 1 && playerVals.every((v) => v != null) && playerPath.length > 0;

  const gridTicks = 4;
  const ticks = Array.from({ length: gridTicks + 1 }, (_, i) => {
    const v = yMin + ((yMax - yMin) * i) / gridTicks;
    return { v, y: yScale(v) };
  });

  const active = hoverIndex != null ? points[hoverIndex] : null;
  const activePlayer = hoverIndex != null ? playerVals[hoverIndex] : null;
  const activeTeam = hoverIndex != null ? teamVals[hoverIndex] : null;
  const tipX =
    hoverIndex != null
      ? Math.min(
          Math.max(xs[hoverIndex], CHART.padLeft + 70),
          CHART.width - CHART.padRight - 70
        )
      : 0;
  const tipY =
    activePlayer != null ? Math.max(yScale(activePlayer) - 52, 4) : 4;

  return (
    <div className="rpe-panel player-rpe">
      <div className="section-title">{t('playerPhysicalLoad')}</div>
      <p className="video-hint">{t('playerPhysicalLoadHint')}</p>

      <div className="rpe-line-toolbar">
        <div
          className="rpe-metric-toggle"
          role="group"
          aria-label={t('rpeMetricToggle')}
        >
          <button
            type="button"
            className={metric === 'load' ? 'active' : ''}
            onClick={() => setMetric('load')}
          >
            {t('rpeMetricLoad')}
          </button>
          <button
            type="button"
            className={metric === 'rpe' ? 'active' : ''}
            onClick={() => setMetric('rpe')}
          >
            {t('rpeMetricRpe')}
          </button>
        </div>
        <div className="rpe-line-legend" aria-hidden="true">
          <span className="rpe-leg-item player">
            <span className="rpe-leg-swatch" />
            {t('rpePlayerSeries')}
          </span>
          <span className="rpe-leg-item team">
            <span className="rpe-leg-swatch" />
            {t('rpeTeamAvgSeries')}
          </span>
        </div>
      </div>

      <div
        className="rpe-line-chart-wrap"
        role="img"
        aria-label={t('playerPhysicalLoadChartAria')}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg
          className="rpe-line-chart"
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id={`rpe-fill-${gradId}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#007fff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#007fff" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => (
            <g key={`tick-${tick.v}`}>
              <line
                className="rpe-line-grid"
                x1={CHART.padLeft}
                x2={CHART.width - CHART.padRight}
                y1={tick.y}
                y2={tick.y}
              />
              <text
                className="rpe-line-axis-y"
                x={CHART.padLeft - 8}
                y={tick.y + 3}
                textAnchor="end"
              >
                {metric === 'load'
                  ? Math.round(tick.v).toLocaleString('it-IT')
                  : formatRpe(tick.v, tick.v % 1 === 0 ? 0 : 1)}
              </text>
            </g>
          ))}

          {canFill ? (
            <path
              d={`${playerPath} L${xs[n - 1].toFixed(1)},${(CHART.padTop + plotH).toFixed(1)} L${xs[0].toFixed(1)},${(CHART.padTop + plotH).toFixed(1)} Z`}
              fill={`url(#rpe-fill-${gradId})`}
              stroke="none"
            />
          ) : null}

          {teamPath ? (
            <path
              className="rpe-line-team"
              d={teamPath}
              fill="none"
              strokeDasharray="5 4"
            />
          ) : null}

          {playerPath ? (
            <path className="rpe-line-player" d={playerPath} fill="none" />
          ) : null}

          {points.map((p, i) => {
            const pv = playerVals[i];
            const tv = teamVals[i];
            const href = pointHref(p);
            const hitW = plotW / Math.max(n, 1);
            return (
              <g key={p.date}>
                {tv != null ? (
                  <circle
                    className="rpe-dot-team"
                    cx={xs[i]}
                    cy={yScale(tv)}
                    r={3.2}
                  />
                ) : null}
                {pv != null ? (
                  <circle
                    className={`rpe-dot-player ${p.kind === 'match' ? 'is-match' : ''} ${hoverIndex === i ? 'is-active' : ''}`}
                    cx={xs[i]}
                    cy={yScale(pv)}
                    r={hoverIndex === i ? 5.5 : 4.2}
                  />
                ) : null}
                <text
                  className={`rpe-line-axis-x ${p.kind === 'match' ? 'is-match' : ''}`}
                  x={xs[i]}
                  y={CHART.height - 14}
                  textAnchor="middle"
                >
                  {formatDate(p.date).slice(0, 5)}
                </text>
                {p.kind === 'match' ? (
                  <text
                    className="rpe-line-match-tag"
                    x={xs[i]}
                    y={CHART.height - 2}
                    textAnchor="middle"
                  >
                    {t('rpeMatchDay')}
                  </text>
                ) : null}
                <rect
                  className={`rpe-line-hit ${href ? 'is-link' : ''}`}
                  x={xs[i] - hitW / 2}
                  y={CHART.padTop}
                  width={hitW}
                  height={plotH}
                  onMouseEnter={() => setHoverIndex(i)}
                  onClick={() => {
                    if (href) navigate(href);
                  }}
                >
                  <title>
                    {`${formatDate(p.date)} — ${t('rpePlayerSeries')}: ${formatMetric(pv, metric)} · ${t('rpeTeamAvgSeries')}: ${formatMetric(tv, metric)}`}
                  </title>
                </rect>
              </g>
            );
          })}

          {hoverIndex != null && active && activePlayer != null ? (
            <g className="rpe-line-tooltip" pointerEvents="none">
              <line
                className="rpe-line-guide"
                x1={xs[hoverIndex]}
                x2={xs[hoverIndex]}
                y1={CHART.padTop}
                y2={CHART.padTop + plotH}
              />
              <rect
                className="rpe-tooltip-bg"
                x={tipX - 70}
                y={tipY}
                width={140}
                height={44}
                rx={4}
              />
              <text
                className="rpe-tooltip-text"
                x={tipX}
                y={tipY + 17}
                textAnchor="middle"
              >
                {formatDate(active.date).slice(0, 5)} ·{' '}
                {formatMetric(activePlayer, metric)}
              </text>
              <text
                className="rpe-tooltip-sub"
                x={tipX}
                y={tipY + 33}
                textAnchor="middle"
              >
                {t('rpeTeamAvgSeries')}: {formatMetric(activeTeam, metric)}
              </text>
            </g>
          ) : null}
        </svg>
      </div>

      <p className="rpe-chart-legend">{t('playerPhysicalLoadLegend')}</p>

      <div className="rpe-player-table compact">
        <div className="rpe-player-row head">
          <div>{t('rpeDate')}</div>
          <div>{t('rpeLabel')}</div>
          <div>{t('rpeTeamAvg')}</div>
          <div>{t('rpeSessionLoad')}</div>
        </div>
        {[...points].reverse().map((p) => {
          const href = pointHref(p);
          const row = (
            <>
              <div>
                {formatDate(p.date)}
                {p.kind === 'match' ? (
                  <span className="rpe-inline-tag"> {t('rpeMatchDay')}</span>
                ) : null}
              </div>
              <div className="rpe-player-num">{formatRpe(p.rpe, 0)}</div>
              <div className="rpe-player-num">{formatRpe(p.teamAvgRpe)}</div>
              <div className="rpe-player-num">
                {formatSessionLoad(p.sessionLoad)}
              </div>
            </>
          );
          return href ? (
            <Link key={p.date} to={href} className="rpe-player-row">
              {row}
            </Link>
          ) : (
            <div key={p.date} className="rpe-player-row">
              {row}
            </div>
          );
        })}
      </div>

      <p className="rpe-footnote">{L(scaleNote)}</p>
    </div>
  );
}
