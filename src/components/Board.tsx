import React from 'react';
import {
    AppState,
    GameBoard,
    GameCell,
} from '../redux/reducer.typings';
import { useSelector } from 'react-redux';

const Board: React.FC = (): JSX.Element => {
    const board: GameBoard = useSelector(selectBoard);

    const boardOfElements: JSX.Element[] = board.map((row, rIndex) => (
        <div key={rIndex}>
            {row.map((element, eIndex) => {
                const eKey = `${rIndex}${eIndex}`;
                switch (true) {
                    case isFlag({ x: eIndex, y: rIndex }):
                        return <span key={eKey}>F</span>;
                    case isBombCell(element):
                        return <span>B</span>;
                    case isCoverCell(element):
                        return <span>O</span>;
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
