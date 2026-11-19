import {
  getPlayerTechStats,
  getTechStatsCoverage,
  TECH_STATS_COMPETITIONS,
  type TechStatLine,
} from '../data/playerMatchStats';
import { MATCH_COMPETITION_TAB_KEYS } from '../data/matchCompetitions';
import { useLanguage } from '../i18n/LanguageContext';

function minutesCell(line: TechStatLine): string {
  if (line.appearances === 0) return '0';
  if (line.minutesUnknown === line.appearances) return '–';
  return line.minutesUnknown > 0 ? `${line.minutes}*` : String(line.minutes);
}

export default function PlayerTechStats({ playerSlug }: { playerSlug: string }) {
  const { t } = useLanguage();
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
      </p>
    </div>
  );
}
