import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';

const dateOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

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
  const createdAtDate = new Date(createdAt).toLocaleString(
    'en-GB',
    dateOptions,
  );

  return (
    <div className={theme.checkboxContainer}>
      <input
        className={theme.input}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className={`${theme.label} ${checked ? theme.labelActive : null}`}
      >
        <img
          src={owner.avatarUrl}
          alt={`${owner.login} avatar`}
          className={theme.avatar}
        />
        <span className={theme.login}>{owner.login}</span>
        <div className={theme.nameContainer}>
          <p className={theme.name}>
            {name}
            {isFork ? <em> (fork)</em> : null}
          </p>
          <p className={theme.date}>{createdAtDate}</p>
        </div>
        <div
          className={`${theme.checkBox} ${checked
            ? theme.checkBoxActive
            : null}`}
        />
      </label>
      <a className={theme.link} href={url}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={theme.linkIcon}
        >
          <path
            d="M488.73 0H302.54a23.27 23.27 0 0 0 0 46.55h130L193 286.09A23.27 23.27 0 1 0 225.9 319L465.45 79.46v130a23.27 23.27 0 0 0 46.55 0V23.27A23.27 23.27 0 0 0 488.73 0z"
            fill="#2B2D42"
          />
          <path
            d="M395.64 232.73A23.27 23.27 0 0 0 372.36 256v209.46H46.55V139.64H256a23.27 23.27 0 0 0 0-46.55H23.27A23.27 23.27 0 0 0 0 116.36v372.37A23.27 23.27 0 0 0 23.27 512h372.37a23.27 23.27 0 0 0 23.27-23.27V256a23.27 23.27 0 0 0-23.27-23.27z"
            fill="#2B2D42"
          />
        </svg>
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
  createdAt: PropTypes.string.isRequired,
};

RepoCheckbox.defaultProps = {
  theme: defaultTheme,
};
