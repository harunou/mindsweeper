import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { appReducer } from '../reducer/reducer';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { AppStore, AppEpicMiddleware, AppEpic } from './store.typings';
import { AppSocket } from '../../api/websocket.typings';
import {
    openCommandEpic,
    mapCommandEpic,
    newCommandEpic,
} from '../epics';

const createAppStore = (socket$: AppSocket): AppStore => {
    const epicMiddleware: AppEpicMiddleware = createEpicMiddleware({
        dependencies: { socket$ },
    });

    const store = createStore(
        appReducer,
        composeWithDevTools(applyMiddleware(epicMiddleware))
    );

    epicMiddleware.run(createRootEpic());

    return store;
};

const createRootEpic = (): AppEpic =>
    combineEpics(openCommandEpic, mapCommandEpic, newCommandEpic);

export default createAppStore;
