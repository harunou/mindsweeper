import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import createAppStore from './redux/store';
import { AppActions } from './redux/actions';
import {
    createSocket$,
    handleSuccessMessages,
    handleErrorMessages,
    handleCompleteMessages,
} from './api/websocket.client';
import { AppState } from './redux/redux.typings';

const WS_API_URL = 'ws://echo.websocket.org';

const socket$ = createSocket$(WS_API_URL);

const store: Store<AppState, AppActions> = createAppStore(socket$);

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
