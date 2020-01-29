import React, { Dispatch, useCallback } from 'react';
import {
    AppState,
    GameBoard,
    GameCell,
} from '../redux/reducer.typings';
import { useSelector, useDispatch } from 'react-redux';
import CoverCell from './CoverCell';
import { AppActions, boardCellClick } from '../redux/actions';

const Board: React.FC = (): JSX.Element => {
    const board: GameBoard = useSelector(selectBoard);
    const dispatch: Dispatch<AppActions> = useDispatch();

    const handleCellLeftClick = useCallback(
        (cell: GameCell) => () => dispatch(boardCellClick({ cell })),
        [dispatch]
    );
    const handleCellRightClick = useCallback(
        (cell: GameCell) => () => console.log('RightClick: ', cell),
        []
    );

    const boardOfElements: JSX.Element[] = board.map((row, rIndex) => (
        <div key={rIndex} className='ms-board-row'>
            {row.map((element, eIndex) => {
                const eKey = `${rIndex}${eIndex}`;
                const cell: GameCell = { x: rIndex, y: eIndex };
                switch (true) {
                    case isFlag(cell):
                        return <span key={eKey}>F</span>;
                    case isBombCell(element):
                        return <span>B</span>;
                    case isCoverCell(element):
                        return (
                            <CoverCell
                                onLeftClick={handleCellLeftClick(cell)}
                                onRightClick={handleCellRightClick(
                                    cell
                                )}
                            />
                        );
                    default:
                        return <span>{element}</span>;
                }
            })}
        </div>
    ));
    return <div>{boardOfElements}</div>;
};

const selectBoard = (state: AppState) => state.board;

const isFlag = (cell: GameCell) => false;
const isBombCell = (element: string) => '*' === element;
const isCoverCell = (element: string) => '□' === element;

export default Board;
