import { union } from './ts-action.patch';
import { action } from 'ts-action';

export const setOffline = action('[App] set offline');

const actions = union({ setOffline });

export type AppActions = typeof actions;
