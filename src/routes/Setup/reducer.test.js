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
  describe('Save redirect', () => {
    it('Saves the redirect path', () => {
      const path = 'path';
      const expectedState = {
        ...initialState,
        redirectPath: path,
      };

      const newState = reducer(initialState, actions.saveRedirect(path));
      expect(newState).toEqual(expectedState);
    });
  });
  describe('Toggle logout modal', () => {
    it('Toggles logout modal boolean from false to true', () => {
      const baseState = {
        ...initialState,
        logoutModalOpen: false,
      };
      const expectedState = {
        ...initialState,
        logoutModalOpen: true,
      };

      const newState = reducer(baseState, actions.toggleLogoutModal());
      expect(newState).toEqual(expectedState);
    });
    it('Toggles logout modal boolean from true to false', () => {
      const baseState = {
        ...initialState,
        logoutModalOpen: true,
      };
      const expectedState = {
        ...initialState,
        logoutModalOpen: false,
      };

      const newState = reducer(baseState, actions.toggleLogoutModal());
      expect(newState).toEqual(expectedState);
    });
  });
  describe('logout', () => {
    it('returns to initial state', () => {
      const baseState = {
        test: true,
      };
      const expectedState = {
        ...initialState,
      };

      const newState = reducer(baseState, actions.logout());
      expect(newState).toEqual(expectedState);
    });
  });
});
