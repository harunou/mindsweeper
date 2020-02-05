import {
    isCoverCell,
    isSafeCell,
    safeCellChar,
    bombCellChar,
    getBoardWidth,
} from '../helpers';

const setCharAt = (
    i: number,
    c: string | number,
    s: string
): string => {
    return `${s.slice(0, i)}${c}${s.slice(i + 1, s.length)}`;
};

const checkHint = (hintIndex: number, rowWidth: number) => (
    acc: { bI: number[]; hI: number[]; map: string },
    offset: number,
    i: number
): { bI: number[]; hI: number[]; map: string } => {
    const nearbyCheck = [-1, -1, -1, 0, 0, 1, 1, 1];
    let { bI, hI, map } = acc;
    if (
        nearbyCheck[i] !==
        Math.floor((hintIndex + offset) / rowWidth) -
            Math.floor(hintIndex / rowWidth)
    ) {
        return { bI, hI, map };
    } else if (
        parseInt(map[hintIndex]) &&
        isCoverCell(map[hintIndex + offset])
    ) {
        bI.push(hintIndex + offset);
    } else if (
        parseInt(map[hintIndex + offset]) &&
        isSafeCell(map[hintIndex])
    ) {
        hI.push(hintIndex + offset);
    } else if (
        parseInt(map[hintIndex + offset]) &&
        isCoverCell(map[hintIndex])
    ) {
        const hint = parseInt(map[hintIndex + offset]) - 1;
        map = setCharAt(hintIndex + offset, hint, map);
        hI.push(hintIndex + offset);
    } else if (
        map[hintIndex] === '0' &&
        isCoverCell(map[hintIndex + offset])
    ) {
        map = setCharAt(hintIndex + offset, safeCellChar, map);
        hI.push(hintIndex + offset);
    }
    return { hI, bI, map };
};

export const solve = (board: string): string => {
    const rowWidth = getBoardWidth(board);
    let map = board.replace(/\n/g, '');
    const hintIndexes = map
        .split('')
        .reduce((h: number[], char: string, index) => {
            if (!isCoverCell(char)) {
                return h.concat(index);
            }
            return h;
        }, []);
    const nearby = [
        -rowWidth - 1,
        -rowWidth,
        -rowWidth + 1,
        -1,
        1,
        rowWidth - 1,
        rowWidth,
        rowWidth + 1,
    ];
    while (hintIndexes.length) {
        const hintIndex = hintIndexes.shift()!; //assert 'undefined' is not possible here
        let bI: number[];
        let hI: number[];
        ({ bI, hI, map } = nearby.reduce(
            checkHint(hintIndex, rowWidth),
            {
                bI: [],
                hI: [],
                map,
            }
        ));
        hintIndexes.splice(hintIndexes.length, 0, ...hI);

        if (isCoverCell(map[hintIndex])) {
            map = setCharAt(hintIndex, bombCellChar, map);
        }
        if (parseInt(map[hintIndex]) === bI.length) {
            bI.forEach(b => hintIndexes.push(b));
        }
    }

    let solvedBoard = [];
    for (let i = 0; i < map.length; i += rowWidth) {
        solvedBoard.push(map.slice(i, i + rowWidth));
    }
    return solvedBoard.join('\n');
};
