import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import counter from './routes/Counter/reducer';
import home from './routes/Home/reducer';
import login from './routes/Login/reducer';

export default createStore(
  combineReducers({ counter, home, login }),
  applyMiddleware(thunkMiddleware),
);
