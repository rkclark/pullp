import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './actions';
import RepoCheckbox from './components/RepoCheckbox';
import defaultTheme from './theme.css';
import Button from '../../components/Button';
import buttonTheme from './buttonTheme.css';
import Loading from '../../components/Loading';

export class SelectRepos extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.loadRepos = this.loadRepos.bind(this);
    this.filterOnChange = this.filterOnChange.bind(this);
  }

  componentDidMount() {
    this.props.requestWatchedRepos(this.props.githubToken);
  }

  loadRepos() {
    if (this.props.paginatedRepos.currentPage) {
      const reposPage = this.props.paginatedRepos.pages[
        this.props.paginatedRepos.currentPage
      ];
      return reposPage.map(repo => {
        const checked = this.props.selectedRepos.includes(repo.id);
        const onChange = () => {
          this.props.toggleRepoSelection(repo.id);
        };
        return (
          <RepoCheckbox
            key={repo.id}
            name={repo.name}
            url={repo.url}
            checked={checked}
            onChange={onChange}
            id={repo.id}
            isFork={repo.isFork}
            owner={repo.owner}
            createdAt={repo.createdAt}
          />
        );
      });
    }

    return null;
  }

  filterOnChange(event) {
    const value = event.target.value;
    this.props.performFiltering(value);
  }

  render() {
    const repos = this.loadRepos();
    const theme = this.props.theme;
    const paginatedRepos = this.props.paginatedRepos;
    return (
      <div>
        <h3 className={theme.title}>
          Select the repos you want monitor with Pullp
        </h3>
        <div className={theme.filterContainer}>
          <label htmlFor="filter" className={theme.filterLabel}>
            Search
          </label>
          <input
            name="filter"
            className={theme.filterInput}
            type="text"
            value={this.props.repoFilterValue || ''}
            data-test-id="filterInput"
            onChange={this.filterOnChange}
          />
        </div>
        <p className={theme.intro}>
          Can&#8217;t find one of your repos here? Make sure you are watching it
          on Github!
        </p>
        {this.props.loading ? (
          <div className={theme.loading}>
            <Loading />
          </div>
        ) : (
          <div>
            <div className={theme.reposContainer}>{repos}</div>
            <div className={theme.paginationContainer}>
              {paginatedRepos.hasPreviousPage ? (
                <div
                  className={`${theme.buttonContainer} ${theme.firstButton}`}
                >
                  <Button
                    data-test-id="firstPageButton"
                    onClick={() => {
                      this.props.changeReposPage(1);
                    }}
                    theme={buttonTheme}
                  >
                    First
                  </Button>
                </div>
              ) : null}

              {paginatedRepos.hasPreviousPage ? (
                <div
                  className={`${theme.buttonContainer} ${theme.previousButton}`}
                >
                  <Button
                    data-test-id="previousButton"
                    onClick={() => {
                      this.props.changeReposPage(
                        paginatedRepos.currentPage - 1,
                      );
                    }}
                    theme={buttonTheme}
                  >
                    Previous
                  </Button>
                </div>
              ) : null}
              {paginatedRepos.currentPage ? (
                <span className={theme.currentPage} data-test-id="currentPage">
                  {paginatedRepos.currentPage} of {paginatedRepos.totalPages}
                </span>
              ) : null}
              {paginatedRepos.hasNextPage ? (
                <div className={`${theme.buttonContainer} ${theme.nextButton}`}>
                  <Button
                    data-test-id="nextButton"
                    onClick={() => {
                      this.props.changeReposPage(
                        paginatedRepos.currentPage + 1,
                      );
                    }}
                    theme={buttonTheme}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
              {paginatedRepos.hasNextPage ? (
                <div className={`${theme.buttonContainer} ${theme.lastButton}`}>
                  <Button
                    data-test-id="lastPageButton"
                    onClick={() => {
                      this.props.changeReposPage(paginatedRepos.totalPages);
                    }}
                    theme={buttonTheme}
                  >
                    Last
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        )}
        {this.props.githubError}
      </div>
    );
  }
}

SelectRepos.propTypes = {
  paginatedRepos: PropTypes.shape({
    currentPage: PropTypes.number,
    hasNextPage: PropTypes.bool,
    hasPreviousPage: PropTypes.bool,
    totalPages: PropTypes.number,
    pages: PropTypes.shape(),
  }),
  githubError: PropTypes.string,
  githubToken: PropTypes.string,
  requestWatchedRepos: PropTypes.func.isRequired,
  selectedRepos: PropTypes.arrayOf(PropTypes.string),
  toggleRepoSelection: PropTypes.func.isRequired,
  theme: PropTypes.shape(),
  performFiltering: PropTypes.func.isRequired,
  repoFilterValue: PropTypes.string,
  changeReposPage: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

SelectRepos.defaultProps = {
  paginatedRepos: {
    currentPage: null,
    hasNextPage: null,
    hasPreviousPage: null,
    totalPages: 0,
    pages: {},
  },
  githubError: null,
  githubToken: null,
  selectedRepos: [],
  theme: defaultTheme,
  repoFilterValue: null,
  loading: false,
};

const mapStateToProps = state => ({
  paginatedRepos: state.selectRepos.paginatedRepos,
  githubError: state.selectRepos.githubError,
  githubToken: state.setup.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
  repoFilterValue: state.selectRepos.repoFilterValue,
  loading: state.selectRepos.loading,
});

const mapDispatchToProps = dispatch => ({
  requestWatchedRepos(token) {
    dispatch(actions.requestWatchedRepos(token));
  },
  toggleRepoSelection(id) {
    dispatch(actions.toggleRepoSelection(id));
  },
  performFiltering(value) {
    dispatch(actions.performFiltering(value));
  },
  changeReposPage(page) {
    dispatch(actions.changeReposPage(page));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRepos);
