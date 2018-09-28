import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';

import { GET_CURRENT_USER, GET_USER_TEAMS } from '../../apollo/queries';
import { USER_INFO_AND_TEAMS_REFRESH_TIME } from '../../constants';
import LoadingMessage from '../LoadingMessage';
import HomeContainer from '../../routes/Home';
import Account from '../../routes/Account';
import SelectRepos from '../../routes/SelectRepos'; //eslint-disable-line
import SetupNewContainer from '../../routes/SetupNew';
import NavContainer from '../Nav';
import style from './style.css';

export function MainRouter({ data, location }) {
  return (
    <div className={style.mainRouterContainer}>
      <div className={style.navContainer}>
        <NavContainer currentPath={get(location, 'pathname')} />
      </div>
      <div className={style.routeContainer}>
        <Route exact path="/app" component={HomeContainer} />
        <Route exact path="/app/account" component={Account} />
        <Route exact path="/app/selectRepos" component={SelectRepos} />
        <Route exact path="/app/setup" component={SetupNewContainer} />

        {get(data, 'loading') && (
          <LoadingMessage
            message={'Refreshing your user and teams data from Github...'}
          />
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
  }),
)(MainRouter);
