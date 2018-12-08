import gql from 'graphql-tag';

export const TOGGLE_REPO_SELECTION = gql(`
mutation ToggleRepoSelection($id: String!) {
  toggleSelectedRepo(id: $id) @client
}`);

export const CLEAR_SELECTED_REPOS = gql(`
mutation ClearSelectedRepos {
  clearSelectedRepos @client
}`);
