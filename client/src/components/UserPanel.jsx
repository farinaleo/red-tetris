import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserPanel.css';
import OpponentSpectrum from "./OpponentsSpectrum.jsx";
import Rules from "./Rules.jsx";
import MasterButton from "./MasterButton.jsx"

const UserPanel = () => {

    const dispatch = useDispatch();
    const { roomName, username, players = [] } = useSelector((state) => state.game);

    // filter game players, remove the current user and extract opponents username and board.
    const opponents = players
        .filter((player) => player.username !== username)
        .map((player) => [player.username, player.board]);

    //Show the master button.
    const currentPlayer = players.find(player => player.username === username);
    if (currentPlayer) {
        if (currentPlayer.isMaster) {
            return (
                <div className="user-panel-container">
                    <OpponentSpectrum opponents={opponents}/>
                    <MasterButton />
                    <Rules />
                </div>
            )
        }
    }

    return (
        <div className="user-panel-container">
            <OpponentSpectrum opponents={opponents}/>
            <Rules />
        </div>
    );
};

export default UserPanel;