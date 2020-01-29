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
    cellOpenedOk,
    cellOpenedYouLose,
} from './actions';
import { reducer, on } from 'ts-action';
import { AppState, GameStatus } from './redux.typings';

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
    on(newLevelStarted, cellOpenedOk, state => ({
        ...state,
        isLoading: true,
    })),
    on(cellOpenedYouLose, state => ({
        ...state,
        status: GameStatus.Lose,
        isLoading: true,
    })),

    on(statusUpdate, (state, { payload }) => ({
        ...state,
        status: payload.status,
        isLoading: true,
    }))
);
