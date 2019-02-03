import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import { GET_GITHUB_AUTH_STATE_FROM_CACHE } from '../../apollo/queries';
import SignInForm from '../../components/SignInForm';
import GetStartedContainer from '../../components/GetStarted';

export function Setup({ data, client }) {
  const authToken = get(data, 'githubAuth.token');

  const saveGithubToken = token => {
    client.writeData({
      data: {
        githubAuth: {
          token,
          loadingToken: false,
          __typename: 'GithubAuth',
        },
      },
    });
  };

  const setLoadingToken = () => {
    client.writeData({
      data: {
        githubAuth: {
          loadingToken: true,
          error: null,
          __typename: 'GithubAuth',
        },
      },
    });
  };

  const saveTokenError = error => {
    client.writeData({
      data: {
        githubAuth: {
          loadingToken: false,
          error,
          __typename: 'GithubAuth',
        },
      },
    });
  };

  return (
    <Fragment>
      {authToken ? (
        <GetStartedContainer />
      ) : (
        <SignInForm
          saveGithubToken={saveGithubToken}
          setLoadingToken={setLoadingToken}
          saveTokenError={saveTokenError}
          loadingToken={get(data, 'githubAuth.loadingToken')}
          error={get(data, 'githubAuth.error')}
        />
      )}
    </Fragment>
  );
}

Setup.propTypes = {
  data: PropTypes.shape({}).isRequired,
  client: PropTypes.shape({}).isRequired,
};

export default function SetupContainer() {
  return (
    <Query query={GET_GITHUB_AUTH_STATE_FROM_CACHE} fetchPolicy="cache-only">
      {({ data, client }) => <Setup data={data} client={client} />}
    </Query>
  );
}
