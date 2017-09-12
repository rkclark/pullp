import { connect } from 'react-redux';
import Home from './components/Home';
import * as actions from './actions';
import { saveRedirect } from '../Login/actions';

const mapStateToProps = state => ({
  apiContent: state.home.apiContent,
  apiError: state.home.apiError,
  redirectPath: state.login.redirectPath,
});

const mapDispatchToProps = dispatch => ({
  requestApiContent() {
    dispatch(actions.requestApiContent());
  },
  saveRedirect() {
    dispatch(saveRedirect());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
