import createAppStore from './store';
import { initialState } from './reducer';
import { createObserverSpy } from '../testing-tools';
import { WebSocketSubject } from 'rxjs/webSocket';
import { socketCommand } from '../api/websocket.client';
import { AppActions, setLevel, fetchMap } from './action';
import { Store } from 'redux';
import { GameSocket, AppState } from './redux.typings';

let socket$: GameSocket;
let store: Store<AppState, AppActions>;

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
    it('should send "new 1" command on "setLevel" action', () => {
        store.dispatch(setLevel({ level: 1 }));
        const new1Command = socketCommand.new(1);
        expect(socket$.next).toHaveBeenCalledWith(new1Command);
    });
});
