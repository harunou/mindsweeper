import { webSocket } from 'rxjs/webSocket';
import { GameLevel } from '../redux/redux.typings';

export const createSocket$ = (wsUrl: string) => webSocket(wsUrl);

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
