import createAppStore from './store';
import { initialState } from '../reducer/reducer';
import {
    createSpyWebSocketSubject,
    SpyWebSocketSubject,
} from '../../testing-tools';
import { socketCommand } from '../../api/websocket.client';
import {
    levelInputClick,
    boardCellClick,
    newLevelStarted,
} from '../actions';
import { AppStore } from './store.typings';
import { GameCell } from '../reducer/reducer.typings';

const cell10: GameCell = { x: 1, y: 0 };
let socket$: SpyWebSocketSubject<string>;
let store: AppStore;

describe('Store', () => {
    beforeEach(() => {
        socket$ = createSpyWebSocketSubject<string>();
        store = createAppStore(socket$);
    });
    it('should create store with initial state', () => {
        expect(store.getState()).toEqual(initialState);
    });
    it('should send "new 1" command on "levelInputClick({level: 1})" action', () => {
        store.dispatch(levelInputClick({ level: 1 }));
        expect(socket$.next).toHaveBeenCalledWith(socketCommand.new(1));
    });
    it('should send "open 1 0" command on "boardCellClick({cell: {x: 1, y: 0}})" action', () => {
        store.dispatch(boardCellClick({ cell: cell10 }));
        expect(socket$.next).toHaveBeenCalledWith(
            socketCommand.open(cell10)
        );
    });
    it('should send "map" command on "newLevelStarted()" action', () => {
        store.dispatch(newLevelStarted());
        expect(socket$.next).toHaveBeenCalledWith(socketCommand.map());
    });
    it('should send "map" command on "cellOpened()" action', () => {
        store.dispatch(newLevelStarted());
        expect(socket$.next).toHaveBeenCalledWith(socketCommand.map());
    });
});
