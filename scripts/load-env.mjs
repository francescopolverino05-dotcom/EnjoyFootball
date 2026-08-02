import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');
export const ENV_PATH = join(ROOT, '.env');
export const TOKEN_PATH = join(homedir(), '.config', 'sscn-primavera', 'github_token');

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

  writeFileSync(
    ENV_PATH,
    `# SSCN Primavera — local secrets (never commit this file)\nGITHUB_TOKEN=${clean}\n`,
    { mode: 0o600 }
  );

  const dir = dirname(TOKEN_PATH);
  mkdirSync(dir, { recursive: true });
  writeFileSync(TOKEN_PATH, `${clean}\n`, { mode: 0o600 });

  return { envPath: ENV_PATH, tokenPath: TOKEN_PATH };
}
