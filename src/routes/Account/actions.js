import { account as types } from '../../actionTypes';

const electron = window.electron;

export const toggleLogoutModal = () => ({
  type: types.TOGGLE_LOGOUT_MODAL,
});

export const clearPersistedLocalStorage = () => ({
  type: types.LOGOUT,
});

export const logout = () => async dispatch => {
  // Delete cookies which have been placed there by Github's login page
  await electron.remote.session.defaultSession.clearStorageData({
    storages: 'cookies',
  });

  dispatch(clearPersistedLocalStorage());
};
