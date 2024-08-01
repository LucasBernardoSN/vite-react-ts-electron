declare module 'electron-windows-badge' {
  import { BrowserWindow } from 'electron';

  class Badge {
    constructor(
      browserWindow: BrowserWindow,
      options: {
        fontColor?: string;
        font?: string;
        color?: string;
        fit?: boolean;
        decimals?: number;
        radius?: number;
      },
    );
  }

  export = Badge;
}
