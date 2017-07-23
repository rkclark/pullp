import React from 'react';
import PropTypes from 'prop-types';

export default function Counter({ counter, increment, decrement }) {
  return (
    <div>
      <button onClick={increment}>+</button>
      <div>{counter}</div>
      <button onClick={decrement}>-</button>
    </div>
  );
}

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
};
