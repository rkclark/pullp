/* eslint-disable import/prefer-default-export */

export const REPO_SUMMARY_MAX_PRS = 3;

export const MAXIMUM_PRS = 50;

// One hour in ms
export const USER_INFO_AND_TEAMS_REFRESH_TIME = 3600000;

export const WATCHED_REPOS_PER_PAGE = 12;

export const WATCHED_REPOS_PAGINATION_RANGE = 5;

export const GITHUB_POLLING_FREQUENCY_MS = 60000;

export const SCHEMA_VERSION_KEY = 'apollo-schema-version';

// Must be a string
export const SCHEMA_VERSION = '3';

export const notificationTypes = {
  REVIEW_REQUESTED: 'REVIEW_REQUESTED',
  REVIEW_ON_YOUR_PR: 'REVIEW_ON_YOUR_PR',
  PR_STATE_CHANGE: 'PR_STATE_CHANGE',
  NEW_COMMENTS: 'NEW_COMMENTS',
  NEW_COMMENTS_ON_YOUR_PR: 'NEW_COMMENTS_ON_YOUR_PR',
};

export const stateChangeNotificationSubTypes = {
  OPENED: 'OPENED',
  RE_OPENED: 'RE_OPENED',
  CLOSED: 'CLOSED',
  MERGED: 'MERGED',
};

export const pullRequestStates = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  MERGED: 'MERGED',
};

export const homePageViews = {
  FULL_VIEW: 'FULL_VIEW',
  MINIMAL_VIEW: 'MINIMAL_VIEW',
  YOUR_PRS_VIEW: 'YOUR_PRS_VIEW',
};

export const CACHE_CLEANING_INTERVAL_MS = 30000; // 5 mins
