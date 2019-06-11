import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import AccountDetails from '../../components/AccountDetails';
import NotificationSettings from '../../components/NotificationSettings';
import LoadingMessage from '../../components/LoadingMessage';
import Error from '../../components/Error';
import {
  GET_CURRENT_USER,
  GET_USER_NOTIFICATION_SETTINGS_FROM_CACHE,
} from '../../apollo/queries';

import style from './style.css';

export class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      logoutModalOpen: false,
    };

    this.toggleLogoutModal = this.toggleLogoutModal.bind(this);
  }

  toggleLogoutModal() {
    this.setState({ logoutModalOpen: !this.state.logoutModalOpen });
  }

  render() {
    const { userData, settingsData, loading, error } = this.props;

    if (loading) {
      return <LoadingMessage message="Refreshing your Github user data..." />;
    }

    if (error) {
      return <Error message={'Unable to load your user data'} />;
    }

    const login = get(userData, 'viewer.login');
    const avatarUrl = get(userData, 'viewer.avatarUrl');

    return (
      <div className={style.settingsContainer}>
        <h2 className={style.heading}>Account</h2>
        <AccountDetails
          login={login}
          avatarUrl={avatarUrl}
          toggleLogoutModal={this.toggleLogoutModal}
          logout={async () => {
            const electron = window.electron;
            // Delete cookies which have been placed there by Github's login page
            await electron.remote.session.defaultSession.clearStorageData({
              storages: 'cookies',
            });

            // Clear localStorage which removes the persisted Apollo cache
            window.localStorage.clear();

            // Push user back to homepage to allow router to push them into setup screen
            window.location.pathname = '/app';
          }}
          logoutModalOpen={this.state.logoutModalOpen}
        />
        <h2 className={style.heading}>Notifications</h2>
        <NotificationSettings
          notifications={get(settingsData, 'userSettings.notifications')}
        />
      </div>
    );
  }
}

Settings.propTypes = {
  userData: PropTypes.shape({}),
  settingsData: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
};

Settings.defaultProps = {
  userData: {},
  settingsData: {},
  error: null,
};

export default function SettingsContainer() {
  return (
    <Query query={GET_CURRENT_USER} fetchPolicy="cache-first">
      {({ data: userData, loading: userLoading, error: userError }) => (
        <Query
          query={GET_USER_NOTIFICATION_SETTINGS_FROM_CACHE}
          fetchPolicy="cache-only"
        >
          {({
            data: settingsData,
            loading: settingsLoading,
            error: settingsError,
          }) => (
            <Settings
              userData={userData}
              settingsData={settingsData}
              loading={settingsLoading || userLoading}
              error={settingsError || userError}
            />
          )}
        </Query>
      )}
    </Query>
  );
}
