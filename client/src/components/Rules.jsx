import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Rules.css';

/**
 * @namspace Client
 */

const Rules = () => {

    return (
        <div className="rules-container">
            <h1>Rules</h1>
            <ul>
                <li>LEFT - Move the current piece left.</li>
                <li>RIGHT - Move the current piece right.</li>
                <li>UP - Rotate the current piece.</li>
                <li>DOWN - Soft move down.</li>
                <li>SPACE - Hard move down.</li>
            </ul>
            <h2>Multiplayer?</h2>
            <ul>
                <li>First in game? Start it when you want!</li>
                <li>Be the last in the game to win it!</li>
                <li>Block the others by winning a row.</li>
                <li>Track the opponents' progression with the panel.</li>
            </ul>
        </div>
    );
};

export default Rules;