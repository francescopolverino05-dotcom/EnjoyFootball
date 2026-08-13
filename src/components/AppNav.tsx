import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Top nav: Home first, then alphabetical —
 * Home | Calendar | Matches | Opposition | Players | Training.
 * Detail pages light up their parent section.
 */
export default function AppNav() {
  const { t } = useLanguage();
  const location = useLocation();
  const path = location.pathname;

  const homeActive = path === '/' || path === '';
  const calendarActive = path === '/calendar' || path.startsWith('/calendar/');
  const matchesActive = path === '/matches' || path.startsWith('/match/');
  const oppositionActive =
    path === '/opposition' || path.startsWith('/opposition/');
  const playersActive = path === '/players' || path.startsWith('/players/');
  const trainingActive =
    path === '/trainings' || path.startsWith('/training/');

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
        to="/calendar"
        className={() =>
          calendarActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('calendar')}
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
        to="/opposition"
        className={() =>
          oppositionActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('navOpposition')}
      </NavLink>
      <NavLink
        to="/players"
        className={() =>
          playersActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('players')}
      </NavLink>
      <NavLink
        to="/trainings"
        className={() =>
          trainingActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('navTraining')}
      </NavLink>
    </nav>
  );
}
