import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { cpSync, existsSync, mkdirSync } from 'fs';

function copyMediaLibrariesPlugin(): Plugin {
  return {
    name: 'copy-media-libraries',
    closeBundle() {
      for (const name of ['matches', 'trainings'] as const) {
        const src = resolve(__dirname, name);
        const dest = resolve(__dirname, 'dist', name);
        if (existsSync(src)) {
          mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
          cpSync(src, dest, { recursive: true });
        }
      }
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/SSCN-Primavera/' : '/',
  plugins: [react(), copyMediaLibrariesPlugin()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@matches': resolve(__dirname, 'matches'),
      '@trainings': resolve(__dirname, 'trainings'),
    },
  },
  server: {
    fs: {
      // Optional absolute path for local media outside the repo (e.g. Desktop folder).
      // Example: SSCN_LOCAL_MEDIA="$HOME/Desktop/Allenamento" npm run dev
      allow: [
        '.',
        'matches',
        'trainings',
        ...(process.env.SSCN_LOCAL_MEDIA ? [process.env.SSCN_LOCAL_MEDIA] : []),
      ],
    },
  },
});
