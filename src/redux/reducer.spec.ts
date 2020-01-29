import { appReducer } from './reducer';
import {
    setOffline,
    newGame,
    fetchMapSuccess,
    fetchMap,
    openCell,
    setStatus,
} from './action';
import { AppState, GameStatus } from './redux.typings';
import {
    mapResponseShortAsGameBoard,
    cell11,
} from '../api/websocket.fixtures';

describe('Reducer', () => {
    it('should handle "setOffline" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: null,
            status: null,
            isLoading: true,
            isOnline: true,
        };
        const state = appReducer(initialState, setOffline());
        expect(state).toEqual({
            ...initialState,
            isLoading: false,
            isOnline: false,
        });
    });
    it('should handle "newGame" action', () => {
        const initialState: AppState = {
            board: mapResponseShortAsGameBoard,
            level: null,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(initialState, newGame({ level: 1 }));
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
    it('should handle "fetchMapSuccess" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: true,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            fetchMapSuccess({ board: mapResponseShortAsGameBoard })
        );
        expect(state).toEqual({
            ...initialState,
            board: mapResponseShortAsGameBoard,
            isLoading: false,
        });
    });
    it('should handle "openCell" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            openCell({ cell: cell11 })
        );
        expect(state).toEqual({
            ...initialState,
            isLoading: true,
        });
    });
    it('should handle "setStatus" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: 1,
            status: null,
            isLoading: false,
            isOnline: true,
        };
        const state = appReducer(
            initialState,
            setStatus({ status: GameStatus.Lose })
        );
        expect(state).toEqual({
            ...initialState,
            status: GameStatus.Lose,
            isLoading: true,
        });
    });
});
