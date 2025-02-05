import { AppState } from './reducer/reducer.typings';

export const selectGameLevel = (state: AppState) => state.level;
export const selectIsOnline = (state: AppState) => state.isOnline;
export const selectGameStatus = (state: AppState) => state.status;
export const selectIsProcessing = (state: AppState) =>
    state.isProcessing;
export const selectBoard = (state: AppState) => state.board;
export const selectFlags = (state: AppState) => state.flags;
