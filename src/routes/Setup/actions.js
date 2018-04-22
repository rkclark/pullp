import { setup as types } from '../../actionTypes';
import { SERVER_PORT } from '../../constants';

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

export const requestGithubToken = oAuthParams => async dispatch => {
  console.log('server port is ', SERVER_PORT);
  const oAuthData = JSON.stringify(oAuthParams);
  try {
    const res = await fetch(`http://localhost:${SERVER_PORT}/authenticate/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: oAuthData,
    });
    const result = await res.json();
    dispatch(requestGithubTokenSuccess(result.access_token));
  } catch (err) {
    dispatch(requestGithubTokenFailure(err));
  }
};
