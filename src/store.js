/* eslint-disable no-param-reassign */
import { combineReducers, createStore, applyMiddleware } from 'redux';
// import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import home from './routes/Home/reducer';
import account from './routes/Account/reducer';
import selectRepos from './routes/SelectRepos/reducer';
import layout from './components/Layout/reducer';
import setup from './routes/Setup/reducer';
// import { rehydrationComplete } from './components/Layout/actions';

const appReducer = combineReducers({
  home,
  account,
  selectRepos,
  layout,
  setup,
});

const store = createStore(
  appReducer,
  undefined,
  composeWithDevTools(
    applyMiddleware(thunkMiddleware),
    // autoRehydrate({ log: true }),
  ),
);

// const dispatchRehydrationComplete = () => {
//   store.dispatch(rehydrationComplete());
// };

// persistStore(
//   store,
//   { whitelist: ['login', 'home', 'selectRepos', 'setup'] },
//   dispatchRehydrationComplete,
// );

export default store;
