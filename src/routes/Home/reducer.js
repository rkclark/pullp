import { home as types, account as accountTypes } from '../../actionTypes';

export const initialState = {
  currentUser: null,
  githubError: null,
  repositories: [],
  openRepoId: null,
  pullRequestsLoading: false,
  userTeams: [],
};

let repos;
let filteredNodes;
let createdAtDate;

const dateOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
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
      };
    case types.REQUEST_CURRENT_USER_FAIL:
      return {
        ...state,
        githubError: action.error,
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

          const reviewRequests = pr.node.reviewRequests.edges.map(
            reviewRequest => ({
              ...reviewRequest.node,
            }),
          );

          let currentUserReviewRequested = false;
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

          return {
            ...pr.node,
            date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
            time: createdAtDate.toLocaleTimeString('en-US'),
            comments: pr.node.comments.edges.map(comment => ({
              ...comment.node,
            })),
            reviewRequests,
            reviews,
            aggregatedReviews: reviewStatuses,
            currentUserReviewRequested,
          };
        });

        return {
          ...node,
          pullRequests: reformattedPrs,
        };
      });

      return {
        ...state,
        repositories: repos,
        pullRequestsLoading: false,
      };
    case types.REQUEST_PULL_REQUESTS_FAIL:
      return {
        ...state,
        githubError: action.error,
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
        githubError: null,
      };
    }
    case types.REQUEST_USER_TEAMS_FAIL:
      return {
        ...state,
        githubError: action.error,
      };
    default:
      return state;
  }
}
