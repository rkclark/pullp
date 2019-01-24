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
  url: 'https://github.com/',
  number: 162,
  title: 'Dockerise test suite',
  author: {
    avatarUrl: 'https://avatars1.githubusercontent.com/',
    login: 'dev3',
    url: 'https://github.com/',
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

const userTeamsData = {
  viewer: {
    login: 'dev',
    organizations: [
      {
        teams: [{ id: 'team1', name: 'Team Awesome' }],
      },
    ],
  },
};

describe('transformPullRequests()', () => {
  describe('with a single pull request', () => {
    const pullRequests = {
      edges: [{ node: basePR }],
    };

    const result = transformPullRequests(pullRequests, userTeamsData)[0];

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
        basePR.reviewRequests.edges[2].node,
      ];

      expect(result.reviewRequests).toEqual(expectedReviewRequests);
    });

    describe('currentUserReviewRequested flag', () => {
      describe("when current user's review has been requested via their personal login", () => {
        it('sets currentUserReviewRequested to true', () => {
          const testResult = transformPullRequests(pullRequests, {
            ...userTeamsData,
            viewer: {
              ...userTeamsData.viewer,
              login: 'dev4', // Is requested, and does not have a review in reviews array
            },
          })[0];

          expect(testResult.currentUserReviewRequested).toBe(true);
        });
      });

      describe("when current user's review has not been requested via their personal login", () => {
        it('sets currentUserReviewRequested to false', () => {
          const testResult = transformPullRequests(pullRequests, {
            ...userTeamsData,
            viewer: {
              ...userTeamsData.viewer,
              login: 'someoneElse', // Is not requested, and does not have a review in reviews array
            },
          })[0];

          expect(testResult.currentUserReviewRequested).toBe(false);
        });

        describe('when review has been requested from a team the user is part of', () => {
          it('sets currentUserReviewRequested to true', () => {
            const reviewRequests = {
              edges: [
                {
                  node: {
                    requestedReviewer: {
                      id: 'team1',
                      avatarUrl: 'https://avatars0.githubusercontent.com/',
                    },
                  },
                },
              ],
            };

            const pullRequestData = {
              edges: [{ node: { ...basePR, reviewRequests } }],
            };

            const testResult = transformPullRequests(pullRequestData, {
              ...userTeamsData,
              viewer: {
                ...userTeamsData.viewer,
                login: 'team1Member', // Is part of team with id "team1"
              },
            })[0];
            expect(testResult.currentUserReviewRequested).toBe(true);
          });

          describe('when the current user is the pull request author', () => {
            it('sets currentUserReviewRequested to false', () => {
              const reviewRequests = {
                edges: [
                  {
                    node: {
                      requestedReviewer: {
                        id: 'team1',
                        avatarUrl: 'https://avatars0.githubusercontent.com/',
                      },
                    },
                  },
                ],
              };

              const pullRequestData = {
                edges: [{ node: { ...basePR, reviewRequests } }],
              };

              const testResult = transformPullRequests(pullRequestData, {
                ...userTeamsData,
                viewer: {
                  ...userTeamsData.viewer,
                  login: 'dev3', // is the PR author
                },
              })[0];

              expect(testResult.currentUserReviewRequested).toBe(false);
            });
          });
        });

        describe('when review has been requested from a team the user is not part of', () => {
          it('sets currentUserReviewRequested to false', () => {
            const reviewRequests = {
              edges: [
                {
                  node: {
                    requestedReviewer: {
                      id: 'team2',
                      avatarUrl: 'https://avatars0.githubusercontent.com/',
                    },
                  },
                },
              ],
            };

            const pullRequestData = {
              edges: [{ node: { ...basePR, reviewRequests } }],
            };

            const testResult = transformPullRequests(pullRequestData, {
              ...userTeamsData,
              viewer: {
                ...userTeamsData.viewer,
                login: 'someoneElse', // Not a member of "team2"
              },
            })[0];
            expect(testResult.currentUserReviewRequested).toBe(false);
          });
        });

        describe("when current user's review is requested", () => {
          describe('when the current user has already reviewed the PR', () => {
            it('sets currentUserReviewRequested to false', () => {
              const testResult = transformPullRequests(pullRequests, {
                ...userTeamsData,
                viewer: {
                  ...userTeamsData.viewer,
                  login: 'dev', // Is requested, and has a review in the reviews array
                },
              })[0];

              expect(testResult.currentUserReviewRequested).toBe(false);
            });
          });
        });
      });
    });

    describe('reviewedByCurrentUser flag', () => {
      describe("when current user's review is not requested", () => {
        describe('when the current user has already reviewed the PR', () => {
          it('sets reviewedByCurrentUser to true', () => {
            const testResult = transformPullRequests(pullRequests, {
              ...userTeamsData,
              viewer: {
                ...userTeamsData.viewer,
                login: 'dev', // Has a review in the reviews array
              },
            })[0];

            expect(testResult.reviewedByCurrentUser).toBe(true);
          });

          describe('when the current user has not already reviewed the PR', () => {
            it('sets reviewedByCurrentUser to false', () => {
              const testResult = transformPullRequests(pullRequests, {
                ...userTeamsData,
                viewer: {
                  ...userTeamsData.viewer,
                  login: 'someoneElse', // Doesn't have a review in the reviews array
                },
              })[0];

              expect(testResult.reviewedByCurrentUser).toBe(false);
            });
          });
        });
      });
    });
  });
});
