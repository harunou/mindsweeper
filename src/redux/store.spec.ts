import createAppStore from './store';
import { initialState } from './reducer';
import { createObserverSpy } from '../testing-tools';
import { WebSocketSubject } from 'rxjs/webSocket';

describe('Store', () => {
    it('Should create store with initial state', () => {
        const socket$ = (createObserverSpy() as unknown) as WebSocketSubject<
            unknown
        >;
        const store = createAppStore(socket$);
        expect(store.getState()).toEqual(initialState);
    });
});
