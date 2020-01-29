import { webSocket } from 'rxjs/webSocket';
import { GameLevel, GameCell } from '../redux/reducer.typings';
import {
    mapUpdated,
    connectionLost,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
} from '../redux/actions';
import { AppStore } from '../redux/store.typings';

export const createSocket$ = (wsUrl: string) =>
    webSocket<string>(wsUrl);

export const socketCommand = {
    new: (level: GameLevel) => `new ${level}`,
    map: () => `map`,
    open: (cell: GameCell) => `open ${cell.x} ${cell.y}`,
};

export const socketResponse = {
    isNewOk: (message: string) => /^new: OK/.test(message),
    isOpenOk: (message: string) => /^open: OK/.test(message),
    isOpenYouLose: (message: string) => /^open: You lose/.test(message),
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
        case socketResponse.isMap(message):
            store.dispatch(
                mapUpdated({
                    message,
                })
            );
            break;
    }
};

export const handleErrorMessages = (store: AppStore) => (
    error: Error
) => {
    store.dispatch(connectionLost());
};

export const handleCompleteMessages = (store: AppStore) => () => {
    store.dispatch(connectionLost());
};
