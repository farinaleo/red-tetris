import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './MasterButton.css';
import { StartGame } from '../store/actions';

/**
 * @namspace Client
 */

/**
 * Create the master button for the master to launch a game.
 * @returns {JSX.Element} The built element.
 * @constructor
 */
const MasterButton = () => {

    const dispatch = useDispatch();
    const { roomName, username } = useSelector((state) => state.game);
    const buttonRef = useRef(null);

    /**
     * Sent the launch request to the corresponding socket.
     */
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