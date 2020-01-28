import { webSocket } from 'rxjs/webSocket';

export const createSocket$ = (wsUrl: string) => webSocket(wsUrl);
