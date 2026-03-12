import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Board.css';
import Pieces from '../types/enums/pieces.jsx';
import Colors from '../types/enums/colors.jsx';

/**
 * @namspace Client
 */

const Board = ({boardElements, isSpectrum=false}) => {

    /**
     * Get the correct background css style for the given index.
     * @param index The tile index.
     * @returns {string} the selected class.
     */
    const getBgClassName = (index) => {
        const tileY = Math.floor(index / 10);
        const tileX = index % 10;
        if (tileX % 2 === 0) {
            if (tileY % 2 === 0) {
                return 'tile light-gray';
            } else {
                return 'tile gray';
            }
        } else {
            if (tileY % 2 === 0) {
                return 'tile gray';
            } else {
                return 'tile light-gray';
            }
        }
    };

    /**
     * Get the correct css class for the given element.
     * if the element is an empty tile, the function calls getBgClassName
     * to form a checkerboard.
     * @param element The tile type.
     * @param index The tile index.
     * @returns {string} The selected class.
     */
    const getClassName = (element, index) => {
        if (element === 0) {
            return getBgClassName(index);
        }

        if (!isSpectrum) {
            return `tile ${Colors[element]}`;
        } else {
          // if (element === 0) {
          //     return `tile ${Colors[element]}`;
          // } else {
            return `tile spectrum-gray`;
          // }
        };
    };

    return (
        <div className="board-container">
            {boardElements.map((element, index) => (
                <div key={index} className={getClassName(element, index)}></div>
            ))}
        </div>
    );
};

export default Board;