import { union } from './ts-action.patch';
import { action, payload } from 'ts-action';
import { GameLevel, GameCell } from './reducer.typings';

export const levelInputClick = action(
    '[Game] Level input click',
    payload<{ level: GameLevel }>()
);
export const boardCellClick = action(
    '[Game] Board cell click',
    payload<{ cell: GameCell }>()
);
export const boardCellRightClick = action(
    '[Game] Board cell right click',
    payload<{ cell: GameCell }>()
);

export const connectionLost = action('[WS] Connection lost');
export const mapUpdated = action(
    '[WS] Map updated',
    payload<{ message: string }>()
);
export const newLevelStarted = action('[WS] New level started');
export const cellOpenedOk = action('[WS] Cell opened ok');
export const cellOpenedYouLose = action('[WS] Cell opened you lose');
export const unknownMessageReceived = action(
    '[WS] Unknown message received'
);

const actions = union({
    levelInputClick,
    boardCellClick,
    boardCellRightClick,
    connectionLost,
    mapUpdated,
    newLevelStarted,
    cellOpenedOk,
    cellOpenedYouLose,
    unknownMessageReceived,
});

export type AppActions = typeof actions;
