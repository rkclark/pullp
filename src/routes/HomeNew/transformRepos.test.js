import transformRepos from './transformRepos';
import transformPullRequests from './transformPullRequests';

const mockPullRequests = [
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
const mockReposData = [
  {
    pullRequests: [],
  },
];

jest.mock('./transformPullRequests.js', () => jest.fn());

describe('transformRepos()', () => {
  let result;

  beforeAll(() => {
    transformPullRequests.mockImplementation(() => mockPullRequests);
    result = transformRepos(mockReposData);
  });

  it("transforms each repo's pull requests data", () => {
    expect(result[0].pullRequests).toEqual(mockPullRequests);
  });
});
