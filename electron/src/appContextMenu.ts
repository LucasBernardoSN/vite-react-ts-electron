import { BrowserWindow, Menu, MenuItem } from 'electron';

/**
 * Função que cria o menu de contexto do aplicativo.
 * @see https://www.electronjs.org/docs/api/menu-item
 * @see https://www.electronjs.org/docs/api/menu
 * @see https://www.electronjs.org/docs/api/web-contents#event-context-menu
 */

export function createAppContextMenu() {
  const window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed(),
  );

  /**
   * Verifica se a janela principal está pronta. (Ou seja, se o aplicativo está aberto.)
   */
  if (!window) return;

  /**
   * Função que envia o Menu de Contexto para a janela.
   */
  window.webContents.on('context-menu', (_, params) => {
    const {
      misspelledWord,
      dictionarySuggestions,
      editFlags: { canCopy, canPaste },
    } = params;

    /**
     * Indica se o menu de contexto deve ser exibido.
     * Somente se houver algo para ser exibido.
     */
    const enableMenu = canCopy || canPaste;
    if (!enableMenu) return;

    /**
     * Cria a instância do menu de contexto.
     * @see https://www.electronjs.org/docs/api/menu
     */
    const menu = new Menu();

    /**
     * Adiciona as sugestões de correção de palavras incorretas.
     */
    if (misspelledWord !== '') {
      if (dictionarySuggestions.length > 0) {
        dictionarySuggestions.forEach((suggestion) => {
          menu.append(
            new MenuItem({
              label: `${suggestion}`,
              click: () => window.webContents.replaceMisspelling(suggestion),
            }),
          );
        });

        menu.append(new MenuItem({ type: 'separator' }));
      }

      /**
       * Adiciona a opção de adicionar palavras ao dicionário.
       */
      if (misspelledWord) {
        menu.append(
          new MenuItem({
            label: 'Adicionar ao dicionário',
            click: () =>
              window.webContents.session.addWordToSpellCheckerDictionary(
                misspelledWord,
              ),
          }),
        );
      }

      menu.append(new MenuItem({ type: 'separator' }));
    }

    /**
     * Adiciona a opção de copiar.
     */
    if (canCopy) {
      menu.append(
        new MenuItem({
          label: 'Copiar',
          click: () => window.webContents.copy(),
        }),
      );
    }

    /**
     * Adiciona a opção de colar.
     */
    if (canPaste) {
      menu.append(
        new MenuItem({
          label: 'Colar',
          click: () => window.webContents.paste(),
        }),
      );
    }

    /**
     * Envia o menu de contexto para a janela.
     */
    menu.popup();
  });
}
