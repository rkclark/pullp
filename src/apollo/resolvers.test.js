import resolvers from './resolvers';
import { GET_CURRENT_USER, GET_USER_TEAMS } from './queries';
import processNotifications from './processNotifications';

jest.mock('./processNotifications');

describe('Apollo resolvers', () => {
  describe('PullRequest.pullpPullRequest', () => {
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
              id: 'review1',
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
              id: 'review2',
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
              id: 'review3',
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
              id: 'review4',
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
              id: 'reviewRequest1',
              requestedReviewer: {
                login: 'dev',
                avatarUrl: 'https://avatars0.githubusercontent.com/',
              },
            },
          },
          {
            node: {
              id: 'reviewRequest2',
              requestedReviewer: {
                login: 'dev2',
                avatarUrl: 'https://avatars0.githubusercontent.com/',
              },
            },
          },
          {
            node: {
              id: 'reviewRequest3',
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
        organizations: {
          edges: [
            {
              node: {
                teams: [{ id: 'team1', name: 'Team Awesome' }],
              },
            },
          ],
        },
      },
    };

    const currentUserData = {
      viewer: {
        id: '1234',
        login: 'dev',
        avatarUrl: 'url',
        url: 'url',
      },
    };

    const readQueryMock = jest.fn();
    const getCacheKeyMock = jest.fn();
    const readFragmentMock = jest.fn();

    const apolloClient = {
      cache: {
        readQuery: readQueryMock,
        readFragment: readFragmentMock,
      },
      getCacheKey: getCacheKeyMock,
    };

    beforeAll(() => {
      window.Notification = class Notification {};
    });

    beforeEach(() => {
      readQueryMock.mockImplementation(({ query }) => {
        if (query === GET_USER_TEAMS) {
          return userTeamsData;
        }

        if (query === GET_CURRENT_USER) {
          return currentUserData;
        }

        return null;
      });
    });

    afterEach(() => {
      readQueryMock.mockReset();
      getCacheKeyMock.mockReset();
      readFragmentMock.mockReset();
    });

    describe('basic fields', () => {
      let result;

      beforeEach(() => {
        result = resolvers.PullRequest.pullpPullRequest(
          basePR,
          undefined,
          apolloClient,
        );
      });

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
    });

    describe('currentUserReviewRequested flag', () => {
      describe("when current user's review has been requested via their personal login", () => {
        beforeEach(() => {
          readQueryMock.mockImplementation(({ query }) => {
            if (query === GET_USER_TEAMS) {
              return {
                ...userTeamsData,
                viewer: {
                  ...userTeamsData.viewer,
                  login: 'dev4', // Is requested, and does not have a review in reviews array
                },
              };
            }

            if (query === GET_CURRENT_USER) {
              return {
                viewer: {
                  ...currentUserData.viewer,
                  login: 'dev4',
                },
              };
            }

            return null;
          });
        });

        it('sets currentUserReviewRequested to true', () => {
          const testResult = resolvers.PullRequest.pullpPullRequest(
            basePR,
            undefined,
            apolloClient,
          );

          expect(testResult.currentUserReviewRequested).toBe(true);
        });

        it('sets userReviewRequestId to the id of the review request', () => {
          const testResult = resolvers.PullRequest.pullpPullRequest(
            basePR,
            undefined,
            apolloClient,
          );

          expect(testResult.userReviewRequestId).toBe(
            basePR.reviewRequests.edges[2].node.id,
          );
        });
      });

      describe("when current user's review has not been requested via their personal login", () => {
        it('sets currentUserReviewRequested to false', () => {
          readQueryMock.mockImplementation(({ query }) => {
            if (query === GET_USER_TEAMS) {
              return {
                ...userTeamsData,
                viewer: {
                  ...userTeamsData.viewer,
                  login: 'someoneElse', // Is not requested, and does not have a review in reviews array
                },
              };
            }

            if (query === GET_CURRENT_USER) {
              return {
                viewer: {
                  ...currentUserData.viewer,
                  login: 'someoneElse',
                },
              };
            }

            return null;
          });

          const testResult = resolvers.PullRequest.pullpPullRequest(
            basePR,
            undefined,
            apolloClient,
          );

          expect(testResult.currentUserReviewRequested).toBe(false);
        });

        describe('when review has been requested from a team the user is part of', () => {
          describe('when the current user is not the pull request author', () => {
            let reviewRequests;
            beforeEach(() => {
              reviewRequests = {
                edges: [
                  {
                    node: {
                      id: 'reviewRequest1',
                      requestedReviewer: {
                        id: 'team1',
                        avatarUrl: 'https://avatars0.githubusercontent.com/',
                      },
                    },
                  },
                ],
              };

              readQueryMock.mockImplementation(({ query }) => {
                if (query === GET_USER_TEAMS) {
                  return {
                    ...userTeamsData,
                    viewer: {
                      ...userTeamsData.viewer,
                      login: 'team1Member', // Is part of team with id "team1"
                    },
                  };
                }

                if (query === GET_CURRENT_USER) {
                  return {
                    viewer: {
                      ...currentUserData.viewer,
                      login: 'team1Member',
                    },
                  };
                }

                return null;
              });
            });

            it('sets currentUserReviewRequested to true', () => {
              const testResult = resolvers.PullRequest.pullpPullRequest(
                { ...basePR, reviewRequests },
                undefined,
                apolloClient,
              );
              expect(testResult.currentUserReviewRequested).toBe(true);
            });

            it('sets userReviewRequestId to the id of the review request', () => {
              const testResult = resolvers.PullRequest.pullpPullRequest(
                { ...basePR, reviewRequests },
                undefined,
                apolloClient,
              );

              expect(testResult.userReviewRequestId).toBe(
                basePR.reviewRequests.edges[0].node.id,
              );
            });
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

              readQueryMock.mockImplementation(({ query }) => {
                if (query === GET_USER_TEAMS) {
                  return {
                    ...userTeamsData,
                    viewer: {
                      ...userTeamsData.viewer,
                      login: 'dev3', // is the PR author
                    },
                  };
                }

                if (query === GET_CURRENT_USER) {
                  return {
                    viewer: {
                      ...currentUserData.viewer,
                      login: 'dev3',
                    },
                  };
                }

                return null;
              });

              const testResult = resolvers.PullRequest.pullpPullRequest(
                { ...basePR, reviewRequests },
                undefined,
                apolloClient,
              );

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

            readQueryMock.mockImplementation(({ query }) => {
              if (query === GET_USER_TEAMS) {
                return {
                  ...userTeamsData,
                  viewer: {
                    ...userTeamsData.viewer,
                    login: 'someoneElse', // Not a member of "team2"
                  },
                };
              }

              if (query === GET_CURRENT_USER) {
                return {
                  viewer: {
                    ...currentUserData.viewer,
                    login: 'someoneElse',
                  },
                };
              }

              return null;
            });

            const testResult = resolvers.PullRequest.pullpPullRequest(
              { ...basePR, reviewRequests },
              undefined,
              apolloClient,
            );

            expect(testResult.currentUserReviewRequested).toBe(false);
          });
        });
      });
    });

    describe('reviewedByCurrentUser flag', () => {
      describe("when current user's review is not requested", () => {
        describe('when the current user has already reviewed the PR', () => {
          it('sets reviewedByCurrentUser to true', () => {
            readQueryMock.mockImplementation(({ query }) => {
              if (query === GET_USER_TEAMS) {
                return {
                  ...userTeamsData,
                  viewer: {
                    ...userTeamsData.viewer,
                    login: 'dev', // Has a review in the reviews array
                  },
                };
              }

              if (query === GET_CURRENT_USER) {
                return {
                  viewer: {
                    ...currentUserData.viewer,
                    login: 'dev',
                  },
                };
              }

              return null;
            });

            const testResult = resolvers.PullRequest.pullpPullRequest(
              basePR,
              undefined,
              {
                cache: {
                  readQuery: readQueryMock,
                },
                getCacheKey: () => {},
              },
            );

            expect(testResult.reviewedByCurrentUser).toBe(true);
          });

          describe('when the current user has not already reviewed the PR', () => {
            it('sets reviewedByCurrentUser to false', () => {
              readQueryMock.mockImplementation(({ query }) => {
                if (query === GET_USER_TEAMS) {
                  return {
                    ...userTeamsData,
                    viewer: {
                      ...userTeamsData.viewer,
                      login: 'someoneElse', // Doesn't have a review in the reviews array
                    },
                  };
                }

                if (query === GET_CURRENT_USER) {
                  return {
                    viewer: {
                      ...currentUserData.viewer,
                      login: 'someoneElse',
                    },
                  };
                }

                return null;
              });

              const testResult = resolvers.PullRequest.pullpPullRequest(
                basePR,
                undefined,
                {
                  cache: {
                    readQuery: readQueryMock,
                  },
                  getCacheKey: () => {},
                },
              );

              expect(testResult.reviewedByCurrentUser).toBe(false);
            });
          });
        });
      });
    });

    describe('notifications', () => {
      describe('when the pull request has existing notifications', () => {
        it('retrieves them and sends them for processing along with the extended pull request and current user', () => {
          const existingNotifications = [{ type: 'aNotification' }];
          getCacheKeyMock.mockReturnValue('1');
          readFragmentMock.mockReturnValue({
            pullpPullRequest: {
              notifications: existingNotifications,
            },
          });

          resolvers.PullRequest.pullpPullRequest(
            basePR,
            undefined,
            apolloClient,
          );

          expect(processNotifications).toHaveBeenCalledWith({
            existingNotifications,
            extendedPullRequest: {
              ...basePR,
              pullpPullRequest: {
                __typename: 'PullpPullRequest',
                currentUserReviewRequested: true,
                date: 'Friday, Jan 4, 2019',
                reviewedByCurrentUser: true,
                userReviewRequestId: 'reviewRequest1',
                reviewsByAuthor: [
                  {
                    avatarUrl: 'https://avatars3.githubusercontent.com/dev',
                    login: 'dev',
                    states: ['DISMISSED', 'APPROVED'],
                  },
                  {
                    avatarUrl: 'https://avatars3.githubusercontent.com/dev2',
                    login: 'dev2',
                    states: ['CHANGES_REQUESTED', 'CHANGES_REQUESTED'],
                  },
                ],
                time: '8:11 AM',
              },
            },
            currentUser: currentUserData.viewer.login,
          });
        });
      });

      describe('when the pull request does not have existing notifications', () => {
        it('sends an empty array for processing along with the extended pull request', () => {
          getCacheKeyMock.mockReturnValue(null);

          resolvers.PullRequest.pullpPullRequest(
            basePR,
            undefined,
            apolloClient,
          );

          expect(processNotifications).toHaveBeenCalledWith({
            existingNotifications: [],
            currentUser: currentUserData.viewer.login,
            extendedPullRequest: {
              ...basePR,
              pullpPullRequest: {
                __typename: 'PullpPullRequest',
                currentUserReviewRequested: true,
                date: 'Friday, Jan 4, 2019',
                reviewedByCurrentUser: true,
                userReviewRequestId: 'reviewRequest1',
                reviewsByAuthor: [
                  {
                    avatarUrl: 'https://avatars3.githubusercontent.com/dev',
                    login: 'dev',
                    states: ['DISMISSED', 'APPROVED'],
                  },
                  {
                    avatarUrl: 'https://avatars3.githubusercontent.com/dev2',
                    login: 'dev2',
                    states: ['CHANGES_REQUESTED', 'CHANGES_REQUESTED'],
                  },
                ],
                time: '8:11 AM',
              },
            },
          });
        });
      });

      it('sets notifications using the processed notifications', () => {
        getCacheKeyMock.mockReturnValue('1');

        const expectedNotifications = [{}, {}, {}];
        processNotifications.mockReturnValue(expectedNotifications);

        const testResult = resolvers.PullRequest.pullpPullRequest(
          basePR,
          undefined,
          apolloClient,
        );

        expect(testResult.notifications).toEqual(expectedNotifications);
      });
    });
  });
});
