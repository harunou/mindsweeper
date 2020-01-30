import React from 'react';
import { GameLevel } from './redux/reducer/reducer.typings';
import { useSelector } from 'react-redux';
import Board from './components/Board';
import LevelSelector from './components/LevelSelector';
import { selectGameLevel } from './redux/selectors';

const App: React.FC = (): React.ReactElement => {
    const activeLevel: GameLevel | null = useSelector(selectGameLevel);

    if (activeLevel === null) {
        return <>loading</>;
    }
    return (
        <>
            <div>Minesweeper</div>
            <LevelSelector />
            <Board />
        </>
    );
};

export default App;
