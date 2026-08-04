import { Routes, Route } from 'react-router-dom';
import AppNav from './components/AppNav';
import LanguageToggle from './components/LanguageToggle';
import PasswordGate from './components/PasswordGate';
import HomePage from './pages/HomePage';
import MatchPage from './pages/MatchPage';
import PlayerPage from './pages/PlayerPage';
import PlayersPage from './pages/PlayersPage';
import TrainingPage from './pages/TrainingPage';

export default function App() {
  return (
    <PasswordGate>
      <div className="app-topbar">
        <AppNav />
        <LanguageToggle />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/match/:slug" element={<MatchPage />} />
        <Route path="/training/:slug" element={<TrainingPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:slug" element={<PlayerPage />} />
      </Routes>
    </PasswordGate>
  );
}
