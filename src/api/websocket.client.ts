import { webSocket } from 'rxjs/webSocket';
import { GameLevel, GameCell } from '../redux/reducer/reducer.typings';
import {
    mapUpdated,
    connectionLost,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
    unknownMessageReceived,
    cellOpenedYouWin,
} from '../redux/actions';
import { AppStore } from '../redux/store/store.typings';

export const createSocket$ = (url: string) =>
    webSocket<string>({
        url,
        deserializer: (e: MessageEvent) => e.data,
        serializer: (v: string) => v,
    });

export const socketCommand = {
    new: (level: GameLevel) => `new ${level}`,
    map: () => `map`,
    open: (cell: GameCell) => `open ${cell.x} ${cell.y}`,
};

export const socketResponse = {
    isNewOk: (message: string) => /^new: OK/.test(message),
    isOpenOk: (message: string) => /^open: OK/.test(message),
    isOpenYouLose: (message: string) => /^open: You lose/.test(message),
    isOpenYouWin: (message: string) => /^open: You win/.test(message),
    isMap: (message: string) => /^map:/.test(message),
};

export const handleSuccessMessages = (store: AppStore) => (
    message: string
) => {
    switch (true) {
        case socketResponse.isNewOk(message):
            store.dispatch(newLevelStarted());
            break;
        case socketResponse.isOpenOk(message):
            store.dispatch(cellOpenedOk());
            break;
        case socketResponse.isOpenYouLose(message):
            store.dispatch(cellOpenedYouLose());
            break;
        case socketResponse.isOpenYouWin(message):
            console.log('Open ws message: ', message);
            store.dispatch(cellOpenedYouWin());
            break;
        case socketResponse.isMap(message):
            console.log('Map ws message: \n', message);
            store.dispatch(
                mapUpdated({
                    message,
                })
            );
            break;
        default:
            console.log('Unknown ws message: ', message);
            store.dispatch(unknownMessageReceived());
    }
};

export const handleErrorMessages = (store: AppStore) => (
    error: Error
) => {
    console.log('Ws error: ', Error);
    store.dispatch(connectionLost());
};

export const handleCompleteMessages = (store: AppStore) => () => {
    store.dispatch(connectionLost());
};
