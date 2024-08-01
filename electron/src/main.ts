import { app, Menu } from 'electron';
import { restoreOrCreateWindow } from './browserWindow';
import { enableAutoLaunch } from './autoLaunch';
import { createIconBadge } from './iconBagde';
import { createUserConfigStore } from './userConfigStore';
import { createTray } from './tray';
import { createAppContextMenu } from './appContextMenu';
import { enableAutoUpdater } from './autoUpdate';
import { createElectronLogger } from './electronLogger';
import { enableGlobalShorcuts } from './globalShortcuts';

/**
 * Desabilita a aceleração de hardware
 */
app.disableHardwareAcceleration();

/**
 * Cria o identificador do aplicativo no Windows
 */
if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName());
}

/**
 * Remove o menu padrão do aplicativo quando estiver em produção
 */
if (app.isPackaged) {
  Menu.setApplicationMenu(null);
}

/**
 * Verifica se o esse processo é da instância
 * primária do aplicativo
 * - Se sim, ele continua o carregamento da janela existente
 * - se não o processo do aplicativo é encerrado
 */
if (app.requestSingleInstanceLock()) {
  /**
   * Quando o evento de `segunda instância` é disparado
   * ele restaura a janela existente ao invés de criar uma nova.
   */
  app.on('second-instance', restoreOrCreateWindow);

  /**
   * Quando o aplicativo estiver pronto
   * ele restaura a janela existente ou cria uma nova
   */
  app
    .whenReady()
    .then(() =>
      restoreOrCreateWindow().then(() => {
        const userConfig = createUserConfigStore();

        enableAutoUpdater(userConfig);
        createTray(userConfig);
        enableAutoLaunch();
        enableGlobalShorcuts();
        createIconBadge();
        createAppContextMenu();
      }),
    )
    .catch((err) => console.error('Error ao criar janela:', err));
} else {
  app.quit();
  process.exit(0);
}

/**
 * Encerra o processo do aplicativo
 * caso todas as janelas sejam fechadas.
 *
 * **Garantia que todos os processos sejam encerrados
 * em algum caso específico**
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Evento especifico para MacOS que recria a janela
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos
 * Event 'activate' para MacOS
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Cria um logger para registrar os erros
 */
const errorLogger = createElectronLogger('errors');

/**
 * Inicia o registro dos erros
 */
errorLogger.errorHandler.startCatching({});
