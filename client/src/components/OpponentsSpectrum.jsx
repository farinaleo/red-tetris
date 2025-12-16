import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './OpponentsSpectrum.css';
import Spectrum from './Spectrum.jsx'

const OpponentsSpectrum = () => {

    return (
        <div className="opponents-spectrum-container">
            <Spectrum />
            <Spectrum />
            <Spectrum />
            <Spectrum />
            <Spectrum />
        </div>
    );
};

export default OpponentsSpectrum;