import { Link } from 'react-router-dom';
import { getPlayerSlugForAppearanceName } from '../data/playerLinks';
import type { MatchAppearances, PlayerAppearance, TeamInfo } from '../types/match';
import type { UiKey } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';

interface AppearancesPanelProps {
  appearances: MatchAppearances;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
}

function formatMinute(minute: number): string {
  return `${minute}'`;
}

function formatMinuteList(minutes: number[] | undefined): string | null {
  if (!minutes || minutes.length === 0) return null;
  return minutes.map(formatMinute).join(', ');
}

function subStatus(player: PlayerAppearance, t: (key: UiKey) => string): string {
  const parts: string[] = [];
  const hasOn = player.onMinute != null;
  const hasOff = player.offMinute != null;

  if (player.starter && hasOff) {
    parts.push(t('appearanceOffAt').replace('{minute}', String(player.offMinute)));
  } else if (player.starter && !hasOff) {
    parts.push(t('appearanceStarter'));
  } else if (hasOn && hasOff) {
    parts.push(t('appearanceOnAt').replace('{minute}', String(player.onMinute)));
    parts.push(t('appearanceOffAt').replace('{minute}', String(player.offMinute)));
  } else if (hasOn) {
    parts.push(t('appearanceOnAt').replace('{minute}', String(player.onMinute)));
  } else if (hasOff) {
    parts.push(t('appearanceOffAt').replace('{minute}', String(player.offMinute)));
  } else {
    parts.push(t('appearanceUnknown'));
  }

  return parts.join(' · ');
}

function EventChips({ player }: { player: PlayerAppearance }) {
  const { t } = useLanguage();
  const chips: { key: string; label: string; className: string }[] = [];

  const goals = formatMinuteList(player.goals);
  if (goals) {
    chips.push({
      key: 'g',
      label: `${t('appearanceGoal')} ${goals}`,
      className: 'appearance-chip appearance-chip-goal',
    });
  }

  const assists = formatMinuteList(player.assists);
  if (assists) {
    chips.push({
      key: 'a',
      label: `${t('appearanceAssist')} ${assists}`,
      className: 'appearance-chip appearance-chip-assist',
    });
  }

  const yellows = formatMinuteList(player.yellowCards);
  if (yellows) {
    chips.push({
      key: 'y',
      label: `${t('appearanceYellow')} ${yellows}`,
      className: 'appearance-chip appearance-chip-yellow',
    });
  }

  const reds = formatMinuteList(player.redCards);
  if (reds) {
    chips.push({
      key: 'r',
      label: `${t('appearanceRed')} ${reds}`,
      className: 'appearance-chip appearance-chip-red',
    });
  }

  if (chips.length === 0) return <span className="appearance-events-empty">—</span>;

  return (
    <span className="appearance-chips">
      {chips.map((chip) => (
        <span className={chip.className} key={chip.key}>
          {chip.label}
        </span>
      ))}
    </span>
  );
}

function TeamAppearanceTable({
  team,
  players,
}: {
  team: TeamInfo;
  players: PlayerAppearance[];
}) {
  const { t, L } = useLanguage();
  const starters = players.filter((p) => p.starter);
  const bench = players.filter((p) => !p.starter && p.onMinute != null);
  const other = players.filter((p) => !p.starter && p.onMinute == null);

  const sections: { key: string; title: string; rows: PlayerAppearance[] }[] = [];
  if (starters.length) {
    sections.push({ key: 'xi', title: t('appearanceStarters'), rows: starters });
  }
  if (bench.length) {
    sections.push({ key: 'bench', title: t('appearanceSubs'), rows: bench });
  }
  if (other.length) {
    sections.push({ key: 'other', title: t('appearanceOther'), rows: other });
  }

  return (
    <section className={`appearance-team appearance-team-${team.colorClass}`}>
      <header className="appearance-team-header">
        {team.logo ? (
          <img
            className="appearance-team-logo"
            src={`/${team.logo}`}
            alt=""
            width={22}
            height={22}
          />
        ) : null}
        <h3 className="appearance-team-name">{L(team.name)}</h3>
      </header>

      {players.length === 0 ? (
        <p className="appearance-empty">{t('appearanceEmpty')}</p>
      ) : (
        sections.map((section) => (
          <div className="appearance-section" key={section.key}>
            <h4 className="appearance-section-title">{section.title}</h4>
            <div className="appearance-table-wrap">
              <table className="appearance-table">
                <thead>
                  <tr>
                    <th scope="col">{t('appearancePlayer')}</th>
                    <th scope="col">{t('appearanceSubStatus')}</th>
                    <th scope="col">{t('appearanceEvents')}</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((player) => (
                    <tr key={`${player.teamId}-${player.name}-${player.onMinute ?? 'x'}`}>
                      <td className="appearance-player">
                        {player.number != null ? (
                          <span className="appearance-number">{player.number}</span>
                        ) : null}
                        {(() => {
                          const slug = getPlayerSlugForAppearanceName(player.name);
                          return slug ? (
                            <Link
                              to={`/players/${slug}`}
                              className="appearance-name appearance-name-link"
                            >
                              {player.name}
                            </Link>
                          ) : (
                            <span className="appearance-name">{player.name}</span>
                          );
                        })()}
                        {player.notes ? (
                          <span className="appearance-note" title={L(player.notes)}>
                            *
                          </span>
                        ) : null}
                      </td>
                      <td className="appearance-status">{subStatus(player, t)}</td>
                      <td className="appearance-events">
                        <EventChips player={player} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default function AppearancesPanel({
  appearances,
  homeTeam,
  awayTeam,
}: AppearancesPanelProps) {
  const { t, L } = useLanguage();

  return (
    <div className="appearances-panel">
      <div className="section-title">{t('appearancesTitle')}</div>
      <p className="appearances-hint">{t('appearancesHint')}</p>
      <div className="appearances-grid">
        <TeamAppearanceTable team={homeTeam} players={appearances.home} />
        <TeamAppearanceTable team={awayTeam} players={appearances.away} />
      </div>
      {appearances.notes ? (
        <p className="appearances-notes">{L(appearances.notes)}</p>
      ) : null}
    </div>
  );
}
