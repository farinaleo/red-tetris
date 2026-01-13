import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './OpponentsSpectrum.css';
import Spectrum from './Spectrum.jsx'

const OpponentsSpectrum = ({opponents}) => {

    return (
        <div className="opponents-spectrum-container">
            {opponents.map(([username, boardElements], index) => (
                <Spectrum key={index} username={username} boardElements={boardElements}/>
            ))}
        </div>
    );
};

export default OpponentsSpectrum;