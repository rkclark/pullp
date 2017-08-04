import { connect } from 'react-redux';
import Home from './components/Home';
import * as actions from './actions';

const mapStateToProps = state => ({
  apiContent: state.home.apiContent,
  apiError: state.home.apiError,
});

const mapDispatchToProps = dispatch => ({
  requestApiContent() {
    dispatch(actions.requestApiContent());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
