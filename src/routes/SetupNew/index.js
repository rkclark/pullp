import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import SignInForm from '../../components/SignInForm';

const GET_GITHUB_TOKEN = gql`
  {
    githubAuth @client {
      token
    }
  }
`;

export default function SetupNew() {
  return (
    <Query query={GET_GITHUB_TOKEN}>
      {({ data, client }) => {
        console.log('In Query result', data, client);
        return (
          <div>
            {!data.githubAuth.token && (
              <SignInForm
                saveGithubToken={token => {
                  console.log('SAVING TOKEN TO APOLLO', token);
                  client.writeData({
                    data: {
                      githubAuth: {
                        token,
                        __typename: 'GithubAuth',
                      },
                    },
                  });
                }}
              />
            )}
          </div>
        );
      }}
    </Query>
  );
}
