/* eslint-disable import/no-named-as-default, no-console */

import React from 'react';
import { get } from 'lodash';
import gql from 'graphql-tag';
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
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { CachePersistor } from 'apollo-cache-persist';
import LoadingMessage from '../LoadingMessage';

import introspectionQueryResultData from '../../apollo/githubFragmentTypes.json';
import LayoutContainer from '../Layout';
import ScrollToTop from '../ScrollToTop';
import '../../css/index.css';
import style from './style.css';
import { SCHEMA_VERSION, SCHEMA_VERSION_KEY } from '../../constants';

export default class App extends React.Component {
  state = {
    client: null,
    loaded: false,
  };

  async componentDidMount() {
    // We need to inform Apollo about the Github API's possible grapql fragment types
    // See https://www.apollographql.com/docs/react/advanced/fragments.html for more info
    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData: introspectionQueryResultData.data,
    });

    const apolloCache = new InMemoryCache({ fragmentMatcher });

    const stateLink = withClientState({
      cache: apolloCache,
      resolvers: {
        Mutation: {
          toggleSelectedRepo: (_, variables, { cache, getCacheKey }) => {
            const id = getCacheKey({
              __typename: 'Repository',
              id: variables.id,
            });

            const fragment = gql(`
            fragment selectedRepo on Repository {
              isSelected
            }`);

            const repo = cache.readFragment({ fragment, id });
            const data = { ...repo, isSelected: !repo.isSelected };

            cache.writeData({ id, data });

            return null;
          },
          clearSelectedRepos: (_, variables, { cache }) => {
            // Get entire data store object from cache
            const cacheData = get(cache, 'data.data');

            if (!cacheData) {
              return null;
            }

            // Filter cache data to only Repository items
            const repos = Object.entries(cacheData).filter(({ 0: id }) =>
              id.startsWith('Repository:'),
            );

            // Filter Repositories to only those that are selected
            const selectedRepos = repos.filter(
              ({ 1: value }) => value.isSelected,
            );

            const fragment = gql(`
            fragment selectedRepo on Repository {
              isSelected
            }`);

            // Iterate through selected repos and set their isSelected flag to false
            selectedRepos.forEach(({ 0: id }) => {
              const repoFragment = cache.readFragment({
                fragment,
                id,
              });

              const data = {
                ...repoFragment,
                isSelected: false,
              };

              cache.writeData({ id, data });
            });

            return null;
          },
        },
        Repository: {
          isSelected: (_, variables, { cache, getCacheKey }) => {
            // Look for existing repo with this id in the cache
            const id = getCacheKey({
              __typename: 'Repository',
              id: _.id,
            });

            // This repo isn't in the cache, so isSelected must be false
            if (!id) {
              return false;
            }

            const fragment = gql(`
            fragment selectedRepo on Repository {
              isSelected
            }`);

            const repo = cache.readFragment({ fragment, id });

            // Repo is selected in the cache, so set isSelected to true
            if (repo && repo.isSelected) {
              return true;
            }

            // Repo is not selected in the cache, so set isSelected to false
            return false;
          },
        },
      },
      defaults: {
        githubAuth: {
          __typename: 'GithubAuth',
          token: null,
          loadingToken: false,
          error: null,
        },
      },
    });

    const authLink = setContext((_, previousContext) => {
      // get the authentication token from the cache
      const token = get(
        previousContext,
        'cache.data.data["$ROOT_QUERY.githubAuth"].token',
      );

      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...previousContext.headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

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
        stateLink,
        authLink,
        new HttpLink({
          uri: process.env.REACT_APP_GITHUB_API_URL,
          credentials: 'same-origin',
        }),
      ]),
      cache: apolloCache,
    });

    try {
      const persistor = new CachePersistor({
        cache: apolloCache,
        storage: window.localStorage,
        debug: true,
      });

      const currentVersion = await window.localStorage.getItem(
        SCHEMA_VERSION_KEY,
      );

      if (currentVersion.toString() === SCHEMA_VERSION.toString()) {
        // If the current version matches the latest version,
        // we're good to go and can restore the cache.
        await persistor.restore();
      } else {
        // Otherwise, we'll want to purge the outdated persisted cache
        // and mark ourselves as having updated to the latest version.
        await persistor.purge();
        await window.localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
      }
    } catch (error) {
      console.error('Error setting up Apollo persistence', error);
    }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      client,
      loaded: true,
    });
  }

  render() {
    const { client, loaded } = this.state;

    if (!loaded) {
      return (
        <div className={style.loadingContainer}>
          <LoadingMessage message="Starting up Pullp" />
        </div>
      );
    }

    return (
      <ApolloProvider client={client}>
        <Router>
          <ScrollToTop>
            <Route path="*" component={LayoutContainer} />
          </ScrollToTop>
        </Router>
      </ApolloProvider>
    );
  }
}
