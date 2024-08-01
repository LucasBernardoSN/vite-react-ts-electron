import { BrowserWindow, ipcMain } from 'electron';
import Badge from 'electron-windows-badge';

/**
 * Cria o `badge` de notificação no ícone do aplicativo.
 * @see https://www.npmjs.com/package/electron-windows-badge
 */
export const createIconBadge = () => {
  const browserWindow = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed(),
  );

  if (!browserWindow) return;

  /**
   * Evento que atualiza o `badge` (notificação com o número de novas mensagens)
   */
  ipcMain.on('update-badge', () => {
    /**
     * Verifica se a janela está visível (ou seja, se a janela está aberta ou minimizada)
     * Se for falso, quer dizer que o app está na bandeja do sistema
     * Então ele minimiza a janela para mostrar o `badge`
     */
    if (browserWindow.isVisible() === false) {
      browserWindow.minimize();
    }

    /**
     * Faz o ícone piscar
     */
    browserWindow.flashFrame(true);
  });

  return new Badge(browserWindow, {});
};
