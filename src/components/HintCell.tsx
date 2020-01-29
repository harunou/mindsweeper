import React from 'react';

export interface HintCellProps {
    hint: number;
}

const HintCell: React.FC<HintCellProps> = ({ hint }): JSX.Element => {
    return <div className='ms-board-cell mod-hint'>{hint || ''}</div>;
};

export default HintCell;
