import React, { Dispatch, useCallback } from 'react';
import {
    AppState,
    GameBoard,
    GameCell,
    GameFlags,
} from '../redux/reducer.typings';
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
import { isEqualCells } from '../redux/helpers';

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

    const boardOfElements: JSX.Element[] = board.map((row, rIndex) => (
        <div key={rIndex} className='ms-board-row'>
            {row.map((element, eIndex) => {
                const eKey = `${rIndex}${eIndex}`;
                const cell: GameCell = { x: rIndex, y: eIndex };
                switch (true) {
                    case isFlagCell(flags, cell):
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

const selectBoard = (state: AppState) => state.board;
const selectFlags = (state: AppState) => state.flags;

const isFlagCell = (flags: GameFlags, cell: GameCell) =>
    flags.some(c => isEqualCells(c, cell));
const isBombCell = (element: string) => '*' === element;
const isCoverCell = (element: string) => '□' === element;

const hintStringToNumber = (hint: string): number => parseInt(hint);

export default Board;
