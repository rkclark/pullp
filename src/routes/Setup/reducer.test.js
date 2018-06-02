import * as actions from './actions';
import reducer, { initialState } from './reducer';
import { clearPersistedLocalStorage } from '../Account/actions';

describe('setup reducer', () => {
  it('should return same state when no action matches', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  describe('Request Github token failure', () => {
    it('Saves github failure error', () => {
      const error = 'error';
      const baseState = {
        ...initialState,
        loadingGithubToken: true,
      };
      const expectedState = {
        ...baseState,
        loginError: error,
        loadingGithubToken: false,
      };

      const newState = reducer(
        baseState,
        actions.requestGithubTokenFailure(error),
      );
      expect(newState).toEqual(expectedState);
    });
  });

  describe('Request Github token success', () => {
    it('Saves github token', () => {
      const token = 'token';
      const baseState = {
        ...initialState,
        loginError: 'test',
        loadingGithubToken: true,
      };

      const expectedState = {
        ...baseState,
        githubToken: token,
        loginError: null,
        loadingGithubToken: false,
      };

      const newState = reducer(
        baseState,
        actions.requestGithubTokenSuccess(token),
      );
      expect(newState).toEqual(expectedState);
    });
  });

  describe('clear persisted local storage', () => {
    it('returns to initial state', () => {
      const baseState = {
        test: true,
      };
      const expectedState = {
        ...initialState,
      };

      const newState = reducer(baseState, clearPersistedLocalStorage());
      expect(newState).toEqual(expectedState);
    });
  });

  describe('Request Github token loading', () => {
    it('Sets loading status to true', () => {
      const baseState = {
        ...initialState,
        loginError: 'test',
        loadingGithubToken: false,
      };
      const expectedState = {
        ...baseState,
        loadingGithubToken: true,
        loginError: null,
      };

      const newState = reducer(baseState, actions.requestGithubTokenLoading());
      expect(newState).toEqual(expectedState);
    });
  });
});
