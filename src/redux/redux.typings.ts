import { WebSocketSubject } from 'rxjs/webSocket';

export type GameLevel = 1 | 2 | 3 | 4;

export interface EpicMiddlewareDependencies {
    socket$: WebSocketSubject<unknown>;
}
