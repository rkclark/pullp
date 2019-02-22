import { get } from 'lodash';

const getPullRequestListId = repository => {
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

    const pullRequestLists = [];

    Object.entries(cacheData).forEach(({ 0: key, 1: value }) => {
      if (key.startsWith('Repository:')) {
        const pullRequestsListId = getPullRequestListId(value);

        if (pullRequestsListId) {
          pullRequestLists.push(pullRequestsListId);
        }
      }
    });

    pullRequestLists.forEach(pullRequestList => {
      console.log('pull rueqest list', pullRequestList);
      const pullRequestEdges = cacheData[pullRequestList].edges;
      pullRequestEdges.forEach(edge => {
        const pullRequestId = get(cacheData[edge.id], 'node.id');
        pullRequestsToKeep.push(pullRequestId);
      });
    });

    console.log('PRS TO KEEP', pullRequestsToKeep);

    let deletedPRCount = 0;

    Object.keys(cacheData).forEach(cacheKey => {
      if (
        cacheKey.startsWith('PullRequest:') &&
        !pullRequestsToKeep.includes(cacheKey)
      ) {
        delete cacheData[cacheKey];
        deletedPRCount += 1;
      }
    });

    console.log('Cleaning cache...');
    console.log(`Deleted ${deletedPRCount} pull requests`);
    // iterate through repos

    // get repo url

    // get id of pull request list

    // access pull request list, get list of edges ids

    // aggregate all active pull requests into a list

    // iterate through all pull requests, remove those not in the list

    // TODO : Can we remove pull request object from de-selected repos?
  }, 10000);
};

export default cleanCacheOnInterval;
