/// <reference types="vite-plugin-electron/electron-env" />

type IpcRenderer = import('electron').IpcRenderer;

/**
 * Sobrescrita de `Window` para que possamos usar o `ipcRenderer`
 * que foi exposto no `preload.ts`
 */
interface Window {
  ipcRenderer: Pick<IpcRenderer, 'on' | 'off' | 'send' | 'invoke'>;
}
