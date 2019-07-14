import PropTypes from 'prop-types';
import ClientActions from './clientActions';
import githubAuth from './helpers/githubAuth';

export default function SetupBrowser({ client }) {
  const { saveGithubToken, setLoadingToken, saveTokenError } = ClientActions({
    client,
  });

  return githubAuth(saveGithubToken, setLoadingToken, saveTokenError);
}

SetupBrowser.propTypes = {
  client: PropTypes.shape({}).isRequired,
};
