import { Link } from 'react-router-dom';
import {
  formatTqr,
  getPlayerTqrTimeline,
  getTqrDataset,
} from '../data/tqrLoad';
import { useLanguage } from '../i18n/LanguageContext';
import BorgScaleLegend from './BorgScaleLegend';

function pointHref(p: {
  trainingSlug: string | null;
  matchSlug: string | null;
}): string | null {
  if (p.trainingSlug) return `/training/${p.trainingSlug}`;
  if (p.matchSlug) return `/match/${p.matchSlug}`;
  return null;
}

/** Per-player TQR histogram across imported days (Excel values only). */
export default function PlayerTqrHistogram({
  playerSlug,
}: {
  playerSlug: string;
}) {
  const { t, L, formatDate } = useLanguage();
  const points = getPlayerTqrTimeline(playerSlug);
  const scaleNote = getTqrDataset().scaleNote;

  if (points.length === 0) {
    return (
      <div className="tqr-panel player-tqr">
        <div className="section-title">{t('playerTqrTitle')}</div>
        <p className="video-hint">{t('playerTqrEmpty')}</p>
      </div>
    );
  }

  const maxVal = Math.max(
    ...points.flatMap((p) => [p.tqr, p.teamAvgTqr ?? 0]),
    1
  );

  return (
    <div className="tqr-panel player-tqr">
      <div className="section-title">{t('playerTqrTitle')}</div>
      <p className="video-hint">{t('playerTqrHint')}</p>
      <BorgScaleLegend kind="tqr" />

      <div
        className="rpe-bars tqr-player-bars"
        role="img"
        aria-label={t('playerTqrChartAria')}
      >
        {points.map((p) => {
          const height = Math.max(4, Math.round((p.tqr / maxVal) * 100));
          const teamH =
            p.teamAvgTqr != null
              ? Math.max(4, Math.round((p.teamAvgTqr / maxVal) * 100))
              : 0;
          const href = pointHref(p);
          const label = formatDate(p.date).slice(0, 5);
          const inner = (
            <>
              <div className="rpe-bar-value">{formatTqr(p.tqr, 0)}</div>
              <div className="tqr-dual-track">
                <div className="rpe-bar-track tqr-track-player">
                  <div
                    className={`rpe-bar-fill tqr-bar-fill ${
                      p.kind === 'match' ? 'is-match-fill' : ''
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                {p.teamAvgTqr != null ? (
                  <div className="rpe-bar-track tqr-track-team">
                    <div
                      className="rpe-bar-fill tqr-team-fill"
                      style={{ height: `${teamH}%` }}
                    />
                  </div>
                ) : null}
              </div>
              <div
                className={`rpe-bar-label ${p.kind === 'match' ? 'is-match-label' : ''}`}
              >
                {label}
              </div>
            </>
          );
          return href ? (
            <Link
              key={p.date}
              to={href}
              className={`rpe-bar-col ${p.kind === 'match' ? 'is-match' : ''}`}
              title={`${formatDate(p.date)} — TQR ${formatTqr(p.tqr, 0)} · ${t('rpeTeamAvgSeries')}: ${formatTqr(p.teamAvgTqr)}`}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={p.date}
              className={`rpe-bar-col ${p.kind === 'match' ? 'is-match' : ''}`}
              title={`${formatDate(p.date)} — TQR ${formatTqr(p.tqr, 0)} · ${t('rpeTeamAvgSeries')}: ${formatTqr(p.teamAvgTqr)}`}
            >
              {inner}
            </div>
          );
        })}
      </div>
      <p className="rpe-chart-legend">{t('playerTqrLegend')}</p>
      <p className="rpe-footnote">{L(scaleNote)}</p>
    </div>
  );
}
