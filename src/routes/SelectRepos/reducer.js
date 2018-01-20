import {
  selectRepos as types,
  account as accountTypes,
} from '../../actionTypes';

const reposPerPage = 25;

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
  reposPerPage,
  loading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case accountTypes.LOGOUT:
      return {
        ...initialState,
      };
    case types.REQUEST_WATCHED_REPOS_SUCCESS: {
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
        loading: false,
      };
    }
    case types.PAGINATE_REPOS: {
      let pages = {};
      let pageCount = 0;
      const filteredRepos = [...state.filteredRepos];
      while (filteredRepos.length > 0) {
        pageCount += 1;
        pages = {
          ...pages,
          [pageCount]: filteredRepos.splice(0, state.reposPerPage),
        };
      }
      return {
        ...state,
        reposPerPage: initialState.reposPerPage,
        paginatedRepos: {
          currentPage: pageCount === 0 ? null : 1,
          hasNextPage: pageCount > 1,
          hasPreviousPage: false,
          totalPages: pageCount,
          pages,
        },
      };
    }
    case types.CHANGE_REPOS_PAGE: {
      return {
        ...state,
        paginatedRepos: {
          ...state.paginatedRepos,
          currentPage: action.page,
          hasNextPage: action.page < state.paginatedRepos.totalPages,
          hasPreviousPage: action.page > 1,
        },
      };
    }
    case types.REQUEST_WATCHED_REPOS_FAIL: {
      return {
        ...state,
        githubError: action.error,
        loading: false,
      };
    }
    case types.TOGGLE_REPO_SELECTION: {
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
    }
    case types.SAVE_REPO_FILTER_VALUE: {
      return {
        ...state,
        repoFilterValue: action.value,
      };
    }
    case types.FILTER_REPOS: {
      const filteredRepos = state.repoFilterValue
        ? state.watchedRepos.filter(repo =>
            repo.name.includes(state.repoFilterValue),
          )
        : state.watchedRepos;
      return {
        ...state,
        filteredRepos,
      };
    }
    case types.LOADING_WATCHED_REPOS: {
      return {
        ...state,
        loading: true,
      };
    }
    default: {
      return state;
    }
  }
}
