import { Observer, Subject } from 'rxjs';
import { AppStore } from './redux/store/store.typings';
import { AppState } from './redux/reducer/reducer.typings';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { StateObservable, ActionsObservable } from 'redux-observable';
import { AppActions } from './redux/actions';

type SpyObject<T> = T &
    {
        [k in keyof T]: T[k] extends (...args: any[]) => any
            ? T[k] & jest.SpyInstance<T[k], jest.ArgsType<T[k]>>
            : T[k];
    };

export type SpyObserver<T> = SpyObject<Observer<T>>;

export const createSpyObserver = <T>(
    observer?: Partial<Observer<T>>
): SpyObserver<T> => {
    const observerSpy: Observer<T> = {
        next(value?: T): void {},
        error(error?: object): void {
            fail(
                `${__filename}: makeObserverSpy() observer catch error: ${error}`
            );
        },
        complete(): void {},
        ...observer,
    };
    jest.spyOn(observerSpy, 'next');
    jest.spyOn(observerSpy, 'error');
    jest.spyOn(observerSpy, 'complete');
    return observerSpy as SpyObserver<T>;
};

export type SpyWebSocketSubject<T> = SpyObject<WebSocketSubject<T>>;

export const createSpyWebSocketSubject = <
    T
>(): SpyWebSocketSubject<T> => {
    const ws = webSocket<T>('dummyWebSocketUrl');
    jest.spyOn(ws, 'next').mockImplementation(() => {});
    jest.spyOn(ws, 'subscribe');
    return ws as SpyWebSocketSubject<T>;
};

export type SpyStore = SpyObject<AppStore>;

export const createStoreSpy = (state?: Partial<AppState>): SpyStore => {
    const initialState: AppState = {
        level: null,
        board: '',
        flags: [],
        safe: [],
        status: null,
        isOnline: true,
        isProcessing: false,
        ...state,
    };
    const storeSpy: Partial<AppStore> = {
        dispatch: <AppActions>(a: AppActions) => a,
        getState: () => initialState,
    };
    jest.spyOn(storeSpy, 'dispatch');
    jest.spyOn(storeSpy, 'getState');
    return storeSpy as SpyStore;
};

export const createStateObservableMock = (
    state?: Partial<AppState>
) => {
    const initialState: AppState = {
        level: null,
        board: '',
        flags: [],
        safe: [],
        status: null,
        isOnline: true,
        isProcessing: false,
        ...state,
    };
    const stateSource$ = new Subject<AppState>();
    const state$ = new StateObservable(stateSource$, initialState);
    return { state$, stateSource$ };
};

export const createActionsObservableMock = () => {
    const actionsSource$ = new Subject<AppActions>();
    const actions$ = new ActionsObservable(actionsSource$);
    return { actions$, actionsSource$ };
};
