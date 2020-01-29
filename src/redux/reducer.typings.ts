import { Reducer } from 'redux';
import { AppActions } from './actions';

export interface AppState {
    level: GameLevel | null;
    board: GameBoard;
    flags: GameFlags;
    status: GameStatus | null;
    isOnline: boolean;
    isLoading: boolean;
}

export type AppReducer = Reducer<AppState, AppActions>;

export enum GameStatus {
    Lose = 'Lose',
}

export type GameCell = { x: number; y: number };

export type GameLevel = 1 | 2 | 3 | 4;

export type GameBoard = Array<string[]>;

export type GameFlags = GameCell[];
