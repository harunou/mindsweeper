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
    cellOpenedYouWin,
} from '../actions';
import { AppState, GameStatus, GameCell } from './reducer.typings';
import {
    gameBoardShort,
    mapResponseShort,
} from '../../api/websocket.fixtures';

const cell11: GameCell = { x: 1, y: 1 };

describe('Reducer', () => {
    it('should handle "connectionLost" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
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
            board: gameBoardShort,
            flags: ['1,1'],
            level: 1,
            status: GameStatus.Lose,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            levelInputClick({ level: 2 })
        );
        const expected: AppState = {
            ...initialState,
            board: '',
            flags: [],
            level: 2,
            status: null,
            isOnline: true,
            isLoading: true,
        };
        expect(state).toEqual(expected);
    });
    it('should handle "mapUpdated" action', () => {
        const initialState: AppState = {
            board: '',
            flags: ['1,1'],
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
            board: gameBoardShort,
            isLoading: false,
        });
    });
    it('should handle "boardCellRightClick" action with cell remove', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: ['1,1'],
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
            board: gameBoardShort,
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
            flags: ['1,1'],
        });
    });
    it('should handle "cellOpenedYouLose" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: ['1,1'],
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
    it('should handle "cellOpenedYouWin" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: ['1,1'],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(initialState, cellOpenedYouWin());
        expect(state).toEqual({
            ...initialState,
            status: GameStatus.Win,
            isLoading: true,
        });
    });
    it('should handle "newLevelStarted" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: ['1,1'],
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
            board: gameBoardShort,
            flags: ['1,1'],
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
            board: gameBoardShort,
            flags: ['1,1'],
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
            board: gameBoardShort,
            flags: ['1,1'],
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
