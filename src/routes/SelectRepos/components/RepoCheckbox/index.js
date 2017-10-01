import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';
import link from '../../../../images/link-primary.svg';

export default function RepoCheckbox({
  name,
  id,
  checked,
  onChange,
  url,
  theme,
}) {
  return (
    <div className={theme.checkboxContainer}>
      <input
        className={theme.input}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className={theme.label}>
        {name}
      </label>
      <a className={theme.link} href={url}>
        <img className={theme.linkIcon} src={link} alt="link icon" />
      </a>
    </div>
  );
}

RepoCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  theme: PropTypes.shape(),
};

RepoCheckbox.defaultProps = {
  theme: defaultTheme,
};
