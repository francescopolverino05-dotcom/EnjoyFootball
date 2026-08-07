import { Routes, Route } from 'react-router-dom';
import AppNav from './components/AppNav';
import LanguageToggle from './components/LanguageToggle';
import PasswordGate from './components/PasswordGate';
import CalendarPage from './pages/CalendarPage';
import HomePage from './pages/HomePage';
import MatchPage from './pages/MatchPage';
import MatchesPage from './pages/MatchesPage';
import PlayerPage from './pages/PlayerPage';
import PlayersPage from './pages/PlayersPage';
import TrainingPage from './pages/TrainingPage';
import TrainingsPage from './pages/TrainingsPage';

export default function App() {
  return (
    <PasswordGate>
      <div className="app-topbar">
        <AppNav />
        <LanguageToggle />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/match/:slug" element={<MatchPage />} />
        <Route path="/trainings" element={<TrainingsPage />} />
        <Route path="/training/:slug" element={<TrainingPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:slug" element={<PlayerPage />} />
      </Routes>
    </PasswordGate>
  );
}
