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
) => async dispatch => {
  try {
    const res = await fetch(`http://localhost:9999/authenticate/${oAuthCode}`);
    const result = await res.json();
    dispatch(requestGithubTokenSuccess(result.token));
  } catch (err) {
    dispatch(requestGithubTokenFailure(err));
  }
};
