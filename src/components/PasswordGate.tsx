import { useEffect, useState, type FormEvent } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const PASSWORD = '01081926';
const STORAGE_KEY = 'sscn-primavera-auth';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const { locale } = useLanguage();
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (unlocked) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
    }
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  const copy =
    locale === 'it'
      ? {
          title: 'Accesso riservato',
          subtitle: 'Enjoy Football — inserisci la password',
          label: 'Password',
          submit: 'Entra',
          error: 'Password non corretta',
        }
      : {
          title: 'Restricted access',
          subtitle: 'Enjoy Football — enter the password',
          label: 'Password',
          submit: 'Enter',
          error: 'Incorrect password',
        };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (value === PASSWORD) {
      setError(false);
      setUnlocked(true);
    } else {
      setError(true);
    }
  }

  return (
    <div className="auth-gate">
      <form className="auth-card" onSubmit={onSubmit}>
        <div className="auth-brand">Enjoy Football</div>
        <h1 className="auth-title">{copy.title}</h1>
        <p className="auth-subtitle">{copy.subtitle}</p>
        <label className="auth-label" htmlFor="sscn-password">
          {copy.label}
        </label>
        <input
          id="sscn-password"
          className="auth-input"
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          autoFocus
        />
        {error ? <p className="auth-error">{copy.error}</p> : null}
        <button type="submit" className="auth-submit">
          {copy.submit}
        </button>
      </form>
    </div>
  );
}
