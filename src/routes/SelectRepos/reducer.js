import { selectRepos as types } from '../../actionTypes';

export const initialState = {
  watchedRepos: [],
  githubError: null,
  selectedRepos: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_WATCHED_REPOS_SUCCESS:
      return {
        ...state,
        watchedRepos: action.data,
        githubError: null,
        selectedRepos: state.selectedRepos.filter(repoId => {
          let result = false;
          for (const node of action.data) { // eslint-disable-line
            if (node.id === repoId) {
              result = true;
              break;
            }
          }
          return result;
        }),
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
    default:
      return state;
  }
}
