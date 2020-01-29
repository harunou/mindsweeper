import {
    AppActions,
    fetchMap,
    levelInputClick,
    boardCellClick,
    statusUpdate,
    newLevelStarted,
    cellOpenedOk,
} from './actions';
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

export const levelInputClickEpic: Epic<
    AppActions,
    AppActions,
    AppState,
    EpicMiddlewareDependencies
> = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(levelInputClick),
        tap(({ payload }) => {
            socket$.next(socketCommand.new(payload.level));
        }),
        ignoreElements()
    );

export const boardCellClickEpic: Epic<
    AppActions,
    AppActions,
    AppState,
    EpicMiddlewareDependencies
> = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(boardCellClick),
        tap(({ payload }) => {
            socket$.next(socketCommand.open(payload.cell));
        }),
        ignoreElements()
    );

export const sendMapCommand: Epic<
    AppActions,
    AppActions,
    AppState,
    EpicMiddlewareDependencies
> = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(statusUpdate, newLevelStarted, cellOpenedOk),
        tap(() => {
            socket$.next(socketCommand.map());
        }),
        ignoreElements()
    );
