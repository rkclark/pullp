const gatekeeperUrl = process.env.REACT_APP_OAUTH_GATEKEEPER_URL;

/* eslint-disable no-console */

export default function githubAuth(
  saveGithubToken,
  setLoadingToken,
  saveTokenError,
) {
  const electron = window.electron;

  const remote = electron.remote;
  const { BrowserWindow, BrowserView } = remote;
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
  const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  const githubUrl = process.env.REACT_APP_GITHUB_AUTH_URL;
  const authUrl = `${githubUrl}?client_id=${clientId}&scope=${scopes}`;

  // For security, we need to load Github login page in a BrowserView
  view.webContents.loadURL(authUrl);

  async function handleCallback(url) {
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);
    // If there is a code, proceed to get token from github
    if (code) {
      view.destroy();
      authWindow.destroy();

      setLoadingToken();
      try {
        const res = await fetch(`${gatekeeperUrl}/${code}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error('Auth request to Pullp gatekeeper failed');
        }
        const json = await res.json();
        const token = json.token;
        if (!token) {
          throw new Error('Cannot find token in Github auth response');
        }

        await saveGithubToken(token);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        saveTokenError(err.message);
      }
    }

    if (error) {
      // Close the browser if code found or error
      view.destroy();
      authWindow.destroy();
    }
  }

  // If "Done" button is pressed, hide "Loading"
  authWindow.on('close', () => {
    view.destroy();
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

  view.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    handleCallback(newUrl);
  });
}
