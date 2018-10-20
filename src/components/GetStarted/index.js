import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GET_CURRENT_USER } from '../../apollo/queries';
import LoadingMessage from '../LoadingMessage';
import Error from '../Error';
import Button from '../Button';
import style from './style.css';

export function GetStarted({ data, loading, error, refetch, networkStatus }) {
  const renderContent = () => {
    // networkStatus 4 is refetching
    if (loading || networkStatus === 4) {
      return <LoadingMessage message="Loading your Github profile..." />;
    }

    if (error) {
      return (
        <div>
          <Error
            message={
              'Failed to load your Github profile from the Github API. Please try again later.'
            }
          />
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      );
    }
    return (
      <Fragment>
        <p className={style.success}>
          Successfully signed in as <strong>{data.viewer.login}</strong>!
        </p>
        <p className={style.continue}>
          Now it&#8217;s time to select the Github repos that you would like to
          monitor with Pullp.
        </p>
        <Link to="/app/selectRepos">
          <Button className={style.button}>Let&#39;s get started</Button>
        </Link>
      </Fragment>
    );
  };

  return <div className={style.getStartedContainer}>{renderContent()}</div>;
}

GetStarted.propTypes = {
  data: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
  refetch: PropTypes.func.isRequired,
  networkStatus: PropTypes.number.isRequired,
};

GetStarted.defaultProps = {
  error: null,
};

export default function GetStartedContainer() {
  return (
    <Query
      query={GET_CURRENT_USER}
      notifyOnNetworkStatusChange
      fetchPolicy="network-only"
    >
      {props => <GetStarted {...props} />}
    </Query>
  );
}
