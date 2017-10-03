import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Repo from './components/Repo';
import * as actions from './actions';
import { saveRedirect } from '../Login/actions';
import theme from './theme.css';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.updateInterval = null;
  }

  componentWillMount() {
    if (this.props.redirectPath === '/') {
      this.props.saveRedirect(null);
    }
  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.props.requestPullRequests(
        this.props.githubToken,
        this.props.selectedRepos,
      );
      this.updateInterval = window.setInterval(() => {
        this.props.requestPullRequests(
          this.props.githubToken,
          this.props.selectedRepos,
        );
      }, 60000);
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.updateInterval);
  }

  render() {
    return (
      <div>
        <div className={theme.reposContainer}>
          {this.props.repositories.map(repo => (
            <Repo
              data={repo}
              key={repo.id}
              openRepoId={this.props.openRepoId}
              toggleOpenRepo={this.props.toggleOpenRepo}
            />
          ))}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  redirectPath: PropTypes.string,
  saveRedirect: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    login: PropTypes.string,
    avatarUrl: PropTypes.string,
    url: PropTypes.string,
  }),
  githubToken: PropTypes.string,
  requestPullRequests: PropTypes.func.isRequired,
  selectedRepos: PropTypes.arrayOf(PropTypes.string),
  repositories: PropTypes.arrayOf(PropTypes.shape()),
  openRepoId: PropTypes.string,
  toggleOpenRepo: PropTypes.func.isRequired,
};

Home.defaultProps = {
  redirectPath: null,
  currentUser: null,
  githubToken: null,
  selectedRepos: [],
  repositories: [],
  openRepoId: null,
};

const mapStateToProps = state => ({
  redirectPath: state.login.redirectPath,
  currentUser: state.home.currentUser,
  githubToken: state.login.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
  repositories: state.home.repositories,
  openRepoId: state.home.openRepoId,
});

const mapDispatchToProps = dispatch => ({
  saveRedirect() {
    dispatch(saveRedirect());
  },
  requestPullRequests(token, repoIds) {
    dispatch(actions.requestPullRequests(token, repoIds));
  },
  toggleOpenRepo(repoId) {
    dispatch(actions.toggleOpenRepo(repoId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
