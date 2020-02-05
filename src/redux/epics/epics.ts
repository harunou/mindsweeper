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
import { tap, map, filter } from 'rxjs/operators';
import { socketCommand } from '../../api/websocket.client';
import { AppEpic } from '../store/store.typings';
import { solve } from '../../solver/solver';
import { getSafeCells, getBombCells } from '../../helpers';

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

export const mapCommandEpic: AppEpic = (action$, state$, { socket$ }) =>
    action$.pipe(
        ofType(newLevelStarted, cellOpenedOk),
        map(() => {
            const [, ...safe] = state$.value.safe;
            if (safe.length) {
                return safeCellsFound({ cells: safe });
            }
            socket$.next(socketCommand.map());
            return processingStarted();
        })
    );

export const safeCellOpenCommandEpic: AppEpic = (
    action$,
    _,
    { socket$ }
) =>
    action$.pipe(
        ofType(safeCellsFound),
        map(({ payload }) => {
            const [cell] = payload.cells;
            socket$.next(socketCommand.open(cell));
            return processingStarted();
        })
    );

export const gameOverEpic: AppEpic = (action$, _, { socket$ }) =>
    action$.pipe(
        ofType(cellOpenedYouWin, cellOpenedYouLose),
        tap(() => {
            socket$.next(socketCommand.map());
        }),
        map(() => processingStarted())
    );

export const mapUpdatedEpic: AppEpic = (action$, state$) =>
    action$.pipe(
        ofType(mapUpdated),
        map(() => {
            const solved = solve(state$.value.board);
            const safeCells = getSafeCells(solved);
            const bombCells = getBombCells(solved);
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
