import { Link } from 'react-router-dom';
import {
  formatTqr,
  getAllTqrSessions,
  getTqrDataset,
  sortPlayersByTqr,
} from '../data/tqrLoad';
import { getPlayerBySlug } from '../data/players';
import type { TqrSession } from '../types/tqr';
import { useLanguage } from '../i18n/LanguageContext';

/** TQR histograms only — squad block + individual bars (Excel values as-is). */
export default function TqrHistograms({ session }: { session: TqrSession }) {
  const { t, L, formatDate } = useLanguage();
  const allSessions = getAllTqrSessions();
  const players = sortPlayersByTqr(session.players);
  const scaleNote = getTqrDataset().scaleNote;

  const maxSquad = Math.max(...allSessions.map((s) => s.avgTqr ?? 0), 1);
  const maxInd = Math.max(...players.map((p) => p.tqr), 1);

  return (
    <div className="tqr-panel">
      <div className="section-title">{t('tqrTitle')}</div>
      <p className="video-hint">{t('tqrHint')}</p>

      <div className="rpe-chart-block">
        <div className="rpe-chart-title">{t('tqrSquadHistogram')}</div>
        <div
          className="rpe-bars tqr-squad-bars"
          role="img"
          aria-label={t('tqrSquadHistogram')}
        >
          {allSessions.map((s) => {
            const value = s.avgTqr ?? 0;
            const height = Math.max(4, Math.round((value / maxSquad) * 100));
            const active = s.date === session.date;
            const label = formatDate(s.date).slice(0, 5);
            return (
              <div
                key={s.date}
                className={`rpe-bar-col ${active ? 'active' : ''} ${
                  s.kind === 'match' ? 'is-match' : ''
                }`}
                title={`${formatDate(s.date)} — TQR ${formatTqr(s.avgTqr)}`}
              >
                <div className="rpe-bar-value">{formatTqr(s.avgTqr, 1)}</div>
                <div className="rpe-bar-track">
                  <div
                    className="rpe-bar-fill tqr-bar-fill"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="rpe-bar-label">{label}</div>
              </div>
            );
          })}
        </div>
        <p className="rpe-chart-legend">{t('tqrSquadLegend')}</p>
      </div>

      <div className="rpe-chart-block">
        <div className="rpe-chart-title">{t('tqrIndividualHistogram')}</div>
        {players.length === 0 ? (
          <p className="video-hint">{t('tqrIndividualEmpty')}</p>
        ) : (
          <div
            className="tqr-ind-bars"
            role="img"
            aria-label={t('tqrIndividualHistogram')}
          >
            {players.map((p) => {
              const player = getPlayerBySlug(p.playerSlug);
              const name = player?.displayName ?? p.excelName;
              const width = Math.max(4, Math.round((p.tqr / maxInd) * 100));
              return (
                <Link
                  key={p.playerSlug}
                  to={`/players/${p.playerSlug}`}
                  className="tqr-ind-row"
                  title={`${name} — TQR ${formatTqr(p.tqr, 0)}`}
                >
                  <div className="tqr-ind-name notranslate" translate="no">
                    {name}
                  </div>
                  <div className="tqr-ind-track">
                    <div
                      className="tqr-ind-fill"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <div className="tqr-ind-value">{formatTqr(p.tqr, 0)}</div>
                </Link>
              );
            })}
          </div>
        )}
        <p className="rpe-chart-legend">{t('tqrIndividualLegend')}</p>
      </div>

      <p className="rpe-footnote">{L(scaleNote)}</p>
    </div>
  );
}
