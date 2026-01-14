import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './TopBar.css';

const TopBar = ({username, roomName}) => {

    if (username.length === 0 || roomName.length === 0) {
        return (
            <div className="top-bar-container">
                <div className="top-bar-logo">
                    <h1>
                        <span className="logo-red">RED</span><span>-TETRIS</span>
                    </h1>
                </div>
            </div>
        );
    } else {
        return (
            <div className="top-bar-container">
                <div className="top-bar-username">Username: {username}</div>
                <div className="top-bar-logo">
                    <h1>
                        <span className="logo-red">RED</span><span>-TETRIS</span>
                    </h1>
                </div>
                <div className="top-bar-room">Room : {roomName}</div>
            </div>
        );
    }
};

export default TopBar;