/* eslint-disable import/no-named-as-default */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import './css/index.css';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GITHUB_API_URL,
  request: operation => {
    console.log(operation);
    console.log(operation.getContext());
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router>
        <ScrollToTop>
          <Route path="*" component={Layout} />
        </ScrollToTop>
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
);
