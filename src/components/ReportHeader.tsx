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
  return (
    <div className="header-container">
      <div className="brand-group">
        <img src={NAPOLI_LOGO} alt="SSC Napoli Logo" className="napoli-logo" />
        <div className="brand-title-text">SSC Napoli</div>
      </div>
      <div className="report-title-block">
        <div className="report-subtitle">Report Tecnico Partita</div>
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

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
