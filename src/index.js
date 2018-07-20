/* eslint-disable import/no-named-as-default, no-console */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';

import introspectionQueryResultData from './apollo/githubFragmentTypes.json';
import store from './store';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import './css/index.css';

// We need to inform Apollo about the Github API's possible grapql fragment types
// See https://www.apollographql.com/docs/react/advanced/fragments.html for more info
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionQueryResultData.data,
});

const cache = new InMemoryCache({ fragmentMatcher });

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
  cache,
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
