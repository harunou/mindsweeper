import { Reducer } from 'redux';
import {
    AppActions,
    setOffline,
    setLevel,
    fetchMapSuccess,
} from './action';
import { reducer, on } from 'ts-action';
import { AppState } from './redux.typings';

export const initialState: AppState = {
    level: null,
    board: [[]],
    isOnline: true,
    isLoading: false,
};

export const appReducer: Reducer<AppState, AppActions> = reducer(
    initialState,
    on(setOffline, state => ({
        ...state,
        isOnline: false,
    })),
    on(setLevel, (state, { payload }) => ({
        ...state,
        level: payload.level,
        isLoading: true,
    })),
    on(fetchMapSuccess, (state, { payload }) => ({
        ...state,
        board: payload.board,
        isLoading: false,
    }))
);
