/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestUserTeams } from '../../routes/Home/actions';
import HomeContainer from '../../routes/Home';
import Account from '../../routes/Account';
import SelectRepos from '../../routes/SelectRepos'; //eslint-disable-line
import Setup from '../../routes/Setup';
import SetupNew from '../../routes/SetupNew';
import defaultTheme from './theme.css';
import NavContainer from '../Nav';

export class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidUpdate() {
    if (
      !this.props.userTeamsRequestComplete &&
      this.props.rehydrationComplete &&
      this.props.currentUser
    ) {
      this.props.requestUserTeams(this.props.githubToken);
    }
  }

  render() {
    const theme = this.props.theme;

    return (
      <div className={theme.layout}>
        {/* {this.props.rehydrationComplete ? (
          <div>
            <NavContainer currentPath={this.props.location.pathname} />
            <div className={this.props.theme.routeContainer}>
              <Route exact path="/app" component={HomeContainer} />
              <Route exact path="/app/account" component={Account} />
              <Route exact path="/app/selectRepos" component={SelectRepos} />
              <Route exact path="/app/setup" component={Setup} />
            </div>
          </div>
        ) : null}
        {window.location.pathname.includes('index.html') && (
          <Redirect to="/app" />
        )}
        {this.props.rehydrationComplete &&
          !this.props.currentUser &&
          window.location.pathname !== '/app/setup' && (
            <Redirect to="/app/setup" />
          )} */}


            <Route exact path="/app/setup" component={SetupNew} />
            {window.location.pathname !== '/app/setup' && (
              <Redirect to="/app/setup" />
            )}
      </div>
    );
  }
}

Layout.propTypes = {
  theme: PropTypes.shape(),
  currentUser: PropTypes.shape({
    login: PropTypes.string,
    avatarUrl: PropTypes.string,
    url: PropTypes.string,
  }),
  githubToken: PropTypes.string,
  rehydrationComplete: PropTypes.bool,
  userTeamsRequestComplete: PropTypes.bool,
  requestUserTeams: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
};

Layout.defaultProps = {
  theme: defaultTheme,
  currentUser: null,
  githubToken: null,
  rehydrationComplete: false,
  userTeamsRequestComplete: false,
};

const mapStateToProps = state => ({
  currentUser: state.home.currentUser,
  githubToken: state.setup.githubToken,
  rehydrationComplete: state.layout.rehydrationComplete,
  userTeamsRequestComplete: state.layout.userTeamsRequestComplete,
});

const mapDispatchToProps = dispatch => ({
  requestUserTeams(token) {
    dispatch(requestUserTeams(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
