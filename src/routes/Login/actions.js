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

export const saveRedirect = path => ({
  type: types.SAVE_REDIRECT,
  path,
});

export const removeCredentials = () => ({
  type: types.REMOVE_CREDENTIALS,
});

export const requestGithubToken = oAuthParams => async dispatch => {
  const oAuthData = JSON.stringify(oAuthParams);
  try {
    const res = await fetch(`http://localhost:9821/authenticate/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: oAuthData,
    });
    const result = await res.json();
    dispatch(requestGithubTokenSuccess(result.access_token));
    dispatch(saveRedirect('/'));
  } catch (err) {
    dispatch(requestGithubTokenFailure(err));
  }
};

export const userLogout = () => ({
  type: types.USER_LOGOUT,
});
