import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';

/**
 * Configuração do Vite
 * @see https://vitejs.dev/config/
 * Configuração do plugin do Vite para Electron
 * @see https://github.com/electron-vite/vite-plugin-electron
 * @see https://github.com/electron-vite/vite-plugin-electron-renderer
 */
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  /**
   * Se a configuração de plataforma for `web`, o único
   * plugin utilizado é o `react`.
   */
  if (process.env.VITE_APP_PLATFORM === 'web') {
    return { plugins: [react()] };
  }

  /**
   * Se a configuração de plataforma for `desktop`, é necessário
   * incluir o plugin `electron`.
   */
  return {
    plugins: [
      react(),
      electron({
        main: {
          // Configuração do caminho do script principal do Electron
          entry: 'electron/src/main.ts',
        },
        preload: {
          // Configuração do caminho do script de pre-carregamento
          input: path.join(__dirname, 'electron/src/preload.ts'),
        },
      }),
    ],
  };
});
