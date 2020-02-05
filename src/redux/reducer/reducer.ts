import {
    connectionLost,
    levelInputClick,
    mapUpdated,
    cellOpenedYouLose,
    unknownMessageReceived,
    boardCellRightClick,
    cellOpenedYouWin,
    processingStarted,
    processingFinished,
} from '../actions';
import { reducer, on } from 'ts-action';
import { AppState, GameStatus, AppReducer } from './reducer.typings';
import { gameBoardLevel1 } from '../../api/websocket.fixtures';
import { parseMapResponseToBoard, toggleFlagAt } from '../../helpers';

export const initialState: AppState = {
    level: null,
    board: '',
    flags: [],
    status: null,
    isOnline: true,
    isProcessing: false,
};

export const appReducer: AppReducer = reducer(
    initialState,
    // NOTE(harunou): 'on' needs to be patched as it does not interfere type of returning value
    // on(newLevelStarted, cellOpenedOk, boardCellClick, state => ({
    //     ...state,
    //     isProcessing: true,
    //     dummyFlag: true // <-- ts does not catch, but should?
    // })),
    on(levelInputClick, (state, { payload }) => {
        if (state.isProcessing) {
            return { ...state };
        }
        const newState: AppState = {
            ...state,
            board: (false && gameBoardLevel1) || '',
            flags: [],
            status: null,
            level: payload.level,
        };
        return newState;
    }),
    on(boardCellRightClick, (state, { payload }) => {
        const newState: AppState = {
            ...state,
            flags: toggleFlagAt(payload.cell, state.flags),
        };
        return newState;
    }),
    on(connectionLost, state => {
        const newState: AppState = {
            ...state,
            isOnline: false,
            isProcessing: false,
        };
        return newState;
    }),
    on(mapUpdated, (state, { payload }) => {
        const newState: AppState = {
            ...state,
            board: parseMapResponseToBoard(payload.message),
        };
        return newState;
    }),
    on(cellOpenedYouLose, state => {
        const newState: AppState = {
            ...state,
            status: GameStatus.Lose,
        };
        return newState;
    }),
    on(cellOpenedYouWin, state => {
        const newState: AppState = {
            ...state,
            status: GameStatus.Win,
        };
        return newState;
    }),
    on(unknownMessageReceived, state => {
        const newState: AppState = {
            ...state,
            isProcessing: false,
        };
        return newState;
    }),
    on(processingStarted, state => {
        const newState: AppState = {
            ...state,
            isProcessing: true,
        };
        return newState;
    }),
    on(processingFinished, state => {
        const newState: AppState = {
            ...state,
            isProcessing: false,
        };
        return newState;
    })
);
