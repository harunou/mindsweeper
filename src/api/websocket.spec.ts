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
import { fetchMap, fetchMapSuccess, setStatus } from '../redux/action';
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
let fetchMapAction: ActionType<typeof fetchMap>;
let fetchMapSuccessAction: ActionType<typeof fetchMapSuccess>;

describe('Socket success handler', () => {
    beforeEach(() => {
        store = createStoreSpy();
        successHandler = handleSuccessMessages(store);
        fetchMapAction = fetchMap();
        fetchMapSuccessAction = fetchMapSuccess({
            board: mapResponseShortAsGameBoard,
        });
    });
    it('should dispatch "fetchMap" command on "new: ok" message', () => {
        successHandler(newOkResponse);
        expect(store.dispatch).toHaveBeenCalledWith(fetchMapAction);
    });
    it('should send "map" command on "open: ok" message', () => {
        successHandler(openOkResponse);
        expect(store.dispatch).toHaveBeenCalledWith(fetchMapAction);
    });
    it('should dispatch "setStatus({status: GameStatus.Lose})" action on "open: You lose" message', () => {
        const setStatusAction = setStatus({ status: GameStatus.Lose });
        successHandler(openYouLoseResponse);
        expect(store.dispatch).toHaveBeenCalledWith(setStatusAction);
    });
    it('should send "fetchMapSuccess" command on "map: ..." message', () => {
        successHandler(mapResponseShort);
        expect(store.dispatch).toHaveBeenCalledWith(
            fetchMapSuccessAction
        );
    });
});

describe('map response parser', () => {
    it('should parse array response to 2D array of chars', () => {
        expect(parseMapResponseToGameBoard(mapResponseShort)).toEqual(
            mapResponseShortAsGameBoard
        );
    });
});
