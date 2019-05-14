import pullRequestStateChange from './pullRequestStateChange';
import {
  notificationTypes,
  pullRequestStates,
  stateChangeNotificationSubTypes,
} from '../../constants';

const { PR_STATE_CHANGE } = notificationTypes;

const pullRequestId = '123';

const pullRequestTitle = 'A new PR';
const pullRequestAuthor = 'User';

const pullRequestStateChangeNotification = {
  type: PR_STATE_CHANGE,
  subType: stateChangeNotificationSubTypes.OPENED,
  title: 'New Pull Request',
  message: `${pullRequestAuthor} opened "${pullRequestTitle}"`,
  sourceNodeId: pullRequestId,
};

const currentUser = 'dev';

describe('pullRequestStateChange', () => {
  describe(`when there is an existing ${PR_STATE_CHANGE} notification`, () => {
    it('does not add a new one', () => {
      const notifications = pullRequestStateChange({
        currentUser,
        existingNotifications: [pullRequestStateChangeNotification],
        pullRequest: {
          id: pullRequestId,
          title: pullRequestTitle,
          state: pullRequestStates.OPEN,
          author: {
            login: pullRequestAuthor,
          },
        },
      });

      expect(notifications.length).toBe(0);
    });
  });

  describe(`when the PR is not open`, () => {
    it('does not add a new notification', () => {
      const notifications = pullRequestStateChange({
        currentUser,
        existingNotifications: [],
        pullRequest: {
          state: pullRequestStates.CLOSED,
          id: pullRequestId,
          title: pullRequestTitle,
          author: {
            login: pullRequestAuthor,
          },
        },
      });

      expect(notifications.length).toBe(0);
    });
  });

  describe(`when there is no existing ${PR_STATE_CHANGE} notification for the PR`, () => {
    describe('when the user is the PR author', () => {
      it('does not add a new notification', () => {
        const notifications = pullRequestStateChange({
          currentUser,
          existingNotifications: [],
          pullRequest: {
            id: pullRequestId,
            state: pullRequestStates.OPEN,
            title: pullRequestTitle,
            author: {
              login: currentUser,
            },
          },
        });

        expect(notifications.length).toBe(0);
      });
    });

    describe('when the user is not the PR author', () => {
      it(`adds a new ${PR_STATE_CHANGE} notification`, () => {
        const notifications = pullRequestStateChange({
          currentUser,
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

        const { type, title, message, sourceNodeId } = notifications[0];

        expect(type).toBe(pullRequestStateChangeNotification.type);
        expect(title).toBe(pullRequestStateChangeNotification.title);
        expect(message).toBe(pullRequestStateChangeNotification.message);
        expect(sourceNodeId).toBe(
          pullRequestStateChangeNotification.sourceNodeId,
        );
      });
    });
  });
});
