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
    processingStarted,
    processingFinished,
    safeCellsFound,
    bombCellsFound,
} from '../actions';
import {
    AppState,
    GameStatus,
    GameCell,
    GameFlag,
} from './reducer.typings';
import {
    gameBoardShort,
    mapResponseShort,
} from '../../api/websocket.fixtures';

const cell10: GameCell = { x: 1, y: 0 };
const flag10: GameFlag = '1,0';

describe('Reducer', () => {
    it('should handle "connectionLost" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [],
            safe: [],
            level: 1,
            status: null,
            isProcessing: true,
            isOnline: true,
        };
        const state = appReducer(initialState, connectionLost());
        expect(state).toEqual({
            ...initialState,
            isOnline: false,
            isProcessing: false,
        });
    });
    it('should handle "levelInputClick" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: GameStatus.Lose,
            isOnline: true,
            isProcessing: false,
        };
        const state = appReducer(
            initialState,
            levelInputClick({ level: 2 })
        );
        const expected: AppState = {
            ...initialState,
            board: '',
            flags: [],
            safe: [],
            level: 2,
            status: null,
        };
        expect(state).toEqual(expected);
    });
    it('should handle "mapUpdated" action', () => {
        const initialState: AppState = {
            board: '',
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isOnline: true,
            isProcessing: true,
        };
        const state = appReducer(
            initialState,
            mapUpdated({ message: mapResponseShort })
        );
        expect(state).toEqual({
            ...initialState,
            board: gameBoardShort,
        });
    });
    it('should handle "boardCellRightClick" action with cell remove', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isOnline: true,
            isProcessing: false,
        };
        const state = appReducer(
            initialState,
            boardCellRightClick({ cell: cell10 })
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
            safe: [],
            level: 1,
            status: null,
            isOnline: true,
            isProcessing: false,
        };
        const state = appReducer(
            initialState,
            boardCellRightClick({ cell: cell10 })
        );
        expect(state).toEqual({
            ...initialState,
            flags: [flag10],
        });
    });
    it('should handle "cellOpenedYouLose" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isOnline: true,
            isProcessing: false,
        };
        const state = appReducer(initialState, cellOpenedYouLose());
        expect(state).toEqual({
            ...initialState,
            status: GameStatus.Lose,
        });
    });
    it('should handle "cellOpenedYouWin" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isOnline: true,
            isProcessing: false,
        };
        const state = appReducer(initialState, cellOpenedYouWin());
        expect(state).toEqual({
            ...initialState,
            status: GameStatus.Win,
        });
    });
    it('should handle "newLevelStarted" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isOnline: true,
            isProcessing: false,
        };
        const state = appReducer(initialState, newLevelStarted());
        expect(state).toEqual({
            ...initialState,
        });
    });
    it('should handle "cellOpenedOk" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isOnline: true,
            isProcessing: false,
        };
        const state = appReducer(initialState, cellOpenedOk());
        expect(state).toEqual({
            ...initialState,
        });
    });
    it('should handle "unknownMessageReceived" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isProcessing: true,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            unknownMessageReceived()
        );
        expect(state).toEqual({
            ...initialState,
            isProcessing: false,
        });
    });
    it('should handle "processingStarted" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isProcessing: false,
            isOnline: true,
        };
        const state = appReducer(initialState, processingStarted());
        expect(state).toEqual({
            ...initialState,
            isProcessing: true,
        });
    });
    it('should handle "processingFinished" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isProcessing: true,
            isOnline: true,
        };
        const state = appReducer(initialState, processingFinished());
        expect(state).toEqual({
            ...initialState,
            isProcessing: false,
        });
    });
    it('should handle "safeCellsFound" action', () => {
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isProcessing: true,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            safeCellsFound({ cells: [cell10] })
        );
        expect(state).toEqual({
            ...initialState,
            safe: [cell10],
        });
    });
    it('should handle "bombCellsFound" action', () => {
        const cell12: GameCell = { x: 1, y: 2 };
        const flag12: GameFlag = '1,2';
        const initialState: AppState = {
            board: gameBoardShort,
            flags: [flag10],
            safe: [],
            level: 1,
            status: null,
            isProcessing: true,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            bombCellsFound({ cells: [cell10, cell12] })
        );
        expect(state).toEqual({
            ...initialState,
            flags: [flag10, flag12],
        });
    });
});
