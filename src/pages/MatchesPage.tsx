import { Link } from 'react-router-dom';
import { getAllMatches } from '../data/matches';
import MatchCard from '../components/MatchCard';
import ReportHeader from '../components/ReportHeader';
import { useLanguage } from '../i18n/LanguageContext';

export default function MatchesPage() {
  const matches = getAllMatches();
  const { t } = useLanguage();

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        {t('backToHome')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('matchesPageTitle')}
          matchTitle={t('matches')}
          matchDate={new Date().toISOString().slice(0, 10)}
          competition={t('season')}
        />
      </div>

      <section className="home-section" aria-labelledby="matches-list-heading">
        <div className="section-title" id="matches-list-heading">
          {t('matches')} ({matches.length})
        </div>
        {matches.length === 0 ? (
          <p className="home-empty">{t('noMatchesYet')}</p>
        ) : (
          <div className="match-grid">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
