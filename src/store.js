import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import home from './routes/Home/reducer';
import login from './routes/Login/reducer';

const store = createStore(
  combineReducers({ home, login }),
  undefined,
  composeWithDevTools(
    applyMiddleware(thunkMiddleware),
    autoRehydrate({ log: true }),
  ),
);

persistStore(store, { whitelist: ['login', 'home'] });

export default store;
