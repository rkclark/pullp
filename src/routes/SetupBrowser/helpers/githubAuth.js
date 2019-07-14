/* eslint-disable no-console */

const gatekeeperUrl = process.env.REACT_APP_OAUTH_GATEKEEPER_URL;

export default function githubAuth(
  saveGithubToken,
  setLoadingToken,
  saveTokenError,
) {
  console.log('init githubAuth');

  async function handleCallback() {
    if (!window || !window.location) {
      return;
    }

    const { code, error } = (
      window.location.href.match(new RegExp('([^?=&]+)(=([^&]*))?', 'g')) || []
    ).reduce((acc, cv) => {
      const [key, value] = cv.split('=');
      return {
        ...acc,
        [key.toLowerCase()]: value,
      };
    }, {});

    console.log('WINDOW.LOCATION', window.location);
    console.log('code', code);
    console.log('error', error);

    // If there is a code, proceed to get token from github
    if (code) {
      console.log('CODE EXISTS', code);
      setLoadingToken();
      try {
        console.log('IN TRY');
        const res = await fetch(`${gatekeeperUrl}/${code}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        console.log(res);

        if (!res.ok) {
          throw new Error('Auth request to Pullp gatekeeper failed');
        }

        const json = await res.json();
        const { token } = json;

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
      console.log('Error', error);
    }
  }

  handleCallback();
}
