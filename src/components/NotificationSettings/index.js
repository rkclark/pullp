import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';

import style from './style.css';

const settingsNames = {
  REVIEW_REQUESTED: 'Your review requested',
  REVIEW_ON_YOUR_PR: 'Reviews on your PR',
  PR_STATE_CHANGE: 'PRs opened/closed/merged',
  NEW_COMMENTS: 'New comments on PRs belonging to other people',
  NEW_COMMENTS_ON_YOUR_PR: 'New comments PRs belonging to you',
};

export default function NotificationSettings({ notifications }) {
  return (
    <div className={style.container}>
      <div className={style.columnNames}>
        <h3 className={style.notificationType}>Trigger notification</h3>
        <h3 className={style.notificationType}>Show on timeline</h3>
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
                <CheckBox
                  checked={trigger}
                  name={triggerCheckBoxId}
                  onChange={() => {}}
                  displayName={''}
                />
              </div>
              <div className={style.notificationCheckbox}>
                <CheckBox
                  checked={showOnTimeline}
                  name={showOnTimelineCheckboxId}
                  onChange={() => {}}
                  displayName={''}
                />
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
