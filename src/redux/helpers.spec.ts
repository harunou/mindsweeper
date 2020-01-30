import {
    parseMapResponseToGameBoard,
    toggleFlagAt,
    hasFlagAt,
} from './helpers';
import {
    mapResponseShort,
    mapResponseShortAsGameBoard,
    cell11,
} from '../api/websocket.fixtures';

const flag11 = '1,1';

describe('Helper functions', () => {
    it('should parse array response to 2D array of chars', () => {
        expect(parseMapResponseToGameBoard(mapResponseShort)).toEqual(
            mapResponseShortAsGameBoard
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
