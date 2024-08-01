import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Estrutura de pastas no build do projeto.
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │

const APP_ROOT = path.join(__dirname, '..');
const RENDERER_DIST = path.join(APP_ROOT, 'dist');

/**
 * URL do servidor de desenvolvimento.
 */
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

/**
 * Caminho do ícone do aplicativo.
 */
export const FAVICON_PATH = path.join(
  VITE_DEV_SERVER_URL ? path.join(APP_ROOT, 'public') : RENDERER_DIST,
  'favicon.ico',
);

/**
 * Caminho do pre-load do aplicativo.
 */
export const PRELOAD_PATH = path.join(__dirname, 'preload.mjs');

/**
 * Caminho do buid
 */
export const BUILD_INDEX_HTML_PATH = path.join(RENDERER_DIST, 'index.html');
