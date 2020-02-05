import {
    levelInputClick,
    boardCellClick,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
    processingStarted,
    processingFinished,
    cellOpenedYouWin,
    mapUpdated,
} from '../actions';
import { ofType } from '../ts-action.patch';
import { tap, map, filter } from 'rxjs/operators';
import { socketCommand } from '../../api/websocket.client';
import { AppEpic } from '../store/store.typings';

export const newCommandEpic: AppEpic = (action$, state$, { socket$ }) =>
    action$.pipe(
        filter(() => !state$.value.isProcessing),
        ofType(levelInputClick),
        tap(({ payload }) => {
            socket$.next(socketCommand.new(payload.level));
        }),
        map(() => processingStarted())
    );

export const openCommandEpic: AppEpic = (
    action$,
    state$,
    { socket$ }
) =>
    action$.pipe(
        filter(() => !state$.value.isProcessing),
        ofType(boardCellClick),
        tap(({ payload }) => {
            socket$.next(socketCommand.open(payload.cell));
        }),
        map(() => processingStarted())
    );

export const mapCommandEpic: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(newLevelStarted, cellOpenedOk),
        tap(() => {
            socket$.next(socketCommand.map());
        }),
        map(() => processingStarted())
    );

export const gameOverEpic: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(cellOpenedYouWin, cellOpenedYouLose),
        tap(() => {
            socket$.next(socketCommand.map());
        }),
        map(() => processingStarted())
    );

export const mapUpdatedEpic: AppEpic = action$ =>
    action$.pipe(
        ofType(mapUpdated),
        map(() => processingFinished())
    );
