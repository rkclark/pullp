import React from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Repo from './components/Repo';
import * as actions from './actions';
import theme from './theme.css';
import Error from '../../components/Error';
import transform from './transform';
import { MAXIMUM_PRS } from '../../constants';

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
    // let sortedRepos = [];
    // if (this.props.repositories.length > 0) {
    //   sortedRepos = this.props.repositories.sort((a, b) => {
    //     if (a.pullRequests.length > b.pullRequests.length) {
    //       return -1;
    //     }
    //     if (a.pullRequests.length < b.pullRequests.length) {
    //       return 1;
    //     }
    //     return 0;
    //   });
    // }

    // return (
    //   <div>
    //     {this.props.githubPullRequestsError ? (
    // <Error
    //   title="Error getting latest pull requests data from Github"
    //   message={this.props.githubPullRequestsError}
    // />
    //     ) : null}

    // <div className={theme.reposContainer}>
    //   {sortedRepos.map(repo => (
    //     <Repo
    //       data={repo}
    //       key={repo.id}
    //       openRepoId={this.props.openRepoId}
    //       toggleOpenRepo={this.props.toggleOpenRepo}
    //     />
    //   ))}
    // </div>
    //   </div>
    return (
      <Query
        pollInterval={60000}
        context={{
          headers: {
            'Content-type': 'application/json',
            Authorization: `bearer ${this.props.githubToken}`,
          },
        }}
        query={gql`
        {nodes (ids:${JSON.stringify(this.props.selectedRepos)}) {
          id
          ... on Repository {
            pullRequests(last: ${MAXIMUM_PRS} states: [OPEN] orderBy:{ field: CREATED_AT, direction: DESC }) {
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
        }}
      `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error)
            return (
              <Error
                title="Error getting latest pull requests data from Github"
                message={this.props.githubPullRequestsError}
              />
            );
          let transformedData = transform(data, {
            watchedRepos: this.props.watchedRepos,
            userTeams: this.props.userTeams,
            currentUser: this.props.currentUser,
          });

          if (!transformedData) {
            transformedData = [];
          }

          return (
            <div className={theme.reposContainer}>
              {transformedData.map(repo => (
                <Repo
                  data={repo}
                  key={repo.id}
                  openRepoId={this.props.openRepoId}
                  toggleOpenRepo={this.props.toggleOpenRepo}
                />
              ))}
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
  // requestPullRequests: PropTypes.func.isRequired,
  selectedRepos: PropTypes.arrayOf(PropTypes.string),
  // repositories: PropTypes.arrayOf(PropTypes.shape()),
  openRepoId: PropTypes.string,
  toggleOpenRepo: PropTypes.func.isRequired,
  githubPullRequestsError: PropTypes.string,
  watchedRepos: PropTypes.arrayOf(PropTypes.shape({})),
  userTeams: PropTypes.arrayOf(PropTypes.shape({})),
};

Home.defaultProps = {
  githubPullRequestsError: null,
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
