import createAppStore from './store';
import { initialState } from './reducer';
import { createObserverSpy } from '../testing-tools';
import { WebSocketSubject } from 'rxjs/webSocket';
import { socketCommand } from '../api/websocket.client';
import { AppActions, newGame, fetchMap, openCell } from './action';
import { Store } from 'redux';
import { GameSocket, AppState } from './redux.typings';
import { cell11 } from '../api/websocket.fixtures';

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
    it('should send "new 1" command on "newGame({level: 1})" action', () => {
        store.dispatch(newGame({ level: 1 }));
        const new1Command = socketCommand.new(1);
        expect(socket$.next).toHaveBeenCalledWith(new1Command);
    });
    it('should send "open 1 1" command on "openCell({cell: {x: 1, y: 1}})" action', () => {
        store.dispatch(openCell({ cell: cell11 }));
        const open11Command = socketCommand.open(cell11);
        expect(socket$.next).toHaveBeenCalledWith(open11Command);
    });
});
