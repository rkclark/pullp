import React from 'react';
import PropTypes from 'prop-types';

export default function LeftArrowIcon({ theme }) {
  return (
    <svg
      className={theme.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
    >
      <path d="M382.69 182.69H59.12l77.2-77.22A17.3 17.3 0 1 0 111.84 81L5.07 187.76a17.3 17.3 0 0 0 0 24.48l106.77 106.78a17.25 17.25 0 0 0 12.24 5.07 17.3 17.3 0 0 0 12.24-29.56l-77.2-77.21h323.57a17.32 17.32 0 0 0 0-34.63z" />
    </svg>
  );
}

LeftArrowIcon.propTypes = {
  theme: PropTypes.shape({}),
};

LeftArrowIcon.defaultProps = {
  theme: {},
};
