import createAppStore from './store';
import { initialState } from './reducer';
import { createObserverSpy } from '../testing-tools';
import { WebSocketSubject } from 'rxjs/webSocket';
import { socketCommand } from '../api/websocket.client';
import {
    levelInputClick,
    boardCellClick,
    newLevelStarted,
} from './actions';
import { cell11 } from '../api/websocket.fixtures';
import { AppSocket } from '../api/websocket.typings';
import { AppStore } from './store.typings';

let socket$: AppSocket;
let store: AppStore;

describe('Store', () => {
    beforeEach(() => {
        socket$ = (createObserverSpy() as unknown) as WebSocketSubject<
            string
        >;
        store = createAppStore(socket$);
    });
    it('should create store with initial state', () => {
        expect(store.getState()).toEqual(initialState);
    });
    it('should send "new 1" command on "levelInputClick({level: 1})" action', () => {
        store.dispatch(levelInputClick({ level: 1 }));
        expect(socket$.next).toHaveBeenCalledWith(socketCommand.new(1));
    });
    it('should send "open 1 1" command on "boardCellClick({cell: {x: 1, y: 1}})" action', () => {
        store.dispatch(boardCellClick({ cell: cell11 }));
        expect(socket$.next).toHaveBeenCalledWith(
            socketCommand.open(cell11)
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
