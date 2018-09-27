import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { Route, Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import Error from '../Error';
import SetupNewContainer from '../../routes/SetupNew';
import style from './style.css';
import MainRouterContainer from '../MainRouter';

export const GET_GITHUB_TOKEN_FROM_CACHE = gql`
  query GithubToken {
    githubAuth @client {
      token
    }
  }
`;

export function Layout({ data, error, location }) {
  const renderContent = () => {
    if (error) {
      return (
        <Error message="Error starting up Pullp. If this continues then try opening the console and clearing local storage with 'window.localStorage.clear()'. You will then need to sign in again after closing and re-opening the app." />
      );
    }

    // If user is authed, render the main app router
    if (get(data, 'githubAuth.token')) {
      return <MainRouterContainer location={location} />;
    }

    // If user is not authed, run setup
    return (
      <Fragment>
        <Route exact path="/app/setup" component={SetupNewContainer} />
        {get(location, 'pathname') !== '/app/setup' && (
          <Redirect to="/app/setup" />
        )}
      </Fragment>
    );
  };

  return <div className={style.layout}>{renderContent()}</div>;
}

Layout.propTypes = {
  data: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({}),
  location: PropTypes.shape({}).isRequired,
};

Layout.defaultProps = {
  error: null,
};

export default function LayoutContainer(routerProps) {
  return (
    <Query query={GET_GITHUB_TOKEN_FROM_CACHE} fetchPolicy="cache-only">
      {props => <Layout {...props} {...routerProps} />}
    </Query>
  );
}
