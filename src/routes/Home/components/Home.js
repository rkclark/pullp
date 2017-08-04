import React from 'react';
import PropTypes from 'prop-types';
import Repo from './Repo';

export default function Home(props) {
  const filtered = props.apiContent.filter(
    elem => elem.pullRequests.nodes.length,
  );
  const repos = filtered.map(({ name, pullRequests }) =>
    <Repo
      name={name}
      key={`${name}_${Math.random()}`}
      pullRequests={pullRequests.nodes}
    />,
  );

  return (
    <div>
      <h1>PULLP</h1>
      <button onClick={props.requestApiContent}>GET ME SOME STUFF</button>
      <div>
        {props.apiError}
        <br />
        {repos}
      </div>
    </div>
  );
}

Home.propTypes = {
  apiContent: PropTypes.array, //eslint-disable-line
  apiError: PropTypes.string,
  requestApiContent: PropTypes.func.isRequired,
};

Home.defaultProps = {
  apiContent: [],
  apiError: null,
};
