import React from 'react';
import { GameLevel, GameStatus } from './redux/reducer/reducer.typings';
import { useSelector } from 'react-redux';
import Board from './components/Board';
import LevelSelector from './components/LevelSelector';
import {
    selectGameLevel,
    selectIsOnline,
    selectGameStatus,
    selectIsLoading,
} from './redux/selectors';

const App: React.FC = (): React.ReactElement => {
    const gameLevel: GameLevel | null = useSelector(selectGameLevel);
    const isOnline: boolean = useSelector(selectIsOnline);
    const gameStatus: GameStatus | null = useSelector(selectGameStatus);
    const isLoading: boolean = useSelector(selectIsLoading);

    return (
        <>
            <div>Minesweeper</div>
            <LevelSelector />
            <div>
                Is online: {isOnline ? 'true' : 'false. reload the app'}
            </div>
            <div>Is loading: {`${isLoading}`}</div>
            <div>Active level: {gameLevel || 'not set'}</div>
            <div>Win/lose: {gameStatus}</div>
            <Board />
        </>
    );
};

export default App;
