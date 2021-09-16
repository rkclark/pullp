const electron = require('electron');

const { contextBridge, ipcRenderer } = electron;

function init() {
  window.electron = electron;

  contextBridge.exposeInMainWorld('electron', {
    authApi: {
      trigger: (...args) => {
        ipcRenderer.send('auth-api-trigger', ...args);
      },
      receiveError: callback => {
        ipcRenderer.on('auth-error', (_, ...args) => callback(...args));
      },
      receiveCode: callback => {
        ipcRenderer.on('auth-code', (_, ...args) => callback(...args));
      },
      clearCookies: () => {
        ipcRenderer.send('clear-cookies');
      },
      removeListeners: () => {
        ipcRenderer.removeAllListeners('auth-code');
        ipcRenderer.removeAllListeners('auth-error');
      },
    },
  });
}

init();
