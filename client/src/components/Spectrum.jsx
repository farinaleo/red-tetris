import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Spectrum.css';
import Board from './Board.jsx'

const Spectrum = ({username, boardElements}) => {


    return (
        <div className="spectrum-container">
            <div className="spectrum-game">
                <Board boardElements={boardElements} isSpectrum={true}/>
            </div>
            <div className="spectrum-username">{username}</div>
        </div>
    );
};

export default Spectrum;