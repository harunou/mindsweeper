import { appReducer } from './reducer';
import { setOffline, newGame, fetchMapSuccess } from './action';
import { AppState } from './redux.typings';
import { mapResponseShortAsGameBoard } from '../api/websocket.fixtures';

describe('Reducer', () => {
    it('should handle "setOffline" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: null,
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
    it('should handle "fetchMapSuccess" action', () => {
        const initialState: AppState = {
            board: [[]],
            level: null,
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
});
