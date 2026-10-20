import { Link } from 'react-router-dom';
import { buildFirstLegView } from '../data/firstLeg';
import { formatMatchScore } from '../data/matches';
import { teamCrestUrl } from '../data/teamLogos';
import { useLanguage } from '../i18n/LanguageContext';
import type { MatchData } from '../types/match';
import MatchMedia from './MatchMedia';

interface FirstLegReferenceProps {
  match: MatchData;
  /** `page` is the return-fixture report. `slot` fills the opposition return-fixture tape. */
  variant?: 'page' | 'slot';
}

export default function FirstLegReference({
  match,
  variant = 'page',
}: FirstLegReferenceProps) {
  const { t, L, formatDate } = useLanguage();
  const view = buildFirstLegView(match, t('firstLegAssist'));
  const homeGoals = match.goals.filter((goal) => goal.teamId === match.homeTeam.id);
  const awayGoals = match.goals.filter((goal) => goal.teamId === match.awayTeam.id);
  const numericPlayers = view.players.some((player) => player.goals != null && !player.note);

  const body = (
    <>
      <div className="match-card-date">
        {t('firstLegKicker')}
        {' · '}
        {formatDate(match.date)}
        {' · '}
        {L(match.subtitle)}
      </div>
      <div className="match-card-scoreline">
        <div className={`match-card-team ${match.homeTeam.colorClass}`}>
          <img
            src={teamCrestUrl(match.homeTeam, 'onLight')}
            alt=""
            className="match-card-crest"
          />
          <span>{match.homeTeam.shortName}</span>
        </div>
        <div className="match-card-score">{formatMatchScore(match.score)}</div>
        <div className={`match-card-team match-card-team-away ${match.awayTeam.colorClass}`}>
          <span>{match.awayTeam.shortName}</span>
          <img
            src={teamCrestUrl(match.awayTeam, 'onLight')}
            alt=""
            className="match-card-crest"
          />
        </div>
      </div>

      {match.goals.length > 0 ? (
        <div className="first-leg-scorers">
          <div className="first-leg-scorers-label">{t('firstLegScorers')}</div>
          <div className="first-leg-scorers-line">
            <span>
              {homeGoals
                .map((goal) => `${goal.minute}' ${goal.scorer}`)
                .join(', ') || '—'}
            </span>
            <span>
              {awayGoals
                .map((goal) => `${goal.minute}' ${goal.scorer}`)
                .join(', ') || '—'}
            </span>
          </div>
        </div>
      ) : null}

      {view.formation ? (
        <p className="first-leg-formation">
          {match.homeTeam.shortName} {view.formation.home}
          {' · '}
          {match.awayTeam.shortName} {view.formation.away}
        </p>
      ) : null}

      {view.stats.length > 0 ? (
        <div className="first-leg-block">
          <h3 className="team-stats-section-title">{t('firstLegTeamStats')}</h3>
          <div className="stats-comparison-row stats-comparison-header">
            <span className="stats-val-home">{match.homeTeam.shortName}</span>
            <span className="stats-label" aria-hidden="true" />
            <span className="stats-val-away">{match.awayTeam.shortName}</span>
          </div>
          {view.stats.map((stat) => (
            <div className="stats-comparison-row" key={stat.id}>
              <span className="stats-val-home">{L(stat.home)}</span>
              <span className="stats-label">{L(stat.label)}</span>
              <span className="stats-val-away">{L(stat.away)}</span>
            </div>
          ))}
        </div>
      ) : null}

      {view.players.length > 0 ? (
        <div className="first-leg-block">
          <h3 className="team-stats-section-title">{t('firstLegPlayers')}</h3>
          {numericPlayers ? (
            <div className="gps-table-wrap">
              <table className="gps-table first-leg-table">
                <thead>
                  <tr>
                    <th scope="col">{t('leagueMatchStatsPlayer')}</th>
                    <th scope="col">{t('team')}</th>
                    <th scope="col">{t('leagueMatchStatsGoals')}</th>
                    <th scope="col">{t('firstLegColShots')}</th>
                    <th scope="col">{t('firstLegColOnTarget')}</th>
                    <th scope="col">{t('firstLegColKey')}</th>
                    <th scope="col">{t('firstLegColXg')}</th>
                  </tr>
                </thead>
                <tbody>
                  {view.players.map((player) => (
                    <tr key={player.id}>
                      <th scope="row">{player.name}</th>
                      <td>{player.team}</td>
                      <td>{player.goals ?? '—'}</td>
                      <td>{player.shots ?? '—'}</td>
                      <td>{player.onTarget ?? '—'}</td>
                      <td>{player.keyPasses ?? '—'}</td>
                      <td>{player.xg == null ? '—' : player.xg.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ul className="first-leg-player-list">
              {view.players.map((player) => (
                <li key={player.id}>
                  <strong>{player.name}</strong>
                  {' · '}
                  {player.team}
                  {player.note ? ` · ${player.note}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <div className="first-leg-links">
        <Link to={`/match/${match.slug}`}>{t('firstLegOpenReport')}</Link>
        {view.leagueStatsHref ? (
          <Link to={view.leagueStatsHref}>{t('firstLegOpenStats')}</Link>
        ) : null}
      </div>

      {match.video?.fullMatch ? (
        <MatchMedia
          slug={match.slug}
          src={match.video.fullMatch}
          unsupportedLabel={t('videoUnsupported')}
          playLabel={t('playVideo')}
          title={L(match.title)}
        />
      ) : null}
    </>
  );

  if (variant === 'slot') {
    return <div className="first-leg-slot">{body}</div>;
  }

  return (
    <section className="first-leg-reference" aria-labelledby="first-leg-title">
      <p className="first-leg-kicker">{t('firstLegKicker')}</p>
      <h2 className="section-title" id="first-leg-title">
        {t('firstLegTitle')}
      </h2>
      <p className="video-hint">{t('firstLegHint')}</p>
      <div className="first-leg-panel">{body}</div>
    </section>
  );
}
