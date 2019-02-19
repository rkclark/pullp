import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import FlipMove from 'react-flip-move';

import ErrorBoundary from '../../components/ErrorBoundary';
import Button from '../../components/Button';
import LoadingMessage from '../../components/LoadingMessage';
import Repo from './components/Repo';
import style from './style.css';
import {
  GET_WATCHED_REPOS,
  GET_PULL_REQUESTS,
  GET_USER_TEAMS,
} from '../../apollo/queries';
import { MAXIMUM_PRS, GITHUB_POLLING_FREQUENCY_MS } from '../../constants';
import transformRepos from './transformRepos';

const loadingMessage = (
  <LoadingMessage message="Asking Github for pull request data..." />
);

const githubPollingFrequencySecs = GITHUB_POLLING_FREQUENCY_MS / 1000;

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
    const { loading, data, error } = this.props;
    const { openRepoId } = this.state;

    if (loading) {
      return <div className={style.loadingContainer}>{loadingMessage}</div>;
    }

    return (
      <div className={style.homeContainer}>
        {error && (
          <div className={style.updateWarning}>
            <span className={style.warningIcon}>!</span>
            <span>
              Failed to sync with Github - trying again in{' '}
              {githubPollingFrequencySecs} seconds
            </span>
          </div>
        )}
        {data.length === 0 ? (
          <div className={style.noReposMessage}>
            <p>
              No repositories to display! Please select which of your watched
              repositories you want to monitor here.
            </p>
            <Link to="/app/selectRepos">
              <Button className={style.button}>Select your repositories</Button>
            </Link>
          </div>
        ) : (
          <div className={style.reposContainer}>
            <FlipMove typeName={null} duration={500} appearAnimation={'fade'}>
              {data.map(repo => (
                <Repo
                  key={repo.id}
                  data={repo}
                  openRepoId={openRepoId}
                  toggleOpenRepo={this.toggleOpenRepo}
                />
              ))}
            </FlipMove>
          </div>
        )}
      </div>
    );
  }
}

Home.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.shape({}),
};

Home.defaultProps = {
  loading: false,
  error: null,
};

export default function HomeContainer() {
  return (
    <ErrorBoundary>
      <Query query={GET_WATCHED_REPOS} fetchPolicy="cache-first">
        {({ data: watchedReposData, loading, error }) => {
          if (loading) {
            return loadingMessage;
          }

          if (error) {
            throw new Error(
              'Error loading your watched repos from Github. Try refreshing the app with CMD+R or CTRL+R',
            );
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
                  throw new Error(
                    'Error loading your user data from Github. Try refreshing the app with CMD+R or CTRL+R',
                  );
                }

                return (
                  <Query
                    query={GET_PULL_REQUESTS}
                    variables={{
                      ids: selectedRepoIds,
                      maximumPrs: MAXIMUM_PRS,
                    }}
                    fetchPolicy="cache-and-network"
                    pollInterval={GITHUB_POLLING_FREQUENCY_MS}
                    notifyOnNetworkStatusChange
                  >
                    {({
                      data: pullRequestData,
                      error: pullRequestsError,
                      networkStatus,
                    }) => {
                      /* 
                        Network status 1 means Apollo is loading this query for the first time.
                        This way we ignore subsequent loading for when we poll Github as we
                        already have data to display.
                      */
                      const pullRequestsLoading = networkStatus === 1;

                      let transformedRepoData = [];

                      if (pullRequestData.nodes && !pullRequestsLoading) {
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
                          error={pullRequestsError}
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
