import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import home from './routes/Home/reducer';
import login from './routes/Account/reducer';
import selectRepos from './routes/SelectRepos/reducer';
import layout from './components/Layout/reducer';
import { rehydrationComplete } from './components/Layout/actions';

const store = createStore(
  combineReducers({ home, login, selectRepos, layout }),
  undefined,
  composeWithDevTools(
    applyMiddleware(thunkMiddleware),
    autoRehydrate({ log: true }),
  ),
);

const dispatchRehydrationComplete = () => {
  store.dispatch(rehydrationComplete());
};

persistStore(
  store,
  { whitelist: ['login', 'home', 'selectRepos'] },
  dispatchRehydrationComplete,
);

export default store;
