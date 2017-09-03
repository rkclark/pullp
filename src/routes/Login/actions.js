import queryString from 'query-string';
import { login as types } from '../../actionTypes';

export const saveGithubCredentials = credentials => ({
  type: types.SAVE_GITHUB_CREDENTIALS,
  credentials,
});

export const requestGithubTokenSuccess = token => ({
  type: types.REQUEST_GITHUB_TOKEN_SUCCESS,
  token,
});

export const requestGithubTokenFailure = error => ({
  type: types.REQUEST_GITHUB_TOKEN_FAILURE,
  error,
});

export const requestGithubToken = (
  clientId,
  clientSecret,
  oAuthCode,
) => async dispatch => { //eslint-disable-line
  const options = queryString.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code: oAuthCode,
  });
  console.log('requesting github token with opts', options);
  // try {
  //   const results = await fetch(
  //     `https://github.com/login/oauth/access_token?${options}`,
  //     {
  //       method: 'POST',
  //     },
  //   );
  //   console.log('FETCHED FROM GITHUB');
  //   dispatch(requestGithubTokenSuccess(results));
  // } catch (err) {
  //   console.log('FAILED FETCH FROM GITHUB', err);
  //   dispatch(requestGithubTokenFailure(err));
  // }

  fetch(`https://github.com/login/oauth/access_token?${options}`, {
    method: 'POST',
  })
    .then(results => {
      console.log('SUCCESSFUL FETCH', results);
    })
    .catch(err => {
      console.log('FAILED FETCH FROM GITHUB', err);
    });
};
