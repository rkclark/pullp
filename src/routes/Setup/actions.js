import { setup as types } from '../../actionTypes';

export const requestGithubTokenSuccess = token => ({
  type: types.REQUEST_GITHUB_TOKEN_SUCCESS,
  token,
});

export const requestGithubTokenFailure = error => ({
  type: types.REQUEST_GITHUB_TOKEN_FAILURE,
  error,
});

const gatekeeperUrl = process.env.REACT_APP_OAUTH_GATEKEEPER_URL;

export const requestGithubToken = code => async dispatch => {
  try {
    const res = await fetch(`${gatekeeperUrl}/authenticate/${code}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const result = await res.json();
    dispatch(requestGithubTokenSuccess(result.token));
  } catch (err) {
    dispatch(requestGithubTokenFailure(err));
  }
};
