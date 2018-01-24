import { layout as types, home as homeTypes } from '../../actionTypes';

export const initialState = {
  rehydrationComplete: false,
  userTeamsRequestComplete: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REHYDRATION_COMPLETE:
      return {
        ...state,
        rehydrationComplete: true,
      };
    case homeTypes.REQUEST_USER_TEAMS_SUCCESS:
      return {
        ...state,
        userTeamsRequestComplete: true,
      };
    case homeTypes.REQUEST_USER_TEAMS_FAIL:
      return {
        ...state,
        userTeamsRequestComplete: true,
      };
    default:
      return state;
  }
}
