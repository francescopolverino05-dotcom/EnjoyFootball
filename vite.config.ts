import { defineConfig, type Plugin, type Connect } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream, cpSync, existsSync, mkdirSync, realpathSync, statSync } from 'fs';
import { extname, join, normalize, resolve, sep } from 'path';

const MEDIA_LIBS = ['matches', 'trainings'] as const;

const MIME: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

/**
 * Serve /matches and /trainings in dev, and copy them into dist on build
 * without following Desktop/media symlinks (those can be multi-GB).
 *
 * Do not put matches/trainings as symlinks under public/ — Vite's publicDir
 * copy dereferences them and can hang local builds on huge video trees.
 */
function mediaLibrariesPlugin(): Plugin {
  const roots = Object.fromEntries(
    MEDIA_LIBS.map((name) => [name, resolve(__dirname, name)])
  ) as Record<(typeof MEDIA_LIBS)[number], string>;

  function serveMedia(
    req: Connect.IncomingMessage,
    res: Connect.ServerResponse,
    next: Connect.NextFunction
  ) {
    const url = req.url?.split('?')[0] ?? '';
    const lib = MEDIA_LIBS.find(
      (name) => url === `/${name}` || url.startsWith(`/${name}/`)
    );
    if (!lib) return next();

    const root = roots[lib];
    const rel = decodeURIComponent(url.slice(lib.length + 2));
    const candidate = normalize(join(root, rel));
    if (!candidate.startsWith(root + sep) && candidate !== root) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    let st;
    try {
      st = statSync(candidate);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    if (st.isDirectory()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    // Confirm symlink targets resolve (local Desktop media) before streaming.
    try {
      realpathSync(candidate);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const type = MIME[extname(candidate).toLowerCase()] ?? 'application/octet-stream';
    res.setHeader('Content-Type', type);
    res.setHeader('Content-Length', String(st.size));
    createReadStream(candidate).pipe(res);
  }

  return {
    name: 'media-libraries',
    configureServer(server) {
      server.middlewares.use(serveMedia);
    },
    closeBundle() {
      for (const name of MEDIA_LIBS) {
        const src = roots[name];
        const dest = resolve(__dirname, 'dist', name);
        if (!existsSync(src)) continue;
        mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
        cpSync(src, dest, { recursive: true, dereference: false });
      }
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/SSCN-Primavera/' : '/',
  plugins: [react(), mediaLibrariesPlugin()],
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
