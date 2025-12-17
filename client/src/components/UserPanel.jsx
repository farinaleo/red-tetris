import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserPanel.css';
import OpponentSpectrum from "./OpponentsSpectrum.jsx";
import Rules from "./Rules.jsx";

const UserPanel = () => {

    const elems = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 3, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 2, 2, 0, 0, 0, 0,
        1, 1, 1, 1, 2, 2, 0, 0, 0, 0,
    ]

    const opponents = [
        ["username", elems],
        ["adsad", elems],
        ["wqeqwe", elems],
        ["qwwww", elems],
        ["4234", elems],
    ];

    return (
        <div className="user-panel-container">
            <OpponentSpectrum opponents={opponents}/>
            <Rules />
        </div>
    );
};

export default UserPanel;