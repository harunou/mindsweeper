import {
    socketResponse,
    handleSuccessMessages,
    socketCommand,
} from './websocket.client';
import {
    newOkResponse,
    openOkResponse,
    openYouLoseResponse,
    mapResponse,
    mapResponseShort,
    open11Command,
} from './websocket.fixtures';
import {
    mapUpdated,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
    unknownMessageReceived,
} from '../redux/actions';
import { SpyStore, createStoreSpy } from '../testing-tools';
import { GameCell } from '../redux/reducer.typings';

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
