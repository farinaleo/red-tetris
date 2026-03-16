// client/src/App.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Game from './components/Game.jsx'
import Home from './components/Home.jsx'
import './App.css'

/**
 * @namspace Client
 */

const App = () => {

    const { roomName, username } = useParams();

    if (roomName && username) {
        return (
            <div className="app">
                <Game />
                <ToastContainer />
            </div>
        );
    } else {
        return (
            <div className="app">
                <Home />
                <ToastContainer />
            </div>
        );
    }

}

export default App;
