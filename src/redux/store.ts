import { Store, Action, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { appReducer, AppState } from './reducer';

const createAppStore = (): Store<AppState, Action<string>> => {
    return createStore(appReducer, devToolsEnhancer({}));
};

export default createAppStore;
