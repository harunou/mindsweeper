import { webSocket } from 'rxjs/webSocket';
import {
    GameLevel,
    GameBoard,
    AppState,
    GameCell,
    GameStatus,
} from '../redux/redux.typings';
import {
    AppActions,
    mapUpdated,
    statusUpdate,
    connectionLost,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
} from '../redux/actions';
import { Store } from 'redux';

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

export const handleSuccessMessages = (
    store: Store<AppState, AppActions>
) => (message: string) => {
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
                    board: parseMapResponseToGameBoard(message),
                })
            );
            break;
    }
};

export const handleErrorMessages = (
    store: Store<AppState, AppActions>
) => (error: Error) => {
    store.dispatch(connectionLost());
};

export const handleCompleteMessages = (
    store: Store<AppState, AppActions>
) => () => {
    store.dispatch(connectionLost());
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
