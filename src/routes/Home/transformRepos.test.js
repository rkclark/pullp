import transformRepos from './transformRepos';
import transformPullRequests from './transformPullRequests';

const testRepoPRs = [
  {
    currentUserReviewRequested: false,
    reviewedByCurrentUser: true,
  },
  {
    currentUserReviewRequested: true,
    reviewedByCurrentUser: false,
  },
  {
    currentUserReviewRequested: true,
    reviewedByCurrentUser: false,
  },
  {
    currentUserReviewRequested: false,
    reviewedByCurrentUser: false,
  },
];

const testRepo2PRs = [{}, {}, {}, {}, {}, {}];

const testRepo3PRs = [{}, {}, {}, {}];

const testRepo4PRs = [{}, {}, {}, {}];

const mockReposData = [
  {
    name: 'testRepo',
    pullRequests: { totalCount: 4, edges: [{}, {}, {}, {}] },
  },
  {
    name: 'testRepo2',
    pullRequests: { totalCount: 6, edges: [{}, {}, {}, {}, {}, {}] },
  },
  {
    name: 'testRepo4', // Out of order to show that name sorting works
    pullRequests: { totalCount: 2, edges: [{}, {}, {}, {}] },
  },
  {
    name: 'testRepo3',
    pullRequests: { totalCount: 2, edges: [{}, {}, {}, {}] },
  },
];

jest.mock('./transformPullRequests.js', () => jest.fn());

describe('transformRepos()', () => {
  let result;

  beforeAll(() => {
    transformPullRequests
      .mockImplementationOnce(() => testRepoPRs)
      .mockImplementationOnce(() => testRepo2PRs)
      .mockImplementationOnce(() => testRepo3PRs)
      .mockImplementationOnce(() => testRepo4PRs);
    result = transformRepos(mockReposData);
  });

  it('sorts repos by number of pull requests and then name', () => {
    const expectedOrder = ['testRepo2', 'testRepo', 'testRepo3', 'testRepo4'];
    expect(result.map(repo => repo.name)).toEqual(expectedOrder);
  });

  it("transforms each repo's pull requests data", () => {
    expect(result[1].pullRequests).toEqual(testRepoPRs);
  });

  it('totals the number of review requests for the current user', () => {
    expect(result[1].currentUserReviewRequests).toBe(2);
  });

  it('totals the number of reviews by the current user', () => {
    expect(result[1].currentUserReviews).toBe(1);
  });

  it('totals the number of pull requests', () => {
    expect(result[1].totalPullRequests).toBe(4);
  });
});
