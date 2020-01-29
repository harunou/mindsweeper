import { Store } from 'redux';
import { AppState } from './reducer.typings';
import { AppActions } from './actions';
import { AppSocket } from '../api/websocket.typings';
import { EpicMiddleware, Epic } from 'redux-observable';

export type AppStore = Store<AppState, AppActions>;

export interface EpicMiddlewareDependencies {
    socket$: AppSocket;
}

export type AppEpicMiddleware = EpicMiddleware<
    AppActions,
    AppActions,
    AppState,
    EpicMiddlewareDependencies
>;

export type AppEpic = Epic<
    AppActions,
    AppActions,
    AppState,
    EpicMiddlewareDependencies
>;
