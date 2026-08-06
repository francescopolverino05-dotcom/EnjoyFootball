import { Link } from 'react-router-dom';
import {
  formatRpe,
  formatSessionLoad,
  getPlayerRpeTimeline,
  getRpeDataset,
} from '../data/rpeLoad';
import { useLanguage } from '../i18n/LanguageContext';

export default function PlayerLoadTimeline({
  playerSlug,
}: {
  playerSlug: string;
}) {
  const { t, L, formatDate } = useLanguage();
  const points = getPlayerRpeTimeline(playerSlug);
  const scaleNote = getRpeDataset().scaleNote;

  if (points.length === 0) {
    return (
      <div className="rpe-panel player-rpe">
        <div className="section-title">{t('playerPhysicalLoad')}</div>
        <p className="video-hint">{t('playerPhysicalLoadEmpty')}</p>
      </div>
    );
  }

  const maxLoad = Math.max(...points.map((p) => p.sessionLoad ?? 0), 1);

  return (
    <div className="rpe-panel player-rpe">
      <div className="section-title">{t('playerPhysicalLoad')}</div>
      <p className="video-hint">{t('playerPhysicalLoadHint')}</p>

      <div className="rpe-timeline-chart" aria-hidden={false}>
        {points.map((p) => {
          const loadH = Math.max(
            6,
            Math.round(((p.sessionLoad ?? 0) / maxLoad) * 100)
          );
          const teamH =
            p.teamAvgSessionLoad != null
              ? Math.max(
                  2,
                  Math.round((p.teamAvgSessionLoad / maxLoad) * 100)
                )
              : null;
          const href = p.trainingSlug
            ? `/training/${p.trainingSlug}`
            : p.matchSlug
              ? `/match/${p.matchSlug}`
              : null;
          const inner = (
            <>
              <div className="rpe-tl-values">
                <span className="rpe-tl-rpe">
                  {t('rpeLabel')} {formatRpe(p.rpe, 0)}
                </span>
                <span className="rpe-tl-load">
                  {formatSessionLoad(p.sessionLoad)}
                </span>
              </div>
              <div className="rpe-tl-track">
                {teamH != null ? (
                  <div
                    className="rpe-tl-team-mark"
                    style={{ bottom: `${teamH}%` }}
                    title={`${t('rpeTeamAvg')}: ${formatSessionLoad(p.teamAvgSessionLoad)}`}
                  />
                ) : null}
                <div
                  className={`rpe-tl-fill ${p.kind === 'match' ? 'is-match' : ''}`}
                  style={{ height: `${loadH}%` }}
                />
              </div>
              <div className="rpe-tl-date">{formatDate(p.date).slice(0, 5)}</div>
              {p.kind === 'match' ? (
                <div className="rpe-tl-kind">{t('rpeMatchDay')}</div>
              ) : (
                <div className="rpe-tl-kind">&nbsp;</div>
              )}
            </>
          );
          return href ? (
            <Link
              key={p.date}
              to={href}
              className="rpe-tl-col"
              title={`${formatDate(p.date)} — RPE ${formatRpe(p.rpe, 0)} (team ${formatRpe(p.teamAvgRpe)}) · TL ${formatSessionLoad(p.sessionLoad)} (team ${formatSessionLoad(p.teamAvgSessionLoad)})`}
            >
              {inner}
            </Link>
          ) : (
            <div key={p.date} className="rpe-tl-col">
              {inner}
            </div>
          );
        })}
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
          const href = p.trainingSlug
            ? `/training/${p.trainingSlug}`
            : p.matchSlug
              ? `/match/${p.matchSlug}`
              : null;
          const row = (
            <>
              <div>
                {formatDate(p.date)}
                {p.kind === 'match' ? (
                  <span className="rpe-inline-tag"> {t('rpeMatchDay')}</span>
                ) : null}
              </div>
              <div className="rpe-player-num">{formatRpe(p.rpe, 0)}</div>
              <div className="rpe-player-num">
                {formatRpe(p.teamAvgRpe)}
              </div>
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
