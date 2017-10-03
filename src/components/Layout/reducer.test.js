import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('Home reducer', () => {
  it('should return same state when no action matches', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  describe('Rehydration complete', () => {
    it('Sets rehydrationComplete to true', () => {
      const expectedState = {
        ...initialState,
        rehydrationComplete: true,
      };

      const newState = reducer(initialState, actions.rehydrationComplete());
      expect(newState).toEqual(expectedState);
    });
  });
});
