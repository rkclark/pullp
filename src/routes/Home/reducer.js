import { home as types } from '../../actionTypes';

export const initialState = {
  currentUser: null,
  githubError: null,
  repositories: [],
  openRepoId: null,
};

let repos;
let filteredNodes;
let createdAtDate;

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
    case types.REQUEST_PULL_REQUESTS_SUCCESS:
      filteredNodes = action.data.nodes.filter(node => node);
      repos = filteredNodes.map(node => ({
        ...node,
        pullRequests: node.pullRequests.edges.map(pr => {
          createdAtDate = new Date(pr.node.createdAt);
          return {
            ...pr.node,
            date: createdAtDate.toLocaleDateString(),
            time: createdAtDate.toLocaleTimeString(),
            participants: pr.node.participants.edges.map(participant => ({
              ...participant.node,
            })),
            reviewRequests: pr.node.reviewRequests.edges.map(reviewRequest => ({
              ...reviewRequest.node,
            })),
            reviews: pr.node.reviews.edges.map(review => ({
              ...review.node,
            })),
          };
        }),
      }));

      return {
        ...state,
        repositories: repos,
      };
    case types.REQUEST_PULL_REQUESTS_FAIL:
      return {
        ...state,
        githubError: action.error,
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
