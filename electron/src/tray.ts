import { app, BrowserWindow, Menu, Tray } from 'electron';
import { FAVICON_PATH } from './paths';
import { UserConfigStore } from './userConfigStore';

/**
 * Cria o ícone da bandeja de aplicativos do sistema. (Tray)
 * @param userConfig Configurações do usuário.
 *
 * @see https://www.electronjs.org/docs/api/tray
 */
export function createTray(userConfigStore: UserConfigStore) {
  const window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed(),
  );

  /**
   * Verifica se a janela principal está pronta. (Ou seja, se o aplicativo está aberto.)
   * - Se não, não cria o ícone.
   */
  if (!window) return;

  /**
   * Cria o ícone com o caminho do arquivo de ícone do aplicativo.
   */
  const tray = new Tray(FAVICON_PATH);

  /**
   * Mostra o nome do aplicativo quando realizar o `hover` no ícone.
   */
  tray.setToolTip(app.getName());

  /**
   * Cria o menu de contexto da ícone.
   */
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir',
      click: () => window.show(),
    },
    {
      label: 'Opções',
      click() {
        return userConfigStore.openInEditor();
      },
    },
    {
      label: 'Fechar',
      click: () => {
        window.destroy();
        tray.destroy();
        app.quit();
      },
    },
  ]);

  /**
   * Define o menu de contexto do ícone.
   */
  tray.setContextMenu(contextMenu);

  /**
   * Clique no ícone para mostrar a janela.
   */
  tray.on('click', () => window.show());

  /**
   * Destroi (remove) o ícone quando o aplicativo for ser encerrado.
   */
  app.on('before-quit', () => {
    tray.destroy();
  });
}
