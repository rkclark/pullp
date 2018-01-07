import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  requestCurrentUser,
  requestPullRequests,
} from '../../routes/Home/actions';
import HomeContainer from '../../routes/Home';
import Account from '../../routes/Account';
import SelectRepos from '../../routes/SelectRepos'; //eslint-disable-line
import defaultTheme from './theme.css';
import CurrentUser from '../CurrentUser';
import eye from '../../images/eye-white.svg';
import pin from '../../images/pin-white.svg';
import account from '../../images/account-white.svg';
import refresh from '../../images/refresh-white.svg';

export class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentWillMount() {
    if (!this.props.currentUser && this.props.githubToken) {
      this.props.requestCurrentUser(this.props.githubToken);
    }
  }

  componentWillUpdate() {
    if (!this.props.currentUser && this.props.githubToken) {
      this.props.requestCurrentUser(this.props.githubToken);
    }
  }

  loadCurrentUser() {
    const currentUser = this.props.currentUser;
    if (currentUser) {
      return (
        <CurrentUser
          login={currentUser.login}
          avatarUrl={currentUser.avatarUrl}
          url={currentUser.url}
        />
      );
    }
    return null;
  }

  loadRefreshIcon(path) {
    const onClick = () => {
      this.props.requestPullRequests(
        this.props.githubToken,
        this.props.selectedRepos,
      );
    };
    const theme = this.props.theme;
    const icon =
      path === '/' && this.props.currentUser ? (
        <button className={theme.refresh} onClick={onClick}>
          <img
            className={`${theme.refreshIcon} ${this.props.pullRequestsLoading
              ? theme.refreshLoading
              : null}`}
            src={refresh}
            alt="refresh icon"
          />
        </button>
      ) : null;
    return icon;
  }

  loadRouteContainer() {
    if (this.props.rehydrationComplete) {
      return (
        <div className={this.props.theme.routeContainer}>
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/Account" component={Account} />
          <Route exact path="/selectRepos" component={SelectRepos} />
        </div>
      );
    }

    return <p>Loading...</p>;
  }

  render() {
    const path = window.location.pathname;
    const theme = this.props.theme;
    const currentUser = this.loadCurrentUser();
    const refreshIcon = this.loadRefreshIcon(path);
    const routeContainerContent = this.loadRouteContainer();

    return (
      <div className={theme.layout}>
        <div className={theme.header}>
          <div>
            <h1 className={theme.title}>PULLP</h1>
            {refreshIcon}
          </div>
          <div className={theme.linkContainer}>
            <Link
              to="/"
              className={`${theme.link} ${path === '/'
                ? theme.activeLink
                : null}`}
            >
              <img src={eye} alt="eye icon" className={theme.icon} />
            </Link>
          </div>
          <div className={theme.linkContainer}>
            <Link
              to="/selectRepos"
              className={`${theme.link} ${path === '/selectRepos'
                ? theme.activeLink
                : null}`}
            >
              <img src={pin} alt="pin icon" className={theme.icon} />
            </Link>
          </div>
          <div className={theme.linkContainer}>
            <Link
              to="/Account"
              className={`${theme.link} ${path === '/Account'
                ? theme.activeLink
                : null}`}
            >
              <img src={account} alt="account icon" className={theme.icon} />
            </Link>
          </div>
          {currentUser}
        </div>
        {window.location.pathname.includes('index.html') && <Redirect to="/" />}
        <div>{routeContainerContent}</div>
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
  requestCurrentUser: PropTypes.func.isRequired,
  githubToken: PropTypes.string,
  selectedRepos: PropTypes.arrayOf(PropTypes.string),
  requestPullRequests: PropTypes.func.isRequired,
  pullRequestsLoading: PropTypes.bool,
  rehydrationComplete: PropTypes.bool,
};

Layout.defaultProps = {
  theme: defaultTheme,
  currentUser: null,
  githubToken: null,
  selectedRepos: [],
  pullRequestsLoading: false,
  rehydrationComplete: false,
};

const mapStateToProps = state => ({
  currentUser: state.home.currentUser,
  githubToken: state.login.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
  pullRequestsLoading: state.home.pullRequestsLoading,
  rehydrationComplete: state.layout.rehydrationComplete,
});

const mapDispatchToProps = dispatch => ({
  requestCurrentUser(token) {
    dispatch(requestCurrentUser(token));
  },
  requestPullRequests(token, repoIds) {
    dispatch(requestPullRequests(token, repoIds));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
