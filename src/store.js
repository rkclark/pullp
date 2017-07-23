import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import counter from './routes/Counter/reducer';

export default createStore(
    combineReducers({ counter }),
    applyMiddleware(
        thunkMiddleware,
    ),
);
