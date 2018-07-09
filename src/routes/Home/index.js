import React from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
import _ from 'lodash';

import Repo from './components/Repo';
import * as actions from './actions';
import theme from './theme.css';
import Error from '../../components/Error';
import transform from './transform';
import { MAXIMUM_PRS } from '../../constants';

const pullRequestsQuery = gql`
  query pullRequests($ids: [ID!]!, $maximumPrs: Int!) {
    nodes(ids: $ids) {
      id
      ... on Repository {
        pullRequests(
          last: $maximumPrs
          states: [OPEN]
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          totalCount
          edges {
            node {
              createdAt
              url
              number
              title
              author {
                avatarUrl
                login
                url
              }
              reviewRequests(last: 100) {
                edges {
                  node {
                    requestedReviewer {
                      ... on User {
                        login
                        avatarUrl
                      }
                      ... on Team {
                        name
                        id
                        avatarUrl
                      }
                    }
                  }
                }
              }
              reviews(last: 100) {
                edges {
                  node {
                    author {
                      login
                      avatarUrl
                    }
                    createdAt
                    state
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    // this.updateInterval = null;
  }

  // componentDidMount() {
  //   if (this.props.currentUser) {
  //     this.props.requestPullRequests(
  //       this.props.githubToken,
  //       this.props.selectedRepos,
  //     );
  //     this.updateInterval = window.setInterval(() => {
  //       this.props.requestPullRequests(
  //         this.props.githubToken,
  //         this.props.selectedRepos,
  //       );
  //     }, 60000);
  //   }
  // }

  // componentWillUnmount() {
  //   window.clearInterval(this.updateInterval);
  // }

  render() {
    return (
      <Query
        pollInterval={60000}
        context={{
          headers: {
            'Content-type': 'application/json',
            Authorization: `bearer ${this.props.githubToken}`,
          },
        }}
        query={pullRequestsQuery}
        variables={{
          ids: this.props.selectedRepos,
          maximumPrs: MAXIMUM_PRS,
        }}
        options={{ fetchPolicy: 'network-only' }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) {
            let message = error.message;
            if (error.graphQLErrors[0].type === 'MAX_NODE_LIMIT_EXCEEDED') {
              message = `The amount of pull request data for your selected repositories exceeds Github's maximum limit. Try selecting fewer repositories and trying again. Here is the specific error from Github as guidance: ${message}`;
            }
            return (
              <Error
                title="Error getting latest pull requests data from Github"
                message={message}
              />
            );
          }

          let transformedRepos = transform(data, {
            watchedRepos: this.props.watchedRepos,
            userTeams: this.props.userTeams,
            currentUser: this.props.currentUser,
          });

          if (!transformedRepos) {
            transformedRepos = [];
          }

          if (transformedRepos.length > 0) {
            transformedRepos = _.orderBy(
              transformedRepos,
              [repo => repo.pullRequests.length, repo => repo.name],
              ['desc', 'asc'],
            );
          }

          return (
            <div className={theme.reposContainer}>
              <FlipMove typeName={null} duration={500} appearAnimation={'fade'}>
                {transformedRepos.map(repo => (
                  <Repo
                    key={repo.id}
                    data={repo}
                    openRepoId={this.props.openRepoId}
                    toggleOpenRepo={this.props.toggleOpenRepo}
                  />
                ))}
              </FlipMove>
            </div>
          );
        }}
      </Query>
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
  selectedRepos: PropTypes.arrayOf(PropTypes.string),
  openRepoId: PropTypes.string,
  toggleOpenRepo: PropTypes.func.isRequired,
  watchedRepos: PropTypes.arrayOf(PropTypes.shape({})),
  userTeams: PropTypes.arrayOf(PropTypes.shape({})),
};

Home.defaultProps = {
  redirectPath: null,
  currentUser: null,
  githubToken: null,
  selectedRepos: [],
  repositories: [],
  openRepoId: null,
  watchedRepos: [],
  userTeams: [],
};

const mapStateToProps = state => ({
  currentUser: state.home.currentUser,
  userTeams: state.home.userTeams,
  githubToken: state.setup.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
  watchedRepos: state.selectRepos.watchedRepos,
  repositories: state.home.repositories,
  openRepoId: state.home.openRepoId,
});

const mapDispatchToProps = dispatch => ({
  toggleOpenRepo(repoId) {
    dispatch(actions.toggleOpenRepo(repoId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
