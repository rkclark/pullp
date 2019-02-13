import React from 'react';
import PropTypes from 'prop-types';
import Error from '../Error';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  componentDidCatch(error, info) {
    /* eslint-disable no-console */
    console.error(error);
    console.error(info);
    /* eslint-enable no-console */

    this.setState({ hasError: true, message: error.message });
  }

  render() {
    const { hasError, message } = this.state;

    if (hasError) {
      return <Error message={message || undefined} />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
