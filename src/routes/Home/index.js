import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
import _ from 'lodash';

import Repo from './components/Repo';
import * as actions from './actions';
import theme from './theme.css';
import Error from '../../components/Error';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.updateInterval = null;
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
    let sortedRepos = [];

    // if (this.props.repositories.length > 0) {
    //   sortedRepos = _.reverse(
    //     _.sortBy(this.props.repositories, ['pullRequests', 'name']),
    //   );
    // }

    if (this.props.repositories.length > 0) {
      sortedRepos = _.orderBy(
        this.props.repositories,
        [repo => repo.pullRequests.length, repo => repo.name],
        ['desc', 'asc'],
      );
    }

    return (
      <div>
        {this.props.githubPullRequestsError ? (
          <Error
            title="Error getting latest pull requests data from Github"
            message={this.props.githubPullRequestsError}
          />
        ) : null}

        <div className={theme.reposContainer}>
          <FlipMove typeName={null} duration={500} appearAnimation={'fade'}>
            {sortedRepos.map(repo => (
              <Repo
                key={repo.id}
                data={repo}
                openRepoId={this.props.openRepoId}
                toggleOpenRepo={this.props.toggleOpenRepo}
              />
            ))}
          </FlipMove>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
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
  githubPullRequestsError: PropTypes.string,
};

Home.defaultProps = {
  githubPullRequestsError: null,
  redirectPath: null,
  currentUser: null,
  githubToken: null,
  selectedRepos: [],
  repositories: [],
  openRepoId: null,
};

const mapStateToProps = state => ({
  currentUser: state.home.currentUser,
  githubToken: state.setup.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
  repositories: state.home.repositories,
  openRepoId: state.home.openRepoId,
  githubPullRequestsError: state.home.githubPullRequestsError,
});

const mapDispatchToProps = dispatch => ({
  requestPullRequests(token, repoIds) {
    dispatch(actions.requestPullRequests(token, repoIds));
  },
  toggleOpenRepo(repoId) {
    dispatch(actions.toggleOpenRepo(repoId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
