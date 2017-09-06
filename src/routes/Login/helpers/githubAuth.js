// import { parse } from 'url';
import request from 'superagent';//eslint-disable-line
import { requestGithubToken } from '../actions'; //eslint-disable-line

const electron = window.require('electron');

const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const dialog = remote.dialog;

const scopes = ['read:org', 'repo'];

export function githubAuth( //eslint-disable-line
  clientId,
  clientSecret,
  dispatch, //eslint-disable-line
) {
  // Build the OAuth consent page URL
  const authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  const githubUrl = `https://github.com/login/oauth/authorize?`;
  const authUrl = `${githubUrl}client_id=${clientId}&scope=${scopes}`;
  console.log('auth url is', authUrl);

  authWindow.loadURL(authUrl);

  async function handleCallback(url) {
    console.log('handling callback url', url);
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    // If there is a code, proceed to get token from github
    if (code) {
      console.log('Getting code from Github');
      await dispatch(requestGithubToken(clientId, clientSecret, code));
      authWindow.destroy();
      //   request
      //     .post('https://github.com/login/oauth/access_token')
      //     .send({
      //       client_id: clientId,
      //       client_secret: clientSecret,
      //       code,
      //     })
      //     .set('Accept', 'application/json')
      //     .end((err, res) => {
      //       console.log('res is ', res);
      //       console.log('err is ', err);
      //     });
      // } else if (error) {
      //   alert(
      //     "Oops! Something went wrong and we couldn't " +
      //       'log you in using Github. Please try again.',
      //   );
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
