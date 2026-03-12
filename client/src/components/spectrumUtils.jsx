/**
 * @namspace Client
 */

/**
 * Correct a board to be displayed as required by the subject. Each column has
 * to be full.
 * @param board The original board.
 * @returns {list} The corrected board.
 */
const spectrum = (board) => {
    // copy the current board to edit a nex element.
    const newBoard = [...board].map(element => element !== 0 ? 1 : 0);

    const col_len = newBoard.length / 10;
    const row_len = 10;

    for (let col = 0; col < row_len; col++) {
        let colum = [];
        for (let i = 0; i < col_len; i++) {
            colum.push(newBoard[col + i * row_len]);
        }

        if (colum.includes(1)) {
            const index_premier_1 = colum.indexOf(1);
            for (let j = index_premier_1 + 1; j < colum.length; j++) {
                colum[j] = 1;
            }

            for (let i = 0; i < col_len; i++) {
                newBoard[col + i * row_len] = colum[i];
            }
        }
    }

    return newBoard;
};

export default spectrum;
