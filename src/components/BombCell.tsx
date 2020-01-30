import React, { memo } from 'react';

const BombCell: React.FC = (): JSX.Element => {
    return (
        <div className='ms-board-cell mod-bomb'>
            <span role='img' aria-label='bomb'>
                💣
            </span>
        </div>
    );
};

export default memo(BombCell);
