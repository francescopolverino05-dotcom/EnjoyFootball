import { Link } from 'react-router-dom';
import {
  formatRpe,
  formatSessionLoad,
  getAllRpeSessions,
  getRpeDataset,
  sortPlayersBySessionLoad,
} from '../data/rpeLoad';
import { getPlayerBySlug } from '../data/players';
import type { GaconSession } from '../types/gacon';
import type { RpeSession } from '../types/rpe';
import type { TqrSession } from '../types/tqr';
import { useLanguage } from '../i18n/LanguageContext';
import BorgScaleLegend from './BorgScaleLegend';
import GaconHistograms from './GaconHistograms';
import TqrHistograms from './TqrHistograms';

export default function PhysicalLoadPanel({
  session,
  tqrSession,
  gaconSession,
}: {
  session: RpeSession | null;
  tqrSession: TqrSession | null;
  gaconSession: GaconSession | null;
}) {
  const { t, L, formatDate } = useLanguage();
  const allSessions = getAllRpeSessions();
  const players = session ? sortPlayersBySessionLoad(session.players) : [];
  const maxLoad = Math.max(
    ...allSessions.map((s) => s.avgSessionLoad ?? 0),
    1
  );
  const scaleNote = getRpeDataset().scaleNote;

  return (
    <div className="rpe-panel">
      {session ? (
        <>
          <div className="section-title">{t('physicalLoad')}</div>
          <p className="video-hint">{t('physicalLoadHint')}</p>
          <BorgScaleLegend kind="rpe" />

          <div className="rpe-kpis">
            <div className="rpe-kpi">
              <div className="rpe-kpi-label">{t('rpeAvgRpe')}</div>
              <div className="rpe-kpi-value">{formatRpe(session.avgRpe)}</div>
            </div>
            <div className="rpe-kpi">
              <div className="rpe-kpi-label">{t('rpeAvgSessionLoad')}</div>
              <div className="rpe-kpi-value">
                {formatSessionLoad(session.avgSessionLoad)}
              </div>
            </div>
            <div className="rpe-kpi">
              <div className="rpe-kpi-label">{t('rpeDuration')}</div>
              <div className="rpe-kpi-value">
                {session.avgMin != null
                  ? `${Math.round(session.avgMin)} ${t('rpeMinShort')}`
                  : '—'}
              </div>
            </div>
            <div className="rpe-kpi">
              <div className="rpe-kpi-label">{t('rpePlayersAnswered')}</div>
              <div className="rpe-kpi-value">
                {session.playersAnswered}
                {session.playersPresent ? ` / ${session.playersPresent}` : ''}
              </div>
            </div>
          </div>

          <div className="rpe-chart-block">
            <div className="rpe-chart-title">{t('rpeBlockComparison')}</div>
            <div
              className="rpe-bars"
              role="img"
              aria-label={t('rpeBlockComparison')}
            >
              {allSessions.map((s) => {
                const load = s.avgSessionLoad ?? 0;
                const height = Math.max(4, Math.round((load / maxLoad) * 100));
                const active = s.date === session.date;
                const label = formatDate(s.date).slice(0, 5);
                return (
                  <div
                    key={s.date}
                    className={`rpe-bar-col ${active ? 'active' : ''} ${
                      s.kind === 'match' ? 'is-match' : ''
                    }`}
                    title={`${formatDate(s.date)} — RPE ${formatRpe(s.avgRpe)} · TL ${formatSessionLoad(s.avgSessionLoad)}`}
                  >
                    <div className="rpe-bar-value">{formatRpe(s.avgRpe, 1)}</div>
                    <div className="rpe-bar-track">
                      <div
                        className="rpe-bar-fill"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="rpe-bar-label">{label}</div>
                  </div>
                );
              })}
            </div>
            <p className="rpe-chart-legend">{t('rpeChartLegend')}</p>
          </div>

          <div className="rpe-players-block">
            <div className="rpe-chart-title">{t('rpeIndividual')}</div>
            <div className="rpe-player-table">
              <div className="rpe-player-row head">
                <div>{t('rpePlayer')}</div>
                <div>{t('rpeLabel')}</div>
                <div>{t('rpeSessionLoad')}</div>
                <div>{t('rpeDuration')}</div>
              </div>
              {players.map((p) => {
                const player = getPlayerBySlug(p.playerSlug);
                const name = player?.displayName ?? p.excelName;
                return (
                  <Link
                    key={p.playerSlug}
                    to={`/players/${p.playerSlug}`}
                    className="rpe-player-row"
                  >
                    <div className="rpe-player-name notranslate" translate="no">
                      {name}
                    </div>
                    <div className="rpe-player-num">{formatRpe(p.rpe, 0)}</div>
                    <div className="rpe-player-num">
                      {formatSessionLoad(p.sessionLoad)}
                    </div>
                    <div className="rpe-player-num">
                      {p.min != null ? `${p.min} ${t('rpeMinShort')}` : '—'}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <p className="rpe-footnote">{L(scaleNote)}</p>
        </>
      ) : null}

      {tqrSession ? <TqrHistograms session={tqrSession} /> : null}

      {gaconSession ? <GaconHistograms session={gaconSession} /> : null}
    </div>
  );
}
