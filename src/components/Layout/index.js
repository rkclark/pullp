import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Route, Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';

import { GET_GITHUB_AUTH_STATE_FROM_CACHE } from '../../apollo/queries';
import Error from '../Error';
import SetupContainer from '../../routes/Setup';
import SetupViaBrowser from '../../routes/SetupBrowser';
import style from './style.css';
import MainRouterContainer from '../MainRouter';

export function Layout({ data, error, location, client }) {
  const renderContent = () => {
    if (error) {
      return (
        <Error message="Error starting up Pullp. If this continues then try opening the console and clearing local storage with 'window.localStorage.clear()'. You will then need to sign in again after closing and re-opening the app." />
      );
    }

    // If user is authed, render the main app router
    const token = get(data, 'githubAuth.token');
    if (token) {
      console.log('data', data);
      return <MainRouterContainer location={location} />;
    }

    SetupViaBrowser({ data, client });

    // If user is not authed, run setup
    return (
      <Fragment>
        <Route exact path="/app/setup" component={SetupContainer} />
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
  client: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({}),
  location: PropTypes.shape({}).isRequired,
};

Layout.defaultProps = {
  error: null,
};

export default function LayoutContainer(routerProps) {
  return (
    <Query query={GET_GITHUB_AUTH_STATE_FROM_CACHE} fetchPolicy="cache-only">
      {props => <Layout {...props} {...routerProps} />}
    </Query>
  );
}
