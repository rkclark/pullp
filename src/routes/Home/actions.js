import { home as types } from '../../actionTypes';
import { get, queries } from '../../apis/githubApi';

export const requestApiContentSuccess = results => ({
  type: types.REQUEST_API_CONTENT_SUCCESS,
  results,
});

export const requestApiContentFail = error => ({
  type: types.REQUEST_API_CONTENT_FAIL,
  error,
});

export const requestApiContent = () => async dispatch => {
  try {
    const results = await get();
    dispatch(requestApiContentSuccess(results));
  } catch (err) {
    dispatch(requestApiContentFail(err.message));
  }
};

export const requestCurrentUserSuccess = results => ({
  type: types.REQUEST_CURRENT_USER_SUCCESS,
  results,
});

export const requestCurrentUserFail = error => ({
  type: types.REQUEST_CURRENT_USER_FAIL,
  error,
});

export const requestCurrentUser = token => async dispatch => {
  try {
    const query = queries.currentUser();
    const results = await get(query, token);
    dispatch(requestCurrentUserSuccess(results));
  } catch (err) {
    console.log(err);
    dispatch(requestCurrentUserFail(err.message));
  }
};
