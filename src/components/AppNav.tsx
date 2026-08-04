import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Top nav is always Home | Matches | Training | Players.
 * Active state follows the current route; detail pages light up their
 * parent section (match → Matches, training → Training, player → Players).
 */
export default function AppNav() {
  const { t } = useLanguage();
  const location = useLocation();
  const path = location.pathname;

  const homeActive = path === '/' || path === '';
  const matchesActive = path === '/matches' || path.startsWith('/match/');
  const trainingActive =
    path === '/trainings' || path.startsWith('/training/');
  const playersActive = path === '/players' || path.startsWith('/players/');

  return (
    <nav className="app-nav" aria-label={t('navAria')}>
      <NavLink
        to="/"
        end
        className={() =>
          homeActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('navHome')}
      </NavLink>
      <NavLink
        to="/matches"
        className={() =>
          matchesActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('matches')}
      </NavLink>
      <NavLink
        to="/trainings"
        className={() =>
          trainingActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('navTraining')}
      </NavLink>
      <NavLink
        to="/players"
        className={() =>
          playersActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('players')}
      </NavLink>
    </nav>
  );
}
