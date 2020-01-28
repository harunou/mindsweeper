import createAppStore from './store';
import { initialState } from './reducer';

describe('Store', () => {
    it('Should create store with initial state', () => {
        const store = createAppStore();
        expect(store.getState()).toEqual(initialState);
    });
});
