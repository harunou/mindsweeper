import { AppState } from './reducer/reducer.typings';

export const selectGameLevel = (state: AppState) => state.level;
export const selectIsOnline = (state: AppState) => state.isOnline;
export const selectGameStatus = (state: AppState) => state.status;
export const selectIsLoading = (state: AppState) => state.isLoading;
