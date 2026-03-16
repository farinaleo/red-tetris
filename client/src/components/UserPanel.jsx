import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserPanel.css';
import OpponentSpectrum from "./OpponentsSpectrum.jsx";
import Rules from "./Rules.jsx";
import MasterButton from "./MasterButton.jsx"
import spectrum from "./spectrumUtils.jsx"

/**
 * @namspace Client
 */

/**
 * Create the user panel with the opponents spectrum, the rules and, if needed,
 * the master button.
 * @returns {JSX.Element} The built element.
 * @constructor
 */
const UserPanel = () => {

    const dispatch = useDispatch();
    const { roomName, username, players = [] } = useSelector((state) => state.game);

    const opponents = players
        .filter((player) => player.username !== username)
        .map((player) => [player.username, spectrum(player.board), player.score || 0]);

    //Show the master button.
    const currentPlayer = players.find(player => player.username === username);
    const currentScore = currentPlayer ? (currentPlayer.score || 0) : 0;

    if (currentPlayer && currentPlayer.isMaster) {
        return (
            <div className="user-panel-container">
                <div className="score-display">Score : {currentScore}</div>
                <OpponentSpectrum opponents={opponents}/>
                <MasterButton />
                <Rules />
            </div>
        );
    }

    return (
        <div className="user-panel-container">
            <div className="score-display">Score : {currentScore}</div>
            <OpponentSpectrum opponents={opponents}/>
            <Rules />
        </div>
    );
};

export default UserPanel;