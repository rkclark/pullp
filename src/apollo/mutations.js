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

export const SET_HOME_PAGE_VIEW = gql(`
mutation SetHomePageView($id: String!, $selectedView: String!) {
  setHomePageView(id: $id, selectedView: $selectedView) @client
}`);

export const DISMISS_NOTIFICATIONS = gql(`
mutation DismissNotifications($pullRequestId: String, $repoId: String) {
  dismissNotifications(pullRequestId: $pullRequestId, repoId: $repoId) @client
}`);
