// client/src/App.jsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Game from './components/Game.jsx'
import './App.css'

const App = () => {
    return (
        <div className="app">
            <Game />
            <ToastContainer />
        </div>
    );
}

export default App;
