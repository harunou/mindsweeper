import { Subject, BehaviorSubject } from 'rxjs';
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
} from './epics';
import { socketCommand } from '../../api/websocket.client';

let state: AppState;
let actionSubject: Subject<AppActions>;
let action$: ActionsObservable<AppActions>;
let stateBehaviorSubject: BehaviorSubject<AppState>;
let state$: StateObservable<AppState>;
let socket$: WebSocketSubject<string>;
let epicObserver: SpyObserver<AppActions>;

describe('Epics', () => {
    beforeEach(() => {
        state = {
            board: '',
            flags: [],
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
        it('should send "new" command if "isProcessing: false"', () => {
            const epic = newCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(levelInputClick({ level: 1 }));
            expect(socket$.next).toBeCalledWith(socketCommand.new(1));
        });
        it('should not send "new" command if "isProcessing: true"', () => {
            state = { ...state, isProcessing: true };
            stateBehaviorSubject.next(state);
            const epic = newCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(levelInputClick({ level: 1 }));
            expect(socket$.next).not.toBeCalled();
        });
        it('should return "processingStarted" action"', () => {
            const epic = newCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(levelInputClick({ level: 1 }));
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
    describe('openCommandEpic', () => {
        it('should send "open" command if "isProcessing: false"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            const epic = openCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(boardCellClick({ cell: cell10 }));
            expect(socket$.next).toBeCalledWith(
                socketCommand.open(cell10)
            );
        });
        it('should not send "open" command if "isProcessing: true"', () => {
            state = { ...state, isProcessing: true };
            stateBehaviorSubject.next(state);
            const cell10: GameCell = { x: 1, y: 0 };
            const epic = openCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(boardCellClick({ cell: cell10 }));
            expect(socket$.next).not.toBeCalled();
        });
        it('should return "processingStarted" action"', () => {
            const cell10: GameCell = { x: 1, y: 0 };
            const epic = openCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(boardCellClick({ cell: cell10 }));
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
    describe('mapCommandEpic', () => {
        it('should handle "newLevelStarted" action', () => {
            const epic = mapCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(newLevelStarted());
            expect(socket$.next).toBeCalled();
        });
        it('should handle "cellOpenedOk" action', () => {
            const epic = mapCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(cellOpenedOk());
            expect(socket$.next).toBeCalled();
        });
        it('should handle "cellOpenedYouLose" action', () => {
            const epic = mapCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(cellOpenedYouLose());
            expect(socket$.next).toBeCalled();
        });
        it('should handle "cellOpenedYouWin" action', () => {
            const epic = mapCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(cellOpenedYouWin());
            expect(socket$.next).toBeCalled();
        });
        it('should send "map" command', () => {
            const epic = mapCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(newLevelStarted());
            expect(socket$.next).toBeCalledWith(socketCommand.map());
        });
        it('should return "processingStarted" action"', () => {
            const epic = mapCommandEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(newLevelStarted());
            expect(epicObserver.next).toBeCalledWith(
                processingStarted()
            );
        });
    });
    describe('mapUpdatedEpic', () => {
        it('should return "processingFinished" action"', () => {
            const epic = mapUpdatedEpic(action$, state$, { socket$ });
            epic.subscribe(epicObserver);
            actionSubject.next(mapUpdated({ message: '' }));
            expect(epicObserver.next).toBeCalledWith(
                processingFinished()
            );
        });
    });
});
