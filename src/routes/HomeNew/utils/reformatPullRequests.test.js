import reformatPullRequests from './reformatPullRequests';

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

describe('reformatPullRequests()', () => {
  const createdAt = '2016-10-14T20:31:44Z';
  const createdAtDate = new Date(createdAt);
  const createdAtDateString = createdAtDate.toLocaleDateString(
    'en-GB',
    dateOptions,
  );
  const createdAtTimeString = createdAtDate.toLocaleTimeString(
    'en-US',
    timeOptions,
  );

  const pullRequests = [
    {
      node: {
        createdAt,
      },
    },
  ];

  describe('when provided with an array of pull request nodes', () => {
    it('adds a date field to each pull request', () => {
      const reformattedPRs = reformatPullRequests(pullRequests);
      expect(reformattedPRs[0].date).toBe(createdAtDateString);
    });

    it('adds a time field to each pull request', () => {
      const reformattedPRs = reformatPullRequests(pullRequests);
      expect(reformattedPRs[0].time).toBe(createdAtTimeString);
    });
  });
});
