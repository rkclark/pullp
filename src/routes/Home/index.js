import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import FlipMove from 'react-flip-move';
import ErrorBoundary from '../../components/ErrorBoundary';

import LoadingMessage from '../../components/LoadingMessage';
import Repo from './components/Repo';
import theme from './theme.css';
import {
  GET_WATCHED_REPOS,
  GET_PULL_REQUESTS,
  GET_USER_TEAMS,
} from '../../apollo/queries';
import { MAXIMUM_PRS } from '../../constants';
import transformRepos from './transformRepos';

const loadingMessage = (
  <LoadingMessage message="Asking Github for pull request data..." />
);

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      openRepoId: null,
    };

    this.toggleOpenRepo = this.toggleOpenRepo.bind(this);
  }

  toggleOpenRepo(id) {
    id
      ? document.body.classList.add('modal-active')
      : document.body.classList.remove('modal-active');

    if (this.state.openRepoId === id) {
      return this.setState({
        openRepoId: null,
      });
    }

    return this.setState({
      openRepoId: id,
    });
  }

  render() {
    if (this.props.loading) {
      return <div className={theme.loadingContainer}>{loadingMessage}</div>;
    }

    return (
      <div className={theme.reposContainer}>
        <FlipMove typeName={null} duration={500} appearAnimation={'fade'}>
          {this.props.data.map(repo => (
            <Repo
              key={repo.id}
              data={repo}
              openRepoId={this.state.openRepoId}
              toggleOpenRepo={this.toggleOpenRepo}
            />
          ))}
        </FlipMove>
      </div>
    );
  }
}

Home.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool,
};

Home.defaultProps = {
  loading: false,
};

export default function HomeContainer() {
  return (
    <ErrorBoundary>
      <Query
        query={GET_WATCHED_REPOS}
        fetchPolicy="cache-first"
        notifyOnNetworkStatusChange
      >
        {({ data: watchedReposData, loading, error }) => {
          if (loading) {
            return loadingMessage;
          }

          if (error) {
            throw new Error('Error loading watched repos');
          }

          // Get repo objects from cache that have been selected for monitoring by the user
          const selectedRepos = get(
            watchedReposData,
            'viewer.watching.edges',
          ).filter(({ node }) => node.isSelected);

          // Get Github node ids for the selected repos
          const selectedRepoIds = selectedRepos.map(({ node }) => node.id);

          return (
            <Query
              query={GET_USER_TEAMS}
              variables={{ login: watchedReposData.viewer.login }}
              fetchPolicy="cache-first"
            >
              {({
                data: userTeamsData,
                loading: userTeamsLoading,
                error: userTeamsError,
              }) => {
                if (userTeamsLoading) {
                  return loadingMessage;
                }

                if (userTeamsError) {
                  throw new Error('Error loading user teams');
                }

                return (
                  <Query
                    query={GET_PULL_REQUESTS}
                    variables={{
                      ids: selectedRepoIds,
                      maximumPrs: MAXIMUM_PRS,
                    }}
                    fetchPolicy="network-only"
                    pollInterval={60000}
                  >
                    {({
                      data: pullRequestData,
                      loading: pullRequestsLoading,
                      error: pullRequestsError,
                    }) => {
                      if (pullRequestsError) {
                        throw new Error(
                          'Error loading repositories and pull requests',
                        );
                      }

                      let transformedRepoData = [];

                      if (pullRequestData.nodes && !loading) {
                        // Add pull request data to the existing selected repo objects
                        const mergedRepos = selectedRepos.map(({ node }) => {
                          const repoWithPullRequests = pullRequestData.nodes.find(
                            repo => repo.id === node.id,
                          );

                          const mergedRepo = {
                            ...node,
                            pullRequests: repoWithPullRequests.pullRequests,
                          };
                          return mergedRepo;
                        });

                        transformedRepoData = transformRepos(
                          mergedRepos,
                          userTeamsData,
                        );
                      }

                      return (
                        <Home
                          data={transformedRepoData}
                          loading={pullRequestsLoading}
                        />
                      );
                    }}
                  </Query>
                );
              }}
            </Query>
          );
        }}
      </Query>
    </ErrorBoundary>
  );
}
