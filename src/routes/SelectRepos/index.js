import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './actions';
import RepoCheckbox from './components/RepoCheckbox';
import defaultTheme from './theme.css';

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
    const filteredRepos = this.props.repoFilterValue
      ? this.props.watchedRepos.filter(repo =>
          repo.name.includes(this.props.repoFilterValue),
        )
      : this.props.watchedRepos;

    return filteredRepos.map(repo => {
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
        />
      );
    });
  }

  filterOnChange(event) {
    const value = event.target.value;
    this.props.filterRepos(value);
  }

  render() {
    const repos = this.loadRepos();
    const theme = this.props.theme;

    return (
      <div className={theme.pinContainer}>
        <h3 className={theme.title}>
          Select the repos you want to pin&hellip;
        </h3>
        <label htmlFor="filter">Filter</label>
        <input
          name="filter"
          type="text"
          value={this.props.repoFilterValue || ''}
          data-test-id="filterInput"
          onChange={this.filterOnChange}
        />
        {repos}
        {this.props.githubError}
      </div>
    );
  }
}

SelectRepos.propTypes = {
  watchedRepos: PropTypes.shape({
    currentPage: PropTypes.number,
    hasNextPage: PropTypes.number,
    hasPreviousPage: PropTypes.number,
    totalPages: PropTypes.number,
    pages: PropTypes.shape(),
  }),
  githubError: PropTypes.string,
  githubToken: PropTypes.string,
  requestWatchedRepos: PropTypes.func.isRequired,
  selectedRepos: PropTypes.arrayOf(PropTypes.string),
  toggleRepoSelection: PropTypes.func.isRequired,
  theme: PropTypes.shape(),
  filterRepos: PropTypes.func.isRequired,
  repoFilterValue: PropTypes.string,
};

SelectRepos.defaultProps = {
  watchedRepos: {
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
};

const mapStateToProps = state => ({
  watchedRepos: state.selectRepos.watchedRepos,
  githubError: state.selectRepos.githubError,
  githubToken: state.login.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
  repoFilterValue: state.selectedRepos.repoFilterValue,
});

const mapDispatchToProps = dispatch => ({
  requestWatchedRepos(token) {
    dispatch(actions.requestWatchedRepos(token));
  },
  toggleRepoSelection(id) {
    dispatch(actions.toggleRepoSelection(id));
  },
  filterRepos(value) {
    dispatch(actions.filterRepos(value));
  },
  changeReposPage(page) {
    dispatch(actions.changeReposPage(page));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRepos);
