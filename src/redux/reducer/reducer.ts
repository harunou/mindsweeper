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
    cellOpenedYouWin,
} from '../actions';
import { reducer, on } from 'ts-action';
import { AppState, GameStatus, AppReducer } from './reducer.typings';
import { mapResponseLevel4 } from '../../api/websocket.fixtures';
import { parseMapResponseToBoard, toggleFlagAt } from '../../helpers';

export const initialState: AppState = {
    level: null,
    board: '',
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
            board:
                (false && parseMapResponseToBoard(mapResponseLevel4)) ||
                '',
            flags: [],
            status: null,
            level: payload.level,
            isLoading: true,
        };
    }),
    on(newLevelStarted, cellOpenedOk, boardCellClick, state => ({
        ...state,
        isLoading: true,
    })),
    on(boardCellRightClick, (state, { payload }) => {
        return {
            ...state,
            flags: toggleFlagAt(payload.cell, state.flags),
        };
    }),
    on(connectionLost, state => ({
        ...state,
        isOnline: false,
        isLoading: false,
    })),
    on(mapUpdated, (state, { payload }) => ({
        ...state,
        board: parseMapResponseToBoard(payload.message),
        isLoading: false,
    })),
    on(cellOpenedYouLose, state => ({
        ...state,
        status: GameStatus.Lose,
        isLoading: true,
    })),
    on(cellOpenedYouWin, state => ({
        ...state,
        status: GameStatus.Win,
        isLoading: true,
    })),
    on(unknownMessageReceived, state => ({
        ...state,
        isLoading: false,
    }))
);
