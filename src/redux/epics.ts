import { AppActions, fetchMap, newGame } from './action';
import { Epic } from 'redux-observable';
import { EpicMiddlewareDependencies, AppState } from './redux.typings';
import { ofType } from './ts-action.patch';
import { tap, ignoreElements } from 'rxjs/operators';
import { socketCommand } from '../api/websocket.client';

export const fetchMapEpic: Epic<
    AppActions,
    AppActions,
    AppState,
    EpicMiddlewareDependencies
> = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(fetchMap),
        tap(() => {
            socket$.next(socketCommand.map());
        }),
        ignoreElements()
    );

export const newGameEpic: Epic<
    AppActions,
    AppActions,
    AppState,
    EpicMiddlewareDependencies
> = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(newGame),
        tap(({ payload }) => {
            socket$.next(socketCommand.new(payload.level));
        }),
        ignoreElements()
    );
