import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { orderBy } from 'lodash';
import FlipMove from 'react-flip-move';

import LoadingMessage from '../../components/LoadingMessage';
import Repo from './components/Repo';
import theme from './theme.css';
import {
  GET_WATCHED_REPOS,
  GET_PULL_REQUESTS,
  GET_USER_TEAMS,
} from '../../apollo/queries';
import { MAXIMUM_PRS } from '../../constants';
import transform from './transform';

export class HomeNew extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      openRepoId: null,
    };

    this.toggleOpenRepo = this.toggleOpenRepo.bind(this);
  }

  toggleOpenRepo(id) {
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
      return (
        <div className={theme.loadingContainer}>
          <LoadingMessage message="Loading pull request data..." />
        </div>
      );
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

HomeNew.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool,
  // error: PropTypes.shape({}),
};

HomeNew.defaultProps = {
  loading: false,
  error: null,
};

export default function HomeNewContainer() {
  return (
    <Query
      query={GET_WATCHED_REPOS}
      fetchPolicy="cache-first"
      notifyOnNetworkStatusChange
    >
      {({ data: watchedReposData }) => {
        console.log('data is', watchedReposData);

        const selectedRepos = watchedReposData.viewer.watching.edges.filter(
          ({ node }) => node.isSelected,
        );

        console.log('selected repos are', selectedRepos);

        const selectedRepoIds = selectedRepos.map(({ node }) => node.id);

        console.log('selected repo ids', selectedRepoIds);

        return (
          <Query
            query={GET_USER_TEAMS}
            variables={{ login: watchedReposData.viewer.login }}
            fetchPolicy="cache-first"
          >
            {({ data: userTeamsData }) => (
              <Query
                query={GET_PULL_REQUESTS}
                variables={{ ids: selectedRepoIds, maximumPrs: MAXIMUM_PRS }}
                fetchPolicy="network-only"
                pollInterval={60000}
              >
                {({ data: pullRequestData, loading, error }) => {
                  console.log('pull reuqests data', pullRequestData);
                  console.log('pull reuqests error', error);
                  console.log('loading', loading);
                  let transformedRepoData = [];

                  if (pullRequestData && !loading) {
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

                    console.log('rendering home page with data', mergedRepos);
                    console.log('user teams data is', userTeamsData);

                    transformedRepoData = transform(mergedRepos, userTeamsData);

                    if (transformedRepoData.length > 0) {
                      transformedRepoData = orderBy(
                        transformedRepoData,
                        [repo => repo.pullRequests.length, repo => repo.name],
                        ['desc', 'asc'],
                      );
                    }
                  }

                  return (
                    <HomeNew
                      data={transformedRepoData}
                      loading={loading}
                      error={error}
                    />
                  );
                }}
              </Query>
            )}
          </Query>
        );
      }}
    </Query>
  );
}
