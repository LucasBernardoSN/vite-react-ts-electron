import { app, BrowserWindow, shell } from 'electron';
import {
  BUILD_INDEX_HTML_PATH,
  FAVICON_PATH,
  PRELOAD_PATH,
  VITE_DEV_SERVER_URL,
} from './paths';

/**
 * Função que cria uma janela do navegador.
 *
 * @see https://www.electronjs.org/docs/api/browser-window
 */
async function createBrowserWindow() {
  /**
   * Posição inicial da janela.
   * - Os valores indicam o afastamento do eixo horizontal e vertical da janela.
   * - Sendo o ponto (0,0) o canto superior esquerdo da janela.
   * - Se o valor for `undefined` ele posiciona a janela no meio da tela.
   * - Em produção os valores devem ser `undefined`.
   * - Em desenvolvimento os valores podem ser estabelecidos manualmente.
   */
  const windowSizes = {
    x: app.isPackaged ? undefined : 2150,
    y: app.isPackaged ? undefined : 100,
    minWidth: app.isPackaged ? 500 : undefined,
    minHeight: app.isPackaged ? 500 : undefined,
  };

  const browserWindow = new BrowserWindow({
    ...windowSizes,
    icon: FAVICON_PATH,
    show: false, // Use o evento 'ready-to-show' para mostrar o BrowserWindow instanciado.'
    webPreferences: {
      preload: PRELOAD_PATH,
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true,
      webviewTag: false, // A tag de visualização da web não é recomendada. Considere alternativas como um iframe ou o BrowserView da Electron.
    },
  });

  /**
   * Carrega o conteúdo da janela.
   * Se o aplicativo estiver em desenvolvimento, carrega a URL.
   * Se o aplicativo estiver em produção, carrega o arquivo index.html.
   */
  if (app.isPackaged) {
    await browserWindow.loadFile(BUILD_INDEX_HTML_PATH);
  } else if (VITE_DEV_SERVER_URL) {
    await browserWindow.loadURL(VITE_DEV_SERVER_URL);
    /**
     * Se o aplicativo estiver em desenvolvimento abre maximizado.
     * E abre o console de desenvolvimento.
     */
    browserWindow.maximize();
    browserWindow.webContents.openDevTools();
  }

  /**
   * Faz com que o BrowserWindow seja exibido quando o evento 'ready-to-show' for disparado.
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow.show();
  });

  /**
   * Faz com que os links sejam abertos com o navegador padrão do sistema operacional. E não dentro do aplicativo.
   */
  browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  /**
   * Muda o comportamento padrão do botão de fechar da janela.
   * Em vez de fechar a janela, minimiza a janela para a bandeja do sistema.
   */
  browserWindow.on('close', (event) => {
    event.preventDefault();
    browserWindow.hide();
  });

  return browserWindow;
}

/**
 * Restaura uma BrowserWindow existente ou cria uma nova.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed(),
  );

  if (window === undefined) {
    window = await createBrowserWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.show();
  window.focus();
  window?.webContents.send('main-process-message', new Date().toLocaleString());
}
