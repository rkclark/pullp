import { get } from 'lodash';
import React from 'react';
import FlipMove from 'react-flip-move';
import PropTypes from 'prop-types';
import PullRequest from '..//PullRequest';
import pullRequestTheme from './pullRequestTheme.css';
import style from './style.css';

export default function YourPRsView({ data, currentUser }) {
  const currentUsersPRs = data.reduce((userPRs, repo) => {
    const PRsToAdd = [];
    repo.pullRequests.forEach(pullRequest => {
      if (get(pullRequest, 'author.login') === currentUser) {
        PRsToAdd.push({ ...pullRequest, repoName: repo.name });
      }
    });

    return [...userPRs, ...PRsToAdd];
  }, []);

  return (
    <div className={style.yourPRsViewContainer}>
      <div className={style.pullRequestsContainer}>
        <FlipMove typeName={null} duration={500} appearAnimation={'fade'}>
          {currentUsersPRs.map(pullRequest => (
            <PullRequest
              {...pullRequest}
              key={`${pullRequest.id}_${pullRequest.number}`}
              theme={pullRequestTheme}
            />
          ))}
        </FlipMove>
      </div>
    </div>
  );
}

YourPRsView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentUser: PropTypes.string.isRequired,
};
