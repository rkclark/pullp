import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { last, get } from 'lodash';
import { Query } from 'react-apollo';
import Pagination from 'react-js-pagination';
import { GET_WATCHED_REPOS } from '../../apollo/queries';
import RepoCheckbox from '../../components/RepoCheckbox';
import LoadingMessage from '../../components/LoadingMessage';
import {
  WATCHED_REPOS_PER_PAGE,
  WATCHED_REPOS_PAGINATION_RANGE,
} from '../../constants';
import style from './style.css';

export class SelectReposNew extends Component {
  constructor() {
    super();

    this.state = {
      activePage: 1,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  render() {
    const { activePage } = this.state;
    const { reposPerPage, loading, data } = this.props;

    if (loading) {
      return (
        <div className={style.loadingContainer}>
          <LoadingMessage message="Asking Github for your watched repos..." />
        </div>
      );
    }
    const startPosition = (activePage - 1) * reposPerPage;
    const endPosition = activePage * reposPerPage;

    const repos = get(data, 'viewer.watching.edges');

    const activePageOfRepos = repos
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

    return (
      <div>
        {activePageOfRepos}
        <div>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={reposPerPage}
            totalItemsCount={repos.length}
            pageRangeDisplayed={WATCHED_REPOS_PAGINATION_RANGE}
            onChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

SelectReposNew.propTypes = {
  data: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
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
