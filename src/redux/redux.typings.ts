import { WebSocketSubject } from 'rxjs/webSocket';

export interface AppState {
    level: GameLevel | null;
    board: GameBoard;
    status: GameStatus | null;
    isOnline: boolean;
    isLoading: boolean;
}

export enum GameStatus {
    Lose = 'Lose',
}

export type GameCell = { x: number; y: number };

export type GameLevel = 1 | 2 | 3 | 4;

export type GameSocket = WebSocketSubject<string>;

export interface EpicMiddlewareDependencies {
    socket$: GameSocket;
}

export type GameBoard = Array<string[]>;
