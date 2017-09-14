import { connect } from 'react-redux';
import Home from './components/Home';
import * as actions from './actions';
import { saveRedirect } from '../Login/actions';

const mapStateToProps = state => ({
  apiContent: state.home.apiContent,
  apiError: state.home.apiError,
  redirectPath: state.login.redirectPath,
  currentUser: state.home.currentUser,
  githubToken: state.login.githubToken,
});

const mapDispatchToProps = dispatch => ({
  requestApiContent() {
    dispatch(actions.requestApiContent());
  },
  saveRedirect() {
    dispatch(saveRedirect());
  },
  requestCurrentUser(token) {
    dispatch(actions.requestCurrentUser(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
