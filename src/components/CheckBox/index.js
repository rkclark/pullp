import React from 'react';
import PropTypes from 'prop-types';
import CheckMark from '../CheckMark';
import style from './style.css';

export default function CheckBox({ checked, name, onChange, displayName }) {
  return (
    <div className={style.checkboxContainer}>
      <input
        className={style.input}
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={name} className={style.checkboxLabel} checked={checked}>
        <div className={style.checkbox}>{checked && <CheckMark />}</div>
        {displayName}
      </label>
    </div>
  );
}

CheckBox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
};
