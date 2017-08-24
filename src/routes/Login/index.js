/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class LoginContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Login</h1>
      </div>
    );
  }
}
LoginContainer.propTypes = {};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
