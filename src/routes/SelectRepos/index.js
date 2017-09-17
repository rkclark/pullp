import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './actions';
import RepoCheckbox from './components/RepoCheckbox';

export class SelectRepos extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    console.log('SELECTREPOS DID MOUNT, token is ', this.props.githubToken);
    this.props.requestWatchedRepos(this.props.githubToken);
  }

  render() {
    console.log('SELECTREPOS RENDER');
    return (
      <div>
        Select requestWatchedRepos
        {this.props.watchedRepos.map(repo =>
          <RepoCheckbox key={repo.id} name={repo.name} />,
        )}
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
};

SelectRepos.defaultProps = {
  watchedRepos: [],
  githubError: null,
  githubToken: null,
};

const mapStateToProps = state => ({
  watchedRepos: state.selectRepos.watchedRepos,
  githubError: state.selectRepos.githubError,
  githubToken: state.login.githubToken,
});

const mapDispatchToProps = dispatch => ({
  requestWatchedRepos(token) {
    dispatch(actions.requestWatchedRepos(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectRepos);
