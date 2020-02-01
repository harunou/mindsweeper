import {
    GameBoard,
    GameCell,
    GameFlags,
} from './reducer/reducer.typings';

export const parseMapResponseToBoard = (message: string): GameBoard => {
    return message.slice(message.indexOf('\n') + 1, -1);
};

export const toggleFlagAt = (
    cell: GameCell,
    flags: GameFlags
): GameFlags => {
    return hasFlagAt(cell, flags)
        ? removeFlagAt(cell, flags)
        : flags.concat(cellToFlag(cell));
};
export const hasFlagAt = (
    cell: GameCell,
    flags: GameFlags
): boolean => {
    return flags.includes(cellToFlag(cell));
};
const cellToFlag = (cell: GameCell): string => `${cell.x},${cell.y}`;
const removeFlagAt = (cell: GameCell, flags: GameFlags): GameFlags => {
    const index = flags.indexOf(cellToFlag(cell));
    if (index === -1) {
        return { ...flags };
    }
    return [...flags.slice(0, index), ...flags.slice(index + 1)];
};
