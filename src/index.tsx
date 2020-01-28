import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { AppState } from './redux/reducer';
import createAppStore from './redux/store';
import { AppActions } from './redux/action';

const store: Store<AppState, AppActions> = createAppStore();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
