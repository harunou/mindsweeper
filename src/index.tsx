import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { AppState } from './redux/reducer';
import createAppStore from './redux/store';
import { AppActions, setOffline } from './redux/action';
import { finalize } from 'rxjs/operators';
import { createSocket$ } from './api/websocket.client';

const WS_API_URL = 'ws://echo.websocket.org';

const socket$ = createSocket$(WS_API_URL);

const store: Store<AppState, AppActions> = createAppStore(socket$);

socket$
    .pipe(
        finalize(() => {
            store.dispatch(setOffline());
        })
    )
    .subscribe(message => {});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
