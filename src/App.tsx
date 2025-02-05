import React from 'react';
import { GameLevel, GameStatus } from './redux/reducer/reducer.typings';
import { useSelector } from 'react-redux';
import Board from './components/Board';
import LevelSelector from './components/LevelSelector';
import {
    selectGameLevel,
    selectIsOnline,
    selectGameStatus,
    selectIsProcessing,
} from './redux/selectors';

const App: React.FC = (): React.ReactElement => {
    const gameLevel: GameLevel | null = useSelector(selectGameLevel);
    const isOnline: boolean = useSelector(selectIsOnline);
    const gameStatus: GameStatus | null = useSelector(selectGameStatus);
    const isProcessing: boolean = useSelector(selectIsProcessing);

    return (
        <>
            <div className='ms-vertical-block'>Minesweeper</div>
            <div className='ms-settings ms-vertical-block'>
                <div>
                    <LevelSelector />
                </div>
                <div>
                    Is online:{' '}
                    {isOnline ? 'true' : 'false. reload the app'}
                    <br />
                    Is processing: {`${isProcessing}`}
                    <br />
                    Active level: {gameLevel || 'not set'}
                    <br />
                    Win/lose: {gameStatus}
                </div>
            </div>
            <Board />
        </>
    );
};

export default App;
