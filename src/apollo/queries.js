import gql from 'graphql-tag';

export const GET_GITHUB_AUTH_STATE_FROM_CACHE = gql`
  query GithubAuthState {
    githubAuth @client {
      token
      loadingToken
      error
    }
  }
`;

export const GET_GITHUB_TOKEN_FROM_CACHE = gql`
  query GithubToken {
    githubAuth @client {
      token
    }
  }
`;

export const GET_USER_NOTIFICATION_SETTINGS_FROM_CACHE = gql`
  query UserSettings {
    userSettings @client {
      notifications {
        REVIEW_REQUESTED {
          trigger
          showOnTimeline
          id
        }
        REVIEW_ON_YOUR_PR {
          trigger
          showOnTimeline
          id
        }
        PR_STATE_CHANGE {
          trigger
          showOnTimeline
          id
        }
        NEW_COMMENTS {
          trigger
          showOnTimeline
          id
        }
        NEW_COMMENTS_ON_YOUR_PR {
          trigger
          showOnTimeline
          id
        }
      }
    }
  }
`;

export const GET_USER_VIEW_SETTINGS_FROM_CACHE = gql`
  query UserSettings {
    userSettings @client {
      id
      currentView
    }
  }
`;

export const GET_CURRENT_USER = gql(`
query CurrentUser {
	viewer {
    id
    login
    avatarUrl
    url
  }
}
`);

export const GET_USER_TEAMS = gql(`query UserTeams($login: String!)  {
  viewer {
    id
    login
    organizations(last:100) {
      edges {
        node {
          id
          teams(last:100, userLogins: [$login]) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
}`);

export const GET_WATCHED_REPOS = gql(`query WatchedRepos($cursor: String) { 
  viewer { 
    id
    login
    watching(first:100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          name
          id
          url
          owner {
            login
            avatarUrl
            id
            timestamp @client
          }
          isFork
          createdAt
          isSelected @client
        }
      }
    }
  }
}`);

export const GET_PULL_REQUESTS = gql(`query getPullRequests($ids: [ID!]!, $maximumPrs: Int!) {
  nodes(ids: $ids) {
    id
    ... on Repository {
      closedPullRequests: pullRequests(
        last: 5
        states: [CLOSED, MERGED]
        orderBy: { field: UPDATED_AT, direction: ASC }
      ) {
        edges {
          node {
            id
            title
            state
            url
            number
            author {
              avatarUrl
              login
              timestamp @client
            }
            pullpPullRequest @client {
              notifications
            }
          }
        }
      }
      pullRequests(
        last: $maximumPrs
        states: [OPEN]
        orderBy: { field: CREATED_AT, direction: ASC }
      ) {
        totalCount
        edges {
          node {
            id
            createdAt
            url
            number
            title
            state
            author {
              avatarUrl
              login
              url
              timestamp @client
            }
            comments {
              totalCount
            }
            additions
            deletions
            baseRefName
            headRefName
            isDraft
            pullpPullRequest @client {
              currentUserReviewRequested
              reviewedByCurrentUser
              date
              time
              reviewsByAuthor
              notifications
            }
            reviewRequests(last: 100) {
              edges {
                node {
                  id
                  requestedReviewer {
                    ... on User {
                      login
                      avatarUrl
                      timestamp @client
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
                  id
                  author {
                    login
                    avatarUrl
                    timestamp @client
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
}`);
