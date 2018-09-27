import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import SignInForm from '../../components/SignInForm';
import GetStartedContainer from '../../components/GetStarted';

export const GET_GITHUB_TOKEN_FROM_CACHE = gql`
  query GithubAuth {
    githubAuth @client {
      token
      loadingToken
      error
    }
  }
`;

export function SetupNew({ data, client }) {
  const authToken = get(data, 'githubAuth.token');

  return (
    <Fragment>
      {!authToken && (
        <SignInForm
          saveGithubToken={token => {
            client.writeData({
              data: {
                githubAuth: {
                  token,
                  loadingToken: false,

                  __typename: 'GithubAuth',
                },
              },
            });
          }}
          setLoadingToken={() => {
            client.writeData({
              data: {
                githubAuth: {
                  loadingToken: true,
                  error: null,
                  __typename: 'GithubAuth',
                },
              },
            });
          }}
          saveTokenError={error => {
            client.writeData({
              data: {
                githubAuth: {
                  loadingToken: false,
                  error,
                  __typename: 'GithubAuth',
                },
              },
            });
          }}
          loadingToken={get(data, 'githubAuth.loadingToken')}
          error={get(data, 'githubAuth.error')}
        />
      )}
      {authToken && <GetStartedContainer />}
    </Fragment>
  );
}

SetupNew.propTypes = {
  data: PropTypes.shape({}).isRequired,
  client: PropTypes.shape({}).isRequired,
};

export default function SetupNewContainer() {
  return (
    <Query query={GET_GITHUB_TOKEN_FROM_CACHE} fetchPolicy="cache-only">
      {({ data, client }) => <SetupNew data={data} client={client} />}
    </Query>
  );
}
