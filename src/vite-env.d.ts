/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_PLATFORM: 'web' | 'desktop';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
