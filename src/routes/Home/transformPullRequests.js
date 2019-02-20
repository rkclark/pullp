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

const isUserReviewRequested = ({
  currentUser,
  normalizedReviewRequests,
  userTeamsData,
}) =>
  normalizedReviewRequests.some(reviewRequest => {
    const requestedReviewerLogin = get(
      reviewRequest,
      'requestedReviewer.login',
    );
    // First check whether PR has user's individual review requested
    if (requestedReviewerLogin && requestedReviewerLogin === currentUser) {
      return true;
    }

    // Secondarily check whether PR has review requested from any team that the user is part of

    // Teams areidentified by ids rather than logins
    const requestedReviewerId = get(reviewRequest, 'requestedReviewer.id');

    // Flatten all user teams into one array
    const userOrgs = normalizeGraphqlEdges(
      get(userTeamsData, 'viewer.organizations'),
    );
    const userTeams = userOrgs.reduce(
      (teamsArray, organization) => [...teamsArray, ...organization.teams],
      [],
    );

    // Check whether requested reviewer is one of the user's teams
    if (
      requestedReviewerId &&
      userTeams.some(team => {
        if (team.id === requestedReviewerId) {
          return true;
        }
        return false;
      })
    ) {
      return true;
    }
    return false;
  });

const hasBeenReviewedByUser = ({ normalizedReviews, currentUser }) =>
  normalizedReviews.some(review => {
    if (review.author.login === currentUser) {
      return true;
    }
    return false;
  });

export default function transformPullRequests(pullRequests, userTeamsData) {
  return normalizeGraphqlEdges(pullRequests).map(
    ({
      createdAt,
      reviews,
      reviewRequests,
      author,
      title,
      url,
      number,
      pullpPullRequest,
    }) => {
      const createdAtDate = new Date(createdAt);
      const normalizedReviews = normalizeGraphqlEdges(reviews);
      const normalizedReviewRequests = normalizeGraphqlEdges(reviewRequests);
      const reviewsByAuthor = aggregateReviewsByAuthor(normalizedReviews);

      const currentUser = get(userTeamsData, 'viewer.login');

      let currentUserReviewRequested = false;

      if (currentUser !== author.login) {
        currentUserReviewRequested = isUserReviewRequested({
          currentUser,
          normalizedReviewRequests,
          userTeamsData,
        });
      }

      const reviewedByCurrentUser = hasBeenReviewedByUser({
        normalizedReviews,
        currentUser,
      });

      // Once a user has reviewed the PR, do not ask for their review again
      // (May want to extend this logic in future for re-reviews)
      if (currentUserReviewRequested && reviewedByCurrentUser) {
        currentUserReviewRequested = false;
      }

      return {
        author,
        title,
        url,
        number,
        date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
        time: createdAtDate.toLocaleTimeString('en-US', timeOptions),
        reviews: normalizedReviews,
        reviewRequests: normalizedReviewRequests,
        reviewsByAuthor,
        ...pullpPullRequest,
      };
    },
  );
}
