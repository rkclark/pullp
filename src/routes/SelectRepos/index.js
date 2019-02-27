import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { last, get } from 'lodash';
import { Query, Mutation } from 'react-apollo';
import Transition from 'react-transition-group/Transition';
import Pagination from 'react-js-pagination';
import { GET_WATCHED_REPOS } from '../../apollo/queries';
import {
  TOGGLE_REPO_SELECTION,
  CLEAR_SELECTED_REPOS,
} from '../../apollo/mutations';
import RepoCheckbox from '../../components/RepoCheckbox';
import Button from '../../components/Button';
import LoadingMessage from '../../components/LoadingMessage';
import {
  WATCHED_REPOS_PER_PAGE,
  WATCHED_REPOS_PAGINATION_RANGE,
} from '../../constants';
import style from './style.css';

const fadeInDuration = 300;

const capitalise = string => string.charAt(0).toUpperCase() + string.slice(1);

export class SelectRepos extends Component {
  constructor() {
    super();

    this.state = {
      activePage: 1,
      filterValue: '',
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);
  }

  setFilterValue(event) {
    const value = event.target.value;
    this.setState({ filterValue: value, activePage: 1 });
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  render() {
    const { activePage, filterValue } = this.state;
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

    let anyReposSelected = null;
    let activePageOfRepos = null;
    let filteredRepos = [];

    if (Array.isArray(repos) && repos.length > 0) {
      anyReposSelected = repos.some(({ node }) => node.isSelected);

      filteredRepos = repos.filter(({ node }) =>
        node.name.includes(filterValue),
      );

      activePageOfRepos = filteredRepos
        .slice(startPosition, endPosition)
        .map(({ node }) => (
          <Mutation
            mutation={TOGGLE_REPO_SELECTION}
            variables={{ id: node.id }}
            key={node.id}
          >
            {toggleRepoSelection => (
              <RepoCheckbox
                name={node.name}
                url={node.url}
                checked={node.isSelected || false}
                onChange={toggleRepoSelection}
                id={node.id}
                isFork={node.isFork}
                owner={node.owner}
                createdAt={node.createdAt}
              />
            )}
          </Mutation>
        ));
    }

    return (
      <div className={style.selectReposContainer}>
        <div>
          <h3 className={style.title}>
            Select the repos you want monitor with Pullp
          </h3>
          <div className={style.filterContainer}>
            <label htmlFor="filter" className={style.filterLabel}>
              Search
            </label>
            <input
              name="filter"
              className={style.filterInput}
              type="text"
              value={filterValue || ''}
              data-test-id="filterInput"
              onChange={this.setFilterValue}
            />
          </div>
          <p className={style.intro}>
            Can&#8217;t find one of your repos here? Make sure you are watching
            it on Github!
          </p>
          <div className={style.selectionControls}>
            <Transition
              appear
              timeout={fadeInDuration}
              in={anyReposSelected}
              unmountOnExit
            >
              {state => {
                const transitionState = capitalise(state);

                const fadeTransitionClassNames = `${style.fadeDefault} ${
                  style[`fade${transitionState}`]
                }`;

                return (
                  <div className={fadeTransitionClassNames}>
                    <Mutation mutation={CLEAR_SELECTED_REPOS}>
                      {clearSelectedRepos => (
                        <Button
                          data-test-id="clearAllSelectionsButton"
                          onClick={clearSelectedRepos}
                        >
                          Clear all selections
                        </Button>
                      )}
                    </Mutation>
                  </div>
                );
              }}
            </Transition>
          </div>
        </div>
        {activePageOfRepos}
        <Pagination
          activePage={activePage}
          itemsCountPerPage={reposPerPage}
          totalItemsCount={filteredRepos.length}
          pageRangeDisplayed={WATCHED_REPOS_PAGINATION_RANGE}
          onChange={this.handlePageChange}
          innerClass={style.paginationContainer}
          itemClass={style.paginationItem}
          activeClass={style.activeItem}
          disabledClass={style.disabledItem}
        />
      </div>
    );
  }
}

SelectRepos.propTypes = {
  data: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
  reposPerPage: PropTypes.number.isRequired,
};

SelectRepos.defaultProps = {
  data: null,
};

export default function SelectReposContainer() {
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
          <SelectRepos
            data={data}
            loading={loading}
            reposPerPage={WATCHED_REPOS_PER_PAGE}
          />
        );
      }}
    </Query>
  );
}
