import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserPanel.css';
import OpponentSpectrum from "./OpponentsSpectrum.jsx";
import Rules from "./Rules.jsx";
import MasterButton from "./MasterButton.jsx"
import spectrum from "./spectrumUtils.jsx"


const UserPanel = () => {

    const dispatch = useDispatch();
    let { roomName, username, players = [] } = useSelector((state) => state.game);

    let opponents = players
        .filter((player) => player.username !== username)
        .map((player) => [player.username, spectrum(player.board)]);

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