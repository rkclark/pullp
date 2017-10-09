import { selectRepos as types } from '../../actionTypes';

export const initialState = {
  watchedRepos: [],
  paginatedRepos: {
    currentPage: null,
    hasNextPage: null,
    hasPreviousPage: null,
    totalPages: 0,
    pages: {},
  },
  filteredRepos: [],
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

      return {
        ...state,
        watchedRepos: action.data,
        githubError: null,
        filteredRepos: [],
        selectedRepos,
      };
    case types.PAGINATE_REPOS:
      let pages = {};
      let pageCount = 0;
      const watchedRepos = state.watchedRepos;
      while (watchedRepos.length > 0) {
        pageCount += 1;
        pages = {
          ...pages,
          [pageCount]: watchedRepos.splice(0, state.reposPerPage),
        };
      }

      return {
        ...state,
        paginatedRepos: {
          currentPage: pageCount === 0 ? null : 1,
          hasNextPage: pageCount > 1,
          hasPreviousPage: false,
          totalPages: pageCount,
          pages,
        },
      };
    case types.CHANGE_REPOS_PAGE:
      return {
        ...state,
        paginatedRepos: {
          ...state.paginatedRepos,
          currentPage: action.page,
          hasNextPage: action.page < state.paginatedRepos.totalPages,
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
    case types.FILTER_REPOS:
      console.log(state.watchedRepos);
      const filteredRepos = state.repoFilterValue
        ? state.watchedRepos.filter(repo =>
            repo.name.includes(state.repoFilterValue),
          )
        : state.watchedRepos;
      console.log(filteredRepos);
      return {
        ...state,
        filteredRepos,
      };
    default:
      return state;
  }
}
