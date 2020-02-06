import { Subject, Observable } from 'rxjs';
import {
    AppActions,
    newLevelStarted,
    levelInputClick,
    processingStarted,
    boardCellClick,
    cellOpenedOk,
    cellOpenedYouLose,
    cellOpenedYouWin,
    processingFinished,
    mapUpdated,
    safeCellsFound,
    bombCellsFound,
} from '../actions';
import { ActionsObservable, StateObservable } from 'redux-observable';
import {
    AppState,
    GameCell,
    GameStatus,
} from '../reducer/reducer.typings';
import {
    SpyObserver,
    SpyWebSocketSubject,
    createSpyWebSocketSubject,
    createSpyObserver,
    createStateObservableMock,
    createActionsObservableMock,
} from '../../testing-tools';
import {
    newCommandEpic,
    openCommandEpic,
    mapCommandEpic,
    mapUpdatedEpic,
    gameOverEpic,
    safeCellOpenCommandEpic,
} from './epics';
import { socketCommand } from '../../api/websocket.client';

let state: AppState;
let actions$: ActionsObservable<AppActions>;
let actionsSource$: Subject<AppActions>;
let state$: StateObservable<AppState>;
let stateSource$: Subject<AppState>;
let socket$: SpyWebSocketSubject<string>;
let epicObserver: SpyObserver<AppActions>;
let epic: Observable<AppActions>;

