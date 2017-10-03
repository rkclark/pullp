import { layout as types } from '../../actionTypes';

export const initialState = {
  rehydrationComplete: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REHYDRATION_COMPLETE:
      return {
        ...state,
        rehydrationComplete: true,
      };
    default:
      return state;
  }
}
