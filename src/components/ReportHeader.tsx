import { useLanguage } from '../i18n/LanguageContext';

const NAPOLI_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1Mb7o5uu6kphzBaGlPMYHSWOtML2btlqFY7TdOXkfTg&s=10';

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
