import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestPullRequests } from '../../routes/Home/actions';

import defaultTheme from './theme.css';
import CurrentUser from '../CurrentUser';
import Loading from '../Loading';

export class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
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
          <Loading loading={this.props.pullRequestsLoading} />
          <span
            className={`${theme.sync} ${this.props.pullRequestsLoading
              ? theme.syncActive
              : null}`}
          >
            Sync
          </span>
        </button>
      ) : null;
    return icon;
  }

  render() {
    const path = this.props.currentPath;
    const theme = this.props.theme;
    const currentUser = this.loadCurrentUser();
    const refreshIcon = this.loadRefreshIcon(path);

    return (
      <div className={theme.header}>
        <div className={theme.titleContainer}>
          <h1 className={theme.title}>PULLP</h1>
          {refreshIcon}
        </div>
        <div className={theme.links}>
          <div className={theme.linkContainer}>
            <Link
              to="/"
              className={`${theme.link} ${path === '/'
                ? theme.activeLink
                : null}`}
            >
              Monitor
            </Link>
          </div>
          <div className={theme.linkContainer}>
            <Link
              to="/selectRepos"
              className={`${theme.link} ${path === '/selectRepos'
                ? theme.activeLink
                : null}`}
            >
              Select
            </Link>
          </div>
          <div className={theme.linkContainer}>
            <Link
              to="/Account"
              className={`${theme.link} ${path === '/Account'
                ? theme.activeLink
                : null}`}
            >
              Account
            </Link>
          </div>
        </div>
        <div className={theme.currentUser}>{currentUser}</div>
      </div>
    );
  }
}

Nav.propTypes = {
  theme: PropTypes.shape(),
  currentUser: PropTypes.shape({
    login: PropTypes.string,
    avatarUrl: PropTypes.string,
    url: PropTypes.string,
  }),
  githubToken: PropTypes.string,
  selectedRepos: PropTypes.arrayOf(PropTypes.string),
  requestPullRequests: PropTypes.func.isRequired,
  pullRequestsLoading: PropTypes.bool,
  currentPath: PropTypes.string.isRequired,
};

Nav.defaultProps = {
  theme: defaultTheme,
  currentUser: null,
  githubToken: null,
  selectedRepos: [],
  pullRequestsLoading: false,
};

const mapStateToProps = state => ({
  currentUser: state.home.currentUser,
  githubToken: state.setup.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
  pullRequestsLoading: state.home.pullRequestsLoading,
});

const mapDispatchToProps = dispatch => ({
  requestPullRequests(token, repoIds) {
    dispatch(requestPullRequests(token, repoIds));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
