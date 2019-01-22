import { get } from 'lodash';
import normalizeGraphqlEdges from '../../utils/normalizeGraphqlEdges';

const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

const aggregateReviewsByAuthor = reviews => {
  let reviewsByAuthor = [];
  if (reviews.length > 0) {
    reviewsByAuthor = reviews.reduce((arr, review) => {
      const existingIndex = arr.findIndex(authorReview => {
        if (authorReview.login === review.author.login) {
          return true;
        }
        return false;
      });

      if (existingIndex > -1) {
        arr[existingIndex].states.push(review.state);
        return [...arr];
      }

      return [
        ...arr,
        {
          login: review.author.login,
          avatarUrl: review.author.avatarUrl,
          states: [review.state],
        },
      ];
    }, []);
  }
  return reviewsByAuthor;
};

export default function transformPullRequests(pullRequests, userTeamsData) {
  return pullRequests.edges.map(({ node }) => {
    const createdAtDate = new Date(node.createdAt);
    const reviews = normalizeGraphqlEdges(node.reviews);
    const reviewRequests = normalizeGraphqlEdges(node.reviewRequests);
    const reviewsByAuthor = aggregateReviewsByAuthor(reviews);

    const currentUser = get(userTeamsData, 'viewer.login');

    let currentUserReviewRequested = false;

    if (currentUser !== node.author.login) {
      reviewRequests.some(reviewRequest => {
        const requestedReviewerLogin = get(
          reviewRequest,
          'requestedReviewer.login',
        );
        if (requestedReviewerLogin && requestedReviewerLogin === currentUser) {
          currentUserReviewRequested = true;
          return true;
        }

        const requestedReviewerId = get(reviewRequest, 'requestedReviewer.id');

        const userTeams = get(userTeamsData, 'viewer.organizations').reduce(
          (teamsArray, organization) => [...teamsArray, ...organization.teams],
          [],
        );

        if (
          requestedReviewerId &&
          userTeams.some(team => {
            if (team.id === requestedReviewerId) {
              return true;
            }
            return false;
          })
        ) {
          currentUserReviewRequested = true;
          return true;
        }
        return false;
      });
    }

    return {
      date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
      time: createdAtDate.toLocaleTimeString('en-US', timeOptions),
      reviews,
      reviewRequests,
      reviewsByAuthor,
      currentUserReviewRequested,
    };
  });
}
