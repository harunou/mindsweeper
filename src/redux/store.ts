import { Store, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { appReducer, AppState } from './reducer';
import { AppActions } from './action';
import {
    combineEpics,
    createEpicMiddleware,
    Epic,
    EpicMiddleware,
} from 'redux-observable';
import { WebSocketSubject } from 'rxjs/webSocket';

interface EpicMiddlewareDependencies {
    socket$: WebSocketSubject<unknown>;
}

const createAppStore = (
    socket$: WebSocketSubject<unknown>
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
> => combineEpics();

export default createAppStore;
