import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './NextPiece.css';
import './tiles.css';
import Pieces from '../types/enums/pieces.jsx';
import Colors from '../types/enums/colors.jsx';

/**
 * @namspace Client
 */

/**
 * Create the element to display the next piece.
 * @param pieceName The next piece name to show.
 * @returns {JSX.Element} The built element.
 * @constructor
 */
const NextPiece = ({pieceName}) => {
    const piece = Pieces[pieceName];
    useEffect(() => {
    }, []);

    /**
     * Get the tile css class according to the element type.
     * @param element The tile element.
     * @returns {string} The selected class.
     */
    const getClassName = (element) => {
        return `next-piece-tile ${Colors[element]}`;
    };

    return (
        <div className="next-piece-container">
            <div className="piece">
                {piece.map((element, index) => (
                    <div key={index} className={getClassName(element)}></div>
                ))}
            </div>

        </div>
    );
};

export default NextPiece;