import { MatchData } from '../types/match';

interface ScoreboardProps {
  match: MatchData;
}

export default function Scoreboard({ match }: ScoreboardProps) {
  const homeGoals = match.goals.filter((g) => g.teamId === match.homeTeam.id);
  const awayGoals = match.goals.filter((g) => g.teamId === match.awayTeam.id);

  return (
    <>
      <div className="scoreboard-cover">
        <div className="team-cover-card">
          <div className={`team-badge-circle ${match.homeTeam.colorClass}`}>
            {match.homeTeam.shortName}
          </div>
          <div className="team-cover-name">{match.homeTeam.name}</div>
        </div>
        <div className="score-display">
          {match.score.home} – {match.score.away}
        </div>
        <div className="team-cover-card">
          <div className={`team-badge-circle ${match.awayTeam.colorClass}`}>
            {match.awayTeam.shortName}
          </div>
          <div className="team-cover-name">{match.awayTeam.name}</div>
        </div>
      </div>

      <div className="scorers-container">
        <div>
          {homeGoals.map((g) => (
            <div className="scorer-item" key={`${g.minute}-${g.scorer}`}>
              ⚽ {g.minute}&apos; {g.scorer}
              {g.position ? ` (${g.position})` : ''}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'right' }}>
          {awayGoals.map((g) => (
            <div
              className="scorer-item"
              key={`${g.minute}-${g.scorer}`}
              style={{ justifyContent: 'flex-end' }}
            >
              {g.minute}&apos; {g.scorer} ⚽
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
