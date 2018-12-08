import React from 'react';
import { Query } from 'react-apollo';
// import { last, get } from 'lodash';
import { GET_WATCHED_REPOS, GET_PULL_REQUESTS } from '../../apollo/queries';
import { MAXIMUM_PRS } from '../../constants';

/* eslint-disable */

export const HomeNew = ({ data, loading, error }) => {
  console.log('pull request data is', data);
  return <div>home</div>;
};

/* eslint-enable */

export default function HomeNewContainer() {
  return (
    <Query
      query={GET_WATCHED_REPOS}
      fetchPolicy="cache-only"
      notifyOnNetworkStatusChange
    >
      {({ data }) => {
        console.log('data is', data);

        const selectedRepoIds = data.viewer.watching.edges.reduce(
          (selected, { node }) => {
            if (node.isSelected) {
              selected.push(node.id);
            }

            return selected;
          },
          [],
        );

        console.log('selected repo ids', selectedRepoIds);

        /* eslint-disable no-shadow */
        return (
          <Query
            query={GET_PULL_REQUESTS}
            variables={{ ids: selectedRepoIds, maximumPrs: MAXIMUM_PRS }}
          >
            {({ data, loading, error, client }) => {
              console.log('client is', client);

              return <HomeNew data={data} loading={loading} error={error} />;
            }}
          </Query>
        );
      }}
    </Query>
  );
}
