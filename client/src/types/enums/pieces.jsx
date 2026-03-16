/**
 * @namspace Client
 */

/**
 * Associate the piece name with its matrix representation.
 */
const Pieces = {
    O : [ 0, 1, 1, 0, 0, 1, 1, 0, ],
    I : [ 0, 0, 0, 0, 2, 2, 2, 2, ],
    T : [ 3, 3, 3, 0, 0, 3, 0, 0, ],
    L : [ 0, 0, 4, 0, 4, 4, 4, 0, ],
    S : [ 0, 5, 5, 0, 5, 5, 0, 0, ],
    J : [ 6, 6, 6, 0, 0, 0, 6, 0, ],
    Z : [ 7, 7, 0, 0, 0, 7, 7, 0, ],
};

export default Pieces;