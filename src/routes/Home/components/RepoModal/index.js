/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';
import PullRequest from '../PullRequest';
import ClosedPullRequest from '../ClosedPullRequest';
import CrossIcon from '../../../../components/CrossIcon';

export default class RepoModal extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = ({ keyCode }) => {
    if (keyCode === 27) {
      this.props.toggleOpenRepo(null);
    }
  };

  onClick = () => {
    this.props.toggleOpenRepo(null);
  };

  render() {
    const { theme, data } = this.props;
    const closeIcon = (
      <button
        className={theme.closeButton}
        data-test-id={'closeButton'}
        onClick={this.onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 240.8 240.8"
          className={theme.closeIcon}
        >
          <path d="M57.6 129L166 237.3a12.1 12.1 0 1 0 17.2-17.2l-99.7-99.7 99.7-99.7A12.1 12.1 0 1 0 166 3.6L57.6 111.8a12.3 12.3 0 0 0 0 17.2z" />
        </svg>
      </button>
    );

    return (
      <div className={theme.repoModalContainer}>
        <div className={theme.closeIconContainer}>{closeIcon}</div>
        <div className={theme.repoContainer}>
          <div className={theme.repoName}>
            <a href={data.url} className={theme.link}>
              <h3 className={theme.name}>{data.name}</h3>
            </a>
          </div>
          <div className={theme.mainContainer}>
            <h3 className={theme.prHeading}>Open</h3>
            {data.pullRequests.length === 0 && (
              <div className={theme.noPRs}>
                <CrossIcon theme={{ svg: theme.crossIcon }} />
                <p>No open pull requests</p>
              </div>
            )}
            <div className={theme.pullRequestsContainer}>
              {data.pullRequests.map(pr => (
                <PullRequest {...pr} key={`${data.id}_${pr.number}`} />
              ))}
            </div>
            {data.closedPullRequests.length > 0 && (
              <div>
                <h3 className={`${theme.prHeading} ${theme.closedHeading}`}>
                  Most recently closed
                </h3>
                <div className={theme.closedPullRequestsContainer}>
                  {data.closedPullRequests.map(pr => (
                    <ClosedPullRequest
                      {...pr}
                      key={`${data.id}_${pr.number}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

RepoModal.propTypes = {
  theme: PropTypes.shape(),
  data: PropTypes.shape({
    name: PropTypes.string,
    pullRequests: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  toggleOpenRepo: PropTypes.func.isRequired,
};

RepoModal.defaultProps = {
  theme: defaultTheme,
  openRepoId: null,
};
