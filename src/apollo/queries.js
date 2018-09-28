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
    login
    avatarUrl
  }
}
`);

export const GET_USER_TEAMS = gql(`query UserTeams($login: String!)  {
  viewer {
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
