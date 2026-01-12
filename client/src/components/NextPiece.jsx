import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './NextPiece.css';
import './tiles.css';
import Pieces from '../types/enums/pieces.jsx';
import Colors from '../types/enums/colors.jsx';

const NextPiece = ({pieceName}) => {
    const piece = Pieces[pieceName];
    useEffect(() => {
    }, []);

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