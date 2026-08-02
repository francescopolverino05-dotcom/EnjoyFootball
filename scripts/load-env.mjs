import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');
export const ENV_PATH = join(ROOT, '.env');
export const TOKEN_PATH = join(homedir(), '.config', 'sscn-primavera', 'github_token');
export const VIMEO_TOKEN_PATH = join(homedir(), '.config', 'sscn-primavera', 'vimeo_token');

/** Load KEY=VALUE pairs from a .env-style file into process.env (no overwrite). */
export function loadEnvFile(filePath = ENV_PATH) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

/** Upsert a single KEY=VALUE in .env without wiping other secrets. */
export function upsertEnvKey(key, value) {
  const clean = value.trim();
  let lines = [];
  if (existsSync(ENV_PATH)) {
    lines = readFileSync(ENV_PATH, 'utf8').split(/\r?\n/);
  } else {
    lines = ['# SSCN Primavera — local secrets (never commit this file)'];
  }

  let found = false;
  const next = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return line;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return line;
    if (trimmed.slice(0, eq).trim() !== key) return line;
    found = true;
    return `${key}=${clean}`;
  });

  if (!found) {
    if (next.length && next[next.length - 1] !== '') next.push('');
    next.push(`${key}=${clean}`);
  }

  writeFileSync(ENV_PATH, `${next.filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n').replace(/\n*$/, '\n')}`, {
    mode: 0o600,
  });
}

/**
 * Resolve GitHub token from (in order):
 * 1. process.env.GITHUB_TOKEN / GH_TOKEN
 * 2. project .env
 * 3. ~/.config/sscn-primavera/github_token
 */
export function resolveGitHubToken() {
  loadEnvFile();
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN.trim();
  if (existsSync(TOKEN_PATH)) {
    return readFileSync(TOKEN_PATH, 'utf8').trim();
  }
  return '';
}

export function saveGitHubToken(token) {
  const clean = token.trim();
  if (!clean) throw new Error('Empty token');

  upsertEnvKey('GITHUB_TOKEN', clean);

  const dir = dirname(TOKEN_PATH);
  mkdirSync(dir, { recursive: true });
  writeFileSync(TOKEN_PATH, `${clean}\n`, { mode: 0o600 });

  return { envPath: ENV_PATH, tokenPath: TOKEN_PATH };
}

/**
 * Resolve Vimeo token from:
 * 1. process.env.VIMEO_ACCESS_TOKEN / VIMEO_TOKEN
 * 2. project .env
 * 3. ~/.config/sscn-primavera/vimeo_token
 */
export function resolveVimeoToken() {
  loadEnvFile();
  if (process.env.VIMEO_ACCESS_TOKEN) return process.env.VIMEO_ACCESS_TOKEN.trim();
  if (process.env.VIMEO_TOKEN) return process.env.VIMEO_TOKEN.trim();
  if (existsSync(VIMEO_TOKEN_PATH)) {
    return readFileSync(VIMEO_TOKEN_PATH, 'utf8').trim();
  }
  return '';
}

export function saveVimeoToken(token) {
  const clean = token.trim();
  if (!clean) throw new Error('Empty token');

  upsertEnvKey('VIMEO_ACCESS_TOKEN', clean);

  const dir = dirname(VIMEO_TOKEN_PATH);
  mkdirSync(dir, { recursive: true });
  writeFileSync(VIMEO_TOKEN_PATH, `${clean}\n`, { mode: 0o600 });

  return { envPath: ENV_PATH, tokenPath: VIMEO_TOKEN_PATH };
}
