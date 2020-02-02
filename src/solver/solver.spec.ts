import { solve } from './solver';

const board = `0001□□□□□□
0012□□□□□□
001□□□□□□□
012□□□□□□□
01□□□□□□□□
011□□□□□□□
001□□□□□□□
001□□□□□□□
001112□□□□
000001□□□□`;
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

describe('Basic solver', () => {
    it('should mark bomb and safe cells on board', () => {
        expect(solve(board)).toEqual(boardSolved);
    });
});