describe('Epics', () => {
    beforeEach(() => {
        state = {
            board: '',
            flags: [],
            safe: [],
            level: 1,
            status: null,
            isProcessing: false,
            isOnline: true,
        };
        ({ actions$, actionsSource$ } = createActionsObservableMock());
        ({ state$, stateSource$ } = createStateObservableMock());
        socket$ = createSpyWebSocketSubject<string>();
        epicObserver = createSpyObserver();
    });
    describe('newCommandEpic', () => {
        beforeEach(() => {
            epic = newCommandEpic(actions$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should send "new" command if "isProcessing: false"', () => {
            actionsSource$.next(levelInputClick({ level: 1 }));
            expect(socket$.next).toBeCalledWith(socketCommand.new(1));
        });
        it('should not send "new" command if "isProcessing: true"', () => {
            state = { ...state, isProcessing: true };
            stateSource$.next(state);
            actionsSource$.next(levelInputClick({ level: 1 }));
            expect(socket$.next).not.toBeCalled();
        });
        it('should return "processingStarted" action"', () => {
            actionsSource$.next(levelInputClick({ level: 1 }));
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
    describe('openCommandEpic', () => {
        beforeEach(() => {
            epic = openCommandEpic(actions$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should send "open" command if "isProcessing: false"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionsSource$.next(boardCellClick({ cell: cell10 }));
            expect(socket$.next).toBeCalledWith(
                socketCommand.open(cell10)
            );
        });
        it('should not send "open" command if "isProcessing: true"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            state = { ...state, isProcessing: true };
            stateSource$.next(state);
            actionsSource$.next(boardCellClick({ cell: cell10 }));
            expect(socket$.next).not.toBeCalled();
        });
        it('should return "processingStarted" action"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionsSource$.next(boardCellClick({ cell: cell10 }));
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
        it('should not be called if Win or Lose status', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            stateSource$.next({
                ...state,
                status: GameStatus.Win,
            });
            actionsSource$.next(boardCellClick({ cell: cell10 }));
            expect(epicObserver.next).not.toBeCalled();
            stateSource$.next({
                ...state,
                status: GameStatus.Lose,
            });
            actionsSource$.next(boardCellClick({ cell: cell10 }));
            expect(epicObserver.next).not.toBeCalled();
        });
    });
    describe('mapCommandEpic', () => {
        beforeEach(() => {
            epic = mapCommandEpic(actions$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should handle "newLevelStarted" action', () => {
            actionsSource$.next(newLevelStarted());
            expect(epicObserver.next).toBeCalled();
        });
        it('should handle "cellOpenedOk" action', () => {
            actionsSource$.next(cellOpenedOk());
            expect(epicObserver.next).toBeCalled();
        });
        it('should handle "bombCellsFound" action', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionsSource$.next(bombCellsFound({ cells: [cell10] }));
            expect(epicObserver.next).toBeCalled();
        });
        it('should send "map" command', () => {
            actionsSource$.next(newLevelStarted());
            expect(socket$.next).toBeCalledWith(socketCommand.map());
        });
        it('should return "processingStarted" action"', () => {
            actionsSource$.next(newLevelStarted());
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
        it('should not send "map" command if tail "state.safe" is not empty', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            const cell12: GameCell = { x: 1, y: 2 };
            state = { ...state, safe: [cell10, cell12] };
            stateSource$.next(state);
            actionsSource$.next(newLevelStarted());
            expect(socket$.next).not.toBeCalled();
        });
        it('should return "safeCellsFound" if tail "state.safe" is not empty', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            const cell12: GameCell = { x: 1, y: 2 };
            state = { ...state, safe: [cell10, cell12] };
            stateSource$.next(state);
            actionsSource$.next(cellOpenedOk());
            expect(epicObserver.next).toBeCalledWith(
                safeCellsFound({ cells: [cell12] })
            );
        });
        it('should not be called if Win or Lose status', () => {
            stateSource$.next({
                ...state,
                status: GameStatus.Win,
            });
            actionsSource$.next(newLevelStarted());
            expect(epicObserver.next).not.toBeCalled();
            stateSource$.next({
                ...state,
                status: GameStatus.Lose,
            });
            actionsSource$.next(newLevelStarted());
            expect(epicObserver.next).not.toBeCalled();
        });
    });
    describe('mapUpdatedEpic', () => {
        beforeEach(() => {
            epic = mapUpdatedEpic(actions$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should return "safeCellsFound" action if solver find safe cells', () => {
            const board = `0001□□□□□□
0012□□□□□□
001□□□□□□□
012□□□□□□□
01□□□□□□□□
011□□□□□□□
001□□□□□□□
001□□□□□□□
001112□□□□
000001□□□□`;
            const safeCells = [
                { x: 3, y: 3 },
                { x: 3, y: 4 },
                { x: 3, y: 5 },
                { x: 3, y: 6 },
                { x: 4, y: 7 },
                { x: 5, y: 7 },
            ];
            stateSource$.next({ ...state, board });
            actionsSource$.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                safeCellsFound({ cells: safeCells })
            );
        });
        it('should return "bombCellsFound" action if solver found only bomb cells', () => {
            const board = `3□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□`;
            const bombCells = [
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ];
            stateSource$.next({ ...state, board });
            actionsSource$.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                bombCellsFound({ cells: bombCells })
            );
        });
        it('should return "processingFinished" action if solver did not find new bomb cells', () => {
            const board = `3□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□`;
            // const bombCells = [
            //     { x: 1, y: 0 },
            //     { x: 0, y: 1 },
            //     { x: 1, y: 1 },
            // ];
            stateSource$.next({
                ...state,
                board,
                flags: ['1,0', '0,1', '1,1'],
            });
            actionsSource$.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                processingFinished()
            );
        });
        it('should return "processingFinished" action if solver found nothing', () => {
            const board = `□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□`;
            stateSource$.next({ ...state, board });
            actionsSource$.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                processingFinished()
            );
        });
        it('should return "processingFinished" if Win or Lose status', () => {
            const board = `□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□
□□□□□□□□□□`;
            stateSource$.next({
                ...state,
                board,
                status: GameStatus.Win,
            });
            actionsSource$.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                processingFinished()
            );
            stateSource$.next({
                ...state,
                board,
                status: GameStatus.Lose,
            });
            actionsSource$.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                processingFinished()
            );
        });
    });
    describe('gameOverEpic', () => {
        beforeEach(() => {
            epic = gameOverEpic(actions$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should handle "cellOpenedYouLose" action', () => {
            actionsSource$.next(cellOpenedYouLose());
            expect(epicObserver.next).toBeCalled();
        });
        it('should handle "cellOpenedYouWin" action', () => {
            actionsSource$.next(cellOpenedYouWin());
            expect(epicObserver.next).toBeCalled();
        });
        it('should send "map" command', () => {
            actionsSource$.next(cellOpenedYouWin());
            expect(socket$.next).toBeCalledWith(socketCommand.map());
        });
        it('should return "processingStarted" action"', () => {
            actionsSource$.next(cellOpenedYouWin());
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
    describe('safeCellOpenCommandEpic', () => {
        beforeEach(() => {
            epic = safeCellOpenCommandEpic(actions$, state$, {
                socket$,
            });
            epic.subscribe(epicObserver);
        });
        it('should send "open" command', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionsSource$.next(safeCellsFound({ cells: [cell10] }));
            expect(socket$.next).toBeCalledWith(
                socketCommand.open(cell10)
            );
        });
        it('should return "processingStarted" action"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionsSource$.next(safeCellsFound({ cells: [cell10] }));
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
        it('should not be called if Win or Lose status', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            stateSource$.next({
                ...state,
                status: GameStatus.Win,
            });
            actionsSource$.next(safeCellsFound({ cells: [cell10] }));
            expect(epicObserver.next).not.toBeCalled();
            stateSource$.next({
                ...state,
                status: GameStatus.Lose,
            });
            actionsSource$.next(safeCellsFound({ cells: [cell10] }));
            expect(epicObserver.next).not.toBeCalled();
        });
    });
});
