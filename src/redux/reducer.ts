import {
    connectionLost,
    levelInputClick,
    mapUpdated,
    boardCellClick,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
    unknownMessageReceived,
    boardCellRightClick,
} from './actions';
import { reducer, on } from 'ts-action';
import { AppState, GameStatus, AppReducer } from './reducer.typings';
import { mapResponse } from '../api/websocket.fixtures';
import { parseMapResponseToGameBoard, isEqualCells } from './helpers';

export const initialState: AppState = {
    level: null,
    board: [[]],
    flags: [],
    status: null,
    isOnline: true,
    isLoading: false,
};

export const appReducer: AppReducer = reducer(
    initialState,
    on(levelInputClick, (state, { payload }) => {
        return {
            ...state,
            board: (false &&
                parseMapResponseToGameBoard(mapResponse)) || [[]],
            flags: [],
            level: payload.level,
            isLoading: true,
        };
    }),
    on(newLevelStarted, cellOpenedOk, boardCellClick, state => ({
        ...state,
        isLoading: true,
    })),
    on(boardCellRightClick, (state, { payload }) => {
        const hasFlag = state.flags.some(cell =>
            isEqualCells(cell, payload.cell)
        );
        return {
            ...state,
            flags: hasFlag
                ? state.flags.filter(
                      cell => !isEqualCells(cell, payload.cell)
                  )
                : state.flags.concat(payload.cell),
        };
    }),
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
