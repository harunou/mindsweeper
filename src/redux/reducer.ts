import { Reducer } from 'redux';
import { AppActions, setOffline, setLevel } from './action';
import { reducer, on } from 'ts-action';
import { GameLevel } from './redux.typings';

export interface AppState {
    level: GameLevel | null;
    isOnline: boolean;
    isLoading: boolean;
}

export const initialState: AppState = {
    level: null,
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
    }))
);
