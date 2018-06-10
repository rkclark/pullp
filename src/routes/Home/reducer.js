import {
  home as types,
  account as accountTypes,
  layout as layoutTypes,
} from '../../actionTypes';

export const initialState = {
  currentUser: null,
  githubPullRequestsError: null,
  githubCurrentUserError: null,
  githubUserTeamsError: null,
  repositories: [],
  openRepoId: null,
  pullRequestsLoading: false,
  currentUserLoading: false,
  userTeams: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case accountTypes.CLEAR_PERSISTED_LOCAL_STORAGE:
      return {
        ...initialState,
      };
    case types.REQUEST_CURRENT_USER_SUCCESS:
      return {
        ...state,
        currentUser: {
          login: action.data.viewer.login,
          avatarUrl: action.data.viewer.avatarUrl,
          url: action.data.viewer.url,
        },
        githubCurrentUserError: null,
        currentUserLoading: false,
      };
    case types.REQUEST_CURRENT_USER_FAIL:
      return {
        ...state,
        githubCurrentUserError: action.error,
        currentUserLoading: false,
      };
    case types.REQUEST_CURRENT_USER_LOADING:
      return {
        ...state,
        currentUserLoading: true,
      };
    case types.TOGGLE_OPEN_REPO:
      return {
        ...state,
        openRepoId:
          action.id === undefined || state.openRepoId === action.id
            ? null
            : action.id,
      };
    case types.REQUEST_USER_TEAMS_SUCCESS: {
      const userTeamsArray = action.data.viewer.organizations.edges.reduce(
        (array, organization) => [
          ...array,
          ...organization.node.teams.edges.map(team => ({ ...team.node })),
        ],
        [],
      );
      return {
        ...state,
        userTeams: userTeamsArray,
        githubUserTeamsError: null,
      };
    }
    case types.REQUEST_USER_TEAMS_FAIL:
      return {
        ...state,
        githubUserTeamsError: action.error,
      };
    case layoutTypes.REHYDRATION_COMPLETE:
      return {
        ...state,
        openRepoId: null,
      };
    default:
      return state;
  }
}
