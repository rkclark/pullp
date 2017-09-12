import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('login reducer', () => {
  it('should return same state when no action matches', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  describe('Github credentials', () => {
    it('Saves github credentials', () => {
      const credentials = {
        githubClientId: 'test',
        githubClientSecret: 'test',
      };
      const expectedState = {
        ...initialState,
        ...credentials,
      };

      const newState = reducer(
        initialState,
        actions.saveGithubCredentials(credentials),
      );
      expect(newState).toEqual(expectedState);
    });
  });
  describe('Request Github token failure', () => {
    it('Saves github failure error', () => {
      const error = 'error';
      const expectedState = {
        ...initialState,
        loginError: error,
      };

      const newState = reducer(
        initialState,
        actions.requestGithubTokenFailure(error),
      );
      expect(newState).toEqual(expectedState);
    });
  });

  describe('Request Github token success', () => {
    it('Saves github token', () => {
      const token = 'token';
      const expectedState = {
        ...initialState,
        githubToken: token,
      };

      const newState = reducer(
        initialState,
        actions.requestGithubTokenSuccess(token),
      );
      expect(newState).toEqual(expectedState);
    });
  });
});
