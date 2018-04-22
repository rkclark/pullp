import * as actions from './actions';
import { account as types } from '../../actionTypes';

describe('Login actions', () => {
  describe('toggleLogoutModal', () => {
    it('creates an action to toggle logout modal', () => {
      const expectedAction = {
        type: types.TOGGLE_LOGOUT_MODAL,
      };
      expect(actions.toggleLogoutModal()).toEqual(expectedAction);
    });
  });

  describe('clearPersistedLocalStorage', () => {
    it('creates an action to logout', () => {
      const expectedAction = {
        type: types.LOGOUT,
      };
      expect(actions.clearPersistedLocalStorage()).toEqual(expectedAction);
    });
  });

  // describe('logout', () => {
  //   it('clears all session cookies', () => {
  //     console.log('global is, ', global);
  //     expect(true).toBe(true);
  //   });
  // });
});
