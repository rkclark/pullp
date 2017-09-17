import { selectRepos as types } from '../../actionTypes';
import { get, queries } from '../../apis/githubApi';

export const requestWatchedReposSuccess = data => ({
  type: types.REQUEST_WATCHED_REPOS_SUCCESS,
  data,
});

export const requestWatchedReposFail = error => ({
  type: types.REQUEST_WATCHED_REPOS_FAIL,
  error,
});

export const requestWatchedRepos = token => async dispatch => {
  try {
    const query = queries.watchedRepos();
    const results = await get(query, token);
    dispatch(requestWatchedReposSuccess(results));
  } catch (err) {
    dispatch(requestWatchedReposFail(err.message));
  }
};

export const toggleRepoSelection = id => ({
  type: types.TOGGLE_REPO_SELECTION,
  id,
});
