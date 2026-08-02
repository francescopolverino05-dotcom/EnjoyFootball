import { Routes, Route } from 'react-router-dom';
import LanguageToggle from './components/LanguageToggle';
import PasswordGate from './components/PasswordGate';
import HomePage from './pages/HomePage';
import MatchPage from './pages/MatchPage';
import TrainingPage from './pages/TrainingPage';

export default function App() {
  return (
    <PasswordGate>
      <div className="app-topbar">
        <LanguageToggle />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/match/:slug" element={<MatchPage />} />
        <Route path="/training/:slug" element={<TrainingPage />} />
      </Routes>
    </PasswordGate>
  );
}
