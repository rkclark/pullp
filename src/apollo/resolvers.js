import { get } from 'lodash';
import gql from 'graphql-tag';
import { GET_CURRENT_USER, GET_USER_TEAMS } from './queries';
import normalizeGraphqlEdges from '../utils/normalizeGraphqlEdges';
import processNotifications from './processNotifications';

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

const isUserReviewRequested = ({
  currentUser,
  reviewRequests,
  userTeamsData,
}) => {
  const userReviewRequest = reviewRequests.edges.find(
    ({ node: reviewRequest }) => {
      const requestedReviewerLogin = get(
        reviewRequest,
        'requestedReviewer.login',
      );

      // First check whether PR has user's individual review requested
      if (requestedReviewerLogin && requestedReviewerLogin === currentUser) {
        return true;
      }

      // Secondarily check whether PR has review requested from any team that the user is part of

      // Teams are identified by ids rather than logins
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
    },
  );

  if (userReviewRequest) {
    return { value: true, reviewRequestId: get(userReviewRequest, 'node.id') };
  }

  return { value: false, reviewRequestId: null };
};

const hasBeenReviewedByUser = ({ reviews, currentUser }) =>
  reviews.edges.some(({ node: review }) => {
    if (review.author.login === currentUser) {
      return true;
    }
    return false;
  });

const aggregateReviewsByAuthor = ({ edges: reviews }) => {
  let reviewsByAuthor = [];
  if (reviews.length > 0) {
    reviewsByAuthor = reviews.reduce((arr, { node: review }) => {
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

export default {
  Mutation: {
    toggleSelectedRepo: (_, variables, { cache, getCacheKey }) => {
      const id = getCacheKey({
        __typename: 'Repository',
        id: variables.id,
      });

      const fragment = gql(`
        fragment selectedRepo on Repository {
          isSelected
        }`);

      const repo = cache.readFragment({ fragment, id });
      const data = { ...repo, isSelected: !repo.isSelected };

      cache.writeData({ id, data });

      return null;
    },
    clearSelectedRepos: (_, variables, { cache }) => {
      // Get entire data store object from cache
      const cacheData = get(cache, 'data.data');

      if (!cacheData) {
        return null;
      }

      // Filter cache data to only Repository items
      const repos = Object.entries(cacheData).filter(({ 0: id }) =>
        id.startsWith('Repository:'),
      );

      // Filter Repositories to only those that are selected
      const selectedRepos = repos.filter(({ 1: value }) => value.isSelected);

      const fragment = gql(`
        fragment selectedRepo on Repository {
          isSelected
        }`);

      // Iterate through selected repos and set their isSelected flag to false
      selectedRepos.forEach(({ 0: id }) => {
        const repoFragment = cache.readFragment({
          fragment,
          id,
        });

        const data = {
          ...repoFragment,
          isSelected: false,
        };

        cache.writeData({ id, data });
      });

      return null;
    },
  },
  Repository: {
    isSelected: (_, variables, { cache, getCacheKey }) => {
      // Look for existing repo with this id in the cache
      const id = getCacheKey({
        __typename: 'Repository',
        id: _.id,
      });

      // This repo isn't in the cache, so isSelected must be false
      if (!id) {
        return false;
      }

      const fragment = gql(`
        fragment selectedRepo on Repository {
          isSelected
        }`);

      const repo = cache.readFragment({ fragment, id });

      // Repo is selected in the cache, so set isSelected to true
      if (repo && repo.isSelected) {
        return true;
      }

      // Repo is not selected in the cache, so set isSelected to false
      return false;
    },
  },
  PullRequest: {
    pullpPullRequest: (pullRequest, variables, { cache, getCacheKey }) => {
      const createdAtDate = new Date(pullRequest.createdAt);
      const reviewsByAuthor = aggregateReviewsByAuthor(pullRequest.reviews);

      const currentUser = cache.readQuery({ query: GET_CURRENT_USER });
      const userLogin = get(currentUser, 'viewer.login');

      const userTeams = cache.readQuery({
        query: GET_USER_TEAMS,
        variables: {
          login: userLogin,
        },
      });

      let currentUserReviewRequested = false;
      let userReviewRequestId;

      if (userLogin !== get(pullRequest, 'author.login')) {
        const { value, reviewRequestId } = isUserReviewRequested({
          currentUser: userLogin,
          reviewRequests: pullRequest.reviewRequests,
          userTeamsData: userTeams,
        });

        currentUserReviewRequested = value;
        userReviewRequestId = reviewRequestId;
      }

      const reviewedByCurrentUser = hasBeenReviewedByUser({
        reviews: pullRequest.reviews,
        currentUser: userLogin,
      });

      const pullpPullRequest = {
        currentUserReviewRequested,
        reviewedByCurrentUser,
        reviewsByAuthor,
        userReviewRequestId,
        date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
        time: createdAtDate.toLocaleTimeString('en-US', timeOptions),
        __typename: 'PullpPullRequest',
      };

      // Look for existing pull request with this id in the cache
      const id = getCacheKey({
        __typename: 'PullRequest',
        id: pullRequest.id,
      });

      let existingNotifications;

      if (!id) {
        // This repo isn't in the cache, so there are no existing notifications
        existingNotifications = [];
      } else {
        const fragment = gql(`
          fragment PullpPullRequest on PullRequest {
            pullpPullRequest {
                notifications
            }
          }`);

        existingNotifications =
          get(
            cache.readFragment({ fragment, id }),
            'pullpPullRequest.notifications',
          ) || [];
      }

      const notifications = processNotifications({
        existingNotifications,
        extendedPullRequest: {
          ...pullRequest,
          pullpPullRequest,
        },
        currentUser: userLogin,
      });

      return {
        ...pullpPullRequest,
        notifications,
      };
    },
  },
  User: {
    timestamp: () => {
      const today = new Date();
      return today.toISOString();
    },
  },
  Organization: {
    timestamp: () => {
      const today = new Date();
      return today.toISOString();
    },
  },
};
