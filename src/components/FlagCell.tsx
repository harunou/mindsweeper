import React, { useCallback } from 'react';

interface FlagCellProps {
    x: number;
    y: number;
    onRightClick(x: number, y: number): void;
}

const FlagCell: React.FC<FlagCellProps> = ({
    x,
    y,
    onRightClick,
}): JSX.Element => {
    const handleContextMenu = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault();
            onRightClick(x, y);
        },
        [onRightClick, x, y]
    );

    return (
        <div
            className='ms-board-cell mod-flag'
            onContextMenu={handleContextMenu}
        >
            <span role='img' aria-label='flag'>
                ⚑
            </span>
        </div>
    );
};

export default FlagCell;
