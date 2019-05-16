import { orderBy, get } from 'lodash';
import transformPullRequests from './transformPullRequests';

export default function transformRepos(reposData) {
  let repos = reposData.map(node => {
    const transformedPRs = transformPullRequests(node.pullRequests);

    let currentUserReviewRequests = 0;
    let currentUserReviews = 0;
    let newNotificationCount = 0;

    transformedPRs.forEach(pullRequest => {
      if (get(pullRequest, 'pullpPullRequest.currentUserReviewRequested')) {
        currentUserReviewRequests += 1;
      }
      if (get(pullRequest, 'pullpPullRequest.reviewedByCurrentUser')) {
        currentUserReviews += 1;
      }

      const prNewNotificationCount =
        get(pullRequest, 'pullpPullRequest.newNotificationCount') || 0;

      newNotificationCount += prNewNotificationCount;
    });

    return {
      ...node,
      pullRequests: transformedPRs,
      currentUserReviewRequests,
      currentUserReviews,
      totalPullRequests: node.pullRequests.totalCount,
      newNotificationCount,
    };
  });

  if (repos.length > 0) {
    repos = orderBy(
      repos,
      [repo => repo.pullRequests.length, repo => repo.name],
      ['desc', 'asc'],
    );
  }

  return repos;
}
