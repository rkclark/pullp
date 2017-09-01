import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import counter from './routes/Counter/reducer';
import home from './routes/Home/reducer';
import login from './routes/Login/reducer';

const store = createStore(
  combineReducers({ counter, home, login }),
  undefined,
  compose(applyMiddleware(thunkMiddleware), autoRehydrate()),
);

persistStore(store);

export default store;
