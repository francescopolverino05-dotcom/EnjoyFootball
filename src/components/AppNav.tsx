import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function AppNav() {
  const { t } = useLanguage();
  const location = useLocation();
  const hash = location.hash.replace(/^#/, '');
  const onHome = location.pathname === '/' || location.pathname === '';

  const sectionHashes = new Set(['matches', 'trainings', 'players']);
  const onSection = onHome && sectionHashes.has(hash);

  return (
    <nav className="app-nav" aria-label={t('navAria')}>
      <NavLink
        to="/"
        end
        className={() =>
          onHome && !onSection ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('navHome')}
      </NavLink>
      <NavLink
        to="/#matches"
        className={() =>
          onHome && hash === 'matches' ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('matches')}
      </NavLink>
      <NavLink
        to="/#trainings"
        className={() =>
          onHome && hash === 'trainings' ? 'app-nav-link active' : 'app-nav-link'
        }
      >
        {t('navTraining')}
      </NavLink>
      <NavLink to="/players" className={navClass}>
        {t('players')}
      </NavLink>
    </nav>
  );
}

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'app-nav-link active' : 'app-nav-link';
}
