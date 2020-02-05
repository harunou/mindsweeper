import { Reducer } from 'redux';
import { AppActions } from '../actions';

export interface AppState {
    level: GameLevel | null;
    board: GameBoard;
    flags: GameFlag[];
    safe: GameCell[];
    status: GameStatus | null;
    isOnline: boolean;
    isProcessing: boolean;
}

export type AppReducer = Reducer<AppState, AppActions>;

export enum GameStatus {
    Lose = 'Lose',
    Win = 'Win',
}

export type GameCell = { x: number; y: number };

export type GameLevel = 1 | 2 | 3 | 4;

export type GameBoard = string;

export type GameFlag = string;
