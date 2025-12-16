import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Spectrum.css';
import Board from './Board.jsx'

const Spectrum = () => {

    return (
        <div className="spectrum-container">
            <div className="spectrum-game">
                <Board />
            </div>
            <div className="spectrum-username">coucou</div>
        </div>
    );
};

export default Spectrum;