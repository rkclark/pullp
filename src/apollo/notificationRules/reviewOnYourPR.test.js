import MockDate from 'mockdate';
import reviewOnYourPR from './reviewOnYourPR';
import { notificationTypes } from '../../constants';

const { REVIEW_ON_YOUR_PR } = notificationTypes;

const reviewOnYourPRNotification = {
  type: REVIEW_ON_YOUR_PR,
  title: 'Review On Your PR',
  message: '',
  sourceNodeId: '123',
  dismissed: false,
};

const userSettings = {
  notifications: {
    REVIEW_ON_YOUR_PR: {
      trigger: true,
    },
  },
};

const currentUser = 'dev';
const reviewer = 'dev2';

const baseArgs = {
  currentUser,
  userSettings,
};

const today = new Date();

describe('reviewOnYourPR', () => {
  beforeAll(() => {
    MockDate.set(today);
  });

  describe(`when there is an existing ${REVIEW_ON_YOUR_PR} notification with the same review id`, () => {
    it('does not add a new one', () => {
      const notifications = reviewOnYourPR({
        ...baseArgs,
        existingNotifications: [reviewOnYourPRNotification],
        pullRequest: {
          author: {
            login: currentUser,
          },
          reviews: {
            edges: [
              {
                node: {
                  id: '123',
                  author: {
                    login: reviewer,
                  },
                },
              },
            ],
          },
        },
      });

      expect(notifications.length).toBe(0);
    });
  });

  describe(`when there is no existing ${REVIEW_ON_YOUR_PR} notification for the review`, () => {
    describe('when the user is the PR author', () => {
      it('adds a new notification with the correct message', () => {
        const notifications = reviewOnYourPR({
          ...baseArgs,
          existingNotifications: [],
          pullRequest: {
            author: {
              login: currentUser,
            },
            reviews: {
              edges: [
                {
                  node: {
                    id: '123',
                    author: {
                      login: reviewer,
                    },
                  },
                },
              ],
            },
            pullpPullRequest: {
              currentUserReviewRequested: true,
            },
          },
        });

        expect(notifications.length).toBe(1);
        const { 0: notification } = notifications;

        expect(notification.type).toBe(REVIEW_ON_YOUR_PR);
        expect(notification.dismissed).toBe(false);
        expect(notification.timestamp).toBe(today.toISOString());
        expect(notification.title).toBe(reviewOnYourPRNotification.title);
        expect(notification.message).toBe(
          `${reviewer} reviewed your pull request`,
        );
      });
    });

    describe('when the user is not the PR author', () => {
      it('does not add a new notification', () => {
        const notifications = reviewOnYourPR({
          ...baseArgs,
          existingNotifications: [],
          pullRequest: {
            author: {
              login: 'someoneElse',
            },
            reviews: {
              edges: [
                {
                  node: {
                    id: '123',
                    author: {
                      login: reviewer,
                    },
                  },
                },
              ],
            },
            pullpPullRequest: {
              currentUserReviewRequested: false,
            },
          },
        });
        expect(notifications.length).toBe(0);
      });
    });
  });

  describe(`when the user setting to trigger ${REVIEW_ON_YOUR_PR} is true`, () => {
    it('adds "trigger: true" to the notification', () => {
      const notifications = reviewOnYourPR({
        ...baseArgs,
        existingNotifications: [],
        pullRequest: {
          author: {
            login: currentUser,
          },
          reviews: {
            edges: [
              {
                node: {
                  id: '123',
                  author: {
                    login: reviewer,
                  },
                },
              },
            ],
          },
          pullpPullRequest: {
            currentUserReviewRequested: true,
          },
        },
      });

      expect(notifications.length).toBe(1);
      const { trigger } = notifications[0];

      expect(trigger).toBe(true);
    });
  });

  describe(`when the user setting to trigger ${REVIEW_ON_YOUR_PR} is false`, () => {
    it('adds "trigger: false" to the notification', () => {
      const notifications = reviewOnYourPR({
        ...baseArgs,
        userSettings: {
          notifications: {
            REVIEW_ON_YOUR_PR: {
              trigger: false,
            },
          },
        },
        existingNotifications: [],
        pullRequest: {
          author: {
            login: currentUser,
          },
          reviews: {
            edges: [
              {
                node: {
                  id: '123',
                  author: {
                    login: reviewer,
                  },
                },
              },
            ],
          },
          pullpPullRequest: {
            currentUserReviewRequested: true,
          },
        },
      });

      expect(notifications.length).toBe(1);
      const { trigger } = notifications[0];

      expect(trigger).toBe(false);
    });
  });
});
