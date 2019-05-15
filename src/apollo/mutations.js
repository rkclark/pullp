import gql from 'graphql-tag';

export const TOGGLE_REPO_SELECTION = gql(`
mutation ToggleRepoSelection($id: String!) {
  toggleSelectedRepo(id: $id) @client
}`);

export const CLEAR_SELECTED_REPOS = gql(`
mutation ClearSelectedRepos {
  clearSelectedRepos @client
}`);

export const TOGGLE_NOTIFICATION_SETTING = gql(`
mutation ToggleRepoSelection($id: String!, $field: String!) {
  toggleNotificationSetting(id: $id, field: $field) @client
}`);
