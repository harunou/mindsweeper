import { union } from './ts-action.patch';
import { action, payload } from 'ts-action';
import { GameLevel, GameCell } from './reducer/reducer.typings';

export const levelInputClick = action(
    '[User] Level input click',
    payload<{ level: GameLevel }>()
);
export const boardCellClick = action(
    '[User] Board cell click',
    payload<{ cell: GameCell }>()
);
export const boardCellRightClick = action(
    '[User] Board cell right click',
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
export const cellOpenedYouWin = action('[WS] Cell opened you win');
export const unknownMessageReceived = action(
    '[WS] Unknown message received'
);
export const processingStarted = action('[WS] Processing started');
export const processingFinished = action('[WS] Processing finished');

export const safeCellsFound = action(
    '[Solver] Safe cells found',
    ({
        cells,
    }: {
        cells: GameCell[];
    }): {
        payload: { first: GameCell; rest: GameCell[] };
    } => {
        const [first, ...rest] = cells;
        return {
            payload: {
                first,
                rest,
            },
        };
    }
);
export const bombCellsFound = action(
    '[Solver] Bomb cells found',
    payload<{ cells: GameCell[] }>()
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
    cellOpenedYouWin,
    unknownMessageReceived,
    processingStarted,
    processingFinished,
    safeCellsFound,
    bombCellsFound,
});

export type AppActions = typeof actions;
