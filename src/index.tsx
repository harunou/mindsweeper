import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import createAppStore from './redux/store/store';
import {
    createSocket$,
    handleSuccessMessages,
    handleErrorMessages,
    handleCompleteMessages,
} from './api/websocket.client';
import { AppStore } from './redux/store/store.typings';

// const WS_API_URL = 'ws://echo.websocket.org';
const WS_API_URL = 'wss://hometask.eg1236.com/game1/';

const socket$ = createSocket$(WS_API_URL);

const store: AppStore = createAppStore(socket$);

socket$.subscribe(
    handleSuccessMessages(store),
    handleErrorMessages(store),
    handleCompleteMessages(store)
);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
