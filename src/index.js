/* eslint-disable import/no-named-as-default */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import './css/index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <ScrollToTop>
        <Route path="*" component={Layout} />
      </ScrollToTop>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
