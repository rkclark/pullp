import { home as types } from '../../actionTypes';
import { get, queries } from '../../apis/githubApi';

export const requestCurrentUserSuccess = data => ({
  type: types.REQUEST_CURRENT_USER_SUCCESS,
  data,
});

export const requestCurrentUserFail = error => ({
  type: types.REQUEST_CURRENT_USER_FAIL,
  error,
});

export const requestCurrentUser = token => async dispatch => {
  try {
    const query = queries.currentUser();
    const results = await get(query, token);
    dispatch(requestCurrentUserSuccess(results));
  } catch (err) {
    dispatch(requestCurrentUserFail(err.message));
  }
};

export const requestPullRequestsLoading = () => ({
  type: types.REQUEST_PULL_REQUESTS_LOADING,
});

export const requestPullRequestsSuccess = data => ({
  type: types.REQUEST_PULL_REQUESTS_SUCCESS,
  data,
});

export const requestPullRequestsFail = error => ({
  type: types.REQUEST_PULL_REQUESTS_FAIL,
  error,
});

export const requestPullRequests = (token, repoIds) => async dispatch => {
  try {
    dispatch(requestPullRequestsLoading());
    const query = queries.pullRequests(repoIds);
    const results = await get(query, token);
    dispatch(requestPullRequestsSuccess(results));
  } catch (err) {
    dispatch(requestPullRequestsFail(err.message));
  }
};

export const toggleOpenRepo = id => ({
  type: types.TOGGLE_OPEN_REPO,
  id,
});
