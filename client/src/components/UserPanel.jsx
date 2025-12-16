import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserPanel.css';
import OpponentSpectrum from "./OpponentsSpectrum.jsx";
import Rules from "./Rules.jsx";

const UserPanel = () => {

    return (
        <div className="user-panel-container">
            <OpponentSpectrum />
            <Rules />
        </div>
    );
};

export default UserPanel;