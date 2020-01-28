import { Reducer } from 'redux';
import { AppActions, setOffline } from './action';
import { reducer, on } from 'ts-action';

export interface AppState {
    isOnline: boolean;
}

export const initialState: AppState = { isOnline: true };

export const appReducer: Reducer<AppState, AppActions> = reducer(
    initialState,
    on(setOffline, state => ({
        ...state,
        isOnline: false,
    }))
);
