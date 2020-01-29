import {
    socketResponse,
    parseMapResponseToGameBoard,
    handleSuccessMessages,
    socketCommand,
} from './websocket.client';
import {
    newOkResponse,
    openOkResponse,
    openYouLoseResponse,
    mapResponse,
    mapResponseShort,
    mapResponseShortAsGameBoard,
    open11Command,
} from './websocket.fixtures';
import {
    fetchMap,
    mapUpdated,
    statusUpdate,
    newLevelStarted,
    cellOpenedOk,
} from '../redux/actions';
import { SpyStore, createStoreSpy } from '../testing-tools';
import { ActionType } from 'ts-action';
import { GameCell, GameStatus } from '../redux/redux.typings';

describe('Websocket responses', () => {
    it('should detect response: new game is set', () => {
        expect(socketResponse.isNewOk(newOkResponse)).toBeTruthy();
    });
    it('should detect response: cell open is ok', () => {
        expect(socketResponse.isOpenOk(openOkResponse)).toBeTruthy();
    });
    it('should detect response: cell open is lose', () => {
        expect(
            socketResponse.isOpenYouLose(openYouLoseResponse)
        ).toBeTruthy();
    });
    it('should detect response: map', () => {
        expect(socketResponse.isMap(mapResponse)).toBeTruthy();
    });
});

describe('Websocket commands', () => {
    it('should generate correct "open X Y" command', () => {
        const cell11: GameCell = { x: 1, y: 1 };
        const command = socketCommand.open(cell11);
        expect(command).toEqual(open11Command);
    });
});

let successHandler: (message: string) => void;
let store: SpyStore;

describe('Socket success handler', () => {
    beforeEach(() => {
        store = createStoreSpy();
        successHandler = handleSuccessMessages(store);
    });
    it('should dispatch "statusUpdate({status: GameStatus.Lose})" action on "open: You lose" message', () => {
        const setStatusAction = statusUpdate({
            status: GameStatus.Lose,
        });
        successHandler(openYouLoseResponse);
        expect(store.dispatch).toHaveBeenCalledWith(setStatusAction);
    });
    it('should dispatch "mapUpdated({message})" action on "map: ..." message', () => {
        const mapUpdatedAction = mapUpdated({
            board: mapResponseShortAsGameBoard,
        });
        successHandler(mapResponseShort);
        expect(store.dispatch).toHaveBeenCalledWith(mapUpdatedAction);
    });
    it('should dispatch "newLevelStarted()" action on "new: OK" message', () => {
        const newLevelStartedAction = newLevelStarted();
        successHandler(newOkResponse);
        expect(store.dispatch).toHaveBeenCalledWith(
            newLevelStartedAction
        );
    });
    it('should dispatch "cellOpenedOk()" action on "open: OK" message', () => {
        successHandler(openOkResponse);
        expect(store.dispatch).toHaveBeenCalledWith(cellOpenedOk());
    });
});

describe('map response parser', () => {
    it('should parse array response to 2D array of chars', () => {
        expect(parseMapResponseToGameBoard(mapResponseShort)).toEqual(
            mapResponseShortAsGameBoard
        );
    });
});
