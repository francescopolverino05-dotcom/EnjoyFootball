import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Top nav is always Home | Matches | Training | Players.
 * Active state follows the current route/section; secondary page tabs
 * (match StatsDashboard vs training TrainingDashboard) stay scoped
 * to their own pages and are not shown here.
 */
export default function AppNav() {
  const { t } = useLanguage();
  const location = useLocation();
  const path = location.pathname;
  const hash = location.hash.replace(/^#/, '');

  const onHome = path === '/' || path === '';
  const onMatch = path.startsWith('/match/');
  const onTraining = path.startsWith('/training/');
  const onPlayers = path === '/players' || path.startsWith('/players/');

  const sectionHashes = new Set(['matches', 'trainings', 'players']);
  const onHomeSection = onHome && sectionHashes.has(hash);

  const homeActive = onHome && !onHomeSection;
  const matchesActive =
    onMatch || (onHome && hash === 'matches');
  const trainingActive =
    onTraining || (onHome && hash === 'trainings');
  const playersActive =
    onPlayers || (onHome && hash === 'players');

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
        to="/#matches"
        className={() =>
          matchesActive ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('matches')}
      </NavLink>
      <NavLink
        to="/#trainings"
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
