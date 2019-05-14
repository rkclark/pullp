import reviewRequested from './reviewRequested';
import { notificationTypes } from '../../constants';

const { REVIEW_REQUESTED } = notificationTypes;

const userReviewRequestId = '12345';

const reviewRequestedNotification = {
  type: REVIEW_REQUESTED,
  title: 'Review Requested',
  message: '',
  sourceNodeId: '123',
};

const currentUser = 'dev';

describe('reviewRequested', () => {
  describe(`when there is an existing ${REVIEW_REQUESTED} notification with the same review request id`, () => {
    it('does not add a new one', () => {
      const notifications = reviewRequested({
        existingNotifications: [
          { ...reviewRequestedNotification, sourceNodeId: userReviewRequestId },
        ],
        pullRequest: {
          author: {
            login: currentUser,
          },
          pullpPullRequest: {
            userReviewRequestId,
          },
        },
      });

      expect(notifications.length).toBe(0);
    });
  });

  describe(`when there is no existing ${REVIEW_REQUESTED} notification`, () => {
    describe("when the user's review is requested", () => {
      it('adds a new notification with the correct message', () => {
        const login = 'user';
        const notifications = reviewRequested({
          existingNotifications: [],
          pullRequest: {
            author: {
              login,
            },
            pullpPullRequest: {
              userReviewRequestId,
            },
          },
        });

        expect(notifications.length).toBe(1);
        const { 0: notification } = notifications;

        expect(notification.type).toBe(REVIEW_REQUESTED);
        expect(notification.title).toBe(reviewRequestedNotification.title);
        expect(notification.message).toBe(`${login} requested your review`);
        expect(notification.sourceNodeId).toBe(userReviewRequestId);
      });
    });

    describe("when the user's review is not requested", () => {
      it('does not add a new notification', () => {
        const notifications = reviewRequested({
          existingNotifications: [],
          pullRequest: {
            pullpPullRequest: {
              userReviewRequestId: null,
            },
          },
        });
        expect(notifications.length).toBe(0);
      });
    });
  });
});
