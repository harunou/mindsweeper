import { Reducer } from 'redux';
import { AppActions } from './action';

export interface AppState {}

export const initialState: AppState = {};

export const appReducer: Reducer<AppState, AppActions> = (
    prevState: AppState = initialState,
    action: AppActions
): AppState => {
    return prevState;
};
