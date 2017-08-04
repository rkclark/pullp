import React from 'react';
import PropTypes from 'prop-types';

export default function PullRequest(props) {
  return (
    <ul>
      <li>
        <a href={props.url}>
          {props.url}
        </a>
      </li>
      <li>
        Author: {props.author}
      </li>
    </ul>
  );
}

PullRequest.propTypes = {
  url: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};
