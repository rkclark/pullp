import React from 'react';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
import Repo from '..//Repo';
import style from './style.css';

export default function FullView({ data, openRepoId, toggleOpenRepo }) {
  return (
    <div className={style.fullViewContainer}>
      <FlipMove typeName={null} duration={500} appearAnimation={'fade'}>
        {data.map(repo => (
          <Repo
            key={repo.id}
            data={repo}
            openRepoId={openRepoId}
            toggleOpenRepo={toggleOpenRepo}
          />
        ))}
      </FlipMove>
    </div>
  );
}

FullView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  openRepoId: PropTypes.string,
  toggleOpenRepo: PropTypes.func.isRequired,
};

FullView.defaultProps = {
  openRepoId: null,
};
