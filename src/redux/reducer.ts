import {
    connectionLost,
    levelInputClick,
    mapUpdated,
    boardCellClick,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
    unknownMessageReceived,
} from './actions';
import { reducer, on } from 'ts-action';
import {
    AppState,
    GameStatus,
    AppReducer,
    GameBoard,
} from './reducer.typings';
import { mapResponse } from '../api/websocket.fixtures';

export const initialState: AppState = {
    level: null,
    board: [[]],
    status: null,
    isOnline: true,
    isLoading: false,
};

export const appReducer: AppReducer = reducer(
    initialState,
    on(levelInputClick, (state, { payload }) => ({
        ...state,
        board: parseMapResponseToGameBoard(mapResponse),
        level: payload.level,
        isLoading: true,
    })),
    on(newLevelStarted, cellOpenedOk, boardCellClick, state => ({
        ...state,
        isLoading: true,
    })),
    on(connectionLost, state => ({
        ...state,
        isOnline: false,
        isLoading: false,
    })),
    on(mapUpdated, (state, { payload }) => ({
        ...state,
        board: parseMapResponseToGameBoard(payload.message),
        isLoading: false,
    })),
    on(cellOpenedYouLose, state => ({
        ...state,
        status: GameStatus.Lose,
        isLoading: true,
    })),
    on(unknownMessageReceived, state => ({
        ...state,
        isLoading: false,
    }))
);
export const parseMapResponseToGameBoard = (
    message: string
): GameBoard => {
    return message
        .split(/\r?\n/)
        .slice(1, -1)
        .map(row => {
            return row.split('');
        });
};
