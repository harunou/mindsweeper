import {
    levelInputClick,
    boardCellClick,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
} from './actions';
import { ofType } from './ts-action.patch';
import { tap, ignoreElements } from 'rxjs/operators';
import { socketCommand } from '../api/websocket.client';
import { AppEpic } from './store/store.typings';

export const newCommandEpic: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(levelInputClick),
        tap(({ payload }) => {
            socket$.next(socketCommand.new(payload.level));
        }),
        ignoreElements()
    );

export const openCommandEpic: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(boardCellClick),
        tap(({ payload }) => {
            socket$.next(socketCommand.open(payload.cell));
        }),
        ignoreElements()
    );

export const mapCommandEpic: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(newLevelStarted, cellOpenedOk, cellOpenedYouLose),
        tap(() => {
            socket$.next(socketCommand.map());
        }),
        ignoreElements()
    );
