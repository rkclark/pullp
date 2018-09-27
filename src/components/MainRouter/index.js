import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import gql from 'graphql-tag';
import LoadingMessage from '../LoadingMessage';
import HomeContainer from '../../routes/Home';
import Account from '../../routes/Account';
import SelectRepos from '../../routes/SelectRepos'; //eslint-disable-line
import SetupNewContainer from '../../routes/SetupNew';

import NavContainer from '../Nav';
import style from './style.css';

export function MainRouter({ data }) {
  return (
    <div>
      <NavContainer currentPath={get(location, 'pathname')} />
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
};

MainRouter.defaultProps = {
  error: null,
};

const GET_CURRENT_USER = gql(`
query CurrentUser {
	viewer {
    login
    avatarUrl
  }
}
`);

const GET_USER_TEAMS = gql(`query UserTeams($login: String!)  {
  viewer {
    organizations(last:100) {
      edges {
        node {
          teams(last:100, userLogins: [$login]) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
}`);

export default compose(
  graphql(GET_CURRENT_USER, {
    options: props => {
      console.log('GET_CURRENT_USER received props', props);
      return {
        pollInterval: 60000,
        fetchPolicy: 'cache-and-network',
      };
    },
  }),
  graphql(GET_USER_TEAMS, {
    options: props => {
      console.log('GET_USER_TEAMS received props', props);
      return {
        variables: {
          login: get(props, 'data.viewer.login'),
        },
        pollInterval: 60000,
        fetchPolicy: 'cache-and-network',
      };
    },
  }),
)(MainRouter);
