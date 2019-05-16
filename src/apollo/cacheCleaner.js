import { get } from 'lodash';

import { CACHE_CLEANING_INTERVAL_MS } from '../constants';

const oneWeekInMs = 604800000;

const getPullRequestConnectionIds = repository => {
  const pullRequestsEntries = Object.entries(repository).filter(({ 0: key }) =>
    key.startsWith('pullRequests'),
  );

  return pullRequestsEntries.map(
    pullRequestsEntry => get(pullRequestsEntry, '[1].id') || null,
  );
};

const isTimestampWithinLastWeek = (timestamp, today) =>
  today - new Date(timestamp) > oneWeekInMs;

const doesUserHaveWatchedRepos = user =>
  Object.keys(user).find(key => key.startsWith('watching'));

const findReviewRequestEntriesToKeep = ({
  value,
  cacheData,
  reviewRequestsToKeep,
  reviewRequestReviewersToKeep,
}) => {
  const reviewRequestsConnectionId = value.id;

  const reviewRequestsConnection = cacheData[reviewRequestsConnectionId] || {};

  const reviewRequestEdges = reviewRequestsConnection.edges || [];

  reviewRequestEdges.forEach(({ id }) => {
    const reviewRequestConnectionId = id;

    const reviewRequestConnection = cacheData[reviewRequestConnectionId] || {};

    const reviewRequestId = get(reviewRequestConnection, 'node.id');

    const reviewRequest = cacheData[reviewRequestId];

    const reviewRequestReviewerId = get(reviewRequest, 'requestedReviewer.id');

    reviewRequestsToKeep.push(reviewRequestId);
    reviewRequestReviewersToKeep.push(reviewRequestReviewerId);
  });
};

const findReviewEntriesToKeep = ({
  value,
  cacheData,
  reviewsToKeep,
  reviewAuthorsToKeep,
}) => {
  const reviewsConnectionId = value.id;

  const reviewsConnection = cacheData[reviewsConnectionId] || {};

  const reviewsEdges = reviewsConnection.edges || [];

  reviewsEdges.forEach(({ id }) => {
    const reviewConnectionId = id;

    const reviewConnection = cacheData[reviewConnectionId] || {};

    const reviewId = get(reviewConnection, 'node.id');

    const review = cacheData[reviewId];

    const reviewAuthorId = get(review, 'author.id');

    reviewsToKeep.push(reviewId);
    reviewAuthorsToKeep.push(reviewAuthorId);
  });
};

const cleanCacheOnInterval = ({ cache }) => {
  window.setInterval(() => {
    console.log('CACHE IS', cache);
    const cacheData = cache.data.data;

    const pullRequestsToKeep = [];

    const pullRequestEdgesToKeep = [];

    let pullRequestConnectionsToKeep = [];

    const reviewRequestsToKeep = [];

    const reviewRequestReviewersToKeep = [];

    const reviewsToKeep = [];

    const reviewAuthorsToKeep = [];

    Object.entries(cacheData).forEach(({ 0: key, 1: value }) => {
      if (key.startsWith('Repository:') && value.isSelected) {
        const pullRequestConnectionIds = getPullRequestConnectionIds(value);

        if (pullRequestConnectionIds.length > 0) {
          pullRequestConnectionsToKeep = [
            ...pullRequestConnectionsToKeep,
            ...pullRequestConnectionIds,
          ];
        }
      }
    });

    pullRequestConnectionsToKeep.forEach(connection => {
      const pullRequestEdges = get(cacheData[connection], 'edges') || [];
      pullRequestEdges.forEach(edge => {
        pullRequestEdgesToKeep.push(edge.id);
        const pullRequestId = get(cacheData[edge.id], 'node.id');
        pullRequestsToKeep.push(pullRequestId);

        const pullRequest = cacheData[pullRequestId] || {};

        Object.entries(pullRequest).forEach(({ 0: key, 1: value }) => {
          // Find and keep all review request cache entries for this PR
          if (key.startsWith('reviewRequests')) {
            findReviewRequestEntriesToKeep({
              value,
              cacheData,
              reviewRequestsToKeep,
              reviewRequestReviewersToKeep,
            });
          }

          // Find and keep all review cache entries for this PR
          if (key.startsWith('reviews')) {
            findReviewEntriesToKeep({
              value,
              cacheData,
              reviewsToKeep,
              reviewAuthorsToKeep,
            });
          }
        });
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
        cacheKey.startsWith('ReviewRequest:') &&
        !reviewRequestsToKeep.find(reviewRequestId =>
          cacheKey.includes(reviewRequestId),
        )
      ) {
        return true;
      }

      if (
        cacheKey.startsWith('$ReviewRequest:') &&
        cacheKey.endsWith('.requestedReviewer') &&
        !reviewRequestReviewersToKeep.find(reviewRequestReviewerId =>
          cacheKey.includes(reviewRequestReviewerId),
        )
      ) {
        return true;
      }

      if (
        cacheKey.startsWith('PullRequestReview:') &&
        !reviewsToKeep.find(reviewId => cacheKey.includes(reviewId))
      ) {
        return true;
      }

      if (
        cacheKey.startsWith('$PullRequestReview:') &&
        cacheKey.endsWith('.author') &&
        !reviewAuthorsToKeep.find(reviewAuthorId =>
          cacheKey.includes(reviewAuthorId),
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
        console.log('Deleting cache key', cacheKey);
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
