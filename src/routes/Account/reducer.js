import { account as types } from '../../actionTypes';

export const initialState = {
  logoutModalOpen: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOGOUT:
      return {
        ...initialState,
      };
    case types.TOGGLE_LOGOUT_MODAL:
      return {
        ...state,
        logoutModalOpen: !state.logoutModalOpen,
      };
    default:
      return state;
  }
}
