import { login as types } from '../../actionTypes';

export const saveGithubCredentials = credentials => ({
  type: types.SAVE_GITHUB_CREDENTIALS,
  credentials,
});
