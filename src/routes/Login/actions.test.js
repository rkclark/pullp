import * as actions from './actions';
import { login as types } from '../../actionTypes';
import localStore from '../../storage/localStore';
import sinon from 'sinon';

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
    it('saves github credentials to localStorage', () => {
      const credentials = { id: 'test', secret: 'test' };
      const storeStub = sinon.stub(localStore, "insert");
      actions.saveGithubCredentials(credentials);
      expect(storeStub.calledWith(credentials)).toBe(true);
    });
  });
});
