import { account as types } from '../../actionTypes';

export const initialState = {
  githubClientId: null,
  githubClientSecret: null,
  loginError: null,
  githubToken: null,
  redirectPath: null,
  logoutModalOpen: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOGOUT:
      return {
        ...initialState,
      };
    case types.SAVE_GITHUB_CREDENTIALS:
      return {
        ...state,
        githubClientId: action.credentials.githubClientId,
        githubClientSecret: action.credentials.githubClientSecret,
      };
    case types.REQUEST_GITHUB_TOKEN_FAILURE:
      return {
        ...state,
        loginError: action.error,
      };
    case types.REQUEST_GITHUB_TOKEN_SUCCESS:
      return {
        ...state,
        githubToken: action.token,
      };
    case types.SAVE_REDIRECT:
      return {
        ...state,
        redirectPath: action.path,
      };
    case types.TOGGLE_LOGOUT_MODAL:
      return {
        ...state,
        logoutModalOpen: !state.logoutModalOpen,
      };
    default:
      return state;
  }
}
