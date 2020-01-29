import React, { useCallback } from 'react';

interface FlagCellProps {
    onRightClick(): void;
}

const FlagCell: React.FC<FlagCellProps> = ({
    onRightClick,
}): JSX.Element => {
    const handleContextMenu = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault();
            onRightClick();
        },
        [onRightClick]
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
