import React from 'react';
import { last, get } from 'lodash';
import { Query } from 'react-apollo';
import { GET_WATCHED_REPOS } from '../../apollo/queries';

export function SelectReposNew(props) {
  return <div>{JSON.stringify(props)}</div>;
}

// const testQuery = gql(`query WatchedRepos {
//   viewer {
//     watching(first:100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
//       edges {
//         cursor
//         node {
//           name
//           id
//           url
//           owner {
//             login
//             avatarUrl
//           }
//           isFork
//           createdAt
//         }
//       }
//     }
//   }
// }`);

// export default function SelectReposNewContainer() {
//   return (
//     <Query query={testQuery} fetchPolicy="network-only">
//       {({ data, loading }) => {
//         console.log('data is', data);
//         console.log('loading is', loading);

//         return <SelectReposNew data={data} loading={loading} />;
//       }}
//     </Query>
//   );
// }

export default function SelectReposNewContainer() {
  return (
    <Query query={GET_WATCHED_REPOS} fetchPolicy="network-only">
      {({ data, loading, fetchMore }) => {
        console.log('data is', data);
        console.log('loading is', loading);
        if (get(data, 'viewer.watching.pageInfo.hasNextPage')) {
          fetchMore({
            variables: {
              cursor: last(data.viewer.watching.edges).cursor,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.viewer.watching.edges;
              const pageInfo = fetchMoreResult.viewer.watching.pageInfo;

              return newEdges.length
                ? {
                    // Put the new watched repos at the end of the list and
                    // update `pageInfo` so we have the new hasNextPage value
                    viewer: {
                      watching: {
                        // eslint-disable-next-line no-underscore-dangle
                        __typename: previousResult.viewer.watching.__typename,
                        edges: [
                          ...previousResult.viewer.watching.edges,
                          ...newEdges,
                        ],
                        pageInfo,
                      },
                    },
                  }
                : previousResult;
            },
          });
        }

        return <SelectReposNew data={data} loading={loading} />;
      }}
    </Query>
  );
}
