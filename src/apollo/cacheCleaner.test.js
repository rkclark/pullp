import MockDate from 'mockdate';
import cleanCacheOnInterval from './cacheCleaner';
import { CACHE_CLEANING_INTERVAL_MS } from '../constants';

describe('cleanCacheOnInterval()', () => {
  const setIntervalMock = jest.fn();

  beforeAll(() => {
    delete window.setInterval;
    window.setInterval = setIntervalMock;
  });

  afterEach(() => {
    setIntervalMock.mockClear();
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('sets a function to run on an interval', () => {
    const client = {
      cache: {},
    };

    cleanCacheOnInterval(client);
    const { 0: cleanCacheFn, 1: interval } = setIntervalMock.mock.calls[0];
    expect(typeof cleanCacheFn).toBe('function');
    expect(interval).toBe(CACHE_CLEANING_INTERVAL_MS);
  });

  describe('interval function', () => {
    it('deletes all orphaned pull request cache entries', () => {
      const initialCache = {
        data: {
          data: {
            // Repo 1 - is selected and has one PR
            'Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==': {
              name: 'repository-1',
              isSelected: true,
              __typename: 'Repository',
              'pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})': {
                id:
                  '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})',
                typename: 'PullRequestConnection',
              },
            },
            // Repo 2 - is NOT selected and has one PR
            'Repository:MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==': {
              name: 'repository-2',
              id: 'MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==',
              url: 'https://github.com/repository-2',
              isSelected: false,
              __typename: 'Repository',
            },
            // PR entries for Repo 1
            '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})': {
              edges: [
                {
                  type: 'id',
                  generated: true,
                  id:
                    '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.0',
                  typename: 'PullRequestEdge',
                },
              ],
              __typename: 'PullRequestConnection',
            },
            '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.0': {
              node: {
                id: 'PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1',
                typename: 'PullRequest',
              },
              __typename: 'PullRequestEdge',
            },
            'PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1': {
              id: 'MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1',
              author: {
                id: '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.author',
                typename: 'User',
              },
              pullpPullRequest: {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.pullpPullRequest',
                typename: 'PullpPullRequest',
              },
              'reviewRequests({"last":100})': {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviewRequests({"last":100})',
                typename: 'ReviewRequestConnection',
              },
              'reviews({"last":100})': {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviews({"last":100})',
                typename: 'PullRequestReviewConnection',
              },
              __typename: 'PullRequest',
            },
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.author': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.pullpPullRequest': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviewRequests({"last":100})': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviewRequests({"last":100}).edges.0': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviewRequests({"last":100}).edges.0.node': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviews({"last":100})': {},
            // PR entries for Repo 2
            '$Repository:MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})': {
              edges: [
                {
                  type: 'id',
                  generated: true,
                  id:
                    '$Repository:MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.0',
                  typename: 'PullRequestEdge',
                },
              ],
              __typename: 'PullRequestConnection',
            },
            '$Repository:MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.0': {
              node: {
                id: 'PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1',
                typename: 'PullRequest',
              },
              __typename: 'PullRequestEdge',
            },
            'PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0': {
              id: 'MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1',
              author: {
                id: '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.author',
                typename: 'User',
              },
              pullpPullRequest: {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.pullpPullRequest',
                typename: 'PullpPullRequest',
              },
              'reviewRequests({"last":100})': {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.reviewRequests({"last":100})',
                typename: 'ReviewRequestConnection',
              },
              'reviews({"last":100})': {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.reviews({"last":100})',
                typename: 'PullRequestReviewConnection',
              },
              __typename: 'PullRequest',
            },
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.author': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.pullpPullRequest': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.reviewRequests({"last":100})': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.reviewRequests({"last":100}).edges.0': {
              node: {
                id: 'ReviewRequest:MDEzOlJldmlld1JlcXVlc3Q5ODYzODEwMA==',
              },
            },
            'ReviewRequest:MDEzOlJldmlld1JlcXVlc3Q5ODYzODEwMA==': {
              id: 'MDEzOlJldmlld1JlcXVlc3Q5ODYzODEwMA==',
              requestedReviewer: {
                type: 'id',
                generated: true,
                id:
                  '$ReviewRequest:MDEzOlJldmlld1JlcXVlc3Q5ODYzODEwMA==.requestedReviewer',
                typename: 'User',
              },
              __typename: 'ReviewRequest',
            },
            '$ReviewRequest:MDEzOlJldmlld1JlcXVlc3Q5ODYzODEwMA==.requestedReviewer': {
              login: 'pullptest',
              avatarUrl:
                'https://avatars2.githubusercontent.com/u/38618582?v=4',
              __typename: 'User',
            },
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.reviews({"last":100})': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MTQ1NzA5ODM1.reviews({"last":100}).edges.0': {
              node: {
                id:
                  'PullRequestReview:MDE3OlB1bGxSZXF1ZXN0UmV2aWV3MjM2NzI1MTMy',
              },
            },
            'PullRequestReview:MDE3OlB1bGxSZXF1ZXN0UmV2aWV3MjM2NzI1MTMy': {
              id: 'MDE3OlB1bGxSZXF1ZXN0UmV2aWV3MjM2NzI1MTMy',
              author: {
                type: 'id',
                generated: true,
                id:
                  '$PullRequestReview:MDE3OlB1bGxSZXF1ZXN0UmV2aWV3MjM2NzI1MTMy.author',
                typename: 'User',
              },
              createdAt: '2019-05-13T14:47:10Z',
              state: 'APPROVED',
              __typename: 'PullRequestReview',
            },
            '$PullRequestReview:MDE3OlB1bGxSZXF1ZXN0UmV2aWV3MjM2NzI1MTMy.author': {
              login: 'pullptest',
              avatarUrl:
                'https://avatars2.githubusercontent.com/u/38618582?v=4',
              __typename: 'User',
            },
          },
        },
      };

      // Expected cache has all PR content for Repo 2 removed as this repo is not selected
      const expectedCache = {
        data: {
          data: {
            // Repo 1 - is selected and has one PR
            'Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==': {
              name: 'repository-1',
              isSelected: true,
              __typename: 'Repository',
              'pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})': {
                id:
                  '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})',
                typename: 'PullRequestConnection',
              },
            },
            // Repo 2 - is NOT selected and has one PR
            'Repository:MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==': {
              name: 'repository-2',
              id: 'MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==',
              url: 'https://github.com/repository-2',
              isSelected: false,
              __typename: 'Repository',
            },
            // PR entries for Repo 1
            '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})': {
              edges: [
                {
                  type: 'id',
                  generated: true,
                  id:
                    '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.0',
                  typename: 'PullRequestEdge',
                },
              ],
              __typename: 'PullRequestConnection',
            },
            '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.0': {
              node: {
                id: 'PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1',
                typename: 'PullRequest',
              },
              __typename: 'PullRequestEdge',
            },
            'PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1': {
              id: 'MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1',
              author: {
                id: '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.author',
                typename: 'User',
              },
              pullpPullRequest: {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.pullpPullRequest',
                typename: 'PullpPullRequest',
              },
              'reviewRequests({"last":100})': {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviewRequests({"last":100})',
                typename: 'ReviewRequestConnection',
              },
              'reviews({"last":100})': {
                id:
                  '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviews({"last":100})',
                typename: 'PullRequestReviewConnection',
              },
              __typename: 'PullRequest',
            },
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.author': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.pullpPullRequest': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviewRequests({"last":100})': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviewRequests({"last":100}).edges.0': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviewRequests({"last":100}).edges.0.node': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1.reviews({"last":100})': {},
          },
        },
      };

      const cache = { ...initialCache };

      cleanCacheOnInterval({
        cache,
      });

      const cleanCacheFn = setIntervalMock.mock.calls[0][0];

      cleanCacheFn();

      expect(cache).toEqual(expectedCache);
    });

    it('deletes User entries with a timestamp over a week old', () => {
      MockDate.set('1/10/2020');

      const initialCache = {
        data: {
          data: {
            'User:MDQ6VXNlcjE3Mjc5MTMw': {
              login: 'user1',
              avatarUrl: 'https://avatars1.githubusercontent.com/u/12345?v=4',
              id: 'MDQ6VXNlcjE3Mjc5MTMw',
              __typename: 'User',
              // Less than 1 week ago
              timestamp: '2020-01-08T00:00:00.000Z',
            },
            'User:MDQ6VXNlcjE4Mjk0OTk2': {
              login: 'user2',
              avatarUrl: 'https://avatars1.githubusercontent.com/u/12345?v=4',
              id: 'MDQ6VXNlcjE4Mjk0OTk2',
              __typename: 'User',
              // 8 days ago
              timestamp: '2020-01-02T00:00:00.000Z',
            },

            'User:MDQ6VXNlcjMyMjYzMDY5': {
              // Has no timestamp, will not be deleted
              login: 'user3',
              avatarUrl: 'https://avatars1.githubusercontent.com/u/12345?v=4',
              id: 'MDQ6VXNlcjMyMjYzMDY5',
              __typename: 'User',
            },
            'User:MDQ6VXNlcjEyODk0MDM5': {
              login: 'user4',
              avatarUrl: 'https://avatars1.githubusercontent.com/u/12345?v=4',
              id: 'MDQ6VXNlcjEyODk0MDM5',
              __typename: 'User',
              // 8 days ago
              timestamp: '2020-01-02T00:00:00.000Z',
              // has watching key - this means this User is the user of Pullp - will not be deleted
              'watching({"affiliations":["OWNER","COLLABORATOR","ORGANIZATION_MEMBER"],"first":100})': {},
            },
          },
        },
      };

      const expectedCache = {
        data: {
          data: {
            'User:MDQ6VXNlcjE3Mjc5MTMw': {
              login: 'user1',
              avatarUrl: 'https://avatars1.githubusercontent.com/u/12345?v=4',
              id: 'MDQ6VXNlcjE3Mjc5MTMw',
              __typename: 'User',
              // Less than 1 week ago
              timestamp: '2020-01-08T00:00:00.000Z',
            },
            'User:MDQ6VXNlcjMyMjYzMDY5': {
              // Has no timestamp, will not be deleted
              login: 'user3',
              avatarUrl: 'https://avatars1.githubusercontent.com/u/12345?v=4',
              id: 'MDQ6VXNlcjMyMjYzMDY5',
              __typename: 'User',
            },
            'User:MDQ6VXNlcjEyODk0MDM5': {
              login: 'user4',
              avatarUrl: 'https://avatars1.githubusercontent.com/u/12345?v=4',
              id: 'MDQ6VXNlcjEyODk0MDM5',
              __typename: 'User',
              // 8 days ago
              timestamp: '2020-01-02T00:00:00.000Z',
              // has watching key - this means this User is the user of Pullp - will not be deleted
              'watching({"affiliations":["OWNER","COLLABORATOR","ORGANIZATION_MEMBER"],"first":100})': {},
            },
          },
        },
      };

      const cache = { ...initialCache };

      cleanCacheOnInterval({
        cache,
      });

      const cleanCacheFn = setIntervalMock.mock.calls[0][0];

      cleanCacheFn();

      expect(cache).toEqual(expectedCache);
    });
  });
});
