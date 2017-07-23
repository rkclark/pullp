import { counter as types } from '../../actionTypes';

export const initialState = 0;

export default function (state = initialState, action) {
  switch (action.type) {
    case types.INCREMENT:
      return state + 1;
    case types.DECREMENT:
      return state - 1;
    default:
      return state;
  }
}
