/* eslint-disable import/no-named-as-default, no-console */

import React from 'react';
import { get } from 'lodash';
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
import resolvers from '../../apollo/resolvers';

import introspectionQueryResultData from '../../apollo/githubFragmentTypes.json';
import LayoutContainer from '../Layout';
import ScrollToTop from '../ScrollToTop';
import '../../css/index.css';
import style from './style.css';
import {
  SCHEMA_VERSION,
  SCHEMA_VERSION_KEY,
  notificationTypes,
} from '../../constants';
import cleanCacheOnInterval from '../../apollo/cacheCleaner';

const {
  REVIEW_REQUESTED,
  REVIEW_ON_YOUR_PR,
  PR_STATE_CHANGE,
  NEW_COMMENTS,
  NEW_COMMENTS_ON_YOUR_PR,
} = notificationTypes;

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
      resolvers,
      defaults: {
        githubAuth: {
          __typename: 'GithubAuth',
          token: null,
          loadingToken: false,
          error: null,
        },
        userSettings: {
          __typename: 'UserSettings',
          notifications: {
            __typename: 'NotificationSettings',
            [REVIEW_REQUESTED]: {
              __typename: 'NotificationSetting',
              trigger: true,
              showOnTimeline: true,
            },
            [REVIEW_ON_YOUR_PR]: {
              __typename: 'NotificationSetting',
              trigger: true,
              showOnTimeline: true,
            },
            [PR_STATE_CHANGE]: {
              __typename: 'NotificationSetting',
              trigger: true,
              showOnTimeline: true,
            },
            [NEW_COMMENTS]: {
              __typename: 'NotificationSetting',
              trigger: false,
              showOnTimeline: true,
            },
            [NEW_COMMENTS_ON_YOUR_PR]: {
              __typename: 'NotificationSetting',
              trigger: true,
              showOnTimeline: true,
            },
          },
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
        maxSize: 2097152, // 2mb
      });

      const currentVersion = await window.localStorage.getItem(
        SCHEMA_VERSION_KEY,
      );

      if (
        currentVersion &&
        currentVersion.toString() === SCHEMA_VERSION.toString()
      ) {
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

    cleanCacheOnInterval(client);

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
