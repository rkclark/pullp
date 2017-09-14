import { home as types } from '../../actionTypes';

export const initialState = {
  currentUser: null,
  githubError: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_CURRENT_USER_SUCCESS:
      return {
        ...state,
        currentUser: {
          login: action.data.viewer.login,
          avatarUrl: action.data.viewer.avatarUrl,
          url: action.data.viewer.url,
        },
      };
    case types.REQUEST_CURRENT_USER_FAIL:
      return {
        ...state,
        githubError: action.error,
      };
    default:
      return state;
  }
}
