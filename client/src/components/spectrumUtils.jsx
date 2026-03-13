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
    const newBoard = [...board].map(element => element !== 0 ? 1 : 0);

    const col_len = newBoard.length / 10;
    const row_len = 10;

    const correctedColumns = Array.from({ length: row_len }, (_, col) => {
        const colum = Array.from({ length: col_len }, (_, i) => newBoard[col + i * row_len]);

        if (!colum.includes(1)) return colum;

        const index_premier_1 = colum.indexOf(1);
        return colum.map((cell, j) => j >= index_premier_1 ? 1 : cell);
    });

    return newBoard.map((_, idx) => {
        const col = idx % row_len;
        const row = Math.floor(idx / row_len);
        return correctedColumns[col][row];
    });
};

export default spectrum;
