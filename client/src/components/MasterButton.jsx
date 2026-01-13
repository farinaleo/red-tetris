import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './MasterButton.css';
import { StartGame } from '../store/actions';

const MasterButton = () => {

    const dispatch = useDispatch();
    const { roomName, username } = useSelector((state) => state.game);

    const clickEvent = () => {
      console.log("CLICK");
      dispatch(StartGame(roomName));
    };

    return (
        <div className="master-button-container">
            <button className="master-button" onClick={clickEvent}>START THE GAME</button>
        </div>
    );
};

export default MasterButton;