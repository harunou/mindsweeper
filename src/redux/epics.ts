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

export const newCommand: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(levelInputClick),
        tap(({ payload }) => {
            socket$.next(socketCommand.new(payload.level));
        }),
        ignoreElements()
    );

export const openCommand: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(boardCellClick),
        tap(({ payload }) => {
            socket$.next(socketCommand.open(payload.cell));
        }),
        ignoreElements()
    );

export const mapCommand: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(newLevelStarted, cellOpenedOk, cellOpenedYouLose),
        tap(() => {
            socket$.next(socketCommand.map());
        }),
        ignoreElements()
    );
