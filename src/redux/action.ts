import { union } from './ts-action.patch';
import { action, payload } from 'ts-action';
import { GameLevel } from './redux.typings';

export const setOffline = action('[App] set offline');
export const setLevel = action(
    '[App] set level',
    payload<{ level: GameLevel }>()
);
export const fetchMap = action('[App] fetch map');
export const fetchMapSuccess = action('[App] fetch map success');

const actions = union({
    setOffline,
    setLevel,
    fetchMap,
    fetchMapSuccess,
});

export type AppActions = typeof actions;
