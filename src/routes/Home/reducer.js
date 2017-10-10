import { home as types } from '../../actionTypes';

export const initialState = {
  currentUser: null,
  githubError: null,
  repositories: [],
  openRepoId: null,
  pullRequestsLoading: false,
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
      repos = filteredNodes.map(node => ({
        ...node,
        pullRequests: node.pullRequests.edges.map(pr => {
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

          return {
            ...pr.node,
            date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
            time: createdAtDate.toLocaleTimeString('en-US'),
            comments: pr.node.comments.edges.map(comment => ({
              ...comment.node,
            })),
            reviewRequests: pr.node.reviewRequests.edges.map(reviewRequest => ({
              ...reviewRequest.node,
            })),
            reviews,
            aggregatedReviews: reviewStatuses,
          };
        }),
      }));

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
    default:
      return state;
  }
}
