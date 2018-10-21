import gql from 'graphql-tag';

// eslint-disable-next-line
export const TOGGLE_REPO_SELECTION = gql(`
mutation ToggleRepoSelection($id: String!) {
  toggleSelectedRepo(id: $id) @client
}`);
