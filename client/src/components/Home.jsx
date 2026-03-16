import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game.css';
import './Home.css';
import GameBoard from './GameBoard.jsx';
import UserPanel from './UserPanel.jsx';
import TopBar from './TopBar.jsx';

/**
 * @namspace Client
 */

const NAME_MIN = 3;
const NAME_MAX = 20;
const NAME_REGEX = /^[a-zA-Z0-9]+$/;

const validateName = (value) => {
    if (!value) return 'This field is required.';
    if (value.length < NAME_MIN) return `Minimum ${NAME_MIN} characters.`;
    if (value.length > NAME_MAX) return `Maximum ${NAME_MAX} characters.`;
    if (!NAME_REGEX.test(value)) return 'Only letters and numbers allowed (no spaces or special characters).';
    return '';
};

/**
 * Create the home interface to join a room.
 * @returns {JSX.Element} The built element.
 * @constructor
 */
const Home = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [roomNameError, setRoomNameError] = useState('');

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        setUsernameError(validateName(value));
    };

    const handleRoomNameChange = (e) => {
        const value = e.target.value;
        setRoomName(value);
        setRoomNameError(validateName(value));
    };

    /**
     * Check the inputs content and return an error or navigate to the right room.
     */
    const handleJoinRoom = () => {
        const uErr = validateName(username);
        const rErr = validateName(roomName);
        setUsernameError(uErr);
        setRoomNameError(rErr);
        if (uErr || rErr) return;
        navigate(`/${roomName}/${username}`);
    };


    return (
        <div className="window-wrapper">
            <TopBar username={''} roomName={''} />
            <div className="home-wrapper">
                <div className="join-form">
                    <div className="field-wrapper">
                        <input
                            type="text"
                            placeholder="ENTER YOUR USERNAME"
                            value={username}
                            className={`input-text${usernameError ? ' input-error' : ''}`}
                            maxLength={NAME_MAX}
                            onChange={handleUsernameChange}
                        />
                        {usernameError && <span className="field-error">{usernameError}</span>}
                    </div>
                    <div className="field-wrapper">
                        <input
                            type="text"
                            placeholder="ENTER A ROOM NAME"
                            value={roomName}
                            className={`input-text${roomNameError ? ' input-error' : ''}`}
                            maxLength={NAME_MAX}
                            onChange={handleRoomNameChange}
                        />
                        {roomNameError && <span className="field-error">{roomNameError}</span>}
                    </div>
                    <button className="join-button" onClick={handleJoinRoom}>JOIN ROOM</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
