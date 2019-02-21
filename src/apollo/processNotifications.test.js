import processNotifications from './processNotifications';
import { notificationTypes } from '../constants';
import reviewRequested from './notificationRules/reviewRequested';

jest.mock('./notificationRules/reviewRequested');

describe('processNotifications', () => {
  const notificationMock = jest.fn(() => ({}));

  beforeAll(() => {
    window.Notification = notificationMock;
  });

  afterEach(() => {
    reviewRequested.mockReset();
    notificationMock.mockClear();
  });

  describe('when the review requested rule returns a new notification', () => {
    it('triggers the notification', () => {
      const message = 'someone requested your review';
      const title = 'Review Requested';

      reviewRequested.mockReturnValue([
        {
          type: notificationTypes.REVIEW_REQUESTED,
          message,
          title,
        },
      ]);

      processNotifications({
        existingNotifications: [],
        extendedPullRequest: {},
      });

      expect(window.Notification).toHaveBeenCalledTimes(1);
      expect(window.Notification).toHaveBeenCalledWith(title, {
        body: message,
      });
    });
  });

  describe('when the review requested rule does not return a new notification', () => {
    it('does not trigger a notification', () => {
      reviewRequested.mockReturnValue([]);

      processNotifications({
        existingNotifications: [],
        extendedPullRequest: {},
      });

      expect(window.Notification).not.toHaveBeenCalled();
    });
  });

  it('returns a combined array of existing and new notifications', () => {
    const message = 'someone requested your review';
    const title = 'Review Requested';

    const reviewRequestedNotification = {
      type: notificationTypes.REVIEW_REQUESTED,
      message,
      title,
    };
    reviewRequested.mockReturnValue([reviewRequestedNotification]);

    const anotherNotification = {
      type: 'randomNotification',
    };

    const combinedNotifications = processNotifications({
      existingNotifications: [anotherNotification],
      extendedPullRequest: {},
    });

    expect(combinedNotifications).toEqual([
      anotherNotification,
      reviewRequestedNotification,
    ]);
  });
});
