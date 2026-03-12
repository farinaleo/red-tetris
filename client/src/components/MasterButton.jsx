import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './MasterButton.css';
import { StartGame } from '../store/actions';

/**
 * @namspace Client
 */

const MasterButton = () => {

    const dispatch = useDispatch();
    const { roomName, username } = useSelector((state) => state.game);
    const buttonRef = useRef(null);

    const clickEvent = () => {
      dispatch(StartGame(roomName));
      buttonRef.current.blur();
    };

    return (
        <div className="master-button-container">
            <button className="master-button" ref={buttonRef} onClick={clickEvent}>START THE GAME</button>
        </div>
    );
};

export default MasterButton;