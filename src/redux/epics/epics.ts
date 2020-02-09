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
    safeCellsFound,
    bombCellsFound,
} from '../actions';
import { ofType } from '../ts-action.patch';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { socketCommand } from '../../api/websocket.client';
import { AppEpic } from '../store/store.typings';
import { solve } from '../../solver/solver';
import {
    getSafeCells,
    getBombCells,
    isGameOver,
    getCellsNotInFlags,
} from '../../helpers';

export const newCommandEpic: AppEpic = (action$, state$, { socket$ }) =>
    action$.pipe(
        ofType(levelInputClick),
        withLatestFrom(state$),
        filter(([, state]) => {
            return !isGameOver(state) && !state.isProcessing;
        }),
        map(([{ payload }]) => {
            socket$.next(socketCommand.new(payload.level));
            return processingStarted();
        })
    );

export const openCommandEpic: AppEpic = (
    action$,
    state$,
    { socket$ }
) =>
    action$.pipe(
        ofType(boardCellClick),
        withLatestFrom(state$),
        filter(([, state]) => {
            return !isGameOver(state) && !state.isProcessing;
        }),
        map(([{ payload }]) => {
            socket$.next(socketCommand.open(payload.cell));
            return processingStarted();
        })
    );

export const mapCommandEpic: AppEpic = (action$, state$, { socket$ }) =>
    action$.pipe(
        ofType(newLevelStarted, cellOpenedOk, bombCellsFound),
        withLatestFrom(state$),
        filter(([, state]) => {
            return !isGameOver(state);
        }),
        map(([, state]) => {
            if (state.safe.length > 0) {
                return safeCellsFound({ cells: state.safe });
            }
            socket$.next(socketCommand.map());
            return processingStarted();
        })
    );

export const safeCellOpenCommandEpic: AppEpic = (
    action$,
    state$,
    { socket$ }
) =>
    action$.pipe(
        ofType(safeCellsFound),
        withLatestFrom(state$),
        filter(([, state]) => {
            return !isGameOver(state);
        }),
        map(([{ payload }]) => {
            socket$.next(socketCommand.open(payload.first));
            return processingStarted();
        })
    );

export const gameOverEpic: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(cellOpenedYouWin, cellOpenedYouLose),
        map(() => {
            socket$.next(socketCommand.map());
            return processingStarted();
        })
    );

export const mapUpdatedEpic: AppEpic = (action$, state$) =>
    action$.pipe(
        ofType(mapUpdated),
        withLatestFrom(state$),
        map(([, state]) => {
            if (isGameOver(state)) {
                return processingFinished();
            }
            const solved = solve(state.board);
            const safeCells = getSafeCells(solved);
            const bombCells = getCellsNotInFlags(
                getBombCells(solved),
                state$.value.flags
            );
            switch (true) {
                case safeCells.length > 0:
                    return safeCellsFound({ cells: safeCells });
                case bombCells.length > 0:
                    return bombCellsFound({ cells: bombCells });
                default:
                    return processingFinished();
            }
        })
    );
