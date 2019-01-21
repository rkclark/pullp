import { get, orderBy } from 'lodash';

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

export default function transform(reposData, userTeamsData) {
  let repos = reposData.map(node => {
    const reformattedPrs = node.pullRequests.edges.map(pr => {
      const createdAtDate = new Date(pr.node.createdAt);
      const reviews = pr.node.reviews.edges.map(review => ({
        ...review.node,
      }));

      let reviewStatuses = {};
      if (reviews.length > 0) {
        reviewStatuses = reviews.reduce((reviewsObj, review) => {
          if (reviewsObj[review.state]) {
            return {
              ...reviewsObj,
              [review.state]: reviewsObj[review.state] + 1,
            };
          }
          return { ...reviewsObj, [review.state]: 1 };
        }, {});
      }

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

      const reviewRequests = pr.node.reviewRequests.edges.map(
        reviewRequest => ({
          ...reviewRequest.node,
        }),
      );

      let currentUserReviewRequested = false;
      let reviewedByCurrentUser = false;

      const userOrganizations = get(
        userTeamsData,
        'viewer.organizations.edges',
      );

      const userTeams = userOrganizations.reduce((teams, { node: org }) => {
        const additionalTeams = org.teams.edges.map(
          ({ node: team }) => team.id,
        );

        return [...teams, ...additionalTeams];
      }, []);

      if (userTeamsData.viewer.login !== pr.node.author.login) {
        reviewRequests.some(request => {
          if (
            request.requestedReviewer.login &&
            request.requestedReviewer.login === userTeamsData.viewer.login
          ) {
            currentUserReviewRequested = true;
            return true;
          }
          if (
            request.requestedReviewer.id &&
            userTeams.some(team => {
              if (team.id === request.requestedReviewer.id) {
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

        reviews.some(review => {
          if (review.author.login === userTeamsData.viewer.login) {
            reviewedByCurrentUser = true;
            return true;
          }
          return false;
        });
        if (currentUserReviewRequested && reviewedByCurrentUser) {
          currentUserReviewRequested = false;
        }
      }

      return {
        ...pr.node,
        date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
        time: createdAtDate.toLocaleTimeString('en-US', timeOptions),
        reviewRequests,
        reviews,
        aggregatedReviews: reviewStatuses,
        currentUserReviewRequested,
        reviewedByCurrentUser,
        reviewsByAuthor,
      };
    });

    let currentUserReviewRequests = 0;
    let currentUserReviews = 0;

    reformattedPrs.forEach(pr => {
      if (pr.currentUserReviewRequested) {
        currentUserReviewRequests += 1;
      }
      if (pr.reviewedByCurrentUser) {
        currentUserReviews += 1;
      }
    });

    return {
      ...node,
      pullRequests: reformattedPrs,
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
