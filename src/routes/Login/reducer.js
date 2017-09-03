import { login as types } from '../../actionTypes';

export const initialState = {
  githubClientId: null,
  githubClientSecret: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SAVE_GITHUB_CREDENTIALS:
      return {
        ...state,
        githubClientId: action.credentials.githubClientId,
        githubClientSecret: action.credentials.githubClientSecret,
      };
    default:
      return state;
  }
}
