const gatekeeperUrl = process.env.REACT_APP_OAUTH_GATEKEEPER_URL;

export default function githubAuth(saveGithubToken, setLoadingToken) {
  const electron = window.electron;

  const remote = electron.remote;
  const BrowserWindow = remote.BrowserWindow;
  const dialog = remote.dialog;
  const authWindow = new BrowserWindow({
    width: 800,
    height: 800,
    center: true,
    show: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  const scopes = ['read:org', 'repo'];
  const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  const githubUrl = process.env.REACT_APP_GITHUB_AUTH_URL;
  const authUrl = `${githubUrl}?client_id=${clientId}&scope=${scopes}`;
  authWindow.loadURL(authUrl);

  async function handleCallback(url) {
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);
    // If there is a code, proceed to get token from github
    if (code) {
      authWindow.destroy();

      setLoadingToken();
      const res = await fetch(`${gatekeeperUrl}/${code}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
      const json = await res.json();
      console.log('JSON is', json);
      const token = json.token;
      await saveGithubToken(token);
    }

    if (error) {
      // Close the browser if code found or error
      authWindow.destroy();
    }
  }

  // If "Done" button is pressed, hide "Loading"
  authWindow.on('close', () => {
    authWindow.destroy();
  });

  authWindow.webContents.on(
    'did-fail-load',
    (event, errorCode, errorDescription, validatedURL) => {
      if (validatedURL.includes('github.com')) {
        authWindow.destroy();

        dialog.showErrorBox(
          'Invalid Hostname',
          `Could not load https://github.com/.`,
        );
      }
    },
  );

  authWindow.webContents.on('will-navigate', (event, url) => {
    handleCallback(url);
  });

  authWindow.webContents.on(
    'did-get-redirect-request',
    (event, oldUrl, newUrl) => {
      handleCallback(newUrl);
    },
  );
}
