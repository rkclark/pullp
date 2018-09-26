/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import style from './style.css';

export function GetStarted({ data }) {
  console.log(data);
  return <div className={style.container} />;
}

GetStarted.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

// GetStarted.defaultProps = {

// };

const GET_CURRENT_USER = gql(`
query {
	viewer {
    login
    avatarUrl
    url
  }
}
`);

export default function GetStartedContainer() {
  return (
    <Query query={GET_CURRENT_USER}>
      {({ data, client }) => <GetStarted data={data} client={client} />}
    </Query>
  );
}
