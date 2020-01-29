import { Reducer } from 'redux';
import {
    AppActions,
    connectionLost,
    levelInputClick,
    mapUpdated,
    fetchMap,
    boardCellClick,
    statusUpdate,
} from './action';
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
    on(connectionLost, state => ({
        ...state,
        isOnline: false,
        isLoading: false,
    })),
    on(levelInputClick, (state, { payload }) => ({
        ...state,
        board: [[]],
        level: payload.level,
        isLoading: true,
    })),
    on(fetchMap, state => ({
        ...state,
        isLoading: true,
    })),
    on(mapUpdated, (state, { payload }) => ({
        ...state,
        board: payload.board,
        isLoading: false,
    })),
    on(boardCellClick, state => ({
        ...state,
        isLoading: true,
    })),
    on(statusUpdate, (state, { payload }) => ({
        ...state,
        status: payload.status,
        isLoading: true,
    }))
);
