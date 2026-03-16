import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './OpponentsSpectrum.css';
import Spectrum from './Spectrum.jsx'

/**
 * @namspace Client
 */

/**
 * Create the element to display opponents boards as spectrum.
 * @param opponents The list of opponents with their username and board.
 * @returns {JSX.Element} The built element.
 * @constructor
 */
const OpponentsSpectrum = ({opponents}) => {

    return (
        <div className="opponents-spectrum-container">
            {opponents.map(([username, boardElements, score], index) => (
                <Spectrum key={index} username={username} boardElements={boardElements} score={score}/>
            ))}
        </div>
    );
};

export default OpponentsSpectrum;