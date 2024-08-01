import './styles/App.css';
import pkg from '../package.json';
import { electronFunctionHandler } from './functions/electronFunctionHandler';
import { useEffect, useState } from 'react';

export const App = () => {
  const [count, setCount] = useState(0);

  const updateBadge = (newCount?: number) => {
    electronFunctionHandler(() => {
      window.ipcRenderer.send('update-badge', newCount);
    });
  };

  const increment = () => {
    setCount((count) => count + 1);
    updateBadge(count + 1);
  };

  const decrement = () => {
    setCount((count) => count - 1);
    updateBadge(count - 1);
  };

  useEffect(() => {
    electronFunctionHandler(() => {
      window.ipcRenderer.on('main-process-message', (_event, message) => {
        // eslint-disable-next-line no-console
        console.log('Essa mensagem veio do main process: ', message);
      });
    });
  }, []);

  return (
    <div style={{ flexDirection: 'column' }}>
      <h1>Vite + React + TS + Electron</h1>

      <h2>{import.meta.env.VITE_APP_PLATFORM}</h2>

      <h3>Version: {pkg.version}</h3>

      <div style={{ flexDirection: 'column' }}>
        <div>
          <button onClick={decrement}>Decrement</button>
          <button onClick={increment}>Increment</button>
        </div>
        <h2>{count}</h2>
      </div>
    </div>
  );
};
