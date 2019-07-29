import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';

/* eslint-disable react/no-array-index-key, jsx-a11y/interactive-supports-focus */
export default class ClosedPullRequest extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const { theme, url, number, title, author, state } = this.props;

    return (
      <div className={`${theme.pullRequestOuterContainer}`}>
        <div className={theme.pullRequestInnerContainer}>
          <a href={url} className={theme.link}>
            <div className={theme.linkIconContainer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className={theme.linkIcon}
              >
                <path
                  d="M488.73 0H302.54a23.27 23.27 0 0 0 0 46.55h130L193 286.09A23.27 23.27 0 1 0 225.9 319L465.45 79.46v130a23.27 23.27 0 0 0 46.55 0V23.27A23.27 23.27 0 0 0 488.73 0z"
                  fill="#1D2843"
                />
                <path
                  d="M395.64 232.73A23.27 23.27 0 0 0 372.36 256v209.46H46.55V139.64H256a23.27 23.27 0 0 0 0-46.55H23.27A23.27 23.27 0 0 0 0 116.36v372.37A23.27 23.27 0 0 0 23.27 512h372.37a23.27 23.27 0 0 0 23.27-23.27V256a23.27 23.27 0 0 0-23.27-23.27z"
                  fill="#1D2843"
                />
              </svg>
            </div>
            <div className={theme.header}>
              <h4 className={theme.title}>{title}</h4>
            </div>
            <div className={theme.topRow}>
              <div className={theme.leftColumn}>
                <img
                  className={theme.authorAvatar}
                  src={author.avatarUrl}
                  alt="pull request author"
                />
                <span className={theme.authorLogin}>{author.login}</span>
              </div>
              <div className={theme.middleColumn}>
                <p className={theme.state}>{state}</p>
              </div>
            </div>
            <div className={theme.footer}>
              <span className={theme.infoSpan}>#{number}</span>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

ClosedPullRequest.propTypes = {
  theme: PropTypes.shape(),
  url: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  author: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
  }).isRequired,
};

ClosedPullRequest.defaultProps = {
  theme: defaultTheme,
};
