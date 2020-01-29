import { Reducer } from 'redux';
import {
    AppActions,
    setOffline,
    newGame,
    fetchMapSuccess,
    fetchMap,
    openCell,
    setStatus,
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
    on(setOffline, state => ({
        ...state,
        isOnline: false,
        isLoading: false,
    })),
    on(newGame, (state, { payload }) => ({
        ...state,
        board: [[]],
        level: payload.level,
        isLoading: true,
    })),
    on(fetchMap, state => ({
        ...state,
        isLoading: true,
    })),
    on(fetchMapSuccess, (state, { payload }) => ({
        ...state,
        board: payload.board,
        isLoading: false,
    })),
    on(openCell, state => ({
        ...state,
        isLoading: true,
    })),
    on(setStatus, (state, { payload }) => ({
        ...state,
        status: payload.status,
        isLoading: true,
    }))
);
