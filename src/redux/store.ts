import { Store, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { appReducer } from './reducer';
import { AppActions } from './actions';
import {
    combineEpics,
    createEpicMiddleware,
    Epic,
    EpicMiddleware,
} from 'redux-observable';
import {
    fetchMapEpic,
    levelInputClickEpic,
    boardCellClickEpic,
    sendMapCommand,
} from './epics';
import {
    GameSocket,
    EpicMiddlewareDependencies,
    AppState,
} from './redux.typings';

const createAppStore = (
    socket$: GameSocket
): Store<AppState, AppActions> => {
    const epicMiddleware: EpicMiddleware<
        AppActions,
        AppActions,
        AppState,
        EpicMiddlewareDependencies
    > = createEpicMiddleware({ dependencies: { socket$ } });

    const store = createStore(
        appReducer,
        composeWithDevTools(applyMiddleware(epicMiddleware))
    );

    epicMiddleware.run(createRootEpic());

    return store;
};

const createRootEpic = (): Epic<
    AppActions,
    AppActions,
    AppState,
    EpicMiddlewareDependencies
> =>
    combineEpics(
        fetchMapEpic,
        levelInputClickEpic,
        boardCellClickEpic,
        sendMapCommand
    );

export default createAppStore;
