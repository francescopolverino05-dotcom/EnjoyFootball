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
        <div className="home-hero home-credit">
          <p className="home-credit-label">{t('homeCreatedBy')}</p>
          <h1 className="home-credit-name">{t('homeCreatorName')}</h1>
          <p className="home-analyst-credit">{t('homeCreatorBrand')}</p>
        </div>
      </div>
    </div>
  );
}
