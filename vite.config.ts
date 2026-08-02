import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { cpSync, existsSync, mkdirSync } from 'fs';

function copyMatchesPlugin(): Plugin {
  return {
    name: 'copy-matches',
    closeBundle() {
      const src = resolve(__dirname, 'matches');
      const dest = resolve(__dirname, 'dist/matches');
      if (existsSync(src)) {
        mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
        cpSync(src, dest, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/SSCN-Primavera/' : '/',
  plugins: [react(), copyMatchesPlugin()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@matches': resolve(__dirname, 'matches'),
    },
  },
  server: {
    fs: {
      allow: ['.', 'matches'],
    },
  },
});
