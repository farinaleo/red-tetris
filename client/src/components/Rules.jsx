import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Rules.css';

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
        </div>
    );
};

export default Rules;