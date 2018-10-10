import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { last, get } from 'lodash';
import { Query } from 'react-apollo';
import { GET_WATCHED_REPOS } from '../../apollo/queries';
import RepoCheckbox from '../../components/RepoCheckbox';
import { WATCHED_REPOS_PER_PAGE } from '../../constants';

export class SelectReposNew extends Component {
  constructor(props) {
    super();

    this.props = props;

    const { data, reposPerPage } = props;

    this.state = {
      reposPerPage,
      currentPage: 1,
      filteredRepos: get(data, 'viewer.watching.edges'),
    };
  }

  render() {
    const { filteredRepos, currentPage, reposPerPage } = this.state;

    const startPosition = (currentPage - 1) * reposPerPage;
    const endPosition = currentPage * reposPerPage;

    const repos = filteredRepos
      .slice(startPosition, endPosition)
      .map(({ node }) => (
        <RepoCheckbox
          key={node.id}
          name={node.name}
          url={node.url}
          checked
          onChange={() => {}}
          id={node.id}
          isFork={node.isFork}
          owner={node.owner}
          createdAt={node.createdAt}
        />
      ));

    return <div>{repos}</div>;
  }
}

SelectReposNew.propTypes = {
  data: PropTypes.shape({}),
  reposPerPage: PropTypes.number.isRequired,
};

SelectReposNew.defaultProps = {
  data: null,
};

export default function SelectReposNewContainer() {
  return (
    <Query query={GET_WATCHED_REPOS} fetchPolicy="network-only">
      {({ data, loading, fetchMore }) => {
        if (get(data, 'viewer.watching.pageInfo.hasNextPage')) {
          fetchMore({
            variables: {
              cursor: last(data.viewer.watching.edges).cursor,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = get(fetchMoreResult, 'viewer.watching.edges');
              const prevEdges = get(previousResult, 'viewer.watching.edges');
              const pageInfo = get(fetchMoreResult, 'viewer.watching.pageInfo');

              const mergedResults = newEdges.length
                ? {
                    // Put the new watched repos at the end of the list and
                    // update `pageInfo` so we have the new hasNextPage value
                    ...previousResult,
                    viewer: {
                      ...get(previousResult, 'viewer'),
                      watching: {
                        ...get(previousResult, 'viewer.watching'),
                        edges: [...prevEdges, ...newEdges],
                        pageInfo,
                      },
                    },
                  }
                : previousResult;

              return mergedResults;
            },
          });
        }

        return (
          <SelectReposNew
            data={data}
            loading={loading}
            reposPerPage={WATCHED_REPOS_PER_PAGE}
          />
        );
      }}
    </Query>
  );
}
