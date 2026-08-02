import { getAllMatches } from '../data/matches';
import { getAllTrainings } from '../data/trainings';
import MatchCard from '../components/MatchCard';
import TrainingCard from '../components/TrainingCard';
import ReportHeader from '../components/ReportHeader';
import { useLanguage } from '../i18n/LanguageContext';

export default function HomePage() {
  const matches = getAllMatches();
  const trainings = getAllTrainings();
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
          <p className="home-analyst-credit">{t('analystCredit')}</p>
        </div>
      </div>

      <section className="home-section" aria-labelledby="home-matches-heading">
        <div className="section-title" id="home-matches-heading">
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

      <section className="home-section" aria-labelledby="home-trainings-heading">
        <div className="section-title" id="home-trainings-heading">
          {t('trainings')} ({trainings.length})
        </div>
        <p className="home-section-hint">{t('trainingsHint')}</p>
        {trainings.length === 0 ? (
          <p className="home-empty">{t('noTrainingsYet')}</p>
        ) : (
          <div className="match-grid">
            {trainings.map((session) => (
              <TrainingCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
