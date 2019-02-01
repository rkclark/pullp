import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('login reducer', () => {
  it('should return same state when no action matches', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
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
  describe('clear persisted local storage', () => {
    it('returns to initial state', () => {
      const baseState = {
        test: true,
      };
      const expectedState = {
        ...initialState,
      };

      const newState = reducer(baseState, actions.clearPersistedLocalStorage());
      expect(newState).toEqual(expectedState);
    });
  });
});
