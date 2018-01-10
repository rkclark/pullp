import { account as types } from '../../actionTypes';

export const toggleLogoutModal = () => ({
  type: types.TOGGLE_LOGOUT_MODAL,
});

export const logout = () => ({
  type: types.LOGOUT,
});
