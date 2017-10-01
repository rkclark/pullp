/* eslint-disable import/no-named-as-default */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './components/Layout';
import './css/index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Layout />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
