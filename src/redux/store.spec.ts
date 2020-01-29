import createAppStore from './store';
import { initialState } from './reducer';
import { createObserverSpy } from '../testing-tools';
import { WebSocketSubject } from 'rxjs/webSocket';
import { socketCommand } from '../api/websocket.client';
import {
    levelInputClick,
    fetchMap,
    boardCellClick,
    statusUpdate,
    newLevelStarted,
} from './actions';
import { GameStatus } from './reducer.typings';
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
    it('should send "map" command on "fetchMap" action', () => {
        store.dispatch(fetchMap());
        const mapCommand = socketCommand.map();
        expect(socket$.next).toHaveBeenCalledWith(mapCommand);
    });
    it('should send "new 1" command on "levelInputClick({level: 1})" action', () => {
        store.dispatch(levelInputClick({ level: 1 }));
        const new1Command = socketCommand.new(1);
        expect(socket$.next).toHaveBeenCalledWith(new1Command);
    });
    it('should send "open 1 1" command on "boardCellClick({cell: {x: 1, y: 1}})" action', () => {
        store.dispatch(boardCellClick({ cell: cell11 }));
        const open11Command = socketCommand.open(cell11);
        expect(socket$.next).toHaveBeenCalledWith(open11Command);
    });
    it('should send "map" command on "statusUpdate({status: GameStatus})" action', () => {
        store.dispatch(statusUpdate({ status: GameStatus.Lose }));
        const mapCommand = socketCommand.map();
        expect(socket$.next).toHaveBeenCalledWith(mapCommand);
    });
    it('should send "map" command on "newLevelStarted()" action', () => {
        store.dispatch(newLevelStarted());
        const mapCommand = socketCommand.map();
        expect(socket$.next).toHaveBeenCalledWith(mapCommand);
    });
    it('should send "map" command on "cellOpened()" action', () => {
        store.dispatch(newLevelStarted());
        expect(socket$.next).toHaveBeenCalledWith(socketCommand.map());
    });
});
