import { layout as types } from '../../actionTypes';
import * as actions from './actions';

describe('rehydrationComplete', () => {
  it('creates an action to report rehydration is complete', () => {
    const expectedAction = {
      type: types.REHYDRATION_COMPLETE,
    };
    expect(actions.rehydrationComplete()).toEqual(expectedAction);
  });
});
