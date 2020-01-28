import createAppStore from './store';
import { initialState } from './reducer';
import { createObserverSpy } from '../testing-tools';
import { WebSocketSubject } from 'rxjs/webSocket';
import {
    handleSuccessMessages,
    socketCommand,
} from '../api/websocket.client';
import {
    newOkResponse,
    openOkResponse,
    openYouLoseResponse,
} from '../api/websocket.fixtures';
import { AppActions, setLevel } from './action';
import { Store } from 'redux';
import { GameSocket, AppState } from './redux.typings';

let socket$: GameSocket;
let store: Store<AppState, AppActions>;
let successHandler: (message: string) => void;

describe('Store', () => {
    beforeEach(() => {
        socket$ = (createObserverSpy() as unknown) as WebSocketSubject<
            string
        >;
        store = createAppStore(socket$);
        successHandler = handleSuccessMessages(store);
    });
    it('should create store with initial state', () => {
        expect(store.getState()).toEqual(initialState);
    });
    it('should send "map" command on "new: ok" message', () => {
        const mapCommand = socketCommand.map();
        successHandler(newOkResponse);
        expect(socket$.next).toHaveBeenCalledWith(mapCommand);
    });
    it('should send "map" command on "open: ok" message', () => {
        const mapCommand = socketCommand.map();
        successHandler(openOkResponse);
        expect(socket$.next).toHaveBeenCalledWith(mapCommand);
    });
    it('should send "map" command on "open: You lose" message', () => {
        const mapCommand = socketCommand.map();
        successHandler(openYouLoseResponse);
        expect(socket$.next).toHaveBeenCalledWith(mapCommand);
    });
    it('should send "new 1" command on "setLevel" action', () => {
        store.dispatch(setLevel({ level: 1 }));
        const new1Command = socketCommand.new(1);
        expect(socket$.next).toHaveBeenCalledWith(new1Command);
    });
});
