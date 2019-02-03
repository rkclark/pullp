import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import AccountDetails from '../../components/AccountDetails';
import LoadingMessage from '../../components/LoadingMessage';
import Error from '../../components/Error';
import { GET_CURRENT_USER } from '../../apollo/queries';

export class Account extends React.Component {
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
    const { data, loading, error } = this.props;

    if (loading) {
      return <LoadingMessage message="Refreshing your Github user data..." />;
    }

    if (error) {
      return <Error message={'Unable to load your user data'} />;
    }

    const login = get(data, 'viewer.login');
    const avatarUrl = get(data, 'viewer.avatarUrl');

    return (
      <div>
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
            window.location.pathname = '/';
          }}
          logoutModalOpen={this.state.logoutModalOpen}
        />
      </div>
    );
  }
}

Account.propTypes = {
  data: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
};

Account.defaultProps = {
  data: {},
  error: null,
};

export default function AccountContainer() {
  return (
    <Query query={GET_CURRENT_USER} fetchPolicy="cache-first">
      {({ data, loading, error }) => (
        <Account data={data} loading={loading} error={error} />
      )}
    </Query>
  );
}
