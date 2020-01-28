import { Store, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { appReducer, AppState } from './reducer';
import { AppActions } from './action';

const createAppStore = (): Store<AppState, AppActions> => {
    return createStore(appReducer, devToolsEnhancer({}));
};

export default createAppStore;
