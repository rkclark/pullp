import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('Counter reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('increment', () => {
    it('should increment the counter', () => {
      const state = 0;
      expect(reducer(state, actions.increment())).toEqual(1);
    });
  });

  describe('decrement', () => {
    it('should decrement the counter', () => {
      const state = 0;
      expect(reducer(state, actions.decrement())).toEqual(-1);
    });
  });
});
