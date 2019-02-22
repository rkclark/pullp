import { get } from 'lodash';

const getPullRequestConnectionId = repository => {
  const pullRequestsEntry = Object.entries(repository).find(({ 0: key }) =>
    key.startsWith('pullRequests'),
  );
  return get(pullRequestsEntry, '[1].id') || null;
};

const cleanCacheOnInterval = ({ cache }) => {
  window.setInterval(() => {
    console.log(cache);

    const cacheData = cache.data.data;

    const pullRequestsToKeep = [];

    const pullRequestConnections = [];

    Object.entries(cacheData).forEach(({ 0: key, 1: value }) => {
      if (key.startsWith('Repository:') && value.isSelected) {
        const pullRequestConnectionId = getPullRequestConnectionId(value);

        if (pullRequestConnectionId) {
          pullRequestConnections.push(pullRequestConnectionId);
        }
      }
    });

    pullRequestConnections.forEach(connection => {
      const pullRequestEdges = cacheData[connection].edges;
      pullRequestEdges.forEach(edge => {
        const pullRequestId = get(cacheData[edge.id], 'node.id');
        pullRequestsToKeep.push(pullRequestId);
      });
    });

    let deletedPRCount = 0;

    Object.keys(cacheData).forEach(cacheKey => {
      let deleteCacheEntry = false;

      if (
        cacheKey.startsWith('PullRequest:') &&
        !pullRequestsToKeep.includes(cacheKey)
      ) {
        deleteCacheEntry = true;
      }

      if (
        cacheKey.startsWith('$PullRequest:') &&
        !pullRequestsToKeep.find(pullRequestId =>
          cacheKey.includes(pullRequestId),
        )
      ) {
        deleteCacheEntry = true;
      }

      if (deleteCacheEntry) {
        delete cacheData[cacheKey];
        deletedPRCount += 1;
      }
    });

    console.log('Cleaning cache...');
    console.log(`Deleted ${deletedPRCount} pull request cache entries`);
  }, 10000);
};

export default cleanCacheOnInterval;
