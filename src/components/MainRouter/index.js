import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';

import { GET_CURRENT_USER, GET_USER_TEAMS } from '../../apollo/queries';
import { USER_INFO_AND_TEAMS_REFRESH_TIME } from '../../constants';
import LoadingMessage from '../LoadingMessage';
import AccountContainer from '../../routes/Account';
import SelectReposContainer from '../../routes/SelectRepos';
import SetupContainer from '../../routes/Setup';
import HomeContainer from '../../routes/Home';
import Nav from '../Nav';
import style from './style.css';

export function MainRouter({ data, location }) {
  const loading = get(data, 'loading');

  return (
    <div className={style.mainRouterContainer}>
      <div className={style.navContainer}>
        <Nav
          currentPath={get(location, 'pathname')}
          currentUser={get(data, 'viewer')}
        />
      </div>
      <div className={style.routeContainer}>
        {loading ? (
          <LoadingMessage
            message={'Refreshing your user data from Github...'}
          />
        ) : (
          <Fragment>
            <Switch>
              <Route exact path="/app" component={HomeContainer} />
              <Route exact path="/app/account" component={AccountContainer} />
              <Route
                exact
                path="/app/selectRepos"
                component={SelectReposContainer}
              />
              <Route exact path="/app/setup" component={SetupContainer} />

              {/* If no paths match, fallback to homepage  */}
              <Redirect to={'/app'} />
            </Switch>
          </Fragment>
        )}
      </div>
    </div>
  );
}

MainRouter.propTypes = {
  data: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
};

export default compose(
  graphql(GET_CURRENT_USER, {
    options: () => ({
      pollInterval: USER_INFO_AND_TEAMS_REFRESH_TIME,
      fetchPolicy: 'cache-and-network',
    }),
  }),
  graphql(GET_USER_TEAMS, {
    options: props => ({
      variables: {
        login: get(props, 'data.viewer.login'),
      },
      pollInterval: USER_INFO_AND_TEAMS_REFRESH_TIME,
      fetchPolicy: 'cache-and-network',
    }),
    // combine the data objects from the two concurrent GraphQL queries
    props: ({ data, ownProps }) => ({
      data: { ...data, ...ownProps.data },
    }),
  }),
)(MainRouter);
