import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MatchPage from './pages/MatchPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/match/:slug" element={<MatchPage />} />
    </Routes>
  );
}
