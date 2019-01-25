import { orderBy } from 'lodash';
import transformPullRequests from './transformPullRequests';

// Maps  Repos
//   Maps + Normalizes PRs
//     Makes createdAtDate from createdAt
//     Sets date and time from createdAtDate
//     Normalizes reviews array
//     Creates reviewStatuses object (aggregatedReviews) - NOT USED
//     Creates reviewsByAuthor array
//     Normalizes review requests
//     Determines and sets currentUserReviewRequested
//     Determines and sets reviewedByCurrentUser
//   Determines and sets currentUserReviewRequests based on PR content
//   Determines and sets currentUserReviews based on PR content
//   Determines and sets totalPullRequests

// Orders Repos by number of PRs and then name

export default function transformRepos(reposData, userTeamsData) {
  let repos = reposData.map(node => {
    const transformedPRs = transformPullRequests(
      node.pullRequests,
      userTeamsData,
    );

    let currentUserReviewRequests = 0;
    let currentUserReviews = 0;

    transformedPRs.forEach(pr => {
      if (pr.currentUserReviewRequested) {
        currentUserReviewRequests += 1;
      }
      if (pr.reviewedByCurrentUser) {
        currentUserReviews += 1;
      }
    });

    return {
      ...node,
      pullRequests: transformedPRs,
      currentUserReviewRequests,
      currentUserReviews,
      totalPullRequests: node.pullRequests.totalCount,
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
