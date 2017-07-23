import * as actions from './actions';
import { counter as types } from '../../actionTypes';

describe('Counter actions', () => {
  describe('increment', () => {
    it('should create an action to increment the counter', () => {
      const expectedAction = {
        type: types.INCREMENT,
      };
      expect(actions.increment()).toEqual(expectedAction);
    });
  });

  describe('decrement', () => {
    it('should create an action to decrement the counter', () => {
      const expectedAction = {
        type: types.DECREMENT,
      };
      expect(actions.decrement()).toEqual(expectedAction);
    });
  });
});
