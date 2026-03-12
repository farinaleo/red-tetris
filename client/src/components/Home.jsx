import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Game.css';
import './Home.css';
import GameBoard from './GameBoard.jsx';
import UserPanel from './UserPanel.jsx';
import TopBar from './TopBar.jsx';

/**
 * @namspace Client
 */

/**
 * Create the home interface to join a room.
 * @returns {JSX.Element} The built element.
 * @constructor
 */
const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);


    /**
     * Check the inputs content and return an error or navigate to the right room.
     */
    const handleJoinRoom = () => {
        if (!username || !roomName) {
            toast.error(`Connexion: Please enter both username and room name.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!isAlphanumeric(username) || !isAlphanumeric(roomName)) {
            toast.error(`Connexion: Username and room name must be alphanumeric (only letters and numbers, no spaces or special characters).`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        navigate(`/${roomName}/${username}`);
    };


    return (
        <div className="window-wrapper">
            <TopBar username={''} roomName={''} />
            <div className="home-wrapper">
                <div className="join-form">
                    <input
                        type="text"
                        placeholder="ENTER YOUR USERNAME"
                        value={username}
                        className='input-text'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="ENTER A ROOM NAME"
                        value={roomName}
                        className='input-text'
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <button className="join-button" onClick={handleJoinRoom}>JOIN ROOM</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
