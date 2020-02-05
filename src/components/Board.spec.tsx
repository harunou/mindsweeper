import React from 'react';
import { act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Board from './Board';
import { AppState } from '../redux/reducer/reducer.typings';
import { AppStore } from '../redux/store/store.typings';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

describe('Board component', () => {
    let container: HTMLElement;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null!;
    });
    it('should render correct amount and type of cells', () => {
        const board = `1*□□
01□□`;
        const stateMock: AppState = {
            level: 1,
            board,
            flags: ['3,1'],
            safe: [],
            status: null,
            isOnline: true,
            isProcessing: false,
        };
        const storeMock: AppStore = createStore(() => {
            return stateMock;
        });
        const coverCellsAmount = 3;
        const bombCellsAmount = 1;
        const hintCellsAmount = 3;
        const flagCellsAmount = 1;
        const cellsAmount = 8;

        act(() => {
            ReactDOM.render(
                <Provider store={storeMock}>
                    <Board />
                </Provider>,
                container
            );
        });

        const cells = container.querySelectorAll('.ms-board-cell');
        expect(cells.length).toEqual(cellsAmount);

        const coverCells = container.querySelectorAll(
            '.ms-board-cell.mod-cover'
        );
        expect(coverCells.length).toEqual(coverCellsAmount);

        const bombCells = container.querySelectorAll(
            '.ms-board-cell.mod-bomb'
        );
        expect(bombCells.length).toEqual(bombCellsAmount);

        const flagCells = container.querySelectorAll(
            '.ms-board-cell.mod-flag'
        );
        expect(flagCells.length).toEqual(flagCellsAmount);

        const hintCells = container.querySelectorAll(
            '.ms-board-cell.mod-hint'
        );
        expect(hintCells.length).toEqual(hintCellsAmount);
    });
});
