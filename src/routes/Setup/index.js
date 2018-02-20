import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SignInForm from './components/SignInForm';
import { saveGithubCredentials } from './actions';
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
      await this.requestCurrentUser();
      this.setState({ autoRequestedCurrentUser: true });
    }
  }

  requestCurrentUser() {
    this.props.requestCurrentUser(this.props.githubToken);
  }

  render() {
    const progressBar = (
      <div className={style.progressBar}>
        <span className={`${style.stepOne} ${style.step} ${style.activeStep}`}>
          1
        </span>
        <span
          className={`${style.stepTwo} ${style.step} ${this.props.githubClientId
            ? style.activeStep
            : null}`}
        >
          2
        </span>
        <span
          className={`${style.stepThree} ${style.step} ${this.props.githubToken
            ? style.activeStep
            : null}`}
        >
          3
        </span>
      </div>
    );

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
        <p>
          Successfully signed in as <strong>{this.props.login}</strong>!
        </p>
        <p>
          Next you can select the repos that you would like to monitor with
          Pullp.
        </p>
        <Link to="/selectRepos">
          <Button className={style.button}>Let&#39;s get started</Button>
        </Link>
      </div>
    ) : null;

    return (
      <div className={style.setupContainer}>
        <h2 className={style.pageTitle}>Setup</h2>
        {progressBar}
        {loginError}
        {currentUserError}

        <SignInForm
          saveGithubCredentials={this.props.saveGithubCredentialsAction}
          githubClientId={this.props.githubClientId}
          githubClientSecret={this.props.githubClientSecret}
          githubToken={this.props.githubToken}
          dispatch={this.props.dispatch}
          logout={this.props.logout}
        />
        {proceedToSelect}
      </div>
    );
  }
}

SetupContainer.propTypes = {
  saveGithubCredentialsAction: PropTypes.func.isRequired,
  githubClientId: PropTypes.string,
  githubClientSecret: PropTypes.string,
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
  githubClientId: null,
  githubClientSecret: null,
  githubCurrentUserError: null,
  login: null,
  avatarUrl: null,
  loginError: null,
  logout: () => {},
  currentUserLoading: false,
};

const mapStateToProps = state => ({
  githubClientId: state.setup.githubClientId,
  githubClientSecret: state.setup.githubClientSecret,
  githubToken: state.setup.githubToken,
  login: state.home.currentUser ? state.home.currentUser.login : null,
  avatarUrl: state.home.currentUser ? state.home.currentUser.avatarUrl : null,
  loginError: state.setup.loginError,
  githubCurrentUserError: state.home.githubCurrentUserError,
  currentUserLoading: state.home.currentUserLoading,
});

const mapDispatchToProps = dispatch => ({
  saveGithubCredentialsAction: credentials => {
    dispatch(saveGithubCredentials(credentials));
  },
  requestCurrentUser(token) {
    dispatch(requestCurrentUser(token));
  },
  logout() {
    dispatch(logout());
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SetupContainer);
