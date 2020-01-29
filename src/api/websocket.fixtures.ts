import { GameBoard, GameCell } from '../redux/reducer.typings';

export const newOkResponse = 'new: OK';
export const openOkResponse = 'open: OK';
export const openYouLoseResponse = 'open: You lose';
export const mapResponse = `map:
1*□□□□□□□□
112□□□□□□□
00111112□□
00000001□□
00001111□□
00112□□□□□
012□□□□□□□
01□□□□□□□□
02□□□□□□□□
01□□□□□□□□
`;
export const mapResponseShort = `map:
1*□□
01□□
`;
export const mapResponseShortAsGameBoard: GameBoard = [
    ['1', '*', '□', '□'],
    ['0', '1', '□', '□'],
];
export const open11Command = 'open 1 1';
export const cell11: GameCell = { x: 1, y: 1 };
