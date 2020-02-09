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
    safeCellsFound,
    bombCellsFound,
} from '../actions';
import { reducer, on } from 'ts-action';
import { AppState, GameStatus, AppReducer } from './reducer.typings';
import { gameBoardLevel1 } from '../../api/websocket.fixtures';
import {
    parseMapResponseToBoard,
    toggleFlagAt,
    cellToFlag,
} from '../../helpers';

export const initialState: AppState = {
    level: null,
    board: '',
    flags: [],
    safe: [],
    status: null,
    isOnline: true,
    isProcessing: false,
};

export const appReducer: AppReducer = reducer(
    initialState,
    on(
        levelInputClick,
        (state, { payload }): AppState => {
            if (state.isProcessing) {
                return { ...state };
            }
            return {
                ...state,
                board: (false && gameBoardLevel1) || '',
                flags: [],
                status: null,
                level: payload.level,
            };
        }
    ),
    on(
        boardCellRightClick,
        (state, { payload }): AppState => {
            return {
                ...state,
                flags: toggleFlagAt(payload.cell, state.flags),
            };
        }
    ),
    on(
        connectionLost,
        (state): AppState => {
            return {
                ...state,
                isOnline: false,
                isProcessing: false,
            };
        }
    ),
    on(
        mapUpdated,
        (state, { payload }): AppState => {
            return {
                ...state,
                board: parseMapResponseToBoard(payload.message),
            };
        }
    ),
    on(
        cellOpenedYouLose,
        (state): AppState => {
            return {
                ...state,
                status: GameStatus.Lose,
            };
        }
    ),
    on(
        cellOpenedYouWin,
        (state): AppState => {
            return {
                ...state,
                flags: [],
                status: GameStatus.Win,
            };
        }
    ),
    on(
        unknownMessageReceived,
        (state): AppState => {
            return {
                ...state,
                isProcessing: false,
            };
        }
    ),
    on(
        processingStarted,
        (state): AppState => {
            return {
                ...state,
                isProcessing: true,
            };
        }
    ),
    on(
        processingFinished,
        (state): AppState => {
            return {
                ...state,
                isProcessing: false,
            };
        }
    ),
    on(
        safeCellsFound,
        (state, { payload }): AppState => {
            return {
                ...state,
                safe: payload.rest,
            };
        }
    ),
    on(
        bombCellsFound,
        (state, { payload }): AppState => {
            return {
                ...state,
                flags: [
                    ...state.flags,
                    ...payload.cells.map(c => cellToFlag(c)),
                ],
            };
        }
    )
);
