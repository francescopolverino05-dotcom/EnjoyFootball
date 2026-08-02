import { Routes, Route } from 'react-router-dom';
import LanguageToggle from './components/LanguageToggle';
import HomePage from './pages/HomePage';
import MatchPage from './pages/MatchPage';

export default function App() {
  return (
    <>
      <div className="app-topbar">
        <LanguageToggle />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/match/:slug" element={<MatchPage />} />
      </Routes>
    </>
  );
}
