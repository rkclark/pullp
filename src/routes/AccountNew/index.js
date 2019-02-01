import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import AccountDetails from '../../components/AccountDetails';
import LoadingMessage from '../../components/LoadingMessage';
import Error from '../../components/Error';
import { GET_CURRENT_USER } from '../../apollo/queries';

export class AccountNew extends React.Component {
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
      return (
        <LoadingMessage message="Asking Github for pull request data..." />
      );
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
          logoutAction={() => {
            window.localStorage.clear();
            window.location.pathname = '/';
          }}
          logoutModalOpen={this.state.logoutModalOpen}
        />
      </div>
    );
  }
}

AccountNew.propTypes = {
  data: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
};

AccountNew.defaultProps = {
  data: {},
  error: null,
};

export default function AccountContainer() {
  return (
    <Query query={GET_CURRENT_USER} fetchPolicy="cache-first">
      {({ data, loading, error }) => (
        <AccountNew data={data} loading={loading} error={error} />
      )}
    </Query>
  );
}
