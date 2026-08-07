import { Link } from 'react-router-dom';
import {
  formatVam,
  getGaconDataset,
  getPlayerGaconTimeline,
} from '../data/gaconLoad';
import { useLanguage } from '../i18n/LanguageContext';

function pointHref(p: {
  trainingSlug: string | null;
  matchSlug: string | null;
}): string | null {
  if (p.trainingSlug) return `/training/${p.trainingSlug}`;
  if (p.matchSlug) return `/match/${p.matchSlug}`;
  return null;
}

/** Per-player Gacon VAM histogram across imported days (Excel values only). */
export default function PlayerGaconHistogram({
  playerSlug,
}: {
  playerSlug: string;
}) {
  const { t, L, formatDate } = useLanguage();
  const points = getPlayerGaconTimeline(playerSlug);
  const scaleNote = getGaconDataset().scaleNote;

  if (points.length === 0) {
    return null;
  }

  const maxVal = Math.max(
    ...points.flatMap((p) => [p.vamKmh, p.teamAvgVamKmh ?? 0]),
    1
  );

  return (
    <div className="tqr-panel player-tqr player-gacon">
      <div className="section-title">{t('playerGaconTitle')}</div>
      <p className="video-hint">{t('playerGaconHint')}</p>

      <div
        className="rpe-bars tqr-player-bars"
        role="img"
        aria-label={t('playerGaconChartAria')}
      >
        {points.map((p) => {
          const height = Math.max(4, Math.round((p.vamKmh / maxVal) * 100));
          const teamH =
            p.teamAvgVamKmh != null
              ? Math.max(4, Math.round((p.teamAvgVamKmh / maxVal) * 100))
              : 0;
          const href = pointHref(p);
          const label = formatDate(p.date).slice(0, 5);
          const inner = (
            <>
              <div className="rpe-bar-value">{formatVam(p.vamKmh, 0)}</div>
              <div className="tqr-dual-track">
                <div className="rpe-bar-track tqr-track-player">
                  <div
                    className={`rpe-bar-fill gacon-bar-fill ${
                      p.kind === 'match' ? 'is-match-fill' : ''
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                {p.teamAvgVamKmh != null ? (
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
              title={`${formatDate(p.date)} — VAM ${formatVam(p.vamKmh, 0)} ${t('gaconUnitKmh')} · ${t('rpeTeamAvgSeries')}: ${formatVam(p.teamAvgVamKmh)}`}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={p.date}
              className={`rpe-bar-col ${p.kind === 'match' ? 'is-match' : ''}`}
              title={`${formatDate(p.date)} — VAM ${formatVam(p.vamKmh, 0)} ${t('gaconUnitKmh')} · ${t('rpeTeamAvgSeries')}: ${formatVam(p.teamAvgVamKmh)}`}
            >
              {inner}
            </div>
          );
        })}
      </div>
      <p className="rpe-chart-legend">{t('playerGaconLegend')}</p>
      <p className="rpe-footnote">{L(scaleNote)}</p>
    </div>
  );
}
