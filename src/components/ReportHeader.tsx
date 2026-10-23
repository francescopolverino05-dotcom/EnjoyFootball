import { useLanguage } from '../i18n/LanguageContext';

/** EnjoyFootball site brand logo */
const BRAND_LOGO = `${import.meta.env.BASE_URL}enjoyfootball-logo.png`;

interface ReportHeaderProps {
  pageTitle: string;
  matchTitle: string;
  matchDate: string;
  competition: string;
}

export default function ReportHeader({
  pageTitle,
  matchTitle,
  matchDate,
  competition,
}: ReportHeaderProps) {
  const { t, formatDate } = useLanguage();

  return (
    <div className="header-container">
      <div className="brand-group">
        <img src={BRAND_LOGO} alt="Enjoy Football" className="napoli-logo" />
        <div className="brand-block">
          <div className="brand-title-text">Enjoy Football</div>
          <div className="brand-sub-text">Primavera</div>
        </div>
      </div>
      <div className="report-title-block">
        <div className="report-subtitle">{t('brandSubtitle')}</div>
        <div className="report-title">{pageTitle}</div>
      </div>
      <div className="match-meta-block">
        <div className="match-teams-title notranslate" translate="no">
          {matchTitle}
        </div>
        <div>
          {competition} ({formatDate(matchDate)})
        </div>
      </div>
    </div>
  );
}
