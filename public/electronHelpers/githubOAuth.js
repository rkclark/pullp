const { BrowserWindow, BrowserView } = require('electron');
/* eslint-disable no-console */

module.exports = function githubOAuth({ clientId, githubUrl, mainWindow }) {
  // https://auth0.com/blog/securing-electron-applications-with-openid-connect-and-oauth-2/  // https://auth0.com/blog/securing-electron-applications-with-openid-connect-and-oauth-2/

  console.log('TRYING TO MAKE AUTH WINDOW');
  const authWindow = new BrowserWindow({
    width: 800,
    height: 800,
    center: true,
    show: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
    },
  });

  authWindow.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: 800, height: 800 });

  const scopes = ['read:org', 'repo'];

  const authUrl = `${githubUrl}?client_id=${clientId}&scope=${scopes}`;

  // For security, we need to load Github login page in a BrowserView
  view.webContents.loadURL(authUrl);

  async function handleCallback(url) {
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    console.log('CODE', code);

    if (code) {
      mainWindow.webContents.send('auth-code', code);
    }

    if (error) {
      mainWindow.webContents.send('auth-error', error);
    }

    authWindow.destroy();
  }

  authWindow.on('close', () => {
    authWindow.destroy();
  });

  view.webContents.on(
    'did-fail-load',
    (event, errorCode, errorDescription, validatedURL) => {
      if (validatedURL.includes('github.com')) {
        console.error(
          'Error loading url in Github sign in window',
          event,
          errorCode,
          errorDescription,
        );
      }
    },
  );

  view.webContents.on('will-navigate', (event, url) => {
    handleCallback(url);
  });

  view.webContents.on('will-redirect', (event, url) => {
    handleCallback(url);
  });

  view.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    handleCallback(newUrl);
  });
};
