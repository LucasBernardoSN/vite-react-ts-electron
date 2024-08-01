import AutoLaunch from 'auto-launch';
import { app } from 'electron';

/**
 * Cria uma instância do objeto `AutoLaunch`
 */
function createAutoLaunchInstance() {
  return new AutoLaunch({
    name: app.name,
  });
}

/**
 * Habilita o `AutoLaunch`
 * - Somente para o `Windows`
 * - Somente em `produção`
 */
export function enableAutoLaunch() {
  const autoLauncher = createAutoLaunchInstance();

  if (process.platform !== 'win32') return;

  if (!app.isPackaged) return;

  autoLauncher
    .isEnabled()
    .then((isEnabled: boolean) => {
      if (isEnabled) return;
      autoLauncher.enable();
    })
    .catch((err: Error) => {
      throw err;
    });
}
