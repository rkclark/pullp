import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Repo from './components/Repo';
import CurrentUser from './components/CurrentUser';
import * as actions from './actions';
import { saveRedirect } from '../Login/actions';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentWillMount() {
    if (this.props.redirectPath === '/') {
      this.props.saveRedirect(null);
    }
    if (!this.props.currentUser && this.props.githubToken) {
      this.props.requestCurrentUser(this.props.githubToken);
    }
  }

  loadRepos() {
    const filtered = this.props.apiContent.filter(
      elem => elem.pullRequests.nodes.length,
    );
    return filtered.map(({ name, pullRequests }) =>
      <Repo
        name={name}
        key={`${name}_${Math.random()}`}
        pullRequests={pullRequests.nodes}
      />,
    );
  }

  loadCurrentUser() {
    const currentUser = this.props.currentUser;
    if (currentUser) {
      return (
        <CurrentUser
          login={currentUser.login}
          avatarUrl={currentUser.avatarUrl}
        />
      );
    }
    return null;
  }

  render() {
    const repos = this.loadRepos();
    const currentUser = this.loadCurrentUser();
    return (
      <div>
        <h1>PULLP</h1>
        {currentUser}
        <button onClick={this.props.requestApiContent}>
          GET ME SOME STUFF
        </button>
        <div>
          {this.props.apiError}
          <br />
          {repos}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  apiContent: PropTypes.array, //eslint-disable-line
  apiError: PropTypes.string,
  requestApiContent: PropTypes.func.isRequired,
  redirectPath: PropTypes.string,
  saveRedirect: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    login: PropTypes.string,
    avatarUrl: PropTypes.string,
    url: PropTypes.string,
  }),
  requestCurrentUser: PropTypes.func.isRequired,
  githubToken: PropTypes.string,
};

Home.defaultProps = {
  apiContent: [],
  apiError: null,
  redirectPath: null,
  currentUser: null,
  githubToken: null,
};

const mapStateToProps = state => ({
  apiContent: state.home.apiContent,
  apiError: state.home.apiError,
  redirectPath: state.login.redirectPath,
  currentUser: state.home.currentUser,
  githubToken: state.login.githubToken,
});

const mapDispatchToProps = dispatch => ({
  requestApiContent() {
    dispatch(actions.requestApiContent());
  },
  saveRedirect() {
    dispatch(saveRedirect());
  },
  requestCurrentUser(token) {
    dispatch(actions.requestCurrentUser(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
