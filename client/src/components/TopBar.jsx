import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './TopBar.css';

const TopBar = () => {

    return (
        <div className="top-bar-container">
            <div className="top-bar-username">Username: coucou</div>
            <div className="top-bar-logo">
                <h1>
                    <span className="logo-red">RED</span><span>-tetris</span>
                </h1>
            </div>
            <div className="top-bar-room">Room : test</div>
        </div>
    );
};

export default TopBar;