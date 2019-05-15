import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import pullpIcon from '../../images/pullpIcon.png';

import CurrentUser from '../CurrentUser';

import styles from './styles.css';

export default function Nav({ currentPath, currentUser }) {
  return (
    <div className={styles.header}>
      <div className={styles.draggable} />
      <div className={styles.titleContainer}>
        <img className={styles.pullpIcon} src={pullpIcon} alt="Pullp Icon" />
      </div>
      <div className={styles.links}>
        <div className={styles.linkContainer}>
          <Link
            to="/app"
            className={`${styles.link} ${
              currentPath === '/app' ? styles.activeLink : null
            }`}
          >
            Monitor
          </Link>
        </div>
        <div className={styles.linkContainer}>
          <Link
            to="/app/selectRepos"
            className={`${styles.link} ${
              currentPath === '/app/selectRepos' ? styles.activeLink : null
            }`}
          >
            Select
          </Link>
        </div>
        <div className={styles.linkContainer}>
          <Link
            to="/app/settings"
            className={`${styles.link} ${
              currentPath === '/app/settings' ? styles.activeLink : null
            }`}
          >
            Settings
          </Link>
        </div>
      </div>
      <div className={styles.currentUser}>
        {currentUser && (
          <CurrentUser
            login={currentUser.login}
            avatarUrl={currentUser.avatarUrl}
            url={currentUser.url}
          />
        )}
      </div>
    </div>
  );
}

Nav.propTypes = {
  currentUser: PropTypes.shape({
    login: PropTypes.string,
    avatarUrl: PropTypes.string,
    url: PropTypes.string,
  }),
  currentPath: PropTypes.string.isRequired,
};

Nav.defaultProps = {
  currentUser: null,
  githubToken: null,
  selectedRepos: [],
};
