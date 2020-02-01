import React, { Dispatch, useCallback } from 'react';
import { GameBoard, GameFlags } from '../redux/reducer/reducer.typings';
import { useSelector, useDispatch } from 'react-redux';
import CoverCell from './CoverCell';
import {
    AppActions,
    boardCellClick,
    boardCellRightClick,
} from '../redux/actions';
import BombCell from './BombCell';
import HintCell from './HintCell';
import FlagCell from './FlagCell';
import { hasFlagAt } from '../redux/helpers';
import { selectBoard, selectFlags } from '../redux/selectors';
import { isBombCell, isCoverCell } from './helpers';

const Board: React.FC = (): JSX.Element => {
    const board: GameBoard = useSelector(selectBoard);
    const flags: GameFlags = useSelector(selectFlags);
    const dispatch: Dispatch<AppActions> = useDispatch();

    const handleCellLeftClick = useCallback(
        (x: number, y: number) =>
            dispatch(boardCellClick({ cell: { x, y } })),
        [dispatch]
    );
    const handleCellRightClick = useCallback(
        (x: number, y: number) =>
            dispatch(boardCellRightClick({ cell: { x, y } })),
        [dispatch]
    );

    const rows: JSX.Element[] = board.split('\n').map((row, y) => (
        <div key={y} className='ms-board-row'>
            {row.split('').map((element, x) => {
                const key = `${x}${y}`;
                switch (true) {
                    case hasFlagAt({ x, y }, flags):
                        return (
                            <FlagCell
                                {...{ x, y, key }}
                                onRightClick={handleCellRightClick}
                            />
                        );
                    case isBombCell(element):
                        return <BombCell key={key} />;
                    case isCoverCell(element):
                        return (
                            <CoverCell
                                {...{ x, y, key }}
                                onLeftClick={handleCellLeftClick}
                                onRightClick={handleCellRightClick}
                            />
                        );
                    default:
                        return <HintCell key={key} hint={element} />;
                }
            })}
        </div>
    ));
    return <div>{rows}</div>;
};

export default Board;
