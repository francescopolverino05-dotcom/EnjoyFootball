import { useLanguage } from '../i18n/LanguageContext';

/** Local SSC Napoli crest (transparent background) */
const NAPOLI_LOGO = `${import.meta.env.BASE_URL}napoli-logo.png`;

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
        <img src={NAPOLI_LOGO} alt="SSC Napoli Logo" className="napoli-logo" />
        <div className="brand-block">
          <div className="brand-title-text">SSC Napoli</div>
          <div className="brand-sub-text">Primavera</div>
        </div>
      </div>
      <div className="report-title-block">
        <div className="report-subtitle">{t('brandSubtitle')}</div>
        <div className="report-title">{pageTitle}</div>
      </div>
      <div className="match-meta-block">
        <div className="match-teams-title">{matchTitle}</div>
        <div>
          {competition} ({formatDate(matchDate)})
        </div>
      </div>
    </div>
  );
}
