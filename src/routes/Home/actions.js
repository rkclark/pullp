import { home as types } from '../../actionTypes';
import { get, queries } from '../../apis/githubApi';
import { MAXIMUM_PRS } from '../../constants';

export const requestCurrentUserSuccess = data => ({
  type: types.REQUEST_CURRENT_USER_SUCCESS,
  data,
});

export const requestCurrentUserFail = error => ({
  type: types.REQUEST_CURRENT_USER_FAIL,
  error,
});

export const requestCurrentUserLoading = () => ({
  type: types.REQUEST_CURRENT_USER_LOADING,
});

export const requestCurrentUser = token => async dispatch => {
  try {
    dispatch(requestCurrentUserLoading());
    const query = queries.currentUser();
    const results = await get(query, token);
    dispatch(requestCurrentUserSuccess(results));
  } catch (err) {
    dispatch(requestCurrentUserFail(err.message));
  }
};

export const requestUserTeamsSuccess = data => ({
  type: types.REQUEST_USER_TEAMS_SUCCESS,
  data,
});

export const requestUserTeamsFail = error => ({
  type: types.REQUEST_USER_TEAMS_FAIL,
  error,
});

export const requestUserTeams = token => async (dispatch, getState) => {
  try {
    const userLogin = getState().home.currentUser.login;
    const query = queries.userTeams(userLogin);
    const results = await get(query, token);
    dispatch(requestUserTeamsSuccess(results));
  } catch (err) {
    dispatch(requestUserTeamsFail(err.message));
  }
};

export const requestPullRequestsLoading = () => ({
  type: types.REQUEST_PULL_REQUESTS_LOADING,
});

export const requestPullRequestsSuccess = (data, watchedRepos) => ({
  type: types.REQUEST_PULL_REQUESTS_SUCCESS,
  data,
  watchedRepos,
});

export const requestPullRequestsFail = error => ({
  type: types.REQUEST_PULL_REQUESTS_FAIL,
  error,
});

export const requestPullRequests = (token, repoIds) => async (
  dispatch,
  getState,
) => {
  const watchedRepos = getState().selectRepos.watchedRepos;
  try {
    dispatch(requestPullRequestsLoading());
    const query = queries.pullRequests(repoIds, MAXIMUM_PRS);
    const results = await get(query, token);
    dispatch(requestPullRequestsSuccess(results, watchedRepos));
  } catch (err) {
    dispatch(requestPullRequestsFail(err.message));
  }
};

export const toggleOpenRepo = id => {
  id
    ? document.body.classList.add('modal-active')
    : document.body.classList.remove('modal-active');
  return {
    type: types.TOGGLE_OPEN_REPO,
    id,
  };
};
