import React, { useCallback, Dispatch } from 'react';
import { GameLevel, AppState } from './redux/reducer.typings';
import { useSelector, useDispatch } from 'react-redux';
import { levelInputClick, AppActions } from './redux/actions';
import Board from './components/Board';

const App: React.FC = (): React.ReactElement => {
    const activeLevel: GameLevel | null = useSelector(selectGameLevel);

    const dispatch: Dispatch<AppActions> = useDispatch();
    const dispatchLevelInputClick = useCallback(
        (level: GameLevel) => () =>
            dispatch(levelInputClick({ level })),
        [dispatch]
    );
    if (activeLevel === null) {
        return <>loading</>;
    }
    return (
        <>
            <div>Minesweeper</div>
            {levels.map((level: GameLevel) => {
                return (
                    <span key={level} className='ms-level-input'>
                        <input
                            type='radio'
                            name='level'
                            value={level}
                            checked={activeLevel === level}
                            onChange={dispatchLevelInputClick(level)}
                        />
                        {level}
                    </span>
                );
            })}
            <Board />
        </>
    );
};

const levels: GameLevel[] = [1, 2, 3, 4];

const selectGameLevel = (state: AppState) => state.level;

export default App;
