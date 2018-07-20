/* eslint-disable import/no-named-as-default, no-console */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import './css/index.css';

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: process.env.REACT_APP_GITHUB_API_URL,
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache(),
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
