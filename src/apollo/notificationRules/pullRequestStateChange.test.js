import pullRequestStateChange from './pullRequestStateChange';
import {
  notificationTypes,
  pullRequestStates,
  stateChangeNotificationSubTypes,
} from '../../constants';

const { PR_STATE_CHANGE } = notificationTypes;

const { OPENED, RE_OPENED, CLOSED, MERGED } = stateChangeNotificationSubTypes;

const pullRequestId = '123';

const pullRequestTitle = 'A new PR';
const pullRequestAuthor = 'User';

const currentUser = 'dev';

const pullRequestOpenedNotification = {
  type: PR_STATE_CHANGE,
  subType: stateChangeNotificationSubTypes.OPENED,
  title: 'New Pull Request',
  message: `${pullRequestAuthor} opened "${pullRequestTitle}"`,
  sourceNodeId: pullRequestId,
  trigger: true,
};

const pullRequestReOpenedNotification = {
  type: PR_STATE_CHANGE,
  subType: stateChangeNotificationSubTypes.RE_OPENED,
  title: 'Pull Request Re-opened',
  message: `${pullRequestAuthor} re-opened "${pullRequestTitle}"`,
  sourceNodeId: pullRequestId,
  trigger: true,
};

const pullRequestClosedNotification = {
  type: PR_STATE_CHANGE,
  subType: stateChangeNotificationSubTypes.CLOSED,
  title: 'Pull Request Closed',
  message: `"${pullRequestTitle}"`,
  sourceNodeId: pullRequestId,
  trigger: true,
};

const pullRequestMergedNotification = {
  type: PR_STATE_CHANGE,
  subType: stateChangeNotificationSubTypes.MERGED,
  title: 'Pull Request Merged',
  message: `"${pullRequestTitle}"`,
  sourceNodeId: pullRequestId,
  trigger: true,
};

const userSettings = {
  notifications: {
    PR_STATE_CHANGE: {
      trigger: true,
    },
  },
};

const baseArgs = {
  currentUser,
  userSettings,
};

