import { getAllMatches } from '../data/matches';
import MatchCard from '../components/MatchCard';
import ReportHeader from '../components/ReportHeader';
import { useLanguage } from '../i18n/LanguageContext';

export default function HomePage() {
  const matches = getAllMatches();
  const { t } = useLanguage();

  return (
    <div className="app-shell">
      <div className="report-page">
        <ReportHeader
          pageTitle={t('homePageTitle')}
          matchTitle={t('homeDashboard')}
          matchDate={new Date().toISOString().slice(0, 10)}
          competition={t('season')}
        />
        <div className="home-hero">
          <h1>{t('homeHeroTitle')}</h1>
          <p>{t('homeHeroBody')}</p>
        </div>
      </div>

      <div className="section-title" style={{ marginBottom: 16 }}>
        {t('matches')} ({matches.length})
      </div>
      <div className="match-grid">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
