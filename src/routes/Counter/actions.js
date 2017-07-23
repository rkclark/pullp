import { counter as types } from '../../actionTypes';

export const increment = () => ({
  type: types.INCREMENT,
});

export const decrement = () => ({
  type: types.DECREMENT,
});
