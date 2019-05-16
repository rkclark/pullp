import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import Button from '../../components/Button';
import LoadingMessage from '../../components/LoadingMessage';
import ErrorBoundary from '../../components/ErrorBoundary';
import FullView from './components/FullView';
import MinimalView from './components/MinimalView';
import style from './style.css';
import {
  GET_WATCHED_REPOS,
  GET_PULL_REQUESTS,
  GET_USER_VIEW_SETTINGS_FROM_CACHE,
} from '../../apollo/queries';
import { SET_HOME_PAGE_VIEW } from '../../apollo/mutations';
import {
  MAXIMUM_PRS,
  GITHUB_POLLING_FREQUENCY_MS,
  homePageViews,
} from '../../constants';
import transformRepos from './transformRepos';

const loadingMessage = (
  <LoadingMessage message="Asking Github for pull request data..." />
);

const githubPollingFrequencySecs = GITHUB_POLLING_FREQUENCY_MS / 1000;

const { FULL_VIEW, MINIMAL_VIEW } = homePageViews;

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
    const {
      loading,
      data,
      error,
      numberOfSelectedRepos,
      settings: { userSettings },
    } = this.props;
    const { openRepoId } = this.state;

    const { currentView, id: userSettingsId } = userSettings;

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
        {numberOfSelectedRepos === 0 ? (
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
          <Fragment>
            <div className={style.viewSelector}>
              <Mutation
                mutation={SET_HOME_PAGE_VIEW}
                variables={{
                  id: userSettingsId,
                  selectedView: FULL_VIEW,
                }}
              >
                {setHomePageView => (
                  <button
                    className={style.fullViewButton}
                    onClick={setHomePageView}
                  >
                    full view
                  </button>
                )}
              </Mutation>
              <Mutation
                mutation={SET_HOME_PAGE_VIEW}
                variables={{
                  id: userSettingsId,
                  selectedView: MINIMAL_VIEW,
                }}
              >
                {setHomePageView => (
                  <button
                    className={style.fullViewButton}
                    onClick={setHomePageView}
                  >
                    minimal view
                  </button>
                )}
              </Mutation>
            </div>
            <div>
              {currentView === 'FULL_VIEW' && (
                <FullView
                  data={data}
                  toggleOpenRepo={this.toggleOpenRepo}
                  openRepoId={openRepoId}
                />
              )}
              {currentView === 'MINIMAL_VIEW' && (
                <MinimalView
                  data={data}
                  toggleOpenRepo={this.toggleOpenRepo}
                  openRepoId={openRepoId}
                />
              )}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

Home.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  settings: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.shape({}),
  numberOfSelectedRepos: PropTypes.number,
};

Home.defaultProps = {
  loading: false,
  error: null,
  numberOfSelectedRepos: 0,
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

                  transformedRepoData = transformRepos(mergedRepos);
                }

                return (
                  <Query
                    query={GET_USER_VIEW_SETTINGS_FROM_CACHE}
                    fetchPolicy="cache-only"
                  >
                    {({ data: settingsData }) => {
                      console.log('got settings data', settingsData);

                      return (
                        <Home
                          data={transformedRepoData}
                          settings={settingsData}
                          loading={pullRequestsLoading}
                          error={pullRequestsError}
                          numberOfSelectedRepos={selectedRepoIds.length}
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
