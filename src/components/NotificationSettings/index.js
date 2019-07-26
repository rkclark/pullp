import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import CheckBox from '../CheckBox';

import { TOGGLE_NOTIFICATION_SETTING } from '../../apollo/mutations';

import style from './style.css';

const settingsNames = {
  REVIEW_REQUESTED: 'Your review requested',
  REVIEW_ON_YOUR_PR: 'New reviews on your pull requests',
  PR_STATE_CHANGE: 'Pull requests opened/closed/merged',
  NEW_COMMENTS: 'New comments on pull requests belonging to other people',
  NEW_COMMENTS_ON_YOUR_PR: 'New comments on pull requests belonging to you',
};

export default function NotificationSettings({ notifications }) {
  return (
    <div className={style.container}>
      <div className={style.columnNames}>
        <h3 className={style.notificationType}>Trigger notification</h3>
        <h3 className={`${style.notificationType} ${style.hide}`}>
          Show on timeline
        </h3>
      </div>
      {Object.entries(notifications).map(({ 0: key, 1: value }) => {
        const name = settingsNames[key];

        if (name) {
          const { trigger, showOnTimeline } = value;

          const triggerCheckBoxId = `${key}_TRIGGER`;
          const showOnTimelineCheckboxId = `${key}_SHOW_ON_TIMELINE`;

          return (
            <div key={key} className={style.notificationRow}>
              <h3 className={style.notificationName}>{name}</h3>
              <div className={style.notificationCheckbox}>
                <Mutation
                  mutation={TOGGLE_NOTIFICATION_SETTING}
                  variables={{ id: value.id, field: 'trigger' }}
                >
                  {toggleNotificationSetting => (
                    <CheckBox
                      checked={trigger}
                      name={triggerCheckBoxId}
                      onChange={toggleNotificationSetting}
                      displayName={''}
                    />
                  )}
                </Mutation>
              </div>
              <div className={`${style.notificationCheckbox} ${style.hide}`}>
                <Mutation
                  mutation={TOGGLE_NOTIFICATION_SETTING}
                  variables={{ id: value.id, field: 'showOnTimeline' }}
                >
                  {toggleNotificationSetting => (
                    <CheckBox
                      checked={showOnTimeline}
                      name={showOnTimelineCheckboxId}
                      onChange={toggleNotificationSetting}
                      displayName={''}
                    />
                  )}
                </Mutation>
              </div>
            </div>
          );
        }

        return undefined;
      })}
    </div>
  );
}

NotificationSettings.propTypes = {
  notifications: PropTypes.shape().isRequired,
};
