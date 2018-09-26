import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import SignInForm from '../../components/SignInForm';

export const GET_GITHUB_TOKEN_FROM_CACHE = gql`
  {
    githubAuth @client {
      token
      loadingToken
    }
  }
`;

export function SetupNew({ data, client }) {
  return (
    <div>
      {!get(data, 'githubAuth.token') && (
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
                  __typename: 'GithubAuth',
                },
              },
            });
          }}
          loadingToken={get(data, 'githubAuth.loadingToken')}
        />
      )}
    </div>
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
