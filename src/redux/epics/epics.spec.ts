import { Subject, BehaviorSubject, Observable } from 'rxjs';
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
import { AppState, GameCell } from '../reducer/reducer.typings';
import { createObserverSpy, SpyObserver } from '../../testing-tools';
import { WebSocketSubject } from 'rxjs/webSocket';
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
let actionSubject: Subject<AppActions>;
let action$: ActionsObservable<AppActions>;
let stateBehaviorSubject: BehaviorSubject<AppState>;
let state$: StateObservable<AppState>;
let socket$: WebSocketSubject<string>;
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
        actionSubject = new Subject();
        action$ = actionSubject.asObservable() as ActionsObservable<
            AppActions
        >;
        stateBehaviorSubject = new BehaviorSubject(state);
        state$ = (stateBehaviorSubject as unknown) as StateObservable<
            AppState
        >;
        socket$ = (createObserverSpy() as unknown) as WebSocketSubject<
            string
        >;
        epicObserver = createObserverSpy();
    });
    describe('newCommandEpic', () => {
        beforeEach(() => {
            epic = newCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should send "new" command if "isProcessing: false"', () => {
            actionSubject.next(levelInputClick({ level: 1 }));
            expect(socket$.next).toBeCalledWith(socketCommand.new(1));
        });
        it('should not send "new" command if "isProcessing: true"', () => {
            state = { ...state, isProcessing: true };
            stateBehaviorSubject.next(state);
            actionSubject.next(levelInputClick({ level: 1 }));
            expect(socket$.next).not.toBeCalled();
        });
        it('should return "processingStarted" action"', () => {
            actionSubject.next(levelInputClick({ level: 1 }));
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
    describe('openCommandEpic', () => {
        beforeEach(() => {
            epic = openCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should send "open" command if "isProcessing: false"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionSubject.next(boardCellClick({ cell: cell10 }));
            expect(socket$.next).toBeCalledWith(
                socketCommand.open(cell10)
            );
        });
        it('should not send "open" command if "isProcessing: true"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            state = { ...state, isProcessing: true };
            stateBehaviorSubject.next(state);
            actionSubject.next(boardCellClick({ cell: cell10 }));
            expect(socket$.next).not.toBeCalled();
        });
        it('should return "processingStarted" action"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionSubject.next(boardCellClick({ cell: cell10 }));
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
    describe('mapCommandEpic', () => {
        beforeEach(() => {
            epic = mapCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should handle "newLevelStarted" action', () => {
            actionSubject.next(newLevelStarted());
            expect(epicObserver.next).toBeCalled();
        });
        it('should handle "cellOpenedOk" action', () => {
            actionSubject.next(cellOpenedOk());
            expect(epicObserver.next).toBeCalled();
        });
        it('should send "map" command', () => {
            actionSubject.next(newLevelStarted());
            expect(socket$.next).toBeCalledWith(socketCommand.map());
        });
        it('should return "processingStarted" action"', () => {
            actionSubject.next(newLevelStarted());
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
        it('should not send "map" command if tail "state.safe" is not empty', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            const cell12: GameCell = { x: 1, y: 2 };
            state = { ...state, safe: [cell10, cell12] };
            stateBehaviorSubject.next(state);
            actionSubject.next(newLevelStarted());
            expect(socket$.next).not.toBeCalled();
        });
        it('should return "safeCellsFound" if tail "state.safe" is not empty', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            const cell12: GameCell = { x: 1, y: 2 };
            state = { ...state, safe: [cell10, cell12] };
            stateBehaviorSubject.next(state);
            actionSubject.next(cellOpenedOk());
            expect(epicObserver.next).toBeCalledWith(
                safeCellsFound({ cells: [cell12] })
            );
        });
    });
    describe('mapUpdatedEpic', () => {
        beforeEach(() => {
            epic = mapUpdatedEpic(action$, state$, { socket$ });
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
            stateBehaviorSubject.next({ ...state, board });
            actionSubject.next(mapUpdated({ message: '' }));
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
            stateBehaviorSubject.next({ ...state, board });
            actionSubject.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                bombCellsFound({ cells: bombCells })
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
            stateBehaviorSubject.next({ ...state, board });
            actionSubject.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                processingFinished()
            );
        });
    });
    describe('gameOverEpic', () => {
        beforeEach(() => {
            epic = gameOverEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
        });
        it('should handle "cellOpenedYouLose" action', () => {
            actionSubject.next(cellOpenedYouLose());
            expect(epicObserver.next).toBeCalled();
        });
        it('should handle "cellOpenedYouWin" action', () => {
            actionSubject.next(cellOpenedYouWin());
            expect(epicObserver.next).toBeCalled();
        });
        it('should send "map" command', () => {
            actionSubject.next(cellOpenedYouWin());
            expect(socket$.next).toBeCalledWith(socketCommand.map());
        });
        it('should return "processingStarted" action"', () => {
            actionSubject.next(cellOpenedYouWin());
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
    describe('safeCellOpenCommandEpic', () => {
        beforeEach(() => {
            epic = safeCellOpenCommandEpic(action$, state$, {
                socket$,
            });
            epic.subscribe(epicObserver);
        });
        it('should send "open" command', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionSubject.next(safeCellsFound({ cells: [cell10] }));
            expect(socket$.next).toBeCalledWith(
                socketCommand.open(cell10)
            );
        });
        it('should return "processingStarted" action"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            actionSubject.next(safeCellsFound({ cells: [cell10] }));
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
});
