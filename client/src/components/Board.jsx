import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Board.css';
import Pieces from '../types/enums/pieces.jsx';
import Colors from '../types/enums/colors.jsx';

const Board = ({boardElements, isSpectrum=false}) => {

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


    const getClassName = (element, index) => {
        console.log(Colors[element]);
        if (element === 0) {
            return getBgClassName(index);
        }

        if (!isSpectrum) {
            return `tile ${Colors[element]}`;
        } else {
          if (element === 0) {
              return `tile ${Colors[element]}`;
          } else {
              return `tile spectrum-gray`;
          }
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