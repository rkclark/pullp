import { home as types, account as accountTypes } from '../../actionTypes';

export const initialState = {
  currentUser: null,
  githubPullRequestsError: null,
  githubCurrentUserError: null,
  githubUserTeamsError: null,
  repositories: [],
  openRepoId: null,
  pullRequestsLoading: false,
  currentUserLoading: false,
  userTeams: [],
};

let repos;
let filteredNodes;
let createdAtDate;

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

export default function(state = initialState, action) {
  switch (action.type) {
    case accountTypes.LOGOUT:
      return {
        ...initialState,
      };
    case types.REQUEST_CURRENT_USER_SUCCESS:
      return {
        ...state,
        currentUser: {
          login: action.data.viewer.login,
          avatarUrl: action.data.viewer.avatarUrl,
          url: action.data.viewer.url,
        },
        githubCurrentUserError: null,
        currentUserLoading: false,
      };
    case types.REQUEST_CURRENT_USER_FAIL:
      return {
        ...state,
        githubCurrentUserError: action.error,
        currentUserLoading: false,
      };
    case types.REQUEST_CURRENT_USER_LOADING:
      return {
        ...state,
        currentUserLoading: true,
      };
    case types.REQUEST_PULL_REQUESTS_LOADING:
      return {
        ...state,
        pullRequestsLoading: true,
      };
    case types.REQUEST_PULL_REQUESTS_SUCCESS:
      filteredNodes = action.data.nodes.filter(node => node);
      repos = filteredNodes.map(node => {
        const reformattedPrs = node.pullRequests.edges.map(pr => {
          createdAtDate = new Date(pr.node.createdAt);
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

          if (state.currentUser.login !== pr.node.author.login) {
            reviewRequests.some(request => {
              if (
                request.requestedReviewer.login &&
                request.requestedReviewer.login === state.currentUser.login
              ) {
                currentUserReviewRequested = true;
                return true;
              }
              if (
                request.requestedReviewer.id &&
                state.userTeams.some(team => {
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
              if (review.author.login === state.currentUser.login) {
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

        const extendedRepoData = action.watchedRepos.find(
          watchedRepo => watchedRepo.id === node.id,
        );

        return {
          ...node,
          name: extendedRepoData.name,
          url: extendedRepoData.url,
          owner: extendedRepoData.owner,
          pullRequests: reformattedPrs,
          currentUserReviewRequests,
          currentUserReviews,
          totalPullRequests: node.pullRequests.totalCount,
        };
      });

      return {
        ...state,
        repositories: repos,
        pullRequestsLoading: false,
        githubPullRequestsError: null,
      };
    case types.REQUEST_PULL_REQUESTS_FAIL:
      return {
        ...state,
        githubPullRequestsError: action.error,
        pullRequestsLoading: false,
      };
    case types.TOGGLE_OPEN_REPO:
      return {
        ...state,
        openRepoId:
          action.id === undefined || state.openRepoId === action.id
            ? null
            : action.id,
      };
    case types.REQUEST_USER_TEAMS_SUCCESS: {
      const userTeamsArray = action.data.viewer.organizations.edges.reduce(
        (array, organization) => [
          ...array,
          ...organization.node.teams.edges.map(team => ({ ...team.node })),
        ],
        [],
      );
      return {
        ...state,
        userTeams: userTeamsArray,
        githubUserTeamsError: null,
      };
    }
    case types.REQUEST_USER_TEAMS_FAIL:
      return {
        ...state,
        githubUserTeamsError: action.error,
      };
    default:
      return state;
  }
}
