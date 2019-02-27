import { get } from 'lodash';

import { CACHE_CLEANING_INTERVAL_MS } from '../constants';

const oneWeekInMs = 604800000;

const getPullRequestConnectionId = repository => {
  const pullRequestsEntry = Object.entries(repository).find(({ 0: key }) =>
    key.startsWith('pullRequests'),
  );
  return get(pullRequestsEntry, '[1].id') || null;
};

const isTimestampWithinLastWeek = (timestamp, today) =>
  today - new Date(timestamp) > oneWeekInMs;

const doesUserHaveWatchedRepos = user =>
  Object.keys(user).find(key => key.startsWith('watching'));

const cleanCacheOnInterval = ({ cache }) => {
  window.setInterval(() => {
    const cacheData = cache.data.data;

    const pullRequestsToKeep = [];

    const pullRequestEdgesToKeep = [];

    const pullRequestConnectionsToKeep = [];

    Object.entries(cacheData).forEach(({ 0: key, 1: value }) => {
      if (key.startsWith('Repository:') && value.isSelected) {
        const pullRequestConnectionId = getPullRequestConnectionId(value);

        if (pullRequestConnectionId) {
          pullRequestConnectionsToKeep.push(pullRequestConnectionId);
        }
      }
    });

    pullRequestConnectionsToKeep.forEach(connection => {
      const pullRequestEdges = get(cacheData[connection], 'edges') || [];
      pullRequestEdges.forEach(edge => {
        pullRequestEdgesToKeep.push(edge.id);
        const pullRequestId = get(cacheData[edge.id], 'node.id');
        pullRequestsToKeep.push(pullRequestId);
      });
    });

    let deletedCacheEntryCount = 0;

    const repoSubEntitiesToKeep = [
      ...pullRequestConnectionsToKeep,
      ...pullRequestEdgesToKeep,
    ];

    const today = new Date();

    const doesKeyRequireDeletion = cacheKey => {
      if (
        cacheKey.startsWith('PullRequest:') &&
        !pullRequestsToKeep.includes(cacheKey)
      ) {
        return true;
      }

      if (
        cacheKey.startsWith('$PullRequest:') &&
        !pullRequestsToKeep.find(pullRequestId =>
          cacheKey.includes(pullRequestId),
        )
      ) {
        return true;
      }

      if (
        cacheKey.startsWith('$Repository:') &&
        !repoSubEntitiesToKeep.includes(cacheKey)
      ) {
        return true;
      }

      if (
        cacheKey.startsWith('User:') &&
        cacheData[cacheKey].timestamp &&
        isTimestampWithinLastWeek(cacheData[cacheKey].timestamp, today) &&
        !doesUserHaveWatchedRepos(cacheData[cacheKey])
      ) {
        return true;
      }

      return false;
    };

    Object.keys(cacheData).forEach(cacheKey => {
      if (doesKeyRequireDeletion(cacheKey)) {
        delete cacheData[cacheKey];
        deletedCacheEntryCount += 1;
      }
    });

    /* eslint-disable no-console */
    console.log('Cleaning cache...');
    console.log(`Deleted ${deletedCacheEntryCount} cache entries`);
    /* eslint-enable no-console */
  }, CACHE_CLEANING_INTERVAL_MS);
};

export default cleanCacheOnInterval;
