import {
  groupPlayersByPosition,
  type PlayerPositionGroup,
} from '../data/players';
import type { Player } from '../types/player';
import type { UiKey } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import PlayerCard from './PlayerCard';

const GROUP_TITLE_KEYS: Record<PlayerPositionGroup, UiKey> = {
  gk: 'playersGroupGk',
  defenders: 'playersGroupDefenders',
  midfielders: 'playersGroupMidfielders',
  forwards: 'playersGroupForwards',
  tbd: 'playersGroupTbd',
};

interface PlayersGroupedListProps {
  players: Player[];
}

export default function PlayersGroupedList({ players }: PlayersGroupedListProps) {
  const { t } = useLanguage();
  const groups = groupPlayersByPosition(players);

  return (
    <div className="player-groups">
      {groups.map(({ group, players: groupPlayers }) => (
        <div key={group} className="player-group">
          <h3 className="player-group-title">
            {t(GROUP_TITLE_KEYS[group])} ({groupPlayers.length})
          </h3>
          <div className="match-grid player-grid">
            {groupPlayers.map((player) => (
              <PlayerCard key={player.slug} player={player} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
