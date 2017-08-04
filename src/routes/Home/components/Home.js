import React from 'react';
import PropTypes from 'prop-types';

export default function Home(props) {
  return (
    <div>
      <h1>PULLP</h1>
      <button onClick={props.requestApiContent}>GET ME SOME STUFF</button>
      <p>
        {JSON.stringify(props.apiContent) || JSON.stringify(props.apiError)}
      </p>
    </div>
  );
}

Home.propTypes = {
  apiContent: PropTypes.object.isRequired, //eslint-disable-line
  apiError: PropTypes.string.isRequired,
  requestApiContent: PropTypes.func.isRequired,
};
