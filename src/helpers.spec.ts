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
import { GameCell, GameFlag } from './redux/reducer/reducer.typings';

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
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    { x: 3, y: 5 },
    { x: 3, y: 6 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
];
const bombCells = [
    { x: 3, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 7 },
];
const cell11: GameCell = { x: 1, y: 1 };
const flag11 = '1,1';

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
        expect(toggleFlagAt(cell11, [])).toEqual([flag11]);
    });
    it('should remove cell from flags array if presented', () => {
        expect(toggleFlagAt(cell11, [flag11])).toEqual([]);
    });
    it('should find cell within flags array if presented', () => {
        expect(hasFlagAt(cell11, [flag11])).toBeTruthy();
        expect(hasFlagAt(cell11, [])).toBeFalsy();
    });
    it('should merge new flags into flags array', () => {
        const cell12: GameCell = { x: 1, y: 2 };
        const flag12: GameFlag = '1,2';
        expect(
            mergeFlagsAt([cell11, cell12], [flag11, flag12])
        ).toBeTruthy();
    });
});
