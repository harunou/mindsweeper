import React, { useCallback } from 'react';

export interface CoverCellProps {
    onLeftClick(): void;
    onRightClick(): void;
}

const CoverCell: React.FC<CoverCellProps> = ({
    onLeftClick,
    onRightClick,
}): JSX.Element => {
    const handleLeftClick = useCallback(() => {
        onLeftClick();
    }, [onLeftClick]);
    const handleContextMenu = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault();
            onRightClick();
        },
        [onRightClick]
    );

    return (
        <div
            className='ms-board-cell mod-cover'
            onClick={handleLeftClick}
            onContextMenu={handleContextMenu}
        ></div>
    );
};

export default CoverCell;
