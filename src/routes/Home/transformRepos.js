import { orderBy } from 'lodash';
import transformPullRequests from './transformPullRequests';

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
  console.log('repos', repos);
  return repos;
}
