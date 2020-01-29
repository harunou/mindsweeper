import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { appReducer } from './reducer';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import {
    fetchMapEpic,
    levelInputClickEpic,
    boardCellClickEpic,
    sendMapCommand,
} from './epics';
import { AppStore, AppEpicMiddleware, AppEpic } from './store.typings';
import { AppSocket } from '../api/websocket.typings';

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
    combineEpics(
        fetchMapEpic,
        levelInputClickEpic,
        boardCellClickEpic,
        sendMapCommand
    );

export default createAppStore;
