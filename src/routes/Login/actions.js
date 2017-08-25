import { login as types } from '../../actionTypes';
import localStore from '../../storage/localStore';

export const saveGithubCredentials = credentials => {
  localStore.insert(credentials);
  return {
    type: types.SAVE_GITHUB_CREDENTIALS,
    credentials,
  };
};
