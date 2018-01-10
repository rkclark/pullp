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

  describe('logout', () => {
    it('creates an action to logout', () => {
      const expectedAction = {
        type: types.LOGOUT,
      };
      expect(actions.logout()).toEqual(expectedAction);
    });
  });
});
