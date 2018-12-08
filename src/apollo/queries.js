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

export const GET_CURRENT_USER = gql(`
query CurrentUser {
	viewer {
    id
    login
    avatarUrl
  }
}
`);

export const GET_USER_TEAMS = gql(`query UserTeams($login: String!)  {
  viewer {
    id
    organizations(last:100) {
      edges {
        node {
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
}`);
