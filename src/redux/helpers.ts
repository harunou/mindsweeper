import { GameBoard, GameCell } from './reducer.typings';

export const parseMapResponseToGameBoard = (
    message: string
): GameBoard => {
    return message
        .split(/\r?\n/)
        .slice(1, -1)
        .map(row => {
            return row.split('');
        });
};

export const isEqualCells = (c1: GameCell, c2: GameCell): boolean =>
    c1.x === c2.x && c1.y === c2.y;
