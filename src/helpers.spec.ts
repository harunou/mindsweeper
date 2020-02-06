import {
    getSafeCells,
    getBombCells,
    parseMapResponseToBoard,
    toggleFlagAt,
    hasFlagAt,
    mergeFlagsAt,
} from './helpers';
import {
    mapResponseShort,
    gameBoardShort,
} from './api/websocket.fixtures';
import { createCellStub, createFlagStub } from './testing-tools';

const boardSolved = `0001□□□□□□
0001□□□□□□
000*□□□□□□
000.□□□□□□
00*.□□□□□□
000.□□□□□□
000.□□□□□□
000*..□□□□
000002□□□□
000001□□□□`;
const safeCells = [
    createCellStub(3, 3),
    createCellStub(3, 4),
    createCellStub(3, 5),
    createCellStub(3, 6),
    createCellStub(4, 7),
    createCellStub(5, 7),
];
const bombCells = [
    createCellStub(3, 2),
    createCellStub(2, 4),
    createCellStub(3, 7),
];
const cell10 = createCellStub(1, 0);
const cell12 = createCellStub(1, 2);
const flag10 = createFlagStub(1, 0);
const flag12 = createFlagStub(1, 2);

describe('App helper functions', () => {
    it('should output array of safe cells from resolved board', () => {
        expect(getSafeCells(boardSolved)).toEqual(safeCells);
    });
    it('should output array of bomb cells from resolved board', () => {
        expect(getBombCells(boardSolved)).toEqual(bombCells);
    });
    it('should parse map response to map value', () => {
        expect(parseMapResponseToBoard(mapResponseShort)).toEqual(
            gameBoardShort
        );
    });
    it('should add cell to flags array if not presented', () => {
        expect(toggleFlagAt(cell10, [])).toEqual([flag10]);
    });
    it('should remove cell from flags array if presented', () => {
        expect(toggleFlagAt(cell10, [flag10])).toEqual([]);
    });
    it('should find cell within flags array if presented', () => {
        expect(hasFlagAt(cell10, [flag10])).toBeTruthy();
        expect(hasFlagAt(cell10, [])).toBeFalsy();
    });
    it('should merge new flags into flags array', () => {
        expect(
            mergeFlagsAt([cell10, cell12], [flag10, flag12])
        ).toBeTruthy();
    });
});
