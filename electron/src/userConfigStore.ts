import Store from 'electron-store';
import { app } from 'electron';
import { watch } from 'chokidar';

type UserConfig = {
  AtualizacaoAutomatica: boolean;
};

export type UserConfigStore = Store<UserConfig>;

/**
 * Cria o armazenamento de configurações do usuário.
 * - Escuta mudanças no arquivo de configurações. (chokidar)
 *
 * @see https://www.npmjs.com/package/electron-store
 * @see https://www.npmjs.com/package/chokidar
 */
export const createUserConfigStore = () => {
  const userConfig = new Store<UserConfig>({
    schema: {
      AtualizacaoAutomatica: { type: 'boolean', default: true },
    },
  });

  watch(userConfig.path).on('change', () => {
    app.relaunch();
    app.exit();
  });

  return userConfig;
};
