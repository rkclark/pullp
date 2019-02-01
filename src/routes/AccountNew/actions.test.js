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
    it('creates an action to clear persisted local storage', () => {
      const expectedAction = {
        type: types.CLEAR_PERSISTED_LOCAL_STORAGE,
      };
      expect(actions.clearPersistedLocalStorage()).toEqual(expectedAction);
    });
  });

  describe('logout', () => {
    const dispatch = jest.fn();
    it('clears all session cookies', async () => {
      const clearStorageFn = jest.fn();
      global.electron = {
        remote: {
          session: {
            defaultSession: {
              clearStorageData: clearStorageFn,
            },
          },
        },
      };
      await actions.logout()(dispatch);

      expect(clearStorageFn).toHaveBeenCalledWith({
        storages: 'cookies',
      });
    });

    it('dispatches cleraPersistedLocalStorage action', async () => {
      global.electron = {
        remote: {
          session: {
            defaultSession: {
              clearStorageData: () => {},
            },
          },
        },
      };
      await actions.logout()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        actions.clearPersistedLocalStorage(),
      );
    });
  });
});
