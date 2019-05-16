import React from 'react';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
import Repo from '..//Repo';
import style from './style.css';
import repoTheme from './repoTheme.css';

export default function MinimalView({ data, openRepoId, toggleOpenRepo }) {
  return (
    <div className={style.minimalViewContainer}>
      <FlipMove typeName={null} duration={500} appearAnimation={'fade'}>
        {data.map(repo => (
          <Repo
            key={repo.id}
            data={repo}
            openRepoId={openRepoId}
            toggleOpenRepo={toggleOpenRepo}
            theme={repoTheme}
          />
        ))}
      </FlipMove>
    </div>
  );
}

MinimalView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  openRepoId: PropTypes.string,
  toggleOpenRepo: PropTypes.func.isRequired,
};

MinimalView.defaultProps = {
  openRepoId: null,
};
