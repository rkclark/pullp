import { setup as types, account as accountTypes } from '../../actionTypes';

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
    case accountTypes.CLEAR_PERSISTED_LOCAL_STORAGE:
      return {
        ...initialState,
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
        loginError: null,
      };
    default:
      return state;
  }
}
