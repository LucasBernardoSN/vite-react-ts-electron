/**
 * Função que verifica se o ambiente é de desktop (Electron)
 * - Se a propriedade `VITE_APP_PLATFORM` for `desktop`
 * e se a propriedade `ipcRenderer` estiver sendo exposta na `window`
 * retorna `true`
 */
const isDesktopEnvironment = () => {
  return import.meta.env.VITE_APP_PLATFORM === 'desktop' && window.ipcRenderer;
};

/**
 * Executa uma função apenas no ambiente de desktop (Electron)
 * @param callback - Função que será executada
 */
export const electronFunctionHandler = (callback: () => void) => {
  if (isDesktopEnvironment()) {
    callback();
  }
};
