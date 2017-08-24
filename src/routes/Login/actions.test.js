import * as actions from './actions';
import { login as types } from '../../actionTypes';

describe('Login actions', () => {
  describe('saveGithubCredentials', () => {
    it('creates an action to save github credentials', () => {
      const credentials = { id: 'test', secret: 'test' };
      const expectedAction = {
        type: types.SAVE_GITHUB_CREDENTIALS,
        credentials,
      };
      expect(actions.saveGithubCredentials(credentials)).toEqual(
        expectedAction,
      );
    });
  });
});
