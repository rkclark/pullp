import { account as types } from '../../actionTypes';

export const toggleLogoutModal = () => ({
  type: types.TOGGLE_LOGOUT_MODAL,
});

export const clearPersistedLocalStorage = () => ({
  type: types.CLEAR_PERSISTED_LOCAL_STORAGE,
});

export const logout = () => async dispatch => {
  const electron = window.electron;
  // Delete cookies which have been placed there by Github's login page
  await electron.remote.session.defaultSession.clearStorageData({
    storages: 'cookies',
  });

  dispatch(clearPersistedLocalStorage());
};
