import { webSocket } from 'rxjs/webSocket';
import { GameLevel, GameBoard, AppState } from '../redux/redux.typings';
import {
    AppActions,
    setOffline,
    fetchMap,
    fetchMapSuccess,
} from '../redux/action';
import { Store } from 'redux';

export const createSocket$ = (wsUrl: string) =>
    webSocket<string>(wsUrl);

export const socketCommand = {
    new: (level: GameLevel) => `new ${level}`,
    map: () => `map`,
    open: (x: number, y: number) => `open ${x} ${y}`,
};

export const socketResponse = {
    isNewOk: (message: string) => /^new: OK/.test(message),
    isOpenOk: (message: string) => /^open: OK/.test(message),
    isOpenYouLose: (message: string) => /^open: You lose/.test(message),
    isMap: (message: string) => /^map:/.test(message),
};

export const handleSuccessMessages = (
    store: Store<AppState, AppActions>
) => (message: string) => {
    switch (true) {
        case socketResponse.isNewOk(message):
        case socketResponse.isOpenOk(message):
        case socketResponse.isOpenYouLose(message):
            store.dispatch(fetchMap());
            break;
        case socketResponse.isMap(message):
            store.dispatch(
                fetchMapSuccess({
                    board: parseMapResponseToGameBoard(message),
                })
            );
            break;
    }
};

export const handleErrorMessages = (
    store: Store<AppState, AppActions>
) => (error: Error) => {
    store.dispatch(setOffline());
};

export const handleCompleteMessages = (
    store: Store<AppState, AppActions>
) => () => {
    store.dispatch(setOffline());
};

export const parseMapResponseToGameBoard = (
    message: string
): GameBoard => {
    return message
        .split(/\r?\n/)
        .slice(1)
        .map(row => {
            return row.split('');
        });
};
