import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Game.css';
import './Home.css';
import GameBoard from './GameBoard.jsx';
import UserPanel from './UserPanel.jsx';
import TopBar from './TopBar.jsx';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');

    const handleJoinRoom = () => {
        if (username && roomName) {
            navigate(`/${roomName}/${username}`);
        } else {
            alert('Please enter both username and room name.');
        }
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
