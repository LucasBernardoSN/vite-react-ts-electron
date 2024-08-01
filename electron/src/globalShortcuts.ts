import { app, BrowserWindow, globalShortcut } from 'electron';

/**
 * Função usada para habilitar os atalhos de teclado globais.
 */
export function enableGlobalShorcuts() {
  const window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed(),
  );

  if (window) {
    /**
     * Registra o atalho de teclado para abrir o DevTools.
     */
    app.whenReady().then(() => {
      globalShortcut.register('Ctrl+Shift+Alt+D', () => {
        window.webContents.toggleDevTools();
      });
    });

    /**
     * Desregistra todos os atalhos de teclado.
     * quando o aplicativo estiver sendo encerrado.
     */
    app.on('will-quit', () => globalShortcut.unregisterAll());
  }
}
