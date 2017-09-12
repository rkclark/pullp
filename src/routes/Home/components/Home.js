import React from 'react';
import PropTypes from 'prop-types';
import Repo from './Repo';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentWillMount() {
    if (this.props.redirectPath === '/') {
      this.props.saveRedirect(null);
    }
  }

  loadRepos() {
    const filtered = this.props.apiContent.filter(
      elem => elem.pullRequests.nodes.length,
    );
    return filtered.map(({ name, pullRequests }) =>
      <Repo
        name={name}
        key={`${name}_${Math.random()}`}
        pullRequests={pullRequests.nodes}
      />,
    );
  }

  render() {
    const repos = this.loadRepos();
    return (
      <div>
        <h1>PULLP</h1>
        <button onClick={this.props.requestApiContent}>
          GET ME SOME STUFF
        </button>
        <div>
          {this.props.apiError}
          <br />
          {repos}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  apiContent: PropTypes.array, //eslint-disable-line
  apiError: PropTypes.string,
  requestApiContent: PropTypes.func.isRequired,
  redirectPath: PropTypes.string,
  saveRedirect: PropTypes.func.isRequired,
};

Home.defaultProps = {
  apiContent: [],
  apiError: null,
  redirectPath: null,
};
