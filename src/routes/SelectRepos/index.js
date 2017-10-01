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
  }

  componentDidMount() {
    this.props.requestWatchedRepos(this.props.githubToken);
  }

  loadRepos() {
    return this.props.watchedRepos.map(repo => {
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

  render() {
    const repos = this.loadRepos();
    const theme = this.props.theme;
    return (
      <div className={theme.pinContainer}>
        <h3 className={theme.title}>
          Select the repos you want to pin&hellip;
        </h3>
        {repos}
        {this.props.githubError}
      </div>
    );
  }
}

SelectRepos.propTypes = {
  watchedRepos: PropTypes.arrayOf(PropTypes.shape()),
  githubError: PropTypes.string,
  githubToken: PropTypes.string,
  requestWatchedRepos: PropTypes.func.isRequired,
  selectedRepos: PropTypes.arrayOf(PropTypes.string),
  toggleRepoSelection: PropTypes.func.isRequired,
  theme: PropTypes.shape(),
};

SelectRepos.defaultProps = {
  watchedRepos: [],
  githubError: null,
  githubToken: null,
  selectedRepos: [],
  theme: defaultTheme,
};

const mapStateToProps = state => ({
  watchedRepos: state.selectRepos.watchedRepos,
  githubError: state.selectRepos.githubError,
  githubToken: state.login.githubToken,
  selectedRepos: state.selectRepos.selectedRepos,
});

const mapDispatchToProps = dispatch => ({
  requestWatchedRepos(token) {
    dispatch(actions.requestWatchedRepos(token));
  },
  toggleRepoSelection(id) {
    dispatch(actions.toggleRepoSelection(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRepos);
