import electronUpdater, { type AppUpdater } from 'electron-updater';
import { app } from 'electron';
import { UserConfigStore } from './userConfigStore';
import { createElectronLogger } from './electronLogger';

/**
 * Função usada para obter a instância do `autoUpdater`
 * - É necessário devido a uma incompatibilidade descrita nessa issue:
 * @see https://github.com/electron-userland/electron-builder/issues/7976
 */
function getAutoUpdater(): AppUpdater {
  // Using destructuring to access autoUpdater due to the CommonJS module of 'electron-updater'.
  // It is a workaround for ESM compatibility issues.
  const { autoUpdater } = electronUpdater;
  return autoUpdater;
}

/**
 * Habilita a atualização automática
 * @param userConfigStore Configurações do usuário
 */
export function enableAutoUpdater(userConfigStore: UserConfigStore) {
  /**
   * Verifica se o aplicativo está em produção para habilitar a atualização.
   */
  if (!app.isPackaged) return;

  /**
   * Verifica se a atualização automática está habilitada no usuário.
   */
  const autoUpdateIsEnabled = userConfigStore.get('AtualizacaoAutomatica');

  if (autoUpdateIsEnabled) {
    /**
     * Cria um log para registrar as atualizações
     */
    const autoUpdateLoggger = createElectronLogger('auto-update');

    /**
     * Cria a instância do `autoUpdater`
     */
    const autoUpdater = getAutoUpdater();

    /**
     * Função que checa se existe uma nova atualização
     */
    autoUpdater
      .checkForUpdates()
      .then((UpdateCheckResult) => {
        autoUpdateLoggger.info(
          `[auto-update] [checkForUpdates] [success] [currentVersion: "${app.getVersion()}"] [updateInfo: ${JSON.stringify(UpdateCheckResult?.updateInfo.version)}]`,
        );
      })
      .catch((error) => {
        autoUpdateLoggger.error(
          `[auto-update] [checkForUpdates] [error] \n[${JSON.stringify(error)}]`,
        );
      });

    /**
     * Evento que dispara quando a nova atualização estiver baixada
     */
    autoUpdater.on('update-downloaded', (event) => {
      autoUpdateLoggger.info(
        `[auto-update] [update-downloaded] \n[${JSON.stringify(event)}]`,
      );

      autoUpdater.quitAndInstall();
    });

    /**
     * Evento que dispara quando ocorrer um erro na atualização
     */
    autoUpdater.on('error', (error) => {
      autoUpdateLoggger.error(
        `[auto-update] [error] \n[${JSON.stringify(error)}]`,
      );
    });
  }
}
