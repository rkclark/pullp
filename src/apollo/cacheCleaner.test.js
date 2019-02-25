import cleanCacheOnInterval from './cacheCleaner';

describe('cleanCacheOnInterval()', () => {
  const setIntervalMock = jest.fn();
  let cleanCacheFn;

  const client = {
    cache: {},
  };

  beforeAll(() => {
    delete window.setInterval;
    window.setInterval = setIntervalMock;
  });

  afterEach(() => {
    setIntervalMock.mockClear();
  });

  it('sets a function to run on an interval', () => {
    cleanCacheOnInterval(client);
    cleanCacheFn = setIntervalMock.mock.calls[0][0];
    expect(typeof cleanCacheFn).toBe('function');
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
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.reviewRequests({"last":100}).edges.0': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.reviewRequests({"last":100}).edges.0.node': {},
            '$PullRequest:MDExOlB1bGxSZXF1ZXN0MjQ0ODg1NzM0.reviews({"last":100})': {},
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

      cleanCacheFn = setIntervalMock.mock.calls[0][0];

      cleanCacheFn();

      expect(cache).toEqual(expectedCache);
    });
  });
});
