import React from 'react';
import PropTypes from 'prop-types';
import PullRequest from './PullRequest';

export default function Repo(props) {
  const pullRequests = props.pullRequests.map(({ url, author }) =>
    <PullRequest url={url} key={url} author={author.login} />,
  );
  return (
    <div>
      <h3>
        {props.name}
      </h3>
      {pullRequests}
    </div>
  );
}

Repo.propTypes = {
  name: PropTypes.string.isRequired, //eslint-disable-line
  pullRequests: PropTypes.array.isRequired, //eslint-disable-line
};
