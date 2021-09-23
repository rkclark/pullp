import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import { GET_GITHUB_AUTH_STATE_FROM_CACHE } from '../../apollo/queries';
import SignInForm from '../../components/SignInForm';
import GetStartedContainer from '../../components/GetStarted';

export function Setup({ data, client }) {
  const authToken = get(data, 'githubAuth.token');
  const gatekeeperUrl = process.env.REACT_APP_OAUTH_GATEKEEPER_URL;

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

  const handleCode = async code => {
    setLoadingToken();

    try {
      const res = await fetch(`${gatekeeperUrl}/${code}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Auth request to Pullp gatekeeper failed');
      }
      const json = await res.json();
      const token = json.token;
      if (!token) {
        throw new Error('Cannot find token in Github auth response');
      }

      saveGithubToken(token);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      saveTokenError(err.message);
    }
  };

  useEffect(() => {
    window.electron.authApi.receiveCode(handleCode);
    window.electron.authApi.receiveError(saveTokenError);

    return window.electron.authApi.removeListeners;
  }, []);

  return (
    <Fragment>
      {authToken ? (
        <GetStartedContainer />
      ) : (
        <SignInForm
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
