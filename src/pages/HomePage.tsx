import { getAllMatches } from '../data/matches';
import MatchCard from '../components/MatchCard';
import ReportHeader from '../components/ReportHeader';

export default function HomePage() {
  const matches = getAllMatches();

  return (
    <div className="app-shell">
      <div className="report-page">
        <ReportHeader
          pageTitle="ANALISI PARTITE"
          matchTitle="Primavera — Dashboard"
          matchDate={new Date().toISOString().slice(0, 10)}
          competition="Stagione 2025/26"
        />
        <div className="home-hero">
          <h1>Report Tecnici Partita</h1>
          <p>
            Tutte le analisi partita U19/U18 in un unico posto — statistiche,
            formazioni, video completo e clip di analisi per lo staff tecnico.
          </p>
        </div>
      </div>

      <div className="section-title" style={{ marginBottom: 16 }}>
        Partite ({matches.length})
      </div>
      <div className="match-grid">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
