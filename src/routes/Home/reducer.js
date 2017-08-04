import { home as types } from '../../actionTypes';

const initialState = {
  apiContent: {},
  apiError: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_API_CONTENT_SUCCESS:
      return {
        ...state,
        apiContent: action.results,
        apiError: null,
      };
    case types.REQUEST_API_CONTENT_FAIL:
      return {
        ...state,
        apiContent: {},
        apiError: action.error,
      };
    default:
      return state;
  }
}
