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
};

const pullRequests = {
  edges: [{ node: basePR }],
};

describe('transformPullRequests()', () => {
  it('sets date field', () => {
    const result = transformPullRequests(pullRequests)[0];
    const expectedDate = new Date(basePR.createdAt).toLocaleDateString(
      'en-GB',
      dateOptions,
    );
    expect(result.date).toBe(expectedDate);
  });

  it('sets time field', () => {
    const result = transformPullRequests(pullRequests)[0];
    const expectedTime = new Date(basePR.createdAt).toLocaleTimeString(
      'en-US',
      timeOptions,
    );
    expect(result.time).toBe(expectedTime);
  });
});
