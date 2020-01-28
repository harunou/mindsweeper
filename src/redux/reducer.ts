import { Reducer, Action } from 'redux';

export interface AppState {}

export const initialState: AppState = {};

export const appReducer: Reducer<AppState, Action<string>> = (
    prevState: AppState = initialState,
    action: Action<string>
): AppState => {
    switch (action.type) {
        default:
            return prevState;
    }
};
