import React from 'react';
import PropTypes from 'prop-types';

export default function RepoCheckbox({ name }) {
  return (
    <div>
      {name}
    </div>
  );
}

RepoCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
};
