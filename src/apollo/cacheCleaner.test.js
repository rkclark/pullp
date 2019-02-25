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
    cleanCacheOnInterval(client);
    cleanCacheFn = setIntervalMock.mock.calls[0][0];
  });

  it('sets a function to run on an interval', () => {
    expect(typeof cleanCacheFn).toBe('function');
  });

  describe('interval function', () => {
    it('deletes all orphaned PullRequest entries', () => {
      const initialCache = {
        '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})': {
          totalCount: 4,
          edges: [
            {
              type: 'id',
              generated: true,
              id:
                '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.0',
              typename: 'PullRequestEdge',
            },
            {
              type: 'id',
              generated: true,
              id:
                '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.1',
              typename: 'PullRequestEdge',
            },
          ],
          __typename: 'PullRequestConnection',
        },
        '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.0': {
          node: {
            type: 'id',
            generated: false,
            id: 'PullRequest:MDExOlB1bGxSZXF1ZXN0MjU1MDgwMjU1',
            typename: 'PullRequest',
          },
          __typename: 'PullRequestEdge',
        },
        '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]}).edges.1': {
          node: {
            type: 'id',
            generated: false,
            id: 'PullRequest:MDExOlB1bGxSZXF1ZXN0MjUyOTkwNTgy',
            typename: 'PullRequest',
          },
          __typename: 'PullRequestEdge',
        },
        'Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==': {
          name: 'rewards.movies-issue-and-redeem',
          id: 'MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==',
          url:
            'https://github.com/ComparetheMarket/rewards.movies-issue-and-redeem',
          owner: {
            type: 'id',
            generated: false,
            id: 'Organization:MDEyOk9yZ2FuaXphdGlvbjE5NTExMjY=',
            typename: 'Organization',
          },
          isFork: false,
          createdAt: '2014-10-16T14:57:25Z',
          isSelected: true,
          __typename: 'Repository',
          'pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})': {
            type: 'id',
            generated: true,
            id:
              '$Repository:MDEwOlJlcG9zaXRvcnkyNTMwNzMwMw==.pullRequests({"last":50,"orderBy":{"direction":"DESC","field":"CREATED_AT"},"states":["OPEN"]})',
            typename: 'PullRequestConnection',
          },
        },
        'Repository:MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==': {
          name: 'rewards.data-bootstrapper',
          id: 'MDEwOlJlcG9zaXRvcnkyOTA1NDE0NA==',
          url: 'https://github.com/ComparetheMarket/rewards.data-bootstrapper',
          owner: {
            type: 'id',
            generated: false,
            id: 'Organization:MDEyOk9yZ2FuaXphdGlvbjE5NTExMjY=',
            typename: 'Organization',
          },
          isFork: false,
          createdAt: '2015-01-10T10:38:06Z',
          isSelected: false,
          __typename: 'Repository',
        },
      };
    });
  });
});
