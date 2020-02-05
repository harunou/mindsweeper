import {
    toggleFlagAt,
    hasFlagAt,
    parseMapResponseToBoard,
} from './helpers';
import {
    mapResponseShort,
    gameBoardShort,
} from '../api/websocket.fixtures';
import { GameCell } from './reducer/reducer.typings';

const cell11: GameCell = { x: 1, y: 1 };
const flag11 = '1,1';

describe('Helper functions', () => {
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
    it('should find cell from flags array if presented', () => {
        expect(hasFlagAt(cell11, [flag11])).toBeTruthy();
        expect(hasFlagAt(cell11, [])).toBeFalsy();
    });
});
