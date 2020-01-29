import { union } from './ts-action.patch';
import { action, payload } from 'ts-action';
import { GameLevel, GameBoard, GameCell } from './redux.typings';

export const setOffline = action('[Game] Set offline');
export const newGame = action(
    '[Game] Start new game',
    payload<{ level: GameLevel }>()
);
export const fetchMap = action('[Game] Fetch map');
export const fetchMapSuccess = action(
    '[Game] Fetch map success',
    payload<{ board: GameBoard }>()
);
export const openCell = action(
    '[Game] Open cell',
    payload<{ cell: GameCell }>()
);

const actions = union({
    setOffline,
    newGame,
    fetchMap,
    fetchMapSuccess,
    openCell,
});

export type AppActions = typeof actions;
