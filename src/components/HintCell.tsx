import React, { memo } from 'react';

export interface HintCellProps {
    hint: string;
}

const HintCell: React.FC<HintCellProps> = ({ hint }): JSX.Element => {
    return (
        <div className='ms-board-cell mod-hint'>
            {hint === '0' || hint}
        </div>
    );
};

export default memo(HintCell);
