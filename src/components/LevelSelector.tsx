import React, {
    useState,
    useCallback,
    Dispatch,
    useEffect,
} from 'react';
import { GameLevel } from '../redux/reducer/reducer.typings';
import { AppActions, levelInputClick } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectGameLevel } from '../redux/selectors';

const levels: GameLevel[] = [1, 2, 3, 4];

const LevelSelector: React.FC = (): JSX.Element => {
    const dispatch: Dispatch<AppActions> = useDispatch();
    const activeLevel: GameLevel | null = useSelector(selectGameLevel);

    const [selectedLevel, updateSelectedLevel] = useState<GameLevel>(1);
    const handleOnChange = useCallback(
        (level: GameLevel) => () => {
            updateSelectedLevel(level);
        },
        [updateSelectedLevel]
    );
    const handleOnClick = useCallback(() => {
        dispatch(levelInputClick({ level: selectedLevel }));
    }, [selectedLevel, dispatch]);

    useEffect(() => {
        const level: GameLevel = activeLevel === null ? 1 : activeLevel;
        updateSelectedLevel(level);
    }, [activeLevel]);

    const radioButtonInputs: JSX.Element[] = levels.map(
        (level: GameLevel) => {
            return (
                <label key={level} className='ms-level-input'>
                    <input
                        type='radio'
                        name='level'
                        value={level}
                        checked={level === selectedLevel}
                        onChange={handleOnChange(level)}
                    />
                    {level}
                </label>
            );
        }
    );
    return (
        <fieldset>
            <legend>Select level</legend>
            {radioButtonInputs}
            <div>
                <button onClick={handleOnClick}>Start</button>
            </div>
        </fieldset>
    );
};

export default LevelSelector;
