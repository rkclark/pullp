import transformPullRequests from './transformPullRequests';

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

const basePR = {
  createdAt: '2019-01-04T08:11:29.816Z',
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
    ],
  },
};

describe('transformPullRequests()', () => {
  describe('with a single pull request', () => {
    const pullRequests = {
      edges: [{ node: basePR }],
    };

    const result = transformPullRequests(pullRequests)[0];

    it('sets date field', () => {
      const expectedDate = new Date(basePR.createdAt).toLocaleDateString(
        'en-GB',
        dateOptions,
      );
      expect(result.date).toBe(expectedDate);
    });

    it('sets time field', () => {
      const expectedTime = new Date(basePR.createdAt).toLocaleTimeString(
        'en-US',
        timeOptions,
      );
      expect(result.time).toBe(expectedTime);
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

    it('aggregates reviews by author', () => {
      const expectedReviewsByAuthor = [
        {
          login: 'dev',
          avatarUrl: 'https://avatars3.githubusercontent.com/dev',
          states: ['DISMISSED', 'APPROVED'],
        },
        {
          login: 'dev2',
          avatarUrl: 'https://avatars3.githubusercontent.com/dev2',
          states: ['CHANGES_REQUESTED', 'CHANGES_REQUESTED'],
        },
      ];

      expect(result.reviewsByAuthor).toEqual(expectedReviewsByAuthor);
    });

    it('normalizes the reviewRequests array', () => {
      const expectedReviewRequests = [
        basePR.reviewRequests.edges[0].node,
        basePR.reviewRequests.edges[1].node,
      ];

      expect(result.reviewRequests).toEqual(expectedReviewRequests);
    });
  });
});
