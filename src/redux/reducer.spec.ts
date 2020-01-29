import { appReducer } from './reducer';
import {
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
import { AppState, GameStatus } from './redux.typings';
import {
    mapResponseShortAsGameBoard,
    cell11,
} from '../api/websocket.fixtures';

describe('Reducer', () => {
    it('should handle "connectionLost" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: null,
            status: null,
            isLoading: true,
            isOnline: true,
        };
        const state = appReducer(initialState, connectionLost());
        expect(state).toEqual({
            ...initialState,
            isLoading: false,
            isOnline: false,
        });
    });
    it('should handle "levelInputClick" action', () => {
        const initialState: AppState = {
            board: mapResponseShortAsGameBoard,
            level: null,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            levelInputClick({ level: 1 })
        );
        expect(state).toEqual({
            ...initialState,
            board: [[]],
            level: 1,
            isLoading: true,
        });
    });
    it('should handle "fetchMap" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(initialState, fetchMap());
        expect(state).toEqual({
            ...initialState,
            isLoading: true,
        });
    });
    it('should handle "mapUpdated" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: true,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            mapUpdated({ board: mapResponseShortAsGameBoard })
        );
        expect(state).toEqual({
            ...initialState,
            board: mapResponseShortAsGameBoard,
            isLoading: false,
        });
    });
    it('should handle "boardCellClick" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            boardCellClick({ cell: cell11 })
        );
        expect(state).toEqual({
            ...initialState,
            isLoading: true,
        });
    });
    it('should handle "statusUpdate" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            statusUpdate({ status: GameStatus.Lose })
        );
        expect(state).toEqual({
            ...initialState,
            status: GameStatus.Lose,
            isLoading: true,
        });
    });
    it('should handle "newLevelStarted" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(initialState, newLevelStarted());
        expect(state).toEqual({
            ...initialState,
            isLoading: true,
        });
    });
    it('should handle "cellOpenedOk" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(initialState, cellOpenedOk());
        expect(state).toEqual({
            ...initialState,
            isLoading: true,
        });
    });
    it('should handle "cellOpenedYouLose" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(initialState, cellOpenedYouLose());
        expect(state).toEqual({
            ...initialState,
            status: GameStatus.Lose,
            isLoading: true,
        });
    });
});
