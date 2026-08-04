import { Link } from 'react-router-dom';
import { getAllPlayers } from '../data/players';
import PlayerCard from '../components/PlayerCard';
import ReportHeader from '../components/ReportHeader';
import { useLanguage } from '../i18n/LanguageContext';

export default function PlayersPage() {
  const players = getAllPlayers();
  const { t } = useLanguage();

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        {t('backToHome')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('playersPageTitle')}
          matchTitle={t('playersRoster')}
          matchDate={new Date().toISOString().slice(0, 10)}
          competition={t('season')}
        />
      </div>

      <section className="home-section" aria-labelledby="players-list-heading">
        <div className="section-title" id="players-list-heading">
          {t('players')} ({players.length})
        </div>
        <p className="home-section-hint">{t('playersHint')}</p>
        <div className="match-grid player-grid">
          {players.map((player) => (
            <PlayerCard key={player.slug} player={player} />
          ))}
        </div>
      </section>
    </div>
  );
}
