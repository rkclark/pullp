import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './actions';
import RepoCheckbox from './components/RepoCheckbox';

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
    return (
      <div>
        Select requestWatchedRepos
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
};

SelectRepos.defaultProps = {
  watchedRepos: [],
  githubError: null,
  githubToken: null,
  selectedRepos: [],
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
