import MockDate from 'mockdate';
import newComments from './newComments';
import { notificationTypes } from '../../constants';

const { NEW_COMMENTS, NEW_COMMENTS_ON_YOUR_PR } = notificationTypes;

const pullRequestId = '12345';

const currentUser = 'dev';
const pullRequestTitle = 'Update Readme';

const userSettings = {
  notifications: {
    NEW_COMMENTS: {
      trigger: true,
    },
    NEW_COMMENTS_ON_YOUR_PR: {
      trigger: true,
    },
  },
};

const today = new Date();

describe('newComments', () => {
  const baseArgs = {
    currentUser,
    userSettings,
  };

  beforeAll(() => {
    MockDate.set(today);
  });

  describe('when user is the PR author', () => {
    const newCommentsOnYourPRNotification = {
      type: NEW_COMMENTS_ON_YOUR_PR,
      title: 'New Comments On Your PR',
      message: '5 new comments on "Update Readme"',
      comments: {
        count: 5,
        increment: 5,
      },
      sourceNodeId: pullRequestId,
      trigger: true,
      timestamp: today.toISOString(),
    };

    describe(`when there is an existing ${NEW_COMMENTS_ON_YOUR_PR} notification`, () => {
      describe('when the comment count has not increased', () => {
        it('does not add a new notification', () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [newCommentsOnYourPRNotification],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 5,
              },
              author: {
                login: currentUser,
              },
            },
          });

          expect(notifications.length).toBe(0);
        });
      });

      describe('when the comment count has increased', () => {
        it(`adds a new ${NEW_COMMENTS_ON_YOUR_PR} notification with the comment count and increment`, () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [newCommentsOnYourPRNotification],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 7,
              },
              author: {
                login: currentUser,
              },
            },
          });

          expect(notifications.length).toBe(1);
          const {
            type,
            title,
            message,
            comments,
            sourceNodeId,
            dismissed,
            timestamp,
          } = notifications[0];

          expect(type).toBe(newCommentsOnYourPRNotification.type);
          expect(title).toBe(newCommentsOnYourPRNotification.title);
          expect(message).toBe('2 new comments on "Update Readme"');
          expect(comments).toEqual({
            count: 7,
            increment: 2,
          });
          expect(sourceNodeId).toBe(
            newCommentsOnYourPRNotification.sourceNodeId,
          );
          expect(dismissed).toBe(false);
          expect(timestamp).toBe(today.toISOString());
        });
      });

      describe('when the increment is 1', () => {
        it(`does not pluralise "comment" in the message`, () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [newCommentsOnYourPRNotification],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 6,
              },
              author: {
                login: currentUser,
              },
            },
          });

          const { message } = notifications[0];

          expect(message).toBe('1 new comment on "Update Readme"');
        });
      });
    });

    describe(`when there is not an existing ${NEW_COMMENTS_ON_YOUR_PR} notification`, () => {
      describe('when the comment count has not increased', () => {
        it('does not add a new notification', () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 0,
              },
              author: {
                login: currentUser,
              },
            },
          });

          expect(notifications.length).toBe(0);
        });
      });

      describe('when the comment count has increased', () => {
        it(`adds a new ${NEW_COMMENTS_ON_YOUR_PR} notification with the comment count and increment`, () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 7,
              },
              author: {
                login: currentUser,
              },
            },
          });

          expect(notifications.length).toBe(1);
          const {
            type,
            title,
            message,
            comments,
            sourceNodeId,
            dismissed,
            timestamp,
          } = notifications[0];

          expect(type).toBe(newCommentsOnYourPRNotification.type);
          expect(title).toBe(newCommentsOnYourPRNotification.title);
          expect(message).toBe('7 new comments on "Update Readme"');
          expect(comments).toEqual({
            count: 7,
            increment: 7,
          });
          expect(sourceNodeId).toBe(
            newCommentsOnYourPRNotification.sourceNodeId,
          );
          expect(dismissed).toBe(false);
          expect(timestamp).toBe(today.toISOString());
        });
      });
    });

    describe(`when the user setting to trigger ${NEW_COMMENTS_ON_YOUR_PR} is true`, () => {
      it('adds "trigger: true" to the notification', () => {
        const notifications = newComments({
          ...baseArgs,
          existingNotifications: [],
          pullRequest: {
            id: pullRequestId,
            title: pullRequestTitle,
            comments: {
              totalCount: 7,
            },
            author: {
              login: currentUser,
            },
          },
        });

        expect(notifications.length).toBe(1);
        const { trigger } = notifications[0];

        expect(trigger).toBe(true);
      });
    });

    describe(`when the user setting to trigger ${NEW_COMMENTS_ON_YOUR_PR} is false`, () => {
      it('adds "trigger: false" to the notification', () => {
        const notifications = newComments({
          ...baseArgs,
          existingNotifications: [],
          userSettings: {
            NEW_COMMENTS_ON_YOUR_PR: {
              trigger: false,
            },
          },
          pullRequest: {
            id: pullRequestId,
            title: pullRequestTitle,
            comments: {
              totalCount: 7,
            },
            author: {
              login: currentUser,
            },
          },
        });

        expect(notifications.length).toBe(1);
        const { trigger } = notifications[0];

        expect(trigger).toBe(false);
      });
    });
  });

  describe('when user is not PR author', () => {
    const newCommentsOnPRNotification = {
      type: NEW_COMMENTS,
      title: 'New Comments On PR',
      message: '5 new comments on "Update Readme"',
      comments: {
        count: 5,
        increment: 5,
      },
      sourceNodeId: pullRequestId,
    };

    describe(`when there is an existing ${NEW_COMMENTS} notification`, () => {
      describe('when the comment count has not increased', () => {
        it('does not add a new notification', () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [newCommentsOnPRNotification],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 5,
              },
              author: {
                login: 'someoneElse',
              },
            },
          });

          expect(notifications.length).toBe(0);
        });
      });

      describe('when the comment count has increased', () => {
        it(`adds a new ${NEW_COMMENTS} notification with the comment count and increment`, () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [newCommentsOnPRNotification],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 7,
              },
              author: {
                login: 'someoneElse',
              },
            },
          });

          expect(notifications.length).toBe(1);
          const {
            type,
            title,
            message,
            comments,
            sourceNodeId,
            dismissed,
            timestamp,
          } = notifications[0];

          expect(type).toBe(newCommentsOnPRNotification.type);
          expect(title).toBe(newCommentsOnPRNotification.title);
          expect(message).toBe('2 new comments on "Update Readme"');
          expect(comments).toEqual({
            count: 7,
            increment: 2,
          });
          expect(sourceNodeId).toBe(newCommentsOnPRNotification.sourceNodeId);
          expect(dismissed).toBe(false);
          expect(timestamp).toBe(today.toISOString());
        });

        describe('when the increment is 1', () => {
          it(`does not pluralise "comment" in the message`, () => {
            const notifications = newComments({
              ...baseArgs,
              existingNotifications: [newCommentsOnPRNotification],
              pullRequest: {
                id: pullRequestId,
                title: pullRequestTitle,
                comments: {
                  totalCount: 6,
                },
                author: {
                  login: currentUser,
                },
              },
            });

            const { message } = notifications[0];

            expect(message).toBe('1 new comment on "Update Readme"');
          });
        });
      });
    });

    describe(`when there is not an existing ${NEW_COMMENTS} notification`, () => {
      describe('when the comment count has not increased', () => {
        it('does not add a new notification', () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 0,
              },
              author: {
                login: 'someoneElse',
              },
            },
          });

          expect(notifications.length).toBe(0);
        });
      });

      describe('when the comment count has increased', () => {
        it(`adds a new ${NEW_COMMENTS} notification with the comment count and increment`, () => {
          const notifications = newComments({
            ...baseArgs,
            existingNotifications: [],
            pullRequest: {
              id: pullRequestId,
              title: pullRequestTitle,
              comments: {
                totalCount: 7,
              },
              author: {
                login: 'someoneElse',
              },
            },
          });

          expect(notifications.length).toBe(1);
          const {
            type,
            title,
            message,
            comments,
            sourceNodeId,
            dismissed,
            timestamp,
          } = notifications[0];

          expect(type).toBe(newCommentsOnPRNotification.type);
          expect(title).toBe(newCommentsOnPRNotification.title);
          expect(message).toBe('7 new comments on "Update Readme"');
          expect(comments).toEqual({
            count: 7,
            increment: 7,
          });
          expect(sourceNodeId).toBe(newCommentsOnPRNotification.sourceNodeId);
          expect(dismissed).toBe(false);
          expect(timestamp).toBe(today.toISOString());
        });
      });
    });

    describe(`when the user setting to trigger ${NEW_COMMENTS} is true`, () => {
      it('adds "trigger: true" to the notification', () => {
        const notifications = newComments({
          ...baseArgs,
          existingNotifications: [],
          pullRequest: {
            id: pullRequestId,
            title: pullRequestTitle,
            comments: {
              totalCount: 7,
            },
            author: {
              login: 'someoneElse',
            },
          },
        });

        expect(notifications.length).toBe(1);
        const { trigger } = notifications[0];

        expect(trigger).toBe(true);
      });
    });

    describe(`when the user setting to trigger ${NEW_COMMENTS} is false`, () => {
      it('adds "trigger: false" to the notification', () => {
        const notifications = newComments({
          ...baseArgs,
          existingNotifications: [],
          userSettings: {
            NEW_COMMENTS: {
              trigger: false,
            },
          },
          pullRequest: {
            id: pullRequestId,
            title: pullRequestTitle,
            comments: {
              totalCount: 7,
            },
            author: {
              login: 'someoneElse',
            },
          },
        });

        expect(notifications.length).toBe(1);
        const { trigger } = notifications[0];

        expect(trigger).toBe(false);
      });
    });
  });
});
