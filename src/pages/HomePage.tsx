import ReportHeader from '../components/ReportHeader';
import { useLanguage } from '../i18n/LanguageContext';

export default function HomePage() {
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
          <h1>{t('homeComingSoonTitle')}</h1>
          <p>{t('homeComingSoonBody')}</p>
        </div>
      </div>
    </div>
  );
}
