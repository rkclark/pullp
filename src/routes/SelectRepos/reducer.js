import { selectRepos as types } from '../../actionTypes';

export const initialState = {
  watchedRepos: {
    currentPage: null,
    hasNextPage: null,
    hasPreviousPage: null,
    pages: {},
  },
  githubError: null,
  selectedRepos: [],
  repoFilterValue: null,
  reposPerPage: 50,
};

/* eslint-disable no-case-declarations */

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_WATCHED_REPOS_SUCCESS:
      const selectedRepos = state.selectedRepos.filter(repoId => {
        let result = false;
        for (const node of action.data) { // eslint-disable-line
          if (node.id === repoId) {
            result = true;
            break;
          }
        }
        return result;
      });

      let pages = {};
      let pageCount = 1;
      while (action.data.length > 0) {
        pages = {
          ...pages,
          [pageCount]: action.data.splice(0, state.reposPerPage),
        };
        pageCount += 1;
      }

      return {
        ...state,
        watchedRepos: {
          currentPage: 1,
          hasNextPage: pageCount > 2,
          hasPreviousPage: false,
          totalPages: pageCount - 1,
          pages,
        },
        githubError: null,
        selectedRepos,
      };
    case types.CHANGE_REPOS_PAGE:
      return {
        ...state,
        watchedRepos: {
          ...state.watchedRepos,
          currentPage: action.page,
          hasNextPage: action.page < state.watchedRepos.totalPages,
          hasPreviousPage: action.page > 1,
        },
      };
    case types.REQUEST_WATCHED_REPOS_FAIL:
      return {
        ...state,
        githubError: action.error,
      };
    case types.TOGGLE_REPO_SELECTION:
      return state.selectedRepos.includes(action.id)
        ? {
            ...state,
            selectedRepos: state.selectedRepos.filter(
              repoId => repoId !== action.id,
            ),
          }
        : {
            ...state,
            selectedRepos: [...state.selectedRepos, action.id],
          };
    case types.SAVE_REPO_FILTER_VALUE:
      return {
        ...state,
        repoFilterValue: action.value,
      };
    default:
      return state;
  }
}
