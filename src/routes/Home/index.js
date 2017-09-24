import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CurrentUser from './components/CurrentUser';
import * as actions from './actions';
import { saveRedirect } from '../Login/actions';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentWillMount() {
    if (this.props.redirectPath === '/') {
      this.props.saveRedirect(null);
    }
    if (!this.props.currentUser && this.props.githubToken) {
      this.props.requestCurrentUser(this.props.githubToken);
    }
  }

  loadCurrentUser() {
    const currentUser = this.props.currentUser;
    if (currentUser) {
      return (
        <CurrentUser
          login={currentUser.login}
          avatarUrl={currentUser.avatarUrl}
        />
      );
    }
    return null;
  }

  render() {
    const currentUser = this.loadCurrentUser();
    return (
      <div>
        <h1>PULLP</h1>
        {currentUser}
      </div>
    );
  }
}

Home.propTypes = {
  redirectPath: PropTypes.string,
  saveRedirect: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    login: PropTypes.string,
    avatarUrl: PropTypes.string,
    url: PropTypes.string,
  }),
  requestCurrentUser: PropTypes.func.isRequired,
  githubToken: PropTypes.string,
};

Home.defaultProps = {
  redirectPath: null,
  currentUser: null,
  githubToken: null,
};

const mapStateToProps = state => ({
  redirectPath: state.login.redirectPath,
  currentUser: state.home.currentUser,
  githubToken: state.login.githubToken,
});

const mapDispatchToProps = dispatch => ({
  saveRedirect() {
    dispatch(saveRedirect());
  },
  requestCurrentUser(token) {
    dispatch(actions.requestCurrentUser(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
