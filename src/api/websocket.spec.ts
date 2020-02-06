import {
    socketResponse,
    handleSuccessMessages,
    socketCommand,
} from './websocket.client';
import {
    newOkResponse,
    openOkResponse,
    openYouLoseResponse,
    mapResponseLevel1,
    mapResponseShort,
    open10Command,
    openYouWinResponse,
} from './websocket.fixtures';
import {
    mapUpdated,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
    unknownMessageReceived,
} from '../redux/actions';
import { SpyStore, createStoreSpy } from '../testing-tools';
import { GameCell } from '../redux/reducer/reducer.typings';

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
    it('should detect response: cell open is win', () => {
        expect(
            socketResponse.isOpenYouWin(openYouWinResponse)
        ).toBeTruthy();
    });
    it('should detect response: map', () => {
        expect(socketResponse.isMap(mapResponseLevel1)).toBeTruthy();
    });
});

describe('Websocket commands', () => {
    it('should generate correct "open X Y" command', () => {
        const cell10: GameCell = { x: 1, y: 0 };
        const command = socketCommand.open(cell10);
        expect(command).toEqual(open10Command);
    });
});

let successHandler: (message: string) => void;
let store: SpyStore;

describe('Socket success handler', () => {
    beforeEach(() => {
        store = createStoreSpy();
        successHandler = handleSuccessMessages(store);
    });
    it('should dispatch "newLevelStarted()" action on "new: OK" message', () => {
        successHandler(newOkResponse);
        expect(store.dispatch).toHaveBeenCalledWith(newLevelStarted());
    });
    it('should dispatch "cellOpenedOk()" action on "open: OK" message', () => {
        successHandler(openOkResponse);
        expect(store.dispatch).toHaveBeenCalledWith(cellOpenedOk());
    });
    it('should dispatch "cellOpenedOkYouLose()" action on "open: You lose" message', () => {
        successHandler(openYouLoseResponse);
        expect(store.dispatch).toHaveBeenCalledWith(
            cellOpenedYouLose()
        );
    });
    it('should dispatch "mapUpdated({message})" action on "map: ..." message', () => {
        successHandler(mapResponseShort);
        expect(store.dispatch).toHaveBeenCalledWith(
            mapUpdated({ message: mapResponseShort })
        );
    });
    it('should dispatch "unknownMessageReceived()" action on "unknown" message', () => {
        successHandler('unknown message');
        expect(store.dispatch).toHaveBeenCalledWith(
            unknownMessageReceived()
        );
    });
});
