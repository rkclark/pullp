import transformPullRequests from './transformPullRequests';

const basePR = {
  createdAt: '2019-01-04T08:11:29.816Z',
  url: 'https://github.com/',
  number: 162,
  title: 'Dockerise test suite',
  author: {
    avatarUrl: 'https://avatars1.githubusercontent.com/',
    login: 'dev3',
    url: 'https://github.com/',
  },
  pullpPullRequest: {
    currentUserReviewRequested: false,
    reviewedByCurrentUser: true,
    reviewsByAuthor: [],
    date: 'date',
    time: 'time',
    __typename: 'PullpPullRequest',
  },
  reviews: {
    edges: [
      {
        node: {
          author: {
            login: 'dev',
            avatarUrl: 'https://avatars3.githubusercontent.com/dev',
          },
          createdAt: '2018-05-31T11:22:08Z',
          state: 'DISMISSED',
        },
      },
      {
        node: {
          author: {
            login: 'dev2',
            avatarUrl: 'https://avatars3.githubusercontent.com/dev2',
          },
          createdAt: '2018-05-31T11:25:05Z',
          state: 'CHANGES_REQUESTED',
        },
      },
      {
        node: {
          author: {
            login: 'dev2',
            avatarUrl: 'https://avatars3.githubusercontent.com/dev2',
          },
          createdAt: '2018-05-31T11:25:05Z',
          state: 'CHANGES_REQUESTED',
        },
      },
      {
        node: {
          author: {
            login: 'dev',
            avatarUrl: 'https://avatars3.githubusercontent.com/dev',
          },
          createdAt: '2018-05-31T11:25:05Z',
          state: 'APPROVED',
        },
      },
    ],
  },
  reviewRequests: {
    edges: [
      {
        node: {
          requestedReviewer: {
            login: 'dev',
            avatarUrl: 'https://avatars0.githubusercontent.com/',
          },
        },
      },
      {
        node: {
          requestedReviewer: {
            login: 'dev2',
            avatarUrl: 'https://avatars0.githubusercontent.com/',
          },
        },
      },
      {
        node: {
          requestedReviewer: {
            login: 'dev4',
            avatarUrl: 'https://avatars0.githubusercontent.com/',
          },
        },
      },
    ],
  },
};

describe('transformPullRequests()', () => {
  describe('with a single pull request', () => {
    const pullRequests = {
      edges: [{ node: basePR }],
    };

    const result = transformPullRequests(pullRequests)[0];

    it('passes through PR fields', () => {
      expect(result.author).toEqual(basePR.author);
      expect(result.title).toEqual(basePR.title);
      expect(result.url).toEqual(basePR.url);
      expect(result.number).toEqual(basePR.number);
      expect(result.pullpPullRequest).toEqual(basePR.pullpPullRequest);
    });

    it('normalizes the reviews array', () => {
      const expectedReviews = [
        basePR.reviews.edges[0].node,
        basePR.reviews.edges[1].node,
        basePR.reviews.edges[2].node,
        basePR.reviews.edges[3].node,
      ];

      expect(result.reviews).toEqual(expectedReviews);
    });

    it('normalizes the reviewRequests array', () => {
      const expectedReviewRequests = [
        basePR.reviewRequests.edges[0].node,
        basePR.reviewRequests.edges[1].node,
        basePR.reviewRequests.edges[2].node,
      ];

      expect(result.reviewRequests).toEqual(expectedReviewRequests);
    });
  });
});
