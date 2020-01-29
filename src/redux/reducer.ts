import { Reducer } from 'redux';
import {
    AppActions,
    connectionLost,
    levelInputClick,
    mapUpdated,
    fetchMap,
    boardCellClick,
    statusUpdate,
    newLevelStarted,
} from './actions';
import { reducer, on } from 'ts-action';
import { AppState } from './redux.typings';

export const initialState: AppState = {
    level: null,
    board: [[]],
    status: null,
    isOnline: true,
    isLoading: false,
};

export const appReducer: Reducer<AppState, AppActions> = reducer(
    initialState,
    on(levelInputClick, (state, { payload }) => ({
        ...state,
        board: [[]],
        level: payload.level,
        isLoading: true,
    })),
    on(boardCellClick, state => ({
        ...state,
        isLoading: true,
    })),

    on(fetchMap, state => ({
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
        board: payload.board,
        isLoading: false,
    })),
    on(newLevelStarted, state => ({
        ...state,
        isLoading: true,
    })),

    on(statusUpdate, (state, { payload }) => ({
        ...state,
        status: payload.status,
        isLoading: true,
    }))
);
