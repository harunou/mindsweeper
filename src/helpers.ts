import {
    GameCell,
    GameBoard,
    GameFlag,
    AppState,
    GameStatus,
} from './redux/reducer/reducer.typings';

export const bombCellChar = '*';
export const coverCellChar = '□';
export const safeCellChar = '.';

export const isBombCell = (element: string) => bombCellChar === element;
export const isCoverCell = (element: string) =>
    coverCellChar === element;
export const isSafeCell = (char: string) => safeCellChar === char;

export const getBoardWidth = (board: string) => {
    const width = board.indexOf('\n');
    if (width === -1) {
        return board.length;
    }
    return width;
};

export const getSafeCells = (board: string): GameCell[] => {
    const width = getBoardWidth(board);
    return board
        .replace(/\n/g, '')
        .split('')
        .reduce(mapToGameCells(width, isSafeCell), []);
};

export const getBombCells = (board: string): GameCell[] => {
    const width = getBoardWidth(board);
    return board
        .replace(/\n/g, '')
        .split('')
        .reduce(mapToGameCells(width, isBombCell), []);
};

const mapToGameCells = (
    width: number,
    isGameCell: (char: string) => boolean
) => (s: GameCell[], char: string, index: number) => {
    if (isGameCell(char)) {
        return s.concat({
            x: index % width,
            y: Math.floor(index / width),
        });
    }
    return s;
};

export const parseMapResponseToBoard = (message: string): GameBoard => {
    return message.slice(message.indexOf('\n') + 1, -1);
};

export const cellToUniqueId = (cell: GameCell): string =>
    `${cell.x},${cell.y}`;

export const cellToFlag = (cell: GameCell): GameFlag =>
    cellToUniqueId(cell);

export const toggleFlagAt = (
    cell: GameCell,
    flags: GameFlag[]
): GameFlag[] => {
    return hasFlagAt(cell, flags)
        ? removeFlagAt(cell, flags)
        : flags.concat(cellToFlag(cell));
};

export const hasFlagAt = (
    cell: GameCell,
    flags: GameFlag[]
): boolean => {
    return flags.includes(cellToFlag(cell));
};

const removeFlagAt = (
    cell: GameCell,
    flags: GameFlag[]
): GameFlag[] => {
    const index = flags.indexOf(cellToFlag(cell));
    if (index === -1) {
        return [...flags];
    }
    return [...flags.slice(0, index), ...flags.slice(index + 1)];
};

export const getCellsNotInFlags = (
    cells: GameCell[],
    flags: GameFlag[]
): GameCell[] => cells.filter(c => !hasFlagAt(c, flags));

export const isGameOver = (state: AppState): boolean => {
    return (
        state.status === GameStatus.Lose ||
        state.status === GameStatus.Win
    );
};
