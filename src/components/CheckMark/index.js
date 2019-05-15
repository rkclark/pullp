import React from 'react';
import style from './style.css';

export default function CheckMark() {
  return (
    <svg
      className={style.checkmark}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 612 612"
    >
      <g>
        <g>
          <g>
            <path
              d="M306 0a306 306 0 1 0 0 612 306 306 0 0 0 0-612zm122.3 199.6s-135 235-137.4 237.2a19.1 19.1 0 0 1-27-.8l-87.4-80.7a19.1 19.1 0 0 1 27.9-26.2l68.4 63.2 122.3-211.9a19.1 19.1 0 0 1 33.2 19.2z"
              fill="#D80027"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
