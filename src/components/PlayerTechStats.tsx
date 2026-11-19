import { Link } from 'react-router-dom';
import {
  getPlayerTechStats,
  getTechStatsCoverage,
  TECH_STATS_COMPETITIONS,
  type MatchLogStatus,
  type PlayerMatchLogEntry,
  type TechStatLine,
} from '../data/playerMatchStats';
import { MATCH_COMPETITION_TAB_KEYS } from '../data/matchCompetitions';
import { useLanguage } from '../i18n/LanguageContext';
import type { UiKey } from '../i18n/translations';

function minutesCell(line: TechStatLine): string {
  if (line.appearances === 0) return '0';
  if (line.minutesUnknown === line.appearances) return '–';
  return line.minutesUnknown > 0 ? `${line.minutes}*` : String(line.minutes);
}

const STATUS_KEYS: Record<MatchLogStatus, UiKey> = {
  started: 'techStatsLogStarted',
  startedOff: 'techStatsLogStartedOff',
  subOn: 'techStatsLogSubOn',
  subOnOff: 'techStatsLogSubOnOff',
  bench: 'techStatsLogBench',
};

function formatStatus(
  entry: PlayerMatchLogEntry,
  t: (key: UiKey) => string
): string {
  const template = t(STATUS_KEYS[entry.status]);
  return template
    .replace('{on}', entry.onMinute != null ? String(entry.onMinute) : '–')
    .replace('{off}', entry.offMinute != null ? String(entry.offMinute) : '–');
}

export default function PlayerTechStats({ playerSlug }: { playerSlug: string }) {
  const { t, L } = useLanguage();
  const stats = getPlayerTechStats(playerSlug);
  const coverage = getTechStatsCoverage();

  const rows: Array<{ key: string; label: string; line: TechStatLine; total?: boolean }> = [
    ...TECH_STATS_COMPETITIONS.map((c) => ({
      key: c,
      label: t(MATCH_COMPETITION_TAB_KEYS[c]),
      line: stats.byCompetition[c],
    })),
    { key: 'total', label: t('techStatsTotal'), line: stats.total, total: true },
  ];

  const unknownList = stats.minutesUnknownIn
    .map((m) => `${m.label} (${t(MATCH_COMPETITION_TAB_KEYS[m.competitionId])})`)
    .join(', ');
  const missingList = coverage.missing
    .map((m) => `${m.label} (${t(MATCH_COMPETITION_TAB_KEYS[m.competitionId])})`)
    .join(', ');
  const coverageText = t('techStatsCoverage')
    .replace(
      '{with}',
      String(TECH_STATS_COMPETITIONS.reduce((n, c) => n + coverage.withLineups[c], 0))
    )
    .replace(
      '{played}',
      String(TECH_STATS_COMPETITIONS.reduce((n, c) => n + coverage.played[c], 0))
    );

  return (
    <div className="player-tech-stats">
      <div className="section-title">{t('techStatsTitle')}</div>

      <dl className="player-stats-grid player-tech-summary">
        {TECH_STATS_COMPETITIONS.map((c) => (
          <div className="player-stat" key={c}>
            <dt>
              {t('techStatsAppsIn')} {t(MATCH_COMPETITION_TAB_KEYS[c])}
            </dt>
            <dd>{stats.byCompetition[c].appearances}</dd>
          </div>
        ))}
        <div className="player-stat">
          <dt>{t('techStatsMinutes')}</dt>
          <dd>{minutesCell(stats.total)}</dd>
        </div>
        <div className="player-stat">
          <dt>{t('techStatsGoals')}</dt>
          <dd>{stats.total.goals}</dd>
        </div>
        <div className="player-stat">
          <dt>{t('techStatsAssists')}</dt>
          <dd>{stats.total.assists}</dd>
        </div>
        <div className="player-stat">
          <dt>{t('techStatsYellow')}</dt>
          <dd>{stats.total.yellowCards}</dd>
        </div>
        <div className="player-stat">
          <dt>{t('techStatsRed')}</dt>
          <dd>{stats.total.redCards}</dd>
        </div>
      </dl>

      <div className="gps-table-wrap">
        <table className="gps-table player-tech-table">
          <thead>
            <tr>
              <th scope="col">{t('techStatsCompetition')}</th>
              <th scope="col">{t('techStatsApps')}</th>
              <th scope="col">{t('techStatsStarts')}</th>
              <th scope="col">{t('techStatsMinutes')}</th>
              <th scope="col">{t('techStatsGoals')}</th>
              <th scope="col">{t('techStatsAssists')}</th>
              <th scope="col">{t('techStatsYellow')}</th>
              <th scope="col">{t('techStatsRed')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label, line, total }) => (
              <tr key={key} className={total ? 'player-tech-total' : undefined}>
                <th scope="row">{label}</th>
                <td>{line.appearances}</td>
                <td>{line.starts}</td>
                <td>{minutesCell(line)}</td>
                <td>{line.goals}</td>
                <td>{line.assists}</td>
                <td>{line.yellowCards}</td>
                <td>{line.redCards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stats.matchLog.length > 0 ? (
        <>
          <div className="section-title player-tech-log-title">{t('techStatsLogTitle')}</div>
          <div className="gps-table-wrap">
            <table className="gps-table player-tech-table player-tech-log-table">
              <thead>
                <tr>
                  <th scope="col">{t('techStatsLogDate')}</th>
                  <th scope="col">{t('techStatsLogMatch')}</th>
                  <th scope="col">{t('techStatsCompetition')}</th>
                  <th scope="col">{t('techStatsLogStatus')}</th>
                  <th scope="col">{t('techStatsMinutes')}</th>
                  <th scope="col">{t('techStatsLogReason')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.matchLog.map((entry) => (
                  <tr
                    key={`${entry.slug}-${entry.status}-${entry.onMinute ?? 'x'}`}
                    className={entry.counted ? undefined : 'player-tech-log-bench'}
                  >
                    <td>{entry.date.slice(5).replace('-', '/')}</td>
                    <th scope="row">
                      <Link to={`/matches/${entry.slug}`} className="player-tech-log-link">
                        {entry.label}
                      </Link>
                    </th>
                    <td>{t(MATCH_COMPETITION_TAB_KEYS[entry.competitionId])}</td>
                    <td>{formatStatus(entry, t)}</td>
                    <td>
                      {entry.status === 'bench'
                        ? '–'
                        : entry.minutes == null
                          ? '–'
                          : entry.minutes}
                    </td>
                    <td className="player-tech-log-reason">
                      {entry.notes ? L(entry.notes) : '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <p className="video-hint player-tech-note">
        {unknownList && (
          <>
            {t('techStatsMinutesUnknown').replace('{matches}', unknownList)}
            <br />
          </>
        )}
        {coverageText}
        {missingList && ` ${t('techStatsMissing').replace('{matches}', missingList)}`}
        <br />
        {t('techStatsMethod')}
        <br />
        {t('techStatsLogHint')}
      </p>
    </div>
  );
}
