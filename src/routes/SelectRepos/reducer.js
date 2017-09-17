import { selectRepos as types } from '../../actionTypes';

export const initialState = {
  watchedRepos: [],
  githubError: null,
  selectedRepos: [],
};

export default function(state = initialState, action) {
  let repos;
  switch (action.type) {
    case types.REQUEST_WATCHED_REPOS_SUCCESS:
      repos = action.data.viewer.watching.edges.map(repo => ({
        name: repo.node.name,
        id: repo.node.id,
      }));
      return {
        ...state,
        watchedRepos: repos,
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
