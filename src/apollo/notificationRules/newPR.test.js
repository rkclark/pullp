import newPR from './newPR';
import { notificationTypes } from '../../constants';

const { NEW_PR } = notificationTypes;

const pullRequestId = '123';

const pullRequestTitle = 'A new PR';
const pullRequestAuthor = 'User';

const newPRNotification = {
  type: NEW_PR,
  title: 'New Pull Request',
  message: `${pullRequestAuthor} opened "${pullRequestTitle}"`,
  sourceNodeId: pullRequestId,
};

const currentUser = 'dev';

describe('newPR', () => {
  describe(`when there is an existing ${NEW_PR} notification`, () => {
    it('does not add a new one', () => {
      const notifications = newPR({
        currentUser,
        existingNotifications: [newPRNotification],
        pullRequest: {
          id: pullRequestId,
          title: pullRequestTitle,
          author: {
            login: currentUser,
          },
        },
      });

      expect(notifications.length).toBe(0);
    });
  });

  describe(`when there is no existing ${NEW_PR} notification for the PR`, () => {
    describe('when the user is the PR author', () => {
      it('does not add a new notification', () => {
        const notifications = newPR({
          currentUser,
          existingNotifications: [],
          pullRequest: {
            id: pullRequestId,
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
      it(`adds a new ${NEW_PR} notification`, () => {
        const notifications = newPR({
          currentUser,
          existingNotifications: [],
          pullRequest: {
            id: pullRequestId,
            title: pullRequestTitle,
            author: {
              login: pullRequestAuthor,
            },
          },
        });
        expect(notifications.length).toBe(1);

        const { type, title, message, sourceNodeId } = notifications[0];

        expect(type).toBe(newPRNotification.type);
        expect(title).toBe(newPRNotification.title);
        expect(message).toBe(newPRNotification.message);
        expect(sourceNodeId).toBe(newPRNotification.sourceNodeId);
      });
    });
  });
});
