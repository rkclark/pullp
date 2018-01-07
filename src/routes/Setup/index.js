import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SignInForm from './components/SignInForm';
import { saveGithubCredentials } from './actions';
import style from './style.css';
import { requestCurrentUser } from '../../routes/Home/actions';

export class SetupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  async componentDidUpdate() {
    if (!this.props.login && this.props.githubToken) {
      await this.props.requestCurrentUser(this.props.githubToken);
    }
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

    const proceedToSelect = this.props.login ? (
      <div>
        <p>Now logged in as {this.props.login}</p>
        <Link to="/selectRepos">Select repos</Link>
      </div>
    ) : null;

    return (
      <div>
        <h2>Setup</h2>
        {progressBar}
        <SignInForm
          saveGithubCredentials={this.props.saveGithubCredentialsAction}
          githubClientId={this.props.githubClientId}
          githubClientSecret={this.props.githubClientSecret}
          githubToken={this.props.githubToken}
          dispatch={this.props.dispatch}
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
};

SetupContainer.defaultProps = {
  githubToken: null,
  githubClientId: null,
  githubClientSecret: null,
  login: null,
  avatarUrl: null,
};

const mapStateToProps = state => ({
  githubClientId: state.setup.githubClientId,
  githubClientSecret: state.setup.githubClientSecret,
  githubToken: state.setup.githubToken,
  login: state.home.currentUser ? state.home.currentUser.login : null,
  avatarUrl: state.home.currentUser ? state.home.currentUser.avatarUrl : null,
});

const mapDispatchToProps = dispatch => ({
  saveGithubCredentialsAction: credentials => {
    dispatch(saveGithubCredentials(credentials));
  },
  requestCurrentUser(token) {
    dispatch(requestCurrentUser(token));
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SetupContainer);
