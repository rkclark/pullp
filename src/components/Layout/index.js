import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  requestCurrentUser,
  requestPullRequests,
} from '../../routes/Home/actions';
import HomeContainer from '../../routes/Home';
import Login from '../../routes/Login';
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

    const icon =
      path === '/' && this.props.currentUser ? (
        <button className={this.props.theme.refresh} onClick={onClick}>
          <img
            className={this.props.theme.refreshIcon}
            src={refresh}
            alt="refresh icon"
          />
        </button>
      ) : null;
    return icon;
  }

  render() {
    const path = window.location.pathname;
    const theme = this.props.theme;
    const currentUser = this.loadCurrentUser();
    const refreshIcon = this.loadRefreshIcon(path);

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
              to="/login"
              className={`${theme.link} ${path === '/login'
                ? theme.activeLink
                : null}`}
            >
              <img src={account} alt="account icon" className={theme.icon} />
            </Link>
          </div>
          {currentUser}
        </div>
        {window.location.pathname.includes('index.html') && <Redirect to="/" />}
        <div className={theme.routeContainer}>
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/selectRepos" component={SelectRepos} />
        </div>
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
};

Layout.defaultProps = {
  theme: defaultTheme,
  currentUser: null,
  githubToken: null,
  selectedRepos: [],
};

const mapStateToProps = state => ({
  currentUser: state.home.currentUser,
  githubToken: state.login.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
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
