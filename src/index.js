/* eslint-disable import/no-named-as-default */

import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import HomeContainer from './routes/Home';
import Login from './routes/Login';
import SelectRepos from './routes/SelectRepos';
import './css/index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        {window.location.pathname.includes('index.html') && <Redirect to="/" />}
        <Route exact path="/" component={HomeContainer} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/selectRepos" component={SelectRepos} />
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/selectRepos">Select Repos</Link>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
