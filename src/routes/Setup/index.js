import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SignInForm from './components/SignInForm';
import style from './style.css';
import { requestCurrentUser } from '../../routes/Home/actions';
import { logout } from '../Account/actions';
import Error from '../../components/Error';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

export class SetupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      autoRequestedCurrentUser: false,
    };
    this.requestCurrentUser = this.requestCurrentUser.bind(this);
  }

  async componentWillReceiveProps(nextProps) {
    if (
      !nextProps.login &&
      nextProps.githubToken &&
      !nextProps.currentUserLoading &&
      !this.state.autoRequestedCurrentUser
    ) {
      await this.props.requestCurrentUser(nextProps.githubToken);
      this.setState({ autoRequestedCurrentUser: true });
    }
  }

  requestCurrentUser() {
    this.props.requestCurrentUser(this.props.githubToken);
  }

  render() {
    const currentUserError = this.props.githubCurrentUserError ? (
      <div>
        {this.props.currentUserLoading ? (
          <div className={style.loadingContainer}>
            <Loading />
          </div>
        ) : (
          <div>
            <Error message="Error requesting your user profile from Github." />
            <Button
              className={style.button}
              onClick={this.requestCurrentUser}
              data-test-id="try-again-button"
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    ) : null;

    const loginError = this.props.loginError ? (
      <Error message="Github sign in failed." />
    ) : null;

    const proceedToSelect = this.props.login ? (
      <div>
        <p className={style.success}>
          Successfully signed in as <strong>{this.props.login}</strong>!
        </p>
        <p className={style.continue}>
          Now its time to select the Github repos that you would like to monitor
          with Pullp.
        </p>
        <Link to="/selectRepos">
          <Button className={style.button}>Let&#39;s get started</Button>
        </Link>
      </div>
    ) : null;

    return (
      <div className={style.setupContainer}>
        <div className={style.innerContainer}>
          {loginError}
          {currentUserError}

          <SignInForm
            githubToken={this.props.githubToken}
            dispatch={this.props.dispatch}
            logout={this.props.logout}
          />
          {proceedToSelect}
        </div>
      </div>
    );
  }
}

SetupContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  githubToken: PropTypes.string,
  login: PropTypes.string,
  requestCurrentUser: PropTypes.func.isRequired,
  loginError: PropTypes.string,
  logout: PropTypes.func,
  githubCurrentUserError: PropTypes.string,
  currentUserLoading: PropTypes.bool,
};

SetupContainer.defaultProps = {
  githubToken: null,
  githubCurrentUserError: null,
  login: null,
  avatarUrl: null,
  loginError: null,
  logout: () => {},
  currentUserLoading: false,
};

const mapStateToProps = state => ({
  githubToken: state.setup.githubToken,
  login: state.home.currentUser ? state.home.currentUser.login : null,
  avatarUrl: state.home.currentUser ? state.home.currentUser.avatarUrl : null,
  loginError: state.setup.loginError,
  githubCurrentUserError: state.home.githubCurrentUserError,
  currentUserLoading: state.home.currentUserLoading,
});

const mapDispatchToProps = dispatch => ({
  requestCurrentUser(token) {
    dispatch(requestCurrentUser(token));
  },
  logout() {
    dispatch(logout());
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SetupContainer);
