import normalizeGraphqlEdges from '../../utils/normalizeGraphqlEdges';

export default function transformPullRequests(pullRequests) {
  return normalizeGraphqlEdges(pullRequests).map(pullRequest => {
    const { reviews, reviewRequests } = pullRequest;
    const normalizedReviews = normalizeGraphqlEdges(reviews);
    const normalizedReviewRequests = normalizeGraphqlEdges(reviewRequests);

    return {
      ...pullRequest,
      reviews: normalizedReviews,
      reviewRequests: normalizedReviewRequests,
    };
  });
}
