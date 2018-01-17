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
  isFork,
  owner,
  createdAt,
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
        <div>
          <img
            src={owner.avatarUrl}
            alt={`${owner.login} avatar`}
            className={theme.avatar}
          />
          <span>{owner.login}</span>
        </div>
        <div>
          {name}
          {isFork ? <em> (Fork)</em> : null}
        </div>
        <div>{createdAt.toLocaleDateString('en-GB')}</div>
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
  isFork: PropTypes.bool.isRequired,
  owner: PropTypes.shape({
    login: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
};

RepoCheckbox.defaultProps = {
  theme: defaultTheme,
};
