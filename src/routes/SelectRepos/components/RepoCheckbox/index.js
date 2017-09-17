import React from 'react';
import PropTypes from 'prop-types';

export default function RepoCheckbox({ name, id, checked, onChange, url }) {
  return (
    <div>
      <label htmlFor={id}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        {name}, {url}
      </label>
    </div>
  );
}

RepoCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
