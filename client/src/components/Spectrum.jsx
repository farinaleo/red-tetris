import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Spectrum.css';
import Board from './Board.jsx'

/**
 * @namspace Client
 */

/**
 * Create the element for an opponent to display as a spectrum.
 * @param username The opponent username.
 * @param boardElements The opponent board.
 * @returns {JSX.Element} The built element.
 * @constructor
 */
const Spectrum = ({username, boardElements, score}) => {


    return (
        <div className="spectrum-container">
            <div className="spectrum-game">
                <Board boardElements={boardElements} isSpectrum={true}/>
            </div>
            <div className="spectrum-username">{username}</div>
            <div className="spectrum-score">{score || 0} pts</div>
        </div>
    );
};

export default Spectrum;