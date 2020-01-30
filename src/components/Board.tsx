import React, { Dispatch, useCallback } from 'react';
import {
    GameBoard,
    GameCell,
    GameFlags,
} from '../redux/reducer/reducer.typings';
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

const isBombCell = (element: string) => '*' === element;
const isCoverCell = (element: string) => '□' === element;

const hintStringToNumber = (hint: string): number => parseInt(hint);

const Board: React.FC = (): JSX.Element => {
    const board: GameBoard = useSelector(selectBoard);
    const flags: GameFlags = useSelector(selectFlags);
    const dispatch: Dispatch<AppActions> = useDispatch();

    const handleCellLeftClick = useCallback(
        (cell: GameCell) => () => dispatch(boardCellClick({ cell })),
        [dispatch]
    );
    const handleCellRightClick = useCallback(
        (cell: GameCell) => () =>
            dispatch(boardCellRightClick({ cell })),
        [dispatch]
    );

    const boardOfElements: JSX.Element[] = board.map((row, y) => (
        <div key={y} className='ms-board-row'>
            {row.map((element, x) => {
                const eKey = `${x}${y}`;
                const cell: GameCell = { x, y };
                switch (true) {
                    case hasFlagAt(cell, flags):
                        return (
                            <FlagCell
                                key={eKey}
                                onRightClick={handleCellRightClick(
                                    cell
                                )}
                            />
                        );
                    case isBombCell(element):
                        return <BombCell key={eKey} />;
                    case isCoverCell(element):
                        return (
                            <CoverCell
                                key={eKey}
                                onLeftClick={handleCellLeftClick(cell)}
                                onRightClick={handleCellRightClick(
                                    cell
                                )}
                            />
                        );
                    default:
                        return (
                            <HintCell
                                key={eKey}
                                hint={hintStringToNumber(element)}
                            />
                        );
                }
            })}
        </div>
    ));
    return <div>{boardOfElements}</div>;
};

export default Board;