describe('pullRequestStateChange', () => {
  describe(`PR ${OPENED} notifications`, () => {
    describe('when there is no existing state change notification', () => {
      describe(`when the PR state is ${pullRequestStates.OPEN}`, () => {
        it(`adds a new ${PR_STATE_CHANGE} notification with subType ${OPENED}`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.OPEN,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(1);
          const {
            type,
            title,
            message,
            sourceNodeId,
            subType,
          } = notifications[0];
          expect(type).toBe(pullRequestOpenedNotification.type);
          expect(title).toBe(pullRequestOpenedNotification.title);
          expect(message).toBe(pullRequestOpenedNotification.message);
          expect(subType).toBe(pullRequestOpenedNotification.subType);
          expect(sourceNodeId).toBe(pullRequestOpenedNotification.sourceNodeId);
        });

        describe('when there is an existing state change notification', () => {
          it(`does not add a new ${PR_STATE_CHANGE} notification`, () => {
            const notifications = pullRequestStateChange({
              currentUser,
              existingNotifications: [pullRequestOpenedNotification],
              pullRequest: {
                id: pullRequestId,
                state: pullRequestStates.OPEN,
                title: pullRequestTitle,
                author: {
                  login: pullRequestAuthor,
                },
              },
            });
            expect(notifications.length).toBe(0);
          });
        });
      });

      describe(`when the PR state is not ${pullRequestStates.OPEN}`, () => {
        it(`does not add a new ${PR_STATE_CHANGE} notification`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.CLOSED,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(0);
        });
      });
    });
  });

  describe(`PR ${CLOSED} notifications`, () => {
    describe(`when the PR state is ${pullRequestStates.CLOSED}`, () => {
      describe(`when the most recent state change is not ${CLOSED}`, () => {
        it(`adds a new ${PR_STATE_CHANGE} notification with subType ${CLOSED}`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [pullRequestOpenedNotification],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.CLOSED,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(1);
          const {
            type,
            title,
            message,
            sourceNodeId,
            subType,
          } = notifications[0];
          expect(type).toBe(pullRequestClosedNotification.type);
          expect(title).toBe(pullRequestClosedNotification.title);
          expect(message).toBe(pullRequestClosedNotification.message);
          expect(sourceNodeId).toBe(pullRequestClosedNotification.sourceNodeId);
          expect(subType).toBe(pullRequestClosedNotification.subType);
        });

        describe('when the user is the PR author', () => {
          it('prepends "Your" to the notification title', () => {
            const notifications = pullRequestStateChange({
              currentUser,
              existingNotifications: [pullRequestOpenedNotification],
              pullRequest: {
                id: pullRequestId,
                state: pullRequestStates.CLOSED,
                title: pullRequestTitle,
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
              sourceNodeId,
              subType,
            } = notifications[0];
            expect(type).toBe(pullRequestClosedNotification.type);
            expect(title).toBe(`Your ${pullRequestClosedNotification.title}`);
            expect(message).toBe(pullRequestClosedNotification.message);
            expect(sourceNodeId).toBe(
              pullRequestClosedNotification.sourceNodeId,
            );
            expect(subType).toBe(pullRequestClosedNotification.subType);
          });
        });
      });

      describe(`when the most recent state change is ${CLOSED}`, () => {
        it(`does not add a new ${PR_STATE_CHANGE} notification`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [pullRequestClosedNotification],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.CLOSED,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(0);
        });
      });
    });
  });

  describe(`PR ${MERGED} notifications`, () => {
    describe(`when the PR state is ${pullRequestStates.MERGED}`, () => {
      describe(`when the most recent state change is not ${MERGED}`, () => {
        it(`adds a new ${PR_STATE_CHANGE} notification with subType ${MERGED}`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [pullRequestOpenedNotification],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.MERGED,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(1);
          const {
            type,
            title,
            message,
            sourceNodeId,
            subType,
          } = notifications[0];
          expect(type).toBe(pullRequestMergedNotification.type);
          expect(title).toBe(pullRequestMergedNotification.title);
          expect(message).toBe(pullRequestMergedNotification.message);
          expect(sourceNodeId).toBe(pullRequestMergedNotification.sourceNodeId);
          expect(subType).toBe(pullRequestMergedNotification.subType);
        });

        describe('when the user is the PR author', () => {
          it('prepends "Your" to the notification title', () => {
            const notifications = pullRequestStateChange({
              currentUser,
              existingNotifications: [pullRequestOpenedNotification],
              pullRequest: {
                id: pullRequestId,
                state: pullRequestStates.MERGED,
                title: pullRequestTitle,
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
              sourceNodeId,
              subType,
            } = notifications[0];
            expect(type).toBe(pullRequestMergedNotification.type);
            expect(title).toBe(`Your ${pullRequestMergedNotification.title}`);
            expect(message).toBe(pullRequestMergedNotification.message);
            expect(sourceNodeId).toBe(
              pullRequestMergedNotification.sourceNodeId,
            );
            expect(subType).toBe(pullRequestMergedNotification.subType);
          });
        });
      });

      describe(`when the most recent state change is ${MERGED}`, () => {
        it(`does not add a new ${PR_STATE_CHANGE} notification`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [pullRequestMergedNotification],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.MERGED,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(0);
        });
      });
    });
  });

  describe(`PR ${RE_OPENED} notifications`, () => {
    describe(`when the PR state is ${pullRequestStates.OPEN}`, () => {
      describe(`when the most recent state change is not ${OPENED}`, () => {
        it(`adds a new ${PR_STATE_CHANGE} notification with subType ${RE_OPENED}`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [pullRequestClosedNotification],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.OPEN,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(1);
          const {
            type,
            title,
            message,
            sourceNodeId,
            subType,
          } = notifications[0];
          expect(type).toBe(pullRequestReOpenedNotification.type);
          expect(title).toBe(pullRequestReOpenedNotification.title);
          expect(message).toBe(pullRequestReOpenedNotification.message);
          expect(sourceNodeId).toBe(
            pullRequestReOpenedNotification.sourceNodeId,
          );
          expect(subType).toBe(pullRequestReOpenedNotification.subType);
        });
      });

      describe(`when the most recent state change is ${RE_OPENED}`, () => {
        it(`does not add a new ${PR_STATE_CHANGE} notification`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [pullRequestReOpenedNotification],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.OPEN,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(0);
        });
      });

      describe(`when the most recent state change is ${OPENED}`, () => {
        it(`does not add a new ${PR_STATE_CHANGE} notification`, () => {
          const notifications = pullRequestStateChange({
            ...baseArgs,
            existingNotifications: [pullRequestOpenedNotification],
            pullRequest: {
              id: pullRequestId,
              state: pullRequestStates.OPEN,
              title: pullRequestTitle,
              author: {
                login: pullRequestAuthor,
              },
            },
          });
          expect(notifications.length).toBe(0);
        });
      });
    });
  });

  describe(`when the user setting to trigger ${PR_STATE_CHANGE} is true`, () => {
    it('adds "trigger: true" to the notification', () => {
      const notifications = pullRequestStateChange({
        ...baseArgs,
        existingNotifications: [],
        pullRequest: {
          id: pullRequestId,
          state: pullRequestStates.OPEN,
          title: pullRequestTitle,
          author: {
            login: pullRequestAuthor,
          },
        },
      });
      expect(notifications.length).toBe(1);
      const { trigger } = notifications[0];

      expect(trigger).toBe(true);
    });
  });

  describe(`when the user setting to trigger ${PR_STATE_CHANGE} is false`, () => {
    it('adds "trigger: false" to the notification', () => {
      const notifications = pullRequestStateChange({
        ...baseArgs,
        userSettings: {
          PR_STATE_CHANGE: {
            trigger: false,
          },
        },
        existingNotifications: [],
        pullRequest: {
          id: pullRequestId,
          state: pullRequestStates.OPEN,
          title: pullRequestTitle,
          author: {
            login: pullRequestAuthor,
          },
        },
      });
      expect(notifications.length).toBe(1);
      const { trigger } = notifications[0];

      expect(trigger).toBe(false);
    });
  });
});
