/* eslint-disable no-await-in-loop */

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

export const paginateRepos = () => ({
  type: types.PAGINATE_REPOS,
});

export const toggleRepoSelection = id => ({
  type: types.TOGGLE_REPO_SELECTION,
  id,
});

export const saveRepoFilterValue = value => ({
  type: types.SAVE_REPO_FILTER_VALUE,
  value,
});

export const filterRepos = () => ({
  type: types.FILTER_REPOS,
});

export const changeReposPage = page => ({
  type: types.CHANGE_REPOS_PAGE,
  page,
});

export const performFiltering = value => dispatch => {
  dispatch(saveRepoFilterValue(value));
  dispatch(filterRepos());
  dispatch(paginateRepos());
};

export const requestWatchedRepos = token => async dispatch => {
  try {
    let query = queries.watchedRepos();
    const initialResults = await get(query, token);
    let reposArray = initialResults.viewer.watching.edges;
    if (initialResults.viewer.watching.pageInfo.hasNextPage) {
      let paginate = true;
      while (paginate) {
        query = queries.watchedRepos(reposArray[reposArray.length - 1].cursor);
        const paginatedResults = await get(query, token);
        reposArray = [...reposArray, ...paginatedResults.viewer.watching.edges];
        paginate = paginatedResults.viewer.watching.pageInfo.hasNextPage;
      }
    }
    reposArray = reposArray.map(repo => ({
      name: repo.node.name,
      id: repo.node.id,
      url: repo.node.url,
    }));
    dispatch(requestWatchedReposSuccess(reposArray));
    dispatch(filterRepos());
    dispatch(paginateRepos());
  } catch (err) {
    dispatch(requestWatchedReposFail(err.message));
  }
};
