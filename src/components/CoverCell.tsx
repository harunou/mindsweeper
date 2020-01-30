import React, { memo } from 'react';

export interface CoverCellProps {
    x: number;
    y: number;
    onLeftClick(x: number, y: number): void;
    onRightClick(x: number, y: number): void;
}

const CoverCell: React.FC<CoverCellProps> = ({
    x,
    y,
    onLeftClick,
    onRightClick,
}): JSX.Element => {
    return (
        <div
            className='ms-board-cell mod-cover'
            onClick={() => onLeftClick(x, y)}
            onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault();
                onRightClick(x, y);
            }}
        ></div>
    );
};

export default memo(CoverCell);
