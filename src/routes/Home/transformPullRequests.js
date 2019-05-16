import { get } from 'lodash';
import normalizeGraphqlEdges from '../../utils/normalizeGraphqlEdges';

export default function transformPullRequests(pullRequests) {
  return normalizeGraphqlEdges(pullRequests).map(pullRequest => {
    const { reviews, reviewRequests } = pullRequest;
    const normalizedReviews = normalizeGraphqlEdges(reviews);
    const normalizedReviewRequests = normalizeGraphqlEdges(reviewRequests);

    const notifications =
      get(pullRequest, 'pullpPullRequest.notifications') || [];

    let newNotificationCount = 0;

    notifications.forEach(({ dismissed, trigger }) => {
      if (!dismissed && trigger) {
        newNotificationCount += 1;
      }
    });

    return {
      ...pullRequest,
      reviews: normalizedReviews,
      reviewRequests: normalizedReviewRequests,
      pullpPullRequest: {
        ...pullRequest.pullpPullRequest,
        newNotificationCount,
      },
    };
  });
}
