import { appReducer } from './reducer';
import {
    connectionLost,
    levelInputClick,
    mapUpdated,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
    unknownMessageReceived,
    boardCellRightClick,
} from './actions';
import { AppState, GameStatus } from './reducer.typings';
import {
    mapResponseShortAsGameBoard,
    cell11,
    mapResponseShort,
} from '../api/websocket.fixtures';
import { parseMapResponseToGameBoard } from './helpers';

describe('Reducer', () => {
    it('should handle "connectionLost" action', () => {
        const initialState: AppState = {
            board: [[]],
            flags: [],
            level: 1,
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
            flags: ['11'],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            levelInputClick({ level: 2 })
        );
        expect(state).toEqual({
            ...initialState,
            board: [[]],
            flags: [],
            level: 2,
            isLoading: true,
        });
    });
    it('should handle "mapUpdated" action', () => {
        const initialState: AppState = {
            board: [[]],
            flags: ['11'],
            level: 1,
            status: null,
            isLoading: true,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            mapUpdated({ message: mapResponseShort })
        );
        expect(state).toEqual({
            ...initialState,
            board: mapResponseShortAsGameBoard,
            isLoading: false,
        });
    });
    it('should handle "boardCellRightClick" action with cell remove', () => {
        const initialState: AppState = {
            board: [[]],
            flags: ['11'],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            boardCellRightClick({ cell: cell11 })
        );
        expect(state).toEqual({
            ...initialState,
            flags: [],
        });
    });
    it('should handle "boardCellRightClick" action with cell add', () => {
        const initialState: AppState = {
            board: [[]],
            flags: [],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            boardCellRightClick({ cell: cell11 })
        );
        expect(state).toEqual({
            ...initialState,
            flags: ['11'],
        });
    });
    it('should handle "cellOpenedYouLose" action', () => {
        const initialState: AppState = {
            board: [[]],
            flags: ['11'],
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
    it('should handle "newLevelStarted" action', () => {
        const initialState: AppState = {
            board: [[]],
            flags: ['11'],
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
            flags: ['11'],
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
            flags: ['11'],
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
    it('should handle "unknownMessageReceived" action', () => {
        const initialState: AppState = {
            board: [[]],
            flags: ['11'],
            level: 1,
            status: null,
            isLoading: true,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            unknownMessageReceived()
        );
        expect(state).toEqual({
            ...initialState,
            isLoading: false,
        });
    });
});

describe('map response parser', () => {
    it('should parse array response to 2D array of chars', () => {
        expect(parseMapResponseToGameBoard(mapResponseShort)).toEqual(
            mapResponseShortAsGameBoard
        );
    });
});
